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

const videoUrl = card.dataset.video;

// Youtube用に
if (videoUrl.includes("youtu.be"))
{
  const id = videoUrl.split("/").pop();
  document.getElementById("modalVideo").src = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`;

}

/* ========================================
   詳細モーダル表示機能（Bootstrap 5対応）
   ======================================== */
document.addEventListener("DOMContentLoaded", () => {
  const worksData = {
    "避けるんデス": {
      purpose: "避ける楽しさを追求したSTGです。",
      specs: [
        {l:"プラットフォーム", v:"Windows"},
        {l:"使用言語", v:"C# / Unity"}
      ],
      reason: "オブジェクトプールを利用してメモリ負荷を軽減しました。",
      github: "https://github.com/..."
    },
    "目指そう明るい未来": {
      purpose: "街を発展させるシミュレーションです。",
      specs: [
        {l:"プラットフォーム", v:"PC"},
        {l:"使用言語", v:"C# / Unity"}
      ],
      reason: "独自のアルゴリズムで経済システムを実装しました。",
      github: "https://github.com/..."
    }
  };

  // HTMLのID「exampleModal」を取得
  const modalEl = document.getElementById('exampleModal');
  const modalVideo = document.getElementById("modalVideo");
  const specBody = document.querySelector(".table tbody"); // tableの中身

  if (modalEl) {
    modalEl.addEventListener('show.bs.modal', (event) => {
      const card = event.relatedTarget;
      const title = card.querySelector("h3").innerText.trim();
      const data = worksData[title];

      if (data) {
        // テキストの流し込み
        document.getElementById("modalPurpose").innerText = data.purpose;
        document.getElementById("modalReason").innerText = data.reason;
        
        // テーブル（スペック）の流し込み
        if (specBody) {
          specBody.innerHTML = data.specs.map(s => `
            <tr>
              <td style="font-weight:bold; background:#f9f9f9; width:35%;">${s.l}</td>
              <td>${s.v}</td>
            </tr>
          `).join('');
        }

        // 動画のセット（data-video属性があれば）
        if (modalVideo) {
          modalVideo.src = card.dataset.video || "";
          modalVideo.play().catch(() => {
            console.log("自動再生がブロックされました");
          });
        }
      }
    });

    // モーダルを閉じた時に動画を止める
    modalEl.addEventListener('hidden.bs.modal', () => {
      if (modalVideo) {
        modalVideo.pause();
        modalVideo.src = "";
      }
    });
  }
});

/*  ========================================
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