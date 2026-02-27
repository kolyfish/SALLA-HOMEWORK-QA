// 步驟：登入 (Login)
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

/**
 * 步驟：登入 (Login)
 * 標題 (Title)： 驗證已註冊使用者可使用正確的手機號碼與密碼成功登入
 * 前置條件 (Preconditions)：
 * 1. 應用程式已安裝且處於未登入狀態。
 * 2. 使用者帳號已註冊且狀態正常 (Active)。
 * 3. 手機網路連線正常。
 * 
 * 測試步驟 (Test Steps)：
 * 1. 開啟應用程式並導航至登入頁面。
 * 2. 輸入已註冊的手機號碼與正確密碼。
 * 3. 點擊「登入」按鈕。
 * 
 * 預期結果 (Expected Result)：
 * 1. 系統驗證成功並跳轉至應用程式首頁 (地圖畫面)。
 * 2. 首頁顯示核心地圖組件。
 * 3. 顯示該使用者的個人化資訊 (例如：姓名)。
 * 
 * 測試項目：核心流程 - 登入 (Login)
 * 測試案例 1：使用有效憑證成功登入 (Happy Path)
 * 技術應用：等價分割 (有效分區)
 */
test('login_case_1_valid_credentials @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // 決策: 設定全域等待時間 10,000ms
    // 原因: 遵守 user_rules 規範，應對後端 API 回傳延遲
    page.setDefaultTimeout(10000);

    // 步驟 1: 開啟應用程式 (導航至登入頁面)
    await loginPage.navigate();

    // 步驟 2 & 3: 在登入畫面輸入已註冊的手機號碼與正確密碼
    // 步驟 4: 點擊「登入」按鈕
    // 決策: 選取代表性有效數據 (0912345678) 驗證整個有效分區
    await loginPage.login('0912345678', 'validPassword123');

    // 預期結果 1 & 2: 系統驗證成功並跳轉至應用程式首頁 (地圖畫面)
    // 決策: 使用 waitForURL 搭配地圖元素可見性作為雙重驗證
    await page.waitForURL('**/home');
    await expect(page.locator('#main-map')).toBeVisible();

    // 預期結果 3: 顯示該使用者的個人化資訊 (例如：歡迎訊息或姓名)
    // 理由: 驗證 Session 綁定正確，非匿名首頁
    const userProfileName = page.locator('#user-profile-name');
    await expect(userProfileName).toBeVisible();
    await expect(userProfileName).not.toBeEmpty();
});
