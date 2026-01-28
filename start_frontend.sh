#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

if ! command -v npm >/dev/null 2>&1; then
  echo "npm not found. Please install Node.js + npm first."
  exit 1
fi

echo "Starting Vite dev server..."
npm run dev -- --host 0.0.0.0 --port 5173


