/* ========================================
   スムーズスクロール機能
   ======================================== */
const buttons = document.querySelectorAll(".nav-btn");
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.target;
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const scrollBlock = targetId === "hero" ? "start" : "center";
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: scrollBlock
      });
    }
  });
});

/* ========================================
   詳細モーダル表示機能（Bootstrapイベント対応）
   ======================================== */
document.addEventListener("DOMContentLoaded", () => {
  const worksData = {
    "避けるんデス": {
      purpose: "ここに制作目的を記載予定",
      specs: [{l:"項目", v:"内容"}],
      reason: "ここに技術的ポイントを記載予定",
      github: "#"
    },
    "目指そう明るい未来": {
      purpose: "ここに制作目的を記載予定",
      specs: [{l:"項目", v:"内容"}],
      reason: "ここに技術的ポイントを記載予定",
      github: "#"
    }
  };

  const modalEl = document.getElementById('videoModal');
  const modalVideo = document.getElementById("modalVideo");
  const specBody = document.getElementById("specBody");

  // ★モーダルが表示される直前の処理★
  modalEl.addEventListener('show.bs.modal', (event) => {
    // クリックされたカード要素を取得
    const card = event.relatedTarget;
    const title = card.querySelector("h3").innerText;
    const data = worksData[title];

    if (data) {
      // データの流し込み
      document.getElementById("modalPurpose").innerText = data.purpose;
      document.getElementById("modalReason").innerText = data.reason;
      document.getElementById("githubLink").href = data.github;
      specBody.innerHTML = data.specs.map(s => `
        <tr><td style="font-weight:bold; background:#f9f9f9; width:35%;">${s.l}</td><td>${s.v}</td></tr>
      `).join('');
      
      // 動画のセットと再生
      modalVideo.src = card.dataset.video || "";
      modalVideo.play();
    }
  });

  // ★モーダルが閉じられた時の処理（動画停止）★
  modalEl.addEventListener('hidden.bs.modal', () => {
    modalVideo.pause();
    modalVideo.src = "";
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