
# 😡スクロールでふわっと出てくるやつ絶対粉砕するマン😡

「スクロールでふわっと出てくるやつ絶対粉砕するマン」は最近のWebページでよくある「スクロールに合わせてふわっと出てくるアレ」を粉砕するネタアプリ（Chrome機能拡張）です

## とりあえず試してみる

機能拡張をインストールするほどでもないけどちょっと試してみたい...くらいの方は[デモページ](https://yuneco.github.io/animation-pulverizer/)で遊べます。

- ページを開いて画面をスクロールするとゲームが始まります
- クソアプリにつきクリアもゲームオーバーもありません
- もういちと遊ぶ時は一番上までスクロールしてからリロードしてください
- Chrome / Safariでは動作すると思います

## 好きなwebページ上で動かす

- このリポジトリのreleaseディレクトリをダウンロードして「パッケージ化されていない拡張機能」として読み込んでください
  - 参考：[GoogleChromeでパッケージ化されていない拡張機能を読み込む方法](https://blog.janjan.net/2020/04/01/chrome-load-non-package-extensions/)
- 任意のアニメーションモリモリのページを開き、機能拡張のアイコン（🔨）をクリックしてからスクロールするとゲームが始まります

## 技術的な説明

この機能拡張は「1. 対象ページ上のアニメーションを検出」し「2. クリックで粉砕」する機能を実装しています。
検出できる・できないアニメーションは以下の通りです

できる：
- CSS Transition
- CSS Animation （Web Animations API含む）
- タイマーやrequestAnimationFrameを使用したスクリプトベースのアニメーション。ただし下記のプロパティに限定しています：
  - width, height, left, top, right, bottom, transform

できない：
- SVGの`<animate>`要素を利用したアニメーション
- Canvas内のアニメーション
- 擬似要素のアニメーション（親要素のアニメーションとして検出されます）


## LICENSE

The source code written for this project is licensed MIT.

<div>Extension icon made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
