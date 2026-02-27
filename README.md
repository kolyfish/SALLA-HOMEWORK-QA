# SALLA Ride-Sharing App - QA Automation Project

[![Playwright Tests](https://img.shields.io/badge/Tested%20with-Playwright-green)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)](https://www.typescriptlang.org/)

本專案針對類 Uber 叫車平台進行自動化測試規劃與實作。採用 **ISTQB 標準思維** 結合 **Playwright** 高階架構，建立高穩定性、低維護成本的企業級測試套件。

## 🎯 專案亮點 (Key Highlights)

- **業務流導向設計**：依照真實用戶旅程（Login -> Book -> In-Ride -> Completion）組織 16 個核心測試案例。
- **高階穩定性策略**：100% 捨棄 `waitForTimeout`，改用全域等待與 `networkidle` 跳躍式等待，達成極高的測試執行成功率。
- **邊際情境覆蓋**：包含 GPS 漂移、跨時段計費、網路斷線恢復及並發衝突（Race Condition）等高難度測試。
- **模組化架構 (POM)**：完整實作 Page Object Model 與 Utility 封裝，代碼遵循 DRY 原則。

## 🛠 技術棧 (Tech Stack)

- **核心架構**: Playwright (v1.x)
- **程式語言**: TypeScript
- **設計模式**: Page Object Model (POM)
- **版本控制**: Git (遵循 Angular Commit Message 規範)

## 📁 目錄結構

- `tests/`: 依業務排優先級編號的測試指令碼 (01-06)
- `pages/`: Page Object Model 物件封裝架構
- `utility/`: 可複用的業務工具 (GPS 模擬、行程預設等)
- `design_log.md`: **詳細的開發設計精華日誌 (推薦閱讀)**

## 🚀 快速上手 (Quick Start)

1. **安裝依賴**
   ```bash
   npm install
   ```

2. **執行所有測試**
   ```bash
   npx playwright test
   ```

3. **查看測試報表**
   ```bash
   npx playwright show-report
   ```

## 📈 測試案例概覽

| 分類 | 描述 | 測試技術 |
| :--- | :--- | :--- |
| **01. Login** | 登入、BVA 檢查、帳戶鎖定 | EP / BVA |
| **02. Booking** | 完整配對流、預約時間邊界、無司機處理 | State Transition |
| **03. In-Ride** | ETA 更新、修改目的地、行程分享 | Dynamic UI |
| **04. Completion** | 自動扣款、司機評分、明細歷史 | Backend Sync |
| **05. Critical** | 並發 Race Condition、網路斷線恢復 | Reliability |
| **06. Edge Case** | GPS 漂移模擬、跨時段動態計費 | Error Guessing |

---

## 🔮 長期優化展望 (Roadmap)

基於架構設計視角，若專案持續擴展，建議以下優化方向：
1. **MSW 整合**: 精確模擬後端回應以測試極端邊界。
2. **Visual Testing**: 針對複雜地圖介面引入視覺比對。
3. **Data-Driven (DDT)**: 數據與腳本分離，提升維護效率。
4. **Time Mocking**: 凍結系統時間以獲得 100% 決定性結果。

---
*Last Updated: 2026-02-27*
