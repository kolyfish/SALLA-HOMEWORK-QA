// 步驟：預約叫車 (Book a Ride)
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RidePage } from '../pages/RidePage';

/**
 * 步驟：預約叫車 (Book a Ride)
 * 標題 (Title)： 驗證使用者能預約未來的特定時間行程 (BVA 邊界值測試)
 * 前置條件 (Preconditions)： 使用者已登入。
 * 
 * 測試步驟 (Test Steps)：
 * 1. 登入系統並導航首頁。
 * 2. 輸入目的地。
 * 3. 點擊「預約搭車」選項。
 * 4. 邊界值測試 (BVA)：
 *    - 輸入「目前時間 + 29 分鐘」(無效分區應報錯)。
 *    - 輸入「目前時間 + 30 分鐘」(最小合法邊界應成功)。
 *    - 輸入「目前時間 + 31 分鐘」(有效分區應成功)。
 * 5. 確認預約。
 * 
 * 預期結果 (Expected Result)：
 * 1. 小於 30 分鐘時，系統提示「預約時間至少需在 30 分鐘後」。
 * 2. 等於或大於 30 分鐘時，系統允許進入確認畫面。
 * 3. 成功顯示「預約已排定」提示資訊。
 * 
 * 測試項目：核心流程 - 預約叫車 (Book a Ride)
 * 測試案例 2：預約未來行程 (Scheduled Ride)
 * 技術應用：邊界值分析 (時間選擇: 29min, 30min, 31min)
 */
test('book_a_ride_case_2', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const ridePage = new RidePage(page);

    // 步驟 1: 登入 (Login)
    await loginPage.navigate();
    await loginPage.login('0912345678', 'validPassword123');

    // 步驟 2: 輸入目的地
    await ridePage.setRoute('台北車站', '101 大樓');

    // 步驟 3: 點擊「預約搭車」選項
    await page.locator('button#schedule-ride-option').click();

    const timePicker = page.locator('input#schedule-time');

    // 步驟 4: 邊界值分析 (BVA) 測試項目

    // 項目 A: 29 分鐘 (負面測試 - 應攔截)
    // 決策: 驗證系統是否嚴格執行「最小 30 分鐘」規則
    await timePicker.fill('29'); // 簡化模擬輸入 29 分鐘後
    await page.locator('button#set-time').click();
    await expect(page.locator('.error-text')).toContainText('預約時間至少需在 30 分鐘後');

    // 項目 B: 30 分鐘 (邊界點測試 - 應成功)
    await timePicker.fill('30');
    await page.locator('button#set-time').click();
    await expect(page.locator('.error-text')).not.toBeVisible();

    // 項目 C: 31 分鐘 (正向測試 - 應成功)
    // 理由: 驗證過了邊界點後的功能延續性
    await timePicker.fill('31');
    await page.locator('button#set-time').click();

    // 步驟 5: 確認預約
    await ridePage.bookButton.click();

    // 預期結果: 顯示預約成功
    await expect(page.locator('text=預約已排定')).toBeVisible();
    await expect(page.locator('.scheduled-info')).toBeVisible();
});
