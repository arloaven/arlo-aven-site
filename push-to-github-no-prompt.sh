#!/bin/bash
set -e
cd "$(dirname "$0")"

if [ ! -f package.json ]; then
  echo "Error: package.json not found. Run this from the project root."
  exit 1
fi

if [ ! -d .git ]; then
  git init
fi

git add .
git commit -m "Initial ARLO AVEN site backend" || true

REPO_URL="$1"
if [ -z "$REPO_URL" ]; then
  echo "Usage: $0 https://github.com/USERNAME/arlo-aven-site.git"
  exit 1
fi

git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"
git branch -M main
git push -u origin main

echo "Pushed to $REPO_URL"
