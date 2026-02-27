// 步驟：預約叫車 (Book a Ride)
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RidePage } from '../pages/RidePage';

/**
 * 步驟：預約叫車 (Book a Ride)
 * 標題 (Title)： 驗證當附近無可用司機時，系統應顯示提示並提供替代方案
 * 前置條件 (Preconditions)：
 * 1. 使用者已成功登入。
 * 2. 所在地點被設定為無司機涵蓋區域 (極端偏遠地區)。
 * 
 * 測試步驟 (Test Steps)：
 * 1. 輸入偏遠地區路線。
 * 2. 點擊「確認叫車」。
 * 3. 等待搜尋逾時。
 * 
 * 預期結果 (Expected Result)：
 * 1. 顯示「附近暫無可用司機」錯誤訊息。
 * 2. 顯示「預約稍後行程」按鈕。
 * 
 * 測試項目：核心流程 - 預約叫車 (Book a Ride)
 * 測試案例 3：無司機可用的處理
 * 技術應用：錯誤猜測 / 異常流程
 */
test('ride_booking_case_3_no_driver_available', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const ridePage = new RidePage(page);

    // 前置動作: 登入
    await loginPage.navigate();
    await loginPage.login('0912345678', 'validPassword123');

    // 步驟 1: 設定偏遠地區路線 (玉山頂峰 -> 阿里山)
    // 決策: 使用極端地點模擬邊際情境
    // 原因: 驗證系統在逾時後的優雅降級 (Graceful Degradation) 處理
    await ridePage.setRoute('玉山頂峰', '阿里山');

    // 步驟 2: 點擊「確認叫車」並開始搜尋司機
    await ridePage.confirmBooking();

    // 步驟 3: 等待搜尋逾時 (系統內定搜尋時間)
    // 策略: 監控特定錯誤訊息「附近暫無可用司機」
    const timeoutMessage = page.locator('text=附近暫無可用司機');
    await timeoutMessage.waitFor({ state: 'visible', timeout: 20000 });

    // 預期結果: 
    // 1. 顯示「附近暫無可用司機」提示。
    // 2. 提供「預約稍後行程」替代方案按鈕。
    await expect(page.locator('button#schedule-later')).toBeVisible();
});
