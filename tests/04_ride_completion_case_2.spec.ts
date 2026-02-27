// 步驟：完成行程 (Ride Completion)
import { test, expect } from '@playwright/test';
import { CompletionUtility } from '../utility/CompletionUtility';

/**
 * 步驟：完成行程 (Ride Completion)
 * 標題 (Title)： 驗證使用者可在行程結束後進行司機評分與填寫評論
 * 前置條件 (Preconditions)： 行程已結束，且已完成扣款，停留於評分畫面。
 * 
 * 測試步驟 (Test Steps)：
 * 1. 使用 Utility 準備評分畫面環境。
 * 2. 在評分畫面點擊「5 顆星」。
 * 3. 在評論框輸入「司機服務很好，駕駛平穩」。
 * 4. 點擊「送出評論」。
 * 
 * 預期結果 (Expected Result)：
 * 1. 系統提示「感謝您的評論」。
 * 2. 評分內容成功回傳後端 API。
 * 3. 畫面跳轉回主畫面。
 * 
 * 測試項目：核心流程 - 完成行程 (Ride Completion)
 * 測試案例 2：司機評分與反饋
 */
test('ride_completion_case_2', async ({ page }) => {
    const completionUtil = new CompletionUtility(page);

    // 前置動作: 使用公共 Utility 直接進入已支付完成的評分階段
    await completionUtil.setupRatingState('last-trip-id');

    // 步驟 2: 點擊 5 星
    await page.locator('.star-rating >> nth=4').click();

    // 步驟 3: 輸入評論
    await page.locator('textarea#feedback-comment').fill('司機服務很好，駕駛平穩');

    // 步驟 4: 送出
    await page.locator('button#submit-rating').click();

    // 預期結果: 顯示感謝訊息並回到首頁
    await expect(page.locator('text=感謝您的評論')).toBeVisible();
    await expect(page.locator('#main-map')).toBeVisible();
});
