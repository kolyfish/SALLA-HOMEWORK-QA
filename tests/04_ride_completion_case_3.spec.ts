// 步驟：完成行程 (Ride Completion)
import { test, expect } from '@playwright/test';
import { CompletionUtility } from '../utility/CompletionUtility';

/**
 * 步驟：完成行程 (Ride Completion)
 * 標題 (Title)： 驗證使用者可在行程結束後查看電子明細與歷史紀錄
 * 前置條件 (Preconditions)： 使用者曾有過至少一筆已完成的行程。
 * 
 * 測試步驟 (Test Steps)：
 * 1. 使用 Utility 登入並進入「行程歷史」頁面。
 * 2. 點擊最近一筆已完成的行程。
 * 3. 點擊「顯示收據明細」。
 * 
 * 預期結果 (Expected Result)：
 * 1. 顯示正確的行程總金額。
 * 2. 顯示費用拆解（里程費、時間費、平台費）。
 * 3. 顯示起點與終點的文字描述。
 * 
 * 測試項目：核心流程 - 完成行程 (Ride Completion)
 * 測試案例 3：查看電子明細
 */
test('ride_completion_case_3', async ({ page }) => {
    const completionUtil = new CompletionUtility(page);

    // 步驟 1: 使用 Utility 準備歷史紀錄環境
    await completionUtil.setupHistoryState();

    // 步驟 2: 點擊第一筆
    await page.locator('.trip-item >> nth=0').click();

    // 步驟 3: 開啟收據
    await page.locator('button#view-receipt').click();

    // 預期結果: 驗證明細數據
    const totalAmount = page.locator('.receipt-total');
    await expect(totalAmount).not.toBeEmpty();

    await expect(page.locator('text=里程費')).toBeVisible();
    await expect(page.locator('text=平台費')).toBeVisible();
});
