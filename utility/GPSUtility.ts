import { Page, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

export class GPSUtility {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * 前置條件 (Preconditions)： 
     * 1. 使用者已登入。
     * 2. 設備開啟定位權限，但目前處於 GPS 訊號較弱環境（如高樓林立區）。
     * 
     * 決策: 將「弱訊號模擬」封裝為 Utility，包含自動登入與環境注入
     * 原因: GPS 飄移測試需要特定精確度參數 (accuracy)，透過 Utility 可保證測試起點的一致性
     */
    async setupWeakGPSEnvironment(lat: number = 25.0450, lng: number = 121.5050, accuracy: number = 250) {
        const loginPage = new LoginPage(this.page);

        // 1. 確保已登入
        await loginPage.navigate();
        await loginPage.login('0912345678', 'validPassword123');

        // 2. 導航至叫車首頁
        await this.page.goto('/home');
        await this.page.waitForLoadState('networkidle');

        // 3. 模擬 GPS 定位訊號漂移與精確度異常
        // 決策: 直接透過事件模擬硬體回報的高誤差半徑
        await this.page.evaluate(({ lat, lng, accuracy }) => {
            window.dispatchEvent(new CustomEvent('gps_signal_drift', {
                detail: { lat, lng, accuracy }
            }));
        }, { lat, lng, accuracy });

        // 4. 驗證 UI 是否已偵測到環境異常
        const accuracyWarning = this.page.locator('.accuracy-warning');
        await expect(accuracyWarning).toBeVisible();
    }
}
