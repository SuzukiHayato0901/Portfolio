/* ========================================
   スムーズスクロール機能
   ======================================== */

// すべてのナビゲーションボタンを取得
const buttons = document.querySelectorAll(".nav-btn");

// 各ボタンにクリックイベントを設定
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    // data-target属性から移動先のIDを取得
    const targetId = btn.dataset.target;
    
    // 移動先の要素を取得
    const targetElement = document.getElementById(targetId);

    // 要素が存在する場合のみスクロール実行
    if (targetElement) {
      // hero以外は画面中央に表示
      const scrollBlock = targetId === "hero" ? "start" : "center";
      
      // スムーズにスクロールして移動
      targetElement.scrollIntoView({
        behavior: "smooth", // スムーズスクロールを有効化
        block: scrollBlock  // hero以外は中央、heroは上端に合わせる
      });
    }
  });
});