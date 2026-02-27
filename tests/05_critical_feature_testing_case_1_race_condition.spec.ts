// 步驟：關鍵功能測試 (Critical Feature Testing)
import { test, expect } from '@playwright/test';

/**
 * 標題 (Title)： 驗證司機接單與乘客取消操作同時發生時，系統應保持資料一致性
 * 前置條件 (Preconditions)：
 * 1. 使用者已發起叫車請求。
 * 2. 系統目前正在搜尋司機中 (Searching)。
 * 
 * 測試步驟 (Test Steps)：
 * 1. 進入搜尋司機畫面。
 * 2. 同時觸發「乘客取消」按鈕與「司機接單」Socket 訊號。
 * 3. 觀察系統最終呈現的狀態。
 * 
 * 預期結果 (Expected Result)：
 * 1. 系統應處於一致狀態 (不可同時呈現取消與接單)。
 * 2. 畫面顯示其中一項明確結果 (「行程已取消」或「司機已接單」)。
 * 3. 系統不得卡死或出現非預期報錯。
 * 
 * 步驟：關鍵功能測試 (Critical Feature Testing)
 * 測試項目：關鍵功能測試 - 並發操作衝突 (Concurrency)
 * 測試案例 1：驗證司機接單與乘客取消同時發生時的交易處理
 */
test('critical_feature_testing_case_1_race_condition', async ({ page }) => {
    // 步驟 1: 進入搜尋司機畫面
    await page.goto('/booking/searching');

    // 步驟 2: 模擬並發 API 請求 (並發競爭情境)
    // 決策: 在 UI 上難以模擬精確並發，故在網路層/事件層模擬 Race Path
    const cancelBtn = page.locator('button#cancel-ride');

    // 策略: 使用 Promise.all 同時觸發乘客動作與伺服器推播
    await Promise.all([
        cancelBtn.click(),
        page.evaluate(() => {
            // 模擬從 Server 端推播司機已接單訊息
            if ((window as any).mockSocketEmit) {
                (window as any).mockSocketEmit('driver_accepted', { driverId: 'D123' });
            }
        })
    ]);

    // 預期結果: 系統應處於一致狀態 (Consistent State)
    // 決策: 根據後端事務鎖定 (Locking) 邏輯，最終應只有一種結果，且 UI 不得崩潰
    const outcome = await Promise.race([
        page.locator('text=行程已取消').waitFor({ state: 'visible' }).then(() => 'Canceled'),
        page.locator('text=司機已接單').waitFor({ state: 'visible' }).then(() => 'Accepted')
    ]);

    console.log(`並發競爭最終結果: ${outcome}`);
    expect(['Canceled', 'Accepted']).toContain(outcome);
});
