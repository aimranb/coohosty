const { defineConfig, devices } = require('@playwright/test');
module.exports = defineConfig({
  testDir: '../tests/e2e',
  outputDir: './maintenance-test-results',
  timeout: 45000,
  workers: 1,
  reporter: [['list']],
  use: { baseURL: process.env.E2E_BASE_URL || 'http://localhost:3131', launchOptions: { channel: 'chrome' }, reducedMotion: 'reduce' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
});
