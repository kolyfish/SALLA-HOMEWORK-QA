// 步驟：預約叫車 (Book a Ride)
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RidePage } from '../pages/RidePage';

/**
 * 步驟：預約叫車 (Book a Ride)
 * 標題 (Title)： 驗證即時叫車流程，確保輸入目的地後能成功配對司機
 * 前置條件 (Preconditions)：
 * 1. 使用者已註冊帳號。
 * 2. 附近有可作業的空車司機。
 * 
 * 測試步驟 (Test Steps)：
 * 1. 登入：開啟 App 並輸入手機號碼與密碼登入系統。
 * 2. 設定路徑：在首頁輸入起點與終點 (台北車站 -> 101 大樓)。
 * 3. 選擇車型：點擊欲呼叫的車輛類型按鈕。
 * 4. 發起叫車：點擊「確認叫車」按鈕發送請求。
 * 5. 配對結果：等待後端 API 回應配對結果。
 * 
 * 預期結果 (Expected Result)：
 * 1. 順利進入地圖首頁。
 * 2. 系統成功配對司機，狀態變更為「司機趕往中」。
 * 3. 顯示司機詳細卡片資訊與預估抵達時間 (ETA)。
 * 
 * 測試項目：核心流程 - 預約叫車 (Book a Ride)
 * 測試案例 1：即時叫車並成功配對
 */
test('book_a_ride_case_1', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const ridePage = new RidePage(page);

    // 步驟 1: 登入 (Login)
    await loginPage.navigate();
    await loginPage.login('0912345678', 'validPassword123');
    await expect(page).toHaveURL(/.*home/);

    // 步驟 2: 設定路徑 (台北車站 -> 101 大樓)
    await ridePage.setRoute('台北車站', '101 大樓');

    // 步驟 3: 選擇車型
    await ridePage.carTypeOption.click();

    // 步驟 4: 點擊「確認叫車」按鈕
    await ridePage.bookButton.click();

    // 步驟 5: 等待後端 API 配對司機
    await ridePage.waitForDriverMatching();

    // 預期結果: 顯示司機卡片資訊
    await expect(ridePage.driverInfo).toBeVisible();
    const eta = await ridePage.getETA();
    expect(eta).not.toBeNull();
});
