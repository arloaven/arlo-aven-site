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

git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/arloaven/arlo-aven-site.git
git branch -M main
git push -u origin main

echo "Pushed to https://github.com/arloaven/arlo-aven-site.git"
