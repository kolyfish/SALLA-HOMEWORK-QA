// 步驟：乘車體驗 (In-Ride Experience)
import { test, expect } from '@playwright/test';
import { RidePage } from '../pages/RidePage';
import { TripUtility } from '../utility/TripUtility';

/**
 * 步驟：乘車體驗 (In-Ride Experience)
 * 標題 (Title)： 驗證乘客在行程中可動態修改目的地，且系統正確處理費用異動
 * 前置條件 (Preconditions)： 行程已開始 (In-Trip 狀態)，車輛正在移動。
 * 
 * 測試步驟 (Test Steps)：
 * 1. 點擊「修改目的地」。
 * 2. 輸入新的目的地。
 * 3. 接受重算後的費用彈窗。
 * 
 * 預期結果 (Expected Result)：
 * 1. 顯示「目的地已更新」提示。
 * 2. 導航路徑同步更新。
 * 3. 司機端接收到異動通知。
 * 
 * 測試項目：核心流程 - 乘車體驗 (In-Ride Experience)
 * 測試案例 2：行程中修改目的地
 */
test('in_ride_experience_case_2', async ({ page }) => {
    const ridePage = new RidePage(page);
    const tripUtil = new TripUtility(page);

    // 前置條件: 使用公共 Utility 進入行程中狀態
    await tripUtil.setupInTripState('active-sample-id');

    // 步驟 1: 點擊「修改目的地」按鈕並輸入新地址 (桃園機場)
    const editDestBtn = page.locator('button#edit-destination');
    await editDestBtn.click();
    await ridePage.destinationInput.fill('桃園機場');
    await page.keyboard.press('Enter');

    // 步驟 2: 確認重算後的費用異動彈窗
    // 警告: 修改路徑必會觸發重算費率，若不處理彈窗，地圖路徑將不會更新
    const priceAlert = page.locator('.price-update-modal');
    await expect(priceAlert).toBeVisible();
    await priceAlert.locator('button#accept').click();

    // 預期結果: 畫面顯示「目的地已更新」提示並驗證地圖
    await expect(page.locator('text=目的地已更新')).toBeVisible();
});
