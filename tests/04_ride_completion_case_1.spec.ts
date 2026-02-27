// 步驟：完成行程 (Ride Completion)
import { test, expect } from '@playwright/test';
import { RidePage } from '../pages/RidePage';
import { CompletionUtility } from '../utility/CompletionUtility';

/**
 * 步驟：完成行程 (Ride Completion)
 * 標題 (Title)： 驗證行程到達終點後，系統應自動執行信用卡扣款並顯示評分畫面
 * 前置條件 (Preconditions)：
 * 1. 使用者已綁定有效的信用卡。
 * 2. 行程已接近目的地點並進入結算畫面。
 * 
 * 測試步驟 (Test Steps)：
 * 1. 透過 Utility 進入結算畫面。
 * 2. 模擬後端發送結束行程事件。
 * 3. 系統自動觸發第三方支付扣款。
 * 4. 檢查支付成功狀態並跳轉評分頁。
 * 
 * 預期結果 (Expected Result)：
 * 1. 顯示正確的扣款金額 ($350)。
 * 2. 顯示「支付成功」標誌。
 * 3. 自動顯示「為司機評分」畫面，包含星等評分。
 * 
 * 測試項目：核心流程 - 完成行程 (Ride Completion)
 * 測試案例 1：自動信用卡扣款成功
 */
test('ride_completion_case_1_auto_payment', async ({ page }) => {
    const ridePage = new RidePage(page);
    const completionUtil = new CompletionUtility(page);

    // 前置動作: 使用公共 Utility 模擬行程抵達終點的結算狀態
    await completionUtil.setupRideEndState('finishing-sample-id');

    // 步驟 2: 模擬後端發送結束行程事件 (Event-driven mockup)
    await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('trip_ended', { detail: { amount: 350 } }));
    });

    // 步驟 3: 驗證支付畫面
    await expect(ridePage.paymentSummary).toBeVisible();
    await expect(ridePage.paymentSummary).toContainText('$350');

    // 決策: 檢查支付成功狀態
    const successBadge = page.locator('.payment-status-success');
    await successBadge.waitFor({ state: 'visible' });

    // 步驟 4: 驗證評分畫面
    await expect(page.locator('text=為司機評分')).toBeVisible();
});
