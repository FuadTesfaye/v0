
import { Worker } from 'worker_threads';
import { Action, PlayerView } from '../engine/types';
import { CodeRunner, RunnerError } from './runner';

const WORKER_CODE = `
const { parentPort } = require('worker_threads');
const vm = require('vm');

if (!parentPort) {
  throw new Error('This script must be run as a worker thread');
}

parentPort.on('message', (message) => {
  const { code, context } = message;

  try {
    const sandbox = {
      console: {
        log: (...args) => parentPort.postMessage({ type: 'log', args }),
        error: (...args) => parentPort.postMessage({ type: 'error', args }),
      },
      game: context,
      result: null
    };

    vm.createContext(sandbox);

    const wrappedCode = \`
      (function() {
        \${code}
      })()
    \`;

    const script = new vm.Script(wrappedCode);
    const result = script.runInContext(sandbox, { timeout: 1000 });

    parentPort.postMessage({ type: 'result', result });

  } catch (err) {
    parentPort.postMessage({ type: 'error', error: err.message });
  }
});
`;

export class JavascriptRunner implements CodeRunner {
  run(code: string, context: PlayerView, timeLimitMs: number = 1000): Promise<Action> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(WORKER_CODE, { eval: true });

      const timer = setTimeout(() => {
        worker.terminate();
        reject(new RunnerError('Execution timed out'));
      }, timeLimitMs);

      worker.on('message', (msg: any) => {
        if (msg.type === 'result') {
          clearTimeout(timer);
          resolve(msg.result);
          worker.terminate();
        } else if (msg.type === 'error') {
          clearTimeout(timer);
          reject(new RunnerError(msg.error));
          worker.terminate();
        } else if (msg.type === 'log') {
          // console.log('[Sandbox Log]', ...msg.args);
        }
      });

      worker.on('error', (err) => {
        clearTimeout(timer);
        reject(new RunnerError(err.message));
        worker.terminate();
      });

      worker.on('exit', (code) => {
        if (code !== 0) {
          clearTimeout(timer);
          reject(new RunnerError(`Worker stopped with exit code ${code}`));
        }
      });

      worker.postMessage({ code, context });
    });
  }
}
