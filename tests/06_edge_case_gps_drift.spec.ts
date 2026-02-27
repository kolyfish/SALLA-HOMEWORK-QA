import { test, expect } from '@playwright/test';
import { RidePage } from '../pages/RidePage';
import { GPSUtility } from '../utility/GPSUtility';

/**
 * 步驟：邊際情境識別 (Edge Case Identification)
 * 標題 (Title)： 驗證 GPS 訊號漂移至「非法/無法上車」地點時的系統攔截機制
 * 前置條件 (Preconditions)： 
 * 1. 使用者已登入。
 * 2. 設備開啟定位權限，但目前處於 GPS 訊號較弱環境（如高樓林立區）。
 * 
 * 測試步驟 (Test Steps)：
 * 1. 透過 Utility 設定弱 GPS 環境。
 * 2. 嘗試將上車地點設定在該「非道路」座標。
 * 3. 觀察大頭針是否自動校正吸附至最近的合法道路。
 * 
 * 預期結果 (Expected Result)：
 * 1. 系統應顯示「GPS 精確度較低，請確認上車地點」之警語。
 * 2. 大頭針應自動移動（吸附）至最近的合法道路邊緣。
 * 3. 系統應阻止將座標直接設在「無法上車」地點 (如河流、海域)。
 * 
 * 測試項目：邊際測試 - GPS 定位穩定性
 * 測試案例 1：GPS 定位漂移至無法上車地點
 * 技術應用：錯誤猜測法 (Error Guessing) & 邊界值分析 (空間邊界)
 */
test('edge_case_identification_case_1', async ({ page }) => {
    const ridePage = new RidePage(page);
    const gpsUtil = new GPSUtility(page);

    // 步驟 1: 前置條件 - 透過 Utility 準備弱 GPS 訊號環境
    await gpsUtil.setupWeakGPSEnvironment(25.0450, 121.5050, 250);

    // 預期結果 1: 系統應偵測到半徑過大，顯示警告標籤
    const accuracyWarning = page.locator('.accuracy-warning');
    await expect(accuracyWarning).toBeVisible();
    await expect(accuracyWarning).toContainText('精確度較低');

    // 步驟 3: 嘗試在該點點擊「設定起點」
    const setPickupBtn = page.locator('button#set-pickup');
    await setPickupBtn.click();

    // 預期結果 2 & 3: 系統應攔截非法座標，並顯示修正提示
    // 理由: 為了避免司機導航至無法行駛的區域（如河中間），系統必須具備合法道路檢查 (Road Snapping)
    const errorMsg = page.locator('.error-dialog');
    await expect(errorMsg).toContainText('請確認上車地點位於道路旁');

    // 驗證大頭針是否已吸附至最近道路 (透過 Mock API 回傳的座標進行斷言)
    const snappedLocation = page.locator('.pickup-info#location-name');
    await expect(snappedLocation).not.toHaveText('河中心');
});
