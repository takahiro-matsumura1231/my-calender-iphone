# 📩 メッセージ送信アプリ（React Native + Google Apps Script）

このアプリは、React Native で作成されたシンプルなメッセージ送信アプリです。
入力されたメッセージを Google Apps Script 経由で送信し、ステータス付きで表示します。

---

## 📱 主な機能

* メッセージの送信（GAS に POST）
* 送信結果（成功 / 失敗 / 通信中）のステータス表示
* 最新メッセージを上部に表示（`FlatList` + `inverted`）
* キーボードを閉じると送信しやすくなる設計
* 通信中にスピナー表示で状態がわかりやすい

---

## 🏗️ 使用技術

* React Native (TypeScript)
* Google Apps Script
* fetch API
* FlatList / ActivityIndicator / KeyboardAvoidingView など

---

## 🚀 セットアップ

```bash
# 依存パッケージのインストール
npm install

# Expo を使う場合
npx expo start

# CLI の場合
npx react-native run-ios
# または
npx react-native run-android
```

---

## 🔧 Google Apps Script の設定

1. Google Apps Script で新規プロジェクトを作成
2. 以下のコードを追加

```javascript
function doPost(e) {
  const content = e.postData.getDataAsString();
  return ContentService.createTextOutput(
    JSON.stringify({
      status: 200,
      message: '受信しました: ' + content
    })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

3. ウェブアプリとして公開
4. GAS\_URL に URL を設定

---

## 📸 スクリーンショット

<img width="1170" height="2532" alt="IMG_7177" src="https://github.com/user-attachments/assets/cd1d0e23-9cc4-4ab0-a1a8-5771d8b99262" />


---

## 📄 ライセンス


---

## 🙌 作成者

* 名前:　Takahiro Matsumura
* GitHub: @takahiro.matsumura1231@gmail.com
