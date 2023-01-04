# pokes-calc

ポケモンの実数値を計算するサイトです。

ポケモン名は「かな/カナ」関わらず行えます。
入力されたポケモンの概要をタイトルとして表示します。
ポケモンのアイコンをクリックすることで姿を変えることができます(選択できる姿違いはまだ未実装)

「252」ボタンで努力値を設定する場合に最大値を超えてしまったり、
無駄な努力値になってしまう事を自動で判断し計算します。

特性「はやあし」によって麻痺での1/2が無視されます。
持ち物「スピードパウダー」は「メタモン」のみに効果があります。

v1.00.0	-	サイト設立 / launch a site
v1.01.0	-	努力値ボタンがより快適になるようにしました(252入らない場合に自動計算,無駄な努力値も省く) / More elaborate EV buttons(No overflow, no waste)
v1.01.1	-	更新内容が表示されるようになりました / show Update details
v1.02.0	-	ひらがなでの検索を可能にしました / You can Search in hiragana
v1.02.1	-	スクロールバーをオリジナルのものにしました / Decorated scroll bars
v1.02.2	-	努力値が入っている際にv1.01.0の機能が正常に動かない問題を直しました / Fixed a problem with v1.01.0 where the function did not work properly when effort is included
v1.03.0	-	素早さ比較用のフォームを作成しました / Created a form for Speed comparison
v1.04.0	-	HP調整表の表示切替を可能にしました / Display of HP adjustment table can be switched
v1.04.1	-	表示をきれいにしました / Cleaned up the display
v1.05.0	-	ランク補正等込みの素早さ実数値が確認できるようになりました / Actual speed values including rank correction, etc. can now be checked
-	サイトの説明を追加しました / Added site description
-	表示非表示のボタンをタイトル自体で行えるようしました / Show/hide can be done by pressing the title
v1.05.1	-	S比較のボタンを見やすくしました / S Comparison buttons are now easier to see
v1.06.0	-	フォントの統一化、S比較でのS表示をしました / Font standardization and S display in S comparisons
v1.06.1	-	空文字の表記ができないようになりました / Even if you enter an empty character, it will be 0
v1.06.2	-	スマホ用の入力方法を用意しました / Input method for mobile phones is available
-	実数値から計算する際の深刻なバグを直しました / A serious glich in calculating from real values has been fixed
-	全体的な要素の配置を見直しました / The overall arrangement of elements has been revised
v1.06.3	-	v1.06.2の矢印追加によって不要になったinput要素の矢印を消去しました / Removed arrows on input elements that are no longer needed due to the addition of arrows in v1.06.2
-	Firefox等のブラウザで無駄な矢印が表示される問題を解決しました / Fixed a problem with useless arrows in Firefox and other browsers
v1.06.4	-	表示をきれいにしました / Cleaned up the display
v1.06.5	-	使われている色を鮮やかにしました / The colors used have been made more vibrant
v2.00.0	-	画像を用意しました(処理を後回しにしているので処理速度に問題はありません) / Images available
v2.00.1	-	HP調整表の表示をきれいにしました / Cleaned up the display of the HP adjustment table
-	サイトの説明の初期設定を「表示」にしました / The default setting for the site description is "Show"
v2.00.2	-	Google等で検索できるようにキーワードを設定しました / Keyworded to be searchable by Google, etc
