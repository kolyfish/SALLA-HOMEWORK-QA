// 步驟：乘車體驗 (In-Ride Experience)
import { test, expect } from '@playwright/test';
import { TripUtility } from '../utility/TripUtility';

/**
 * 步驟：乘車體驗 (In-Ride Experience)
 * 標題 (Title)： 驗證「分享行程狀態」功能可傳送正確連結
 * 前置條件 (Preconditions)： 行程已開始 (In-Trip 狀態)，車輛正在移動。
 * 
 * 測試步驟 (Test Steps)：
 * 1. 點擊「分享行程」按鈕。
 * 2. 選擇通訊軟體 (如 Line 或 SMS) 發送給聯絡人。
 * 3. 聯絡人點擊收到的連結。
 * 
 * 預期結果 (Expected Result)：
 * 1. 聯絡人能開啟網頁地圖，並看到車輛的即時位置與車牌資訊。
 * 
 * 測試項目：核心流程 - 乘車體驗 (In-Ride Experience)
 * 測試案例 3：安全功能 - 分享行程
 */
test('in_ride_experience_case_3', async ({ page, context }) => {
    const tripUtil = new TripUtility(page);

    // 前置條件: 使用公共 Utility 進入行程中狀態
    await tripUtil.setupInTripState('active-tracking-id');

    // 步驟 2: 模擬分享動作
    const shareBtn = page.locator('button#share-trip');
    await shareBtn.click();

    // 獲取產生的分享連結
    const sharedUrl = await page.getAttribute('.share-link-input', 'value');

    // 步驟 3: 開啟新分頁模擬聯絡人點擊連結
    const contactPage = await context.newPage();
    await contactPage.goto(sharedUrl || '');

    // 預期結果: 聯絡人看到地圖與司機資訊 (非登入狀態也可查看)
    await expect(contactPage.locator('#external-tracking-map')).toBeVisible();
    await expect(contactPage.locator('.driver-plate-number')).toContainText('ABC-1234');
});
