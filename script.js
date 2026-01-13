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

/* ========================================
   画像クリック拡大機能
   ======================================== */

// DOMが完全に読み込まれた後に実行
document.addEventListener("DOMContentLoaded", () => {
  // モーダル要素を取得
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const closeModalBtn = document.querySelector(".close-modal");

  // 要素が存在するか確認
  if (!modal || !modalImage || !closeModalBtn) {
    console.error("モーダル要素が見つかりません");
    return;
  }

  // 作品カード内のすべての画像を取得
  const workImages = document.querySelectorAll(".work-card img");

  // 各画像にクリックイベントを設定
  workImages.forEach(img => {
    img.addEventListener("click", () => {
      modal.style.display = "flex"; // モーダルを表示
      modalImage.src = img.src; // クリックした画像をモーダルに表示
      modalImage.alt = img.alt; // alt属性もコピー
    });
  });

  // 閉じるボタンをクリックしたらモーダルを閉じる
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none"; // モーダルを非表示
  });

  // モーダル背景をクリックしても閉じる
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none"; // モーダルを非表示
    }
  });
});

/* ========================================
   画像クリック拡大機能
   ======================================== */

// モーダル要素を取得
const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const closeModal = document.querySelector(".close-modal");

// 作品カード内のすべての画像を取得
const workImages = document.querySelectorAll(".work-card img");

// 各画像にクリックイベントを設定
workImages.forEach(img => {
  img.addEventListener("click", () => {
    modal.style.display = "flex"; // モーダルを表示
    modalImage.src = img.src; // クリックした画像をモーダルに表示
    modalImage.alt = img.alt; // alt属性もコピー
  });
});

// 閉じるボタンをクリックしたらモーダルを閉じる
closeModal.addEventListener("click", () => {
  modal.style.display = "none"; // モーダルを非表示
});

// モーダル背景をクリックしても閉じる
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none"; // モーダルを非表示
  }
});