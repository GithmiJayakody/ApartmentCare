import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./tests",
    timeout: 60000,
    workers: 1,
    use: { baseURL: "http://localhost:5174", browserName: "chromium", channel: "chrome", headless: true, viewport: { width: 1440, height: 1000 } },
    webServer: [
        { command: "npm run test:server", cwd: "../Backend", url: "http://localhost:5001/api/health", timeout: 90000, env: { PORT: "5001", FRONTEND_URL: "http://localhost:5174" } },
        { command: "npm run dev -- --host localhost --port 5174", url: "http://localhost:5174", env: { VITE_API_URL: "http://localhost:5001/api" } },
    ],
});
