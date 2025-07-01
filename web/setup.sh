#!/bin/sh

set -e

print_help() {
  echo "Usage: $0 [--dev] [--help]"
  echo "  --dev   Start the dev server after setup (npm start)"
  echo "  --help  Show this help message"
}

if [ "$1" = "--help" ]; then
  print_help
  exit 0
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Error: Node.js is not installed." >&2
  exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "Error: npm is not installed." >&2
  exit 1
fi

echo "[1/3] Installing dependencies..."
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

echo "[2/3] Building project..."
npm run build

echo "[3/3] Setup complete."

if [ "$1" = "--dev" ]; then
  echo "Starting dev server..."
  npm start
fi 