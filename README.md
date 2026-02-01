# もう釣りいきたい

遊漁船の検索WEBサービス

## 機能

- プラン検索（日付・釣り方・遊漁船でフィルタ）
- 空きありのみ表示
- 遊漁船一覧

## データソース

Google スプレッドシートからデータを取得

- ships: 遊漁船情報
- booking: プラン情報（Googleカレンダーから自動取得）

## 開発

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build
```

## 技術スタック

- React + TypeScript
- Vite
- react-router-dom
- papaparse (CSV解析)
