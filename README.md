
このツールはAmong Usをプレイするときに、特定のチャンネルに入っているメンバーの「ミュート」「スピーカーミュート」の状態を一括で切り替えるためのツールです。

誰か一人がこのツールを使うことで、他のメンバーはDiscordの操作を気にすることなくプレイできます。

インポスターにキルされた人、もしくは投票によって追放された人同士はプレイ中に会話できます。

## 事前準備

### 1. Discord Application を作って、ボットアカウントを Discord サーバに追加する
1. https://discord.com/developers/applications
    - 上記ページからアプリを作っておきます。
    - CLIENT ID を控えておいてください
2. 「Bot」メニューを選択し、ボットを作成してください
3. トークンがコピーできるはずなので、控えておいてください
4. 以下のURLを使って、このツールを導入したいサーバにボットを追加してください（CLIENT_IDは、1で控えたものに差し替えてください）
    ```
    https://discord.com/api/oauth2/authorize?client_id=#{YOUR_APP_CLIENT_ID}&permissions=12582912&scope=bot
    ``` 

### 2. アプリケーションのトークン入力欄にトークンを貼り付ける

- TODO: Releaseから最新バージョンをダウンロードしてください
   - node.jsの開発環境がある人は、`yarn run electron:dev` で開発者モードのアプリを起動できます。（機能に差はありません）
- 初回に起動すると、「BOT Token」を入力するフィールドが表示されるので、1-3で控えたトークンを入力してください。

### 3. 1で作ったボットアカウントが追加されているサーバが選択できるようになっているはず

- サーバのセレクトボックスで、1-4で追加したサーバーが選択できるようになっていると思います

## 使い方

1. 「サーバー」と「チャンネル」を選ぶ
   - ボイスチャンネルしか選択不可
2. プレイするメンバーが揃ったら「ゲーム開始」をクリック
   - 開始時はすべてのメンバーが「サーバーミュート」「サーバースピーカーミュート」になる
3. 「リポート」「緊急会議」が発生したら「会議開始」をクリック
   - 生きているメンバーは「サーバースピーカーミュート」および「サーバーミュート」解除、死んでいるメンバーは「サーバースピーカーミュート」のみ解除される
4. 死んでいるプレイヤーがいればプレイヤーをクリック
    - クリックするたびに生き死にの状態が切り替わる
5. 会議が終わったら「会議終了」をクリック
   - 生きているメンバーは「サーバースピーカーミュート」および「サーバーミュート」に、死んでいるメンバーはいずれのミュートもされない