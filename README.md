# Twin3 Marketplace

Twin3 Marketplace 是一個人機協作的市場平台，提供個人化代理服務和任務管理功能。

## 專案結構

```
twin3-marketplace/
├── client/          # Next.js 前端應用
├── server/          # Node.js 後端 API
├── UI/              # 設計文件和原型
└── README.md        # 專案說明
```

## 功能特色

- 🤖 個人化 AI 代理管理
- 📋 任務管理系統
- 🌐 多語言支援 (中文、英文、日文)
- 📱 響應式移動端設計
- 🔐 用戶認證和隱私設定

## 技術棧

### 前端 (Client)
- **框架**: Next.js 15.5.4
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **狀態管理**: React Context
- **Web3**: @web3-react/core

### 後端 (Server)
- **運行時**: Node.js
- **語言**: TypeScript
- **數據庫**: SQLite
- **容器化**: Docker

## 快速開始

### 前置需求
- Node.js 20.x 或更高版本
- npm 或 yarn

### 安裝和運行

1. **克隆專案**
   ```bash
   git clone <repository-url>
   cd twin3-marketplace
   ```

2. **安裝前端依賴**
   ```bash
   cd client
   npm install
   ```

3. **安裝後端依賴**
   ```bash
   cd ../server
   npm install
   ```

4. **啟動開發服務器**
   
   前端 (端口 3000):
   ```bash
   cd client
   npm run dev
   ```
   
   後端 (端口 3001):
   ```bash
   cd server
   npm start
   ```

## 開發指南

### 前端開發
- 使用 `npm run dev` 啟動開發服務器
- 支援熱重載和快速刷新
- 使用 ESLint 進行代碼檢查

### 後端開發
- 使用 `npm start` 啟動服務器
- 數據庫文件位於 `server/twin3.db`
- API 端點文檔請參考 `server/src/` 目錄

### 語言系統
專案支援多語言，語言文件位於：
- `client/src/contexts/LanguageContext.tsx`

支援的語言：
- 英文 (en)
- 繁體中文 (zh-TW)
- 簡體中文 (zh-CN)
- 日文 (ja)

## 部署

### 前端部署
```bash
cd client
npm run build
npm start
```

### 後端部署
使用 Docker:
```bash
cd server
docker-compose up -d
```

## 貢獻指南

1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 授權

本專案採用 MIT 授權 - 詳見 [LICENSE](LICENSE) 文件

## 聯繫方式

如有問題或建議，請通過以下方式聯繫：
- 創建 Issue
- 發送 Pull Request
- 郵件聯繫: your-email@example.com

## 更新日誌

### v1.0.0 (2024-01-01)
- 初始版本發布
- 完整的任務管理系統
- 多語言支持
- 響應式設計

---

**Twin3 Marketplace** - 打造未來的人機協作平台 🚀

*✨ 剛剛通過了所有測試，準備投入生產環境！*