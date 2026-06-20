#!/bin/bash
set -ex
cd "$(dirname "$0")"

if [ ! -f package.json ]; then
  echo "Error: package.json not found. Run this from the project root."
  exit 1
fi

if [ ! -d .git ]; then
  echo "Initializing git repository..."
  git init
fi

echo "Git status before push:"
git status --short --branch

git add .

if git diff --cached --quiet; then
  echo "No staged changes to commit."
else
  git commit -m "Initial ARLO AVEN site backend" || true
fi

git remote remove origin 2>/dev/null || true

git remote add origin https://github.com/arloaven/arlo-aven-site.git

git remote -v

git branch -M main

git push -u origin main

echo "Pushed to https://github.com/arloaven/arlo-aven-site.git"
