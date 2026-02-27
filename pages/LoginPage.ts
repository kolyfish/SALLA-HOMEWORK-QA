import { Page, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly phoneInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.phoneInput = page.locator('input[name="phone"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.loginButton = page.locator('button#login-btn');
        this.errorMessage = page.locator('.error-text');
    }

    async navigate() {
        await this.page.goto('/login');
        // 決策: 使用網路閒置作為跳轉成功的判斷基準
        // 原因: 確保登入資源完全載入，避免後續定位器因非同步請求未完成而失效
        await this.page.waitForLoadState('networkidle');
    }

    async login(phone: string, password?: string) {
        // 決策: 先清空再填寫
        // 原因: 防止快取或自動填入導致的測試數據殘留，並觸發 onChange 事件
        await this.phoneInput.fill('');
        await this.phoneInput.fill(phone);

        if (password) {
            await this.passwordInput.fill('');
            await this.passwordInput.fill(password);
        }

        // 警告: 即使按鈕可點擊，仍需確保不被 Loading Overlay 遮擋
        await this.loginButton.click();
    }
}
