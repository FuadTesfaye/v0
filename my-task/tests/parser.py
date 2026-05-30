import json, sys

data = json.load(sys.stdin)
results = []

for suite in data.get("testResults", []):
    for test in suite.get("testResults", []):
        status = "pass" if test["status"] == "passed" else "fail"
        results.append({"name": test["fullName"], "status": status})

print(json.dumps(results))
