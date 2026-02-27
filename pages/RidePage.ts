import { Page, Locator, expect } from '@playwright/test';

export class RidePage {
    readonly page: Page;
    readonly pickupInput: Locator;
    readonly destinationInput: Locator;
    readonly bookButton: Locator;
    readonly carTypeOption: Locator;
    readonly tripStatus: Locator;
    readonly driverInfo: Locator;
    readonly paymentSummary: Locator;

    constructor(page: Page) {
        this.page = page;
        this.pickupInput = page.locator('input#pickup');
        this.destinationInput = page.locator('input#destination');
        this.bookButton = page.locator('button#confirm-booking');
        this.carTypeOption = page.locator('.car-option').first();
        this.tripStatus = page.locator('.status-badge');
        this.driverInfo = page.locator('.driver-card');
        this.paymentSummary = page.locator('.payment-summary');
    }

    async setRoute(pickup: string, destination: string) {
        await this.pickupInput.fill(pickup);
        await this.destinationInput.fill(destination);
        // 決策: 等待預估路徑列表出現
        // 原因: 輸入後通常會有非同步 API 請求建議地點，需等待建議框消失或穩定
        await this.page.keyboard.press('Enter');
    }

    async confirmBooking() {
        await this.carTypeOption.click();
        await this.bookButton.click();
    }

    async waitForDriverMatching() {
        // 策略: 持續監控狀態變化而非寫死等待時間
        // 原因: 司機接單時間不可控，採用特定狀態的 visibility 作為訊號
        await this.tripStatus.waitFor({ state: 'visible', timeout: 30000 });
        await expect(this.tripStatus).toContainText('司機趕往中');
    }

    async getETA(): Promise<string | null> {
        return await this.page.locator('.eta-timer').textContent();
    }
}
