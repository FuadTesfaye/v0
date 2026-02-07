
import { spawn } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { Action, PlayerView } from '../engine/types';
import { CodeRunner, RunnerError } from './runner';

const PYTHON_WORKER_SCRIPT = `
import sys
import json
import traceback

def main():
    try:
        # Read input from stdin
        input_data = sys.stdin.read()
        if not input_data:
            return

        data = json.loads(input_data)
        user_code = data['code']
        context = data['context']

        # Sandbox environment
        local_scope = {}
        
        # Execute user code
        exec(user_code, {}, local_scope)

        if 'turn' not in local_scope:
             print(json.dumps({"error": "Function 'turn(game_state)' not defined"}))
             return

        # Run the turn function
        result = local_scope['turn'](context)
        
        # Output result
        print(json.dumps({"result": result}))

    except Exception as e:
        tb = traceback.format_exc()
        print(json.dumps({"error": str(e), "traceback": tb}))

if __name__ == "__main__":
    main()
`;

export class PythonRunner implements CodeRunner {
    async run(code: string, context: PlayerView, timeLimitMs: number = 1000): Promise<Action> {
        // Create temp file for the worker script
        const tmpDir = os.tmpdir();
        const scriptPath = path.join(tmpDir, `algowars-py-${Date.now()}-${Math.random().toString(36).substring(2)}.py`);

        try {
            await fs.promises.writeFile(scriptPath, PYTHON_WORKER_SCRIPT);

            return await new Promise<Action>((resolve, reject) => {
                const pythonProcess = spawn('python3', [scriptPath]);

                let outputData = '';
                let errorData = '';

                const timer = setTimeout(() => {
                    pythonProcess.kill();
                    reject(new RunnerError('Execution timed out'));
                }, timeLimitMs);

                const input = JSON.stringify({ code, context });
                pythonProcess.stdin.write(input);
                pythonProcess.stdin.end();

                pythonProcess.stdout.on('data', (data) => {
                    outputData += data.toString();
                });

                pythonProcess.stderr.on('data', (data) => {
                    errorData += data.toString();
                });

                pythonProcess.on('close', (code) => {
                    clearTimeout(timer);
                    if (code !== 0) {
                        reject(new RunnerError(`Python process exited with code ${code}: ${errorData}`));
                    } else {
                        try {
                            const result = JSON.parse(outputData);
                            if (result.error) {
                                reject(new RunnerError(result.error));
                            } else {
                                resolve(result.result);
                            }
                        } catch (e) {
                            reject(new RunnerError(`Failed to parse python output: ${outputData} | Error: ${errorData}`));
                        }
                    }
                });

                pythonProcess.on('error', (err) => {
                    clearTimeout(timer);
                    reject(new RunnerError(err.message));
                });
            });
        } finally {
            // Cleanup
            fs.unlink(scriptPath, (err) => {
                if (err) console.error('Failed to cleanup temp script:', err);
            });
        }
    }
}
