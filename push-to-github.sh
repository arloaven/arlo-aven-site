#!/bin/bash
set -e
cd "$(dirname "$0")"

if [ ! -f package.json ]; then
  echo "package.json not found, make sure you're in the project root"
  exit 1
fi

if [ ! -d .git ]; then
  git init
fi

git add .
git commit -m "Initial ARLO AVEN site backend" || true

echo "Enter your GitHub repository URL (e.g. https://github.com/USERNAME/arlo-aven-site.git):"
read REPO_URL

git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"
git branch -M main
git push -u origin main

echo "Pushed to $REPO_URL"
