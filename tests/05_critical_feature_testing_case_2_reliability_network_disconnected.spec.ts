// 步驟：關鍵功能測試 (Critical Feature Testing)
import { test, expect } from '@playwright/test';
import { TripUtility } from '../utility/TripUtility';

/**
 * 步驟：關鍵功能測試 (Critical Feature Testing)
 * 測試項目：關鍵功能測試 - 網路不穩定處理 (Reliability)
 * 標題 (Title)： 驗證行程中網路斷線後，系統應顯示警告並在恢復後自動同步狀態
 * 前置條件 (Preconditions)：
 * 1. 使用者已登入且正在行程中。
 * 2. 行程穩定運作中。
 * 
 * 測試步驟 (Test Steps)：
 * 1. 透過 Utility 進入行程中狀態。
 * 2. 模擬手機網路斷線。
 * 3. 觀察 UI 是否顯示離線警告。
 * 4. 恢復網絡連線。
 * 5. 驗證資料是否自動重新同步。
 * 
 * 預期結果 (Expected Result)：
 * 1. 斷線後立即顯示「離線提示」。
 * 2. 恢復後警告自動消失。
 * 3. 行程 ID 與狀態應與斷線前保持一致 (無資料遺失)。
 * 
 * 測試案例 2：驗證行程中網路斷線後的狀態恢復
 */
test('critical_feature_testing_case_2_reliability_network_disconnected', async ({ page, context }) => {
    const tripUtil = new TripUtility(page);

    // 步驟 1: 進入行程中畫面 (使用詳細 Utility 設定環境)
    await tripUtil.setupInTripState('台北車站', '101 大樓', 'active-recovery-test');

    // 步驟 2: 模擬網路斷線
    // 決策: 使用 context.setOffline(true) 模擬底層網路中斷
    await context.setOffline(true);

    // 預期結果 1: UI 應出現離線警告
    const offlineWarning = page.locator('.offline-banner');
    await expect(offlineWarning).toBeVisible();

    // 步驟 4: 恢復網絡並驗證同步
    await context.setOffline(false);

    // 預期結果 2 & 3: 
    // - 警告自動消失
    // - 狀態與行程 ID 保持一致
    await expect(offlineWarning).toBeHidden();
    await expect(page.locator('.status-badge')).toContainText('行程進行中');

    const tripId = await page.locator('.trip-id').textContent();
    expect(tripId).toBe('active-recovery-test');
});
