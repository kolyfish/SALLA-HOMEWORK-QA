# 《開發者設計精華日誌》 - Uber-like 叫車平台自動化測試專案

## 專案概述
本專案針對一個類 Uber 的叫車平台進行自動化測試規劃與實作。採用 ISTQB 標準思維，結合 Playwright 高階測試架構，旨在建立一個高穩定性、低維護成本的測試套件。

## 設計理念
### 1. 測試設計技術應用
- **等價分割 (EP)**：減少冗餘測試，確保覆蓋所有邏輯分區。
- **邊界值分析 (BVA)**：鎖定輸入欄位（如手機號碼）與時間選擇的邊緣情境。
- **狀態轉換測試**：關鍵於叫車流程（搜尋 -> 等待 -> 趕往 -> 行程中 -> 完成）的流轉驗證。
- **錯誤猜測 (Error Guessing)**：基於經驗預測「無司機」、「網路斷線」或「並發衝突」等高階異常。

### 2. 技術架構決策 (POM & Playwright)
- **Page Object Model (POM)**：將頁面邏輯與測試案例解耦，LoginPage 與 RidePage 封裝複雜的定位器與操作流程。
- **公共 Utility 模組化**：針對 In-Trip 與 Ride Completion 等多案例共用的前置作業，封裝成 `TripUtility` 與 `CompletionUtility`。這大幅提升了代碼重用性 (DRY 原則)，並讓測試案例專注於核心業務邏輯。
- **高階等待策略**：全面捨棄 `wait_for_timeout`。改用 `networkidle` 與 `element.wait_for(state="visible")` 以應對變動的 API 回應時間。

### 3. 環境與 TypeScript 配置
- **TypeScript 整合**：配置 `tsconfig.json` 並確保型別宣告一致。
- **全域配置 (playwright.config.ts)**：將全域等待時間設定為 10,000ms，符合高效能測試準則。

## 專案工程化與長期優化展望 (Future Roadmap)
> *本節說明若專案需規模化至企業級應用，基於架構設計視角的優化路線方案：*

1. **Mock Service Worker (MSW)**：在端對端測試中整合後端模擬，以便更精確地測試「跨時段計費」等難以複現的情境。
2. **Visual Testing Integration**：針對複雜地圖介面引入視覺比對（如 Applitools 或 Playwright Screenshots），確保地圖渲染的一致性。
3. **Data-Driven Testing (DDT)**：針對多國手機號碼格式，將數據外置於 JSON，提升測試數據的維護效率。
4. **Time Mocking**：針對跨計費時段測試，建議透過 `Date.now` 封裝進行全域時間凍結，以獲得 100% 決定性的測試結果。

### 實作測試案例清單 (按業務流程排序)
#### 01. 登入 (Login)
- `01_login_case_1.spec.ts`: 驗證 Happy Path 登入。
- `01_login_case_2.spec.ts`: 驗證手機號碼 BVA 檢查。
- `01_login_case_3.spec.ts`: 驗證帳戶安全鎖定邏輯。

#### 02. 預約叫車 (Book a Ride)
- `02_book_a_ride_case_1.spec.ts`: 驗證完整叫車配對流。
- `02_book_a_ride_case_2.spec.ts`: 驗證邊界預約時間 (BVA 29/30/31 min)。
- `02_book_a_ride_case_3.spec.ts`: 驗證無司機時的異常處理。

#### 03. 乘車體驗 (In-Ride Experience)
- `03_in_ride_experience_case_1.spec.ts`: 驗證即時路徑與 ETA 更新。
- `03_in_ride_experience_case_2.spec.ts`: 驗證行程中修改目的地。
- `03_in_ride_experience_case_3.spec.ts`: 驗證分享行程安全功能。

#### 04. 完成行程 (Ride Completion)
- `04_ride_completion_case_1.spec.ts`: 驗證自動扣款流程。
- `04_ride_completion_case_2.spec.ts`: 驗證司機評分與反饋。
- `04_ride_completion_case_3.spec.ts`: 驗證查看電子明細歷史。

#### 05. 關鍵功能測試 (Critical Feature Testing)
- `05_critical_feature_testing_case_1_race_condition.spec.ts`: 驗證司機/乘客同時取消的競爭狀態。
- `05_critical_feature_testing_case_2_reliability_network_disconnected.spec.ts`: 驗證網路斷線後的行程恢復。

#### 06. 邊際情境 (Edge Cases)
- `06_edge_case_gps_drift.spec.ts`: 驗證 GPS 漂移至非法地點 (空間邊際)。
- `06_edge_case_cross_pricing.spec.ts`: 驗證跨時段計費 (時間邊際)。

### 4. 環境與 Debug 紀錄
- **TypeScript 型別衝突修復**：修正 `tsconfig.json` 中的 `types` 配置。移除 `@playwright/test` 全域宣告，強制 IDE 使用文件頂部的 `import` 導入型別，解決 "Cannot find name 'test'" 的 false positive 錯誤。
- **導航機制穩定性**：在 `playwright.config.ts` 引入 `baseURL`。這解決了 POM 中使用相對路徑時導致的 `Invalid URL` 錯誤，並確保測試環境的可遷移性。
- **環境清理與 Git 規範**：導入完整的 `.gitignore` 並手動清理 macOS 於外接硬碟產生的 `._*` 元數據檔案 (AppleDouble)，確保版本控制的純淨性。
- **Git 版本控制初始化**：建立 Git 儲存庫並導入 Angular Commit Message 規範。排除所有非開發相關的教學檔案與系統垃圾，確保 Repo 的專業性。

---
*進度：已完成全系列 E2E 測試實作。修復 `expect` 型別識別問題，並移除 `TripUtility` 中的 `waitForTimeout` 違規調用，達成 100% 規範符合度。*
*最後更新時間：2026-02-27*
