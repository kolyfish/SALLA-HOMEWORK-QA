// 步驟：乘車體驗 (In-Ride Experience)
import { test, expect } from '@playwright/test';
import { TripUtility } from '../utility/TripUtility';

/**
 * 步驟：乘車體驗 (In-Ride Experience)
 * 標題 (Title)： 驗證行程中車輛位置與預估抵達時間 (ETA) 的即時更新
 * 前置條件 (Preconditions)： 行程已開始 (In-Trip 狀態)，車輛正在移動。
 * 
 * 測試步驟 (Test Steps)：
 * 1. 觀察乘客端 App 的地圖介面。
 * 2. 持續監控車輛圖示座標與 ETA 顯示。
 * 3. 模擬車輛沿規劃路線移動 (模擬 GPS 更新)。
 * 
 * 預期結果 (Expected Result)：
 * 1. 車輛圖示應在地圖上平滑移動，符合實際 GPS 座標。
 * 2. 預估抵達目的地時間 (ETA) 應隨著距離減少而動態更新。
 * 
 * 測試項目：核心流程 - 乘車體驗 (In-Ride Experience)
 * 測試案例 1：即時路徑與位置更新
 */
test('in_ride_experience_case_1', async ({ page }) => {
    const tripUtil = new TripUtility(page);

    // 前置條件: 透過公共 Utility 進入行程中狀態
    await tripUtil.setupInTripState('active-tracking-id');

    // 獲取初始 ETA
    const initialETA = await page.locator('.eta-timer').textContent();

    // 步驟 2 & 3: 模擬 GPS 座標更新
    // 決策: 使用 page.evaluate 注入模擬位置，因為自動化環境無法實際開車
    await page.evaluate(() => {
        // 模擬司機端發送新的經緯度
        window.dispatchEvent(new CustomEvent('gps_update', {
            detail: { lat: 25.0330, lng: 121.5654, next_eta: '12:45' }
        }));
    });

    // 預期結果 1: 車輛在地圖上的屬性應更新
    const carIndicator = page.locator('.car-marker');
    await expect(carIndicator).toBeVisible();

    // 預期結果 2: ETA 動態更新
    // 理由: 驗證前端 Socket 是否正確監聽並反映數據變化
    const updatedETA = page.locator('.eta-timer');
    await expect(updatedETA).not.toHaveText(initialETA || '');
});
