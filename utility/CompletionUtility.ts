import { Page, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

export class CompletionUtility {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * 前置條件 (Preconditions): 行程即將結束，進入結算畫面。
     * 適用場景: 測試支付流程、金額核對。
     */
    async setupRideEndState(tripId: string = 'finishing-sample-id') {
        const loginPage = new LoginPage(this.page);

        // 1. 登入 (確保測試在授權狀態下進行)
        await loginPage.navigate();
        await loginPage.login('0912345678', 'validPassword123');

        // 2. 導航至行程結束結算頁面
        await this.page.goto(`/trip/${tripId}`);
        await this.page.waitForLoadState('networkidle');

        // 3. 驗證結算組件是否出現
        const settlementModal = this.page.locator('.settlement-modal');
        await expect(settlementModal).toBeVisible();
    }

    /**
     * 前置條件 (Preconditions): 行程已結束，支付已完成，停留在評分畫面。
     * 適用場景: 測試司機評分、評論回饋。
     */
    async setupRatingState(tripId: string = 'rating-sample-id') {
        const loginPage = new LoginPage(this.page);

        // 1. 登入
        await loginPage.navigate();
        await loginPage.login('0912345678', 'validPassword123');

        // 2. 導航至評分頁面
        await this.page.goto(`/trip/rating/${tripId}`);
        await this.page.waitForLoadState('networkidle');

        // 3. 驗證評分組件就緒 (關鍵標誌: 5 顆星與送出按鈕)
        const ratingTitle = this.page.locator('text=為司機評分');
        const submitBtn = this.page.locator('button#submit-rating');

        await expect(ratingTitle).toBeVisible();
        await expect(submitBtn).toBeDisabled(); // 預設應未評分不可送出
    }

    /**
     * 前置條件 (Preconditions): 使用者曾有過至少一筆已完成的行程。
     * 適用場景: 測試行程歷史紀錄、查看明細。
     */
    async setupHistoryState() {
        const loginPage = new LoginPage(this.page);

        // 1. 登入
        await loginPage.navigate();
        await loginPage.login('0912345678', 'validPassword123');

        // 2. 導航至歷史紀錄頁
        await this.page.goto('/history');
        await this.page.waitForLoadState('networkidle');

        // 3. 驗證歷史列表已載入 (至少有一筆資料)
        const firstHistoryItem = this.page.locator('.trip-item').first();
        await expect(firstHistoryItem).toBeVisible();
    }
}
