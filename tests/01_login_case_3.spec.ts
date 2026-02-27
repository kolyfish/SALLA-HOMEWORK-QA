// 步驟：登入 (Login)
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

/**
 * 步驟：登入 (Login)
 * 標題 (Title)： 驗證連續輸入多次錯誤密碼後，系統應暫時鎖定該帳戶
 * 前置條件 (Preconditions)：
 * 1. 使用者已擁有註冊帳號。
 * 2. 帳號目前處於正常可登入狀態。
 * 
 * 測試步驟 (Test Steps)：
 * 1. 在登入畫面輸入正確手機號碼與固定錯誤密碼。
 * 2. 重複點擊登入按鈕達 5 次。
 * 3. 第 5 次失敗後，輸入正確密碼再次嘗試登入。
 * 
 * 預期結果 (Expected Result)：
 * 1. 第 5 次失敗後顯示「帳戶已暫時鎖定」。
 * 2. 鎖定期間即使密碼正確，仍應顯示「請稍後再試」。
 * 
 * 測試項目：核心流程 - 登入 (Login)
 * 測試案例 3：連續輸入錯誤密碼導致帳戶鎖定
 * 技術應用：狀態轉換測試 (安全性測試)
 */
test('login_case_3_account_lockout', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // 步驟 1: 開啟應用程式並進入登入面
    await loginPage.navigate();

    // 步驟 2: 連續失敗輸入錯誤密碼 5 次
    // 決策: 使用迴圈模擬暴力破解行為
    // 原因: 驗證系統對帳號枚舉與暴力破解的防護閾值
    for (let i = 0; i < 5; i++) {
        await loginPage.login('0912345678', 'wrongPassword');
        // 等待 API 返回錯誤再進行下一次嘗試
        await page.waitForLoadState('networkidle');
    }

    // 預期結果 1: 第 5 次後顯示鎖定訊息「帳戶已暫時鎖定」
    // 理由: 安全性測試範疇，確保系統有防範機制
    await expect(loginPage.errorMessage).toContainText('帳戶已暫時鎖定');

    // 步驟 3: 在鎖定期間使用「正確」密碼嘗試登入
    // 決策: 驗證鎖定狀態的強制性
    await loginPage.login('0912345678', 'validPassword123');

    // 預期結果 2: 即使用正確密碼也應顯示「請稍後再試」
    await expect(loginPage.errorMessage).toContainText('請稍後再試');
});
