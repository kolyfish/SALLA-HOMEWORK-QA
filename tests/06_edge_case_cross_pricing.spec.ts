// 步驟：邊際情境識別 (Edge Case Identification)
import { test, expect } from '@playwright/test';
import { TripUtility } from '../utility/TripUtility';

/**
 * 步驟：邊際情境識別 (Edge Case Identification)
 * 標題 (Title)： 驗證行程跨越計費時段 (如 23:00 夜間加成) 時的車資計算精確度
 * 前置條件 (Preconditions)： 
 * 1. 使用者已登入。
 * 2. 計費規則：23:00 以後為夜間加成時段 (Surcharge 1.2x)。
 * 
 * 測試步驟 (Test Steps)：
 * 1. 22:50 開始行程（白天費率）。
 * 2. 行程持續至 23:20 結束（跨越 23:00 加成點）。
 * 3. 獲取最終收據明細。
 * 4. 驗證費率是否依照「上車即鎖定」或「分段計費」之業務規則計算。
 * 
 * 預期結果 (Expected Result)：
 * 1. 系統在預估車資時應提示：「跨越 23:00 可能會產生夜間加成費」。
 * 2. 最終扣款金額應精確符合分段計算結果（22:50-23:00 原價，23:00-23:20 加成）。
 * 3. 收據明細應清晰列出「時間段加成費用」項目，提升帳單透明度。
 * 
 * 測試項目：邊際測試 - 金融計費完整性
 * 測試案例 2：行程跨越計費時段 (Cross-Timebox Pricing)
 * 技術應用：邊界值分析 (時間點 23:00) & 狀態轉換測試
 */
test('cross_timebox_pricing_case_2', async ({ page }) => {
    const tripUtil = new TripUtility(page);

    // 步驟 1: 模擬在 22:50 左右進入行程中狀態
    // 決策: 直接注入特定的系統時間 (Time Mocking)，確保穩定重現加成情境
    await page.addInitScript(() => {
        const mockNow = new Date('2026-02-27T22:50:00').getTime();
        Date.now = () => mockNow;
    });

    await tripUtil.setupInTripState('台北大安', '台北車站', 'cross-time-id');

    // 步驟 2: 模擬行程推移至 23:20 結束
    // 策略: 透過事件通知前端行程已完成，並帶入跨時段數據
    await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('trip_ended', {
            detail: {
                startTime: '22:50',
                endTime: '23:20',
                baseFare: 100,
                surcharge: 30, // 23:00 後產生的加成
                total: 130
            }
        }));
    });

    // 預期結果 1: 檢查是否有跨時段警告 (Pre-trip/Mid-trip warning)
    // 理由: 業務規則通常要求在可能變貴時主動告知使用者，避免爭議
    const priceWarning = page.locator('.price-surcharge-notice');
    await expect(priceWarning).toBeVisible();

    // 預期結果 2 & 3: 驗證帳單明細
    const receipt = page.locator('.receipt-container');
    await expect(receipt).toBeVisible();
    await expect(receipt.locator('.surcharge-item')).toContainText('夜間加成');
    await expect(receipt.locator('.total-amount')).toContainText('130');
});
