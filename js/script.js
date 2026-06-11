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
        purpose:
          "避ける楽しさを追求したSTGです。",

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
          "オブジェクトプールを利用してメモリ負荷を軽減しました。"
      },

      "目指そう明るい未来":
      {
        purpose:
          "街を発展させるシミュレーションです。",

        specs: [
          {
            l: "プラットフォーム",
            v: "PC"
          },
          {
            l: "使用言語",
            v: "C# / Unity"
          }
        ],

        reason:
          "独自のアルゴリズムで経済システムを実装しました。"
      },

      "ガブッとクリッカー":
      {
        purpose:
          "マウスクリックで食べ物を食べてスコアを競うゲームです。",

        specs: [
          {
            l: "プラットフォーム",
            v: "PC"
          },
          {
            l: "使用言語",
            v: "C# / Unity"
          }
        ]
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

            document.getElementById(
              "modalPurpose"
            ).innerText =
              data.purpose;

            document.getElementById(
              "modalReason"
            ).innerText =
              data.reason;

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
                modalVideo.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
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