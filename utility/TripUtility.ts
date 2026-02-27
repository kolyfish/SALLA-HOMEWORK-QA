import { Page, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

export class TripUtility {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * 前置條件詳解 (Detailed Preconditions)： 
     * 1. 確保使用者已持有有效 Session (已登入)。
     * 2. 強制進入行程路徑，並注入指定的「起點」與「終點」數據。
     * 3. 驗證地圖圖層載入完成 (車輛圖示已顯示)。
     * 4. 驗證行程關鍵資訊 (地點、ETA、司機) 正確顯現。
     * 
     * 決策: 將起點與終點納入參數，以便模擬不同距離與路徑的行程
     * 原因: 不同的行程長度會影響系統的 ETA 計算與 UI 更新頻率
     */
    async setupInTripState(
        pickup: string = '台北車站',
        destination: string = '101 大樓',
        tripId: string = 'active-sample-id'
    ) {
        const loginPage = new LoginPage(this.page);

        // 步驟 A: 登入驗證
        await loginPage.navigate();
        await loginPage.login('0912345678', 'validPassword123');

        // 步驟 B: 切換至行程追蹤畫面並注入狀態
        // 決策: 使用 URL 參數或 Mock 注入地點資訊
        await this.page.goto(`/trip/${tripId}`);
        await this.page.waitForLoadState('networkidle');

        // 步驟 C: 詳細 UI 組件與地點資料驗證
        const components = {
            mainMap: this.page.locator('#main-map'),
            carMarker: this.page.locator('.car-marker'),
            tripStatus: this.page.locator('.status-badge:has-text("行程進行中")'),
            pickupLabel: this.page.locator('.pickup-info'),
            destinationLabel: this.page.locator('.destination-info'),
            etaDisplay: this.page.locator('.eta-timer'),
            driverCard: this.page.locator('.driver-card')
        };

        // 步驟 D: 模擬資料注入 (起點/終點/GPS)
        // 決策: 直接透過瀏覽器事件注入 Mock 數據，達成「起點與目的地同步」的需求
        await this.page.evaluate(({ pickup, destination }) => {
            if (window.dispatchEvent) {
                window.dispatchEvent(new CustomEvent('trip_init_data', {
                    detail: { pickup, destination, lat: 25.0339, lng: 121.5644 }
                }));
            }
        }, { pickup, destination });

        // 步驟 E: 並行斷言資料正確性
        await Promise.all([
            expect(components.mainMap).toBeVisible(),
            expect(components.carMarker).toBeVisible(),
            expect(components.tripStatus).toBeVisible(),
            expect(components.pickupLabel).toContainText(pickup),
            expect(components.destinationLabel).toContainText(destination),
            expect(components.etaDisplay).not.toBeEmpty(),
            expect(components.driverCard).toBeVisible()
        ]);

        await this.page.waitForLoadState('networkidle');
    }
}
