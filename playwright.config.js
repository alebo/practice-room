import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  outputDir: './.playwright/results',
  reporter: [['list'], ['html', { outputFolder: '.playwright/report', open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:4173', browserName: 'chromium', ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) },
  webServer: { command: 'npm start', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI },
});
