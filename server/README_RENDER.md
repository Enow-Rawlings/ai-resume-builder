# Deploying the backend on Render (without committing `.env`)

Summary
- The repository intentionally does not contain `server/.env`. Keep secrets out of Git and set them in Render's Environment settings.

Steps
1. Create the service
   - Go to https://dashboard.render.com and create a new Web Service.
   - Connect your GitHub repo and select the `main` branch.

2. Add environment variables
   - In your Render service, open the "Environment" (or "Environment > Environment Variables") section.
   - Add variables matching `server/.env.example` keys, e.g. `OPENAI_API_KEY`, `MONGODB_URI`, etc. Paste the real secret values there.

3. Build & Start commands
   - Build Command: `npm install --prefix server && npm run build --prefix server` (if you have a build step)
   - Start Command: `node server/server.js` or `npm --prefix server start` (ensure `server/package.json` has a `start` script)

4. Optional: health checks & instance settings
   - Configure the health check path if your server exposes one (e.g., `/health`).
   - Choose instance type and region as needed.

5. Logs & testing
   - Use Render logs to view startup errors or missing env var warnings.
   - If the server fails because an env var is missing, Render logs will indicate which variable name is undefined in code (avoid printing secret values).

Local development
- Copy `server/.env.example` to `server/.env` and fill in values for local testing. Do NOT commit `server/.env`.

Security notes
- The original `server/.env` was removed from the repo to avoid exposing secrets. Assume any previously exposed key is compromised — rotate the key in the provider dashboard (Google Gemini) and update Render with the new key.
