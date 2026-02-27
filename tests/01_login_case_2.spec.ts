// 步驟：登入 (Login)
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

/**
 * 步驟：登入 (Login)
 * 標題 (Title)： 驗證輸入格式錯誤的手機號碼時，系統應攔截並顯示錯誤提示
 * 前置條件 (Preconditions)：
 * 1. 應用程式已開啟至登入頁面。
 * 2. 使用者尚未進行任何輸入。
 * 
 * 測試步驟 (Test Steps)：
 * 1. 在手機號碼欄位輸入少於 10 碼的無效號碼 (例如: "09123")。
 * 2. 觀察登入按鈕狀態或嘗試點擊。
 * 
 * 預期結果 (Expected Result)：
 * 1. 登入按鈕應保持禁用 (Disabled) 狀態。
 * 2. 若允許點擊，則應顯示「請輸入有效的手機號碼」錯誤提示。
 * 
 * 測試項目：核心流程 - 登入 (Login)
 * 測試案例 2：輸入無效的手機號碼格式
 * 技術應用：等價分割 (無效分區) / 邊界值分析 (長度檢查)
 */
test('login_case_2', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // 步驟 1: 開啟應用程式 (導航至登入頁面)
    await loginPage.navigate();

    // 步驟 2: 在手機號碼欄位輸入少於 10 碼的無效號碼 (例如: "09123")
    await loginPage.phoneInput.fill('09123');

    // 步驟 3: 觀察畫面回應
    const isEnabled = await loginPage.loginButton.isEnabled();

    if (isEnabled) {
        await loginPage.loginButton.click();
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toContainText('請輸入有效的手機號碼');
    } else {
        expect(isEnabled).toBeFalsy();
    }
});
