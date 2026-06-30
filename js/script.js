/* ========================================
   スムーズスクロール機能
   ======================================== */
const buttons = document.querySelectorAll(".nav-btn");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {

    const targetId = btn.dataset.target;
    const targetElement =
      document.getElementById(targetId);

    if (targetElement) {

      const scrollBlock =
        targetId === "hero"
          ? "start"
          : "center";

      targetElement.scrollIntoView({
        behavior: "smooth",
        block: scrollBlock
      });
    }
  });
});


/* ========================================
   詳細モーダル表示機能（Bootstrap 5対応）
   ======================================== */
document.addEventListener(
  "DOMContentLoaded",
  () => {

    const worksData = {

      "避けるんデス":
      {
        program:
          "・ランダムスポーン処理\n・アイテム3種の作成\n・スポーン統一化の修正\n・ウェーブ切替アニメーション",

        specs: [
          {
            l: "プラットフォーム",
            v: "Windows"
          },
          {
            l: "使用言語",
            v: "C# / Unity"
          }
        ],

        reason:
          "多彩なアイテムやボスの攻撃ギミックが登場する、２Ｄシューティングゲームです。\n快適な捜査官で、スコアやアイテムの取得を意識しながら、弾幕やボスの攻撃を上手く搔い潜る緊張感も楽しめます。"
      },

      "Draw&Goal":
      {
        program:
        "タイトルシーン\n・アイテム\n・UI",

        specs: [
          {
            l: "プラットフォーム",
            v: "Windows"
          },
          {
            l: "使用言語",
            v: "C# / Unity"
          }
        ],

        reason:
          "アイテムを収集しモニタに線を引くことで現実世界に橋を生成し、ゴールを目指すアクションゲームです。"
      },

      "目指そう明るい未来":
      {
        program:
          "・企画立案\n・ランダムボタンの生成・管理",

        specs: [
          {
            l: "プラットフォーム",
            v: "Windows"
          },
          {
            l: "使用言語",
            v: "C# / Unity"
          }
        ],

        reason:
          "ランダムに出現するボタンを押して税率を上下させ、国民の怒りゲージがMaxになる前にハイスコアを目指すゲームです。"
      },

      "ガブッとクリッカー":
      {
        program:
          "・画面遷移\n・アニメーション",

        specs: [
          {
            l: "プラットフォーム",
            v: "Windows"
          },
          {
            l: "使用言語",
            v: "C# / Unity"
          }
        ],

        reason:
          "食べていいものをクリックしてスコアを稼ぎ、ダメなものを3回食べると歯が欠けてゲームオーバーになるクリッカーゲームです。"
      }
    }

    const modalEl =
      document.getElementById(
        "exampleModal"
      );

    const modalVideo =
      document.getElementById(
        "modalVideo"
      );

    const specBody =
      document.querySelector(
        ".table tbody"
      );

    if (modalEl) {

      modalEl.addEventListener(
        "show.bs.modal",
        (event) => {

          const card =
            event.relatedTarget;

          const title =
            card.querySelector("h3")
            .innerText
            .trim();

          const data =
            worksData[title];

          if (data) {

            // 【変更】modalPurpose ← data.reason（概要を表示）
            document.getElementById(
              "modalPurpose"
            ).innerText =
              data.reason;

            // 【変更】modalReason ← data.program（担当箇所を表示）
            document.getElementById(
              "modalReason"
            ).innerText =
              data.program;

            specBody.innerHTML =
              data.specs.map(s => `
                <tr>
                  <td style="
                    font-weight:bold;
                    background:#f9f9f9;
                    width:35%;
                  ">
                    ${s.l}
                  </td>
                  <td>${s.v}</td>
                </tr>
              `).join("");

            // ===== 動画処理 =====
            const videoUrl = card.dataset.video;

            if (videoUrl) {
              let id = "";

              if (videoUrl.includes("youtu.be/")) {
                // 短縮URL: https://youtu.be/VIDEO_ID
                id = videoUrl.split("youtu.be/")[1].split("?")[0];
              } else if (videoUrl.includes("youtube.com/watch")) {
                // 通常URL: https://www.youtube.com/watch?v=VIDEO_ID
                id = new URL(videoUrl).searchParams.get("v");
              }

              if (id) {
                modalVideo.src = `https://www.youtube.com/embed/${id}`;
              } else {
                modalVideo.src = "";
              }
            } else {
              modalVideo.src = "";
            }
          }
        }
      );

      // 閉じたら停止
      modalEl.addEventListener("hidden.bs.modal", () => {
        modalVideo.src = ""; // 停止
      });
    }
});