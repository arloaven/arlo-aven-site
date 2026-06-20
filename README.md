# ARLO AVEN Site

This repository contains the frontend and Express backend for the ARLO AVEN order site.

## What it does

- Serves the static website from `public/`
- Accepts order submissions at `POST /api/orders`
- Stores uploaded reference files in `uploads/`
- Sends a notification email to the shop owner
- Sends a confirmation email to the customer

## Local setup

1. Install dependencies:

```bash
cd ~/arlo-aven-site
npm install
```

2. Create `.env` from `.env.example` and set your real values:

```bash
cp .env.example .env
```

3. Start the server:

```bash
npm start
```

4. Open `http://localhost:3000` in your browser.

## Required environment variables

Create a `.env` file with these values:

```text
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=shopat.arloaven@gmail.com
EMAIL_PASS=your-gmail-app-password
ORDER_NOTIFICATION_EMAIL=shopat.arloaven@gmail.com
```

> Use a Gmail app password with 2FA enabled for `EMAIL_PASS`.

## Publish publicly with GitHub + Render

1. Initialize git and commit the project:

```bash
cd ~/arlo-aven-site
git init
git add .
git commit -m "Initial ARLO AVEN site backend"
```

2. Create a GitHub repository and push:

```bash
git remote add origin https://github.com/<your-username>/arlo-aven-site.git
git branch -M main
git push -u origin main
```

3. Log in to Render and create a new Web Service:
   - Connect your GitHub account
   - Select `arlo-aven-site`
   - Environment: `Node`
   - Build command: `npm install`
   - Start command: `npm start`

4. Add environment variables in Render Dashboard:
   - `EMAIL_HOST` = `smtp.gmail.com`
   - `EMAIL_PORT` = `587`
   - `EMAIL_SECURE` = `false`
   - `EMAIL_USER` = `shopat.arloaven@gmail.com`
   - `EMAIL_PASS` = `<your app password>`
   - `ORDER_NOTIFICATION_EMAIL` = `shopat.arloaven@gmail.com`

5. Deploy and verify the site.

## Notes

- `.env` is excluded from version control.
- `uploads/` is also excluded, so uploaded files are not persisted across deployments unless you add external storage.
- The confirmation email is sent to the customer address provided in the form.
