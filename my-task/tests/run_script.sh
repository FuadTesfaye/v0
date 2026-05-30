#!/bin/bash
set -e

cd /app

npx jest \
  --testPathPattern="__tests__/silver" \
  --json \
  --outputFile=/tmp/jest-results.json \
  --forceExit \
  2>&1 || true

cat /tmp/jest-results.json
