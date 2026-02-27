import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Config
 * 決策: 設定基礎測試參數，包含測試路徑、重試機制與瀏覽器配置
 */
export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:3000', // 決策: 設定基礎 URL
        // 原因: 修正導航錯誤 "Cannot navigate to invalid URL"，並讓 POM 中的相對路徑有效
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        // 決策: 設定預設等待時間
        // 原因: 遵守 user_rules 全域等待規範 (10s)
        actionTimeout: 10000,
        navigationTimeout: 10000,
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],
});
