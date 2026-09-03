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
          "多彩なアイテムやボスの攻撃ギミックが登場する、２Ｄシューティングゲームです。\n快適な捜査官で、スコアやアイテムの取得を意識しながら、弾幕やボスの攻撃を上手く搔い潜る緊張感も楽しめます。",

        // 【追加】担当コードタブに表示するファイル一覧
        codeFiles: [
          {
            name: "ItemSpawner.cs",
            desc: "アイテムをランダムな位置・間隔でスポーンさせる管理処理",
            code:
`using System.Collections;
using System.Collections.Generic;
using UnityEngine;

// 複数種類のアイテムを「1個ずつ」管理し、一定間隔で再出現させるマネージャー
public class ItemSpawner : MonoBehaviour
{
    public enum ItemType
    {
        // バフ
        Coin,
        Lifes,
        Shield,
        SpeedUp,
        BulletRefill,

        // デバフ
        SpeedDown
    }

    [System.Serializable]
    public class ItemSpawnData
    {
        public ItemType type;            // アイテムの種類
        public GameObject prefab;        // プレハブ
        public float spawnInterval;      // 再出現までの時間（秒）

        [HideInInspector] public GameObject currentInstance = null; // 現在のアイテム
    }

    public List<ItemSpawnData> itemDataList = new List<ItemSpawnData>();

    public Vector2 spawnAreaMin = new Vector2(-3.6f, -3.6f);
    public Vector2 spawnAreaMax = new Vector2(3.6f, 3.6f);

    void Start()
    {
        // 各アイテムについて初回スポーンタイマーを開始
        foreach (var data in itemDataList)
        {
            StartCoroutine(SpawnAfterDelay(data, data.spawnInterval));
        }
    }

    // spawnInterval後にスポーン処理を実行する
    IEnumerator SpawnAfterDelay(ItemSpawnData data, float delay)
    {
        yield return new WaitForSeconds(delay);
        SpawnItem(data);
    }

    // ランダムな位置にアイテムを1スポーンさせる
    public void SpawnItem(ItemSpawnData data)
    {
        // すでに存在していたら生成しない
        if (data.currentInstance != null) return;

        Vector2 spawnPos = new Vector2(
            Random.Range(spawnAreaMin.x, spawnAreaMax.x),
            Random.Range(spawnAreaMin.y, spawnAreaMax.y)
        );

        GameObject item = Instantiate(data.prefab, spawnPos, Quaternion.identity);
        data.currentInstance = item;

        // インデックスを渡すためリスト内の位置を取得
        int index = itemDataList.IndexOf(data);

        ItemIdentity identity = item.GetComponent<ItemIdentity>();
        if (identity != null)
        {
            identity.SetSpawner(this, index);
        }
    }

    // 外部から呼ばれる：アイテムが取得されたときに実行
    public void OnItemCollected(int index)
    {
        if (index < 0 || index >= itemDataList.Count) return;

        var data = itemDataList[index];
        data.currentInstance = null;

        StartCoroutine(SpawnAfterDelay(data, data.spawnInterval));
    }
}`
          },
          {
            name: "ItemIdentity.cs",
            desc: "スポーンしたアイテムとスポナーを紐付け、取得時の通知を行う処理",
            code:
`using UnityEngine;

public class ItemIdentity : MonoBehaviour
{
    private ItemSpawner spawner;  // スポナーの参照
    private int index;            // スポーンリスト内のアイテムインデックス

    // スポナーとアイテムリスト内のインデックスをセットする
    public void SetSpawner(ItemSpawner spawner, int index)
    {
        this.spawner = spawner; // スポナーの参照
        this.index = index;     // リスト内のアイテム番号
    }

    public void NotifyCollectedByPlayer()
    {
        spawner.OnItemCollected(index);  // プレイヤーに取得されたとスポナーに通知
        Destroy(gameObject);             // 自身を破棄
    }

    public void NotifyShieldByPlaer()
    {
        spawner.OnItemCollected(index); // シールドを使われたら
    }

    private void OnTriggerEnter2D(Collider2D other)
    {
        // プレイヤーに触れたか確認
        if (!other.CompareTag("Player")) return;

        Player player = other.GetComponent<Player>();
        if (player == null) return;

        // シールド専用処理（自身を削除せずプレイヤーに追従させるためここで return）
        Shield shield = GetComponent<Shield>();
        if (shield != null)
        {
            shield.ApplyToPlayer(player);
            return;
        }

        SpeedUpItem speedUp = GetComponent<SpeedUpItem>();
    }
}`
          },
          {
            name: "Lives.cs",
            desc: "プレイヤーがライフアイテムを取得した際に残機を加算する処理",
            code:
`using UnityEngine;

[RequireComponent(typeof(Collider2D))] // Collider2Dコンポーネントが必須であることを指定
public class Lives : MonoBehaviour
{
    public int lifeValue = 1; // ライフの値。プレイヤーが取得した際に加算される

    // トリガーイベント：プレイヤーがこのオブジェクトと衝突した時に発生
    private void OnTriggerEnter2D(Collider2D collision)
    {
        // 衝突したオブジェクトが「Player」タグを持っているかチェック
        if (collision.CompareTag("Player"))
        {
            // ItemSpawner に回収通知を送る
            ItemIdentity identity = GetComponent<ItemIdentity>();
            if (identity != null)
            {
                identity.NotifyCollectedByPlayer();
            }
            else
            {
                Destroy(gameObject);
            }
            // プレイヤーがライフを取得したので、ゲームマネージャに通知してライフを加算
            if (GameManager.Instance != null)
            {
                GameManager.Instance.AddLife(lifeValue); // プレイヤーの残機を加算
            }

            Destroy(gameObject); // ライフオブジェクトを削除
        }
    }
}`
          },
          {
            name: "SpeedUpItem.cs",
            desc: "プレイヤーに一定時間のスピードアップ効果を付与する処理",
            code:
`using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SpeedUpItem : MonoBehaviour
{
    [SerializeField] float speedUp = 2f;     // 加速量
    [SerializeField] float duration = 3f;    // 効果持続時間

    public void ApplyToPlayer(Player player)
    {
        if (player != null)
        {
            // プレイヤーにスピードアップ効果を適用
            player.ActivateSpeedBoost(speedUp, duration);

            // ItemSpawnerに回収通知を送る
            ItemIdentity identity = GetComponent<ItemIdentity>();
            if (identity != null)
            {
                identity.NotifyCollectedByPlayer();
            }
            else
            {
                Destroy(gameObject);
            }
        }
    }

    // プレイヤーとの接触を検知
    private void OnTriggerEnter2D(Collider2D other)
    {
        // Playerタグを持っているか確認
        if (other.CompareTag("Player"))
        {
            // プレイヤーのスクリプトを取得
            Player player = other.GetComponent<Player>();
            if (player != null)
            {
                // 効果を適用
                ApplyToPlayer(player);
            }
        }
    }
}`
          }
        ]
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
          "アイテムを収集しモニタに線を引くことで現実世界に橋を生成し、ゴールを目指すアクションゲームです。",

        // 【追加】担当コードタブに表示するファイル一覧
        codeFiles: [
          {
            name: "Player.cs",
            desc: "カメラ正面のRaycastでアイテムを検知し、取得処理を行う",
            code:
`using UnityEngine;

public class Player : MonoBehaviour
{
    public string itemText;       // アイテム取得テキスト用
    public int woodCount = 0;     // 木材所持数
    public LogManeger logManager; // ログマネージャー参照用

    // Raycastのための参照
    public Transform playerCamera;
    public float rayDistance = 3f; // 取得可能な距離

    void Start()
    {
        itemText = string.Empty;
    }

    void Update()
    {
        // 毎フレームRaycastを実行する
        CheckForItem();

        // デバッグ用（木材が0以下にならないように）
        if (Input.GetKeyDown(KeyCode.L))
        {
            if (woodCount > 0)
            {
                woodCount--;
                Debug.Log("木材を1減らした");
            }
        }
    }

    void CheckForItem()
    {
        // カメラがない場合は処理しない
        if (playerCamera == null)
        {
            itemText = string.Empty;
            return;
        }

        // 画面中央（カメラの前方）にRayを飛ばす
        Ray ray = new Ray(playerCamera.position, playerCamera.forward);
        RaycastHit hit;

        // Rayが何かに当たったら
        if (Physics.Raycast(ray, out hit, rayDistance))
        {
            // 当たったオブジェクトが "Wood" タグを持っているか
            if (hit.collider.CompareTag("Wood"))
            {
                itemText = "F 取得";

                if (Input.GetKeyDown(KeyCode.F))
                {
                    PickupWood(hit.collider.gameObject);
                }
            }
            else
            {
                // Wood以外に当たっている場合
                itemText = string.Empty;
            }
        }
        else
        {
            // 何も当たっていない場合
            itemText = string.Empty;
        }
    }

    void PickupWood(GameObject woodObject)
    {
        woodCount++;

        // ログ
        logManager.AddLog("木材を1取得した。");
        logManager.AddLog("現在の所持数：" + woodCount);

        Destroy(woodObject);

        // 2秒後にテキストを消す
        Invoke(nameof(ClearItemText), 2f);
    }

    void ClearItemText()
    {
        itemText = string.Empty;
    }
}`
          },
          {
            name: "TextManager.cs",
            desc: "取得テキストを一定時間後に自動で非表示にするコルーチン処理",
            code:
`using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class TextManager : MonoBehaviour
{
    [SerializeField] TMP_Text itemText;         // アイテム取得テキスト用
    [SerializeField] TMP_Text UDIText;          // 木材カウントテキスト用
    [SerializeField] Player playerController;   // Playerスクリプト参照用

    private string lastItemText = "";           // 以前のテキストを保持して変更を検知
    private Coroutine hideCoroutine;            // テキスト非表示用コルーチン

    void Start()
    {
        itemText.text = string.Empty;   // 初期状態は空文字
        itemText.color = Color.black;   // 黒色に設定
        itemText.fontSize = 40;         // フォントサイズを40に設定

        UDIText.text = "0";           // 初期状態は0
        UDIText.color = Color.white;  // 白色に設定
        UDIText.fontSize = 30;        // フォントサイズを30に設定

        // 初期状態を記録
        lastItemText = string.Empty;
    }

    void Update()
    {
        // itemTextの内容が変わったかどうかチェック
        if (playerController.itemText != lastItemText)
        {
            lastItemText = playerController.itemText;
            itemText.text = lastItemText;

            // 新しいテキストが空でなければ、3秒後に消すタイマーを開始
            if (!string.IsNullOrEmpty(lastItemText))
            {
                if (hideCoroutine != null)
                {
                    StopCoroutine(hideCoroutine);
                }
                hideCoroutine = StartCoroutine(HideTextAfterDelay(3.0f));
            }
        }

        UDIText.text = playerController.woodCount.ToString();     // プレイヤーのwoodCountを表示
    }

    // 指定秒数後にテキストを消すコルーチン
    IEnumerator HideTextAfterDelay(float delay)
    {
        yield return new WaitForSeconds(delay);
        itemText.text = string.Empty;
    }
}`
          },
          {
            name: "LogManager.cs",
            desc: "取得ログをUIに追加し、上限件数を超えたら古いログから削除する処理",
            code:
`using NUnit.Framework;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class LogManeger : MonoBehaviour
{
    [Header("UI")]
    public Transform content;
    public ScrollRect scrollRect;
    public GameObject logPrefab;

    [Header("設定")]
    public int maxLogCount = 10; // 最大ログ数

    private readonly List<GameObject> logs = new();

    public void AddLog(string message)
    {
        // 生成
        GameObject newLog = Instantiate(logPrefab, content);
        newLog.GetComponent<TMP_Text>().text = message;

        logs.Add(newLog);

        if (logs.Count > maxLogCount)
        {
            // 古いログを削除
            Destroy(logs[0]);
            logs.RemoveAt(0);
        }

        // ログが追加された後に最下部へスクロール
        Canvas.ForceUpdateCanvases(); // レイアウトを更新
        scrollRect.verticalNormalizedPosition = 0f; // 一番下にスクロール
    }

    void Start()
    {

    }

    void Update()
    {

    }
}`
          },
          {
            name: "TitleLoader.cs",
            desc: "Additive Scene Loadingでタイトル画面の裏にゲームシーンをプレビュー表示する処理",
            code:
`using System.Collections;
using UnityEngine;
using UnityEngine.SceneManagement;

public class TitleLoader : MonoBehaviour
{
    private void Start()
    {
        // プレビュー用に Additive で読み込む
        SceneManager.LoadSceneAsync("Game", LoadSceneMode.Additive);
    }

    public void UnloadPreview()
    {
        // "Game" シーンが読み込まれているか確認
        Scene gameScene = SceneManager.GetSceneByName("Game");

        // 読み込まれていればアンロード
        if (gameScene.isLoaded)
        {
            SceneManager.UnloadSceneAsync("Game");
        }
        else
        {
            Debug.Log("Game シーンは読み込まれていないためアンロードしません");
        }
    }

    private IEnumerator Atart()
    {
        // プレビュー用に Additive で読み込む
        yield return SceneManager.LoadSceneAsync("Game", LoadSceneMode.Additive);

        foreach (var cam in FindObjectsOfType<Camera>())
        {
            cam.enabled = false;
        }
    }
}`
          }
        ]
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
          "ランダムに出現するボタンを押して税率を上下させ、国民の怒りゲージがMaxになる前にハイスコアを目指すゲームです。",

        // 【追加】担当コードタブに表示するファイル一覧
        codeFiles: [
          {
            name: "ButtonRandom.cs",
            desc: "ボタンをランダムに選び、クリックされたら再生成する処理",
            code:
`using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;

public class ButtonRandom : MonoBehaviour
{
    // ボタンのプレハブを配列で登録
    public GameObject[] randombuttonPrefabs;
    public Transform buttonParent;

    public Vector2[] positions = new Vector2[]
    {
        new Vector2(-150, -100),
        new Vector2(-150, -250),
        new Vector2(150, -100),
        new Vector2(150, -250)
    };

    public List<GameObject> activeButtons = new List<GameObject>();

    void Start()
    {
        SpawnRandomButtons();
    }

    public void SpawnRandomButtons()
    {
        // ボタンの削除
        foreach (var btn in activeButtons)
        {
            Destroy(btn);
        }
        activeButtons.Clear();

        // ランダムで選ぶ
        var randomButtons = randombuttonPrefabs.OrderBy(x => Random.value).Take(4).ToList();

        for (int i = 0; i < randomButtons.Count; i++)
        {
            var button = Instantiate(randomButtons[i], buttonParent);
            button.GetComponent<RectTransform>().anchoredPosition = positions[i];
            button.GetComponent<UnityEngine.UI.Button>().onClick.AddListener(() => OnButtonClick(button));
            activeButtons.Add(button);
        }
    }

    void OnButtonClick(GameObject button)
    {
        // イベントが発生したときの処理
        // 新しいボタンを生成
        SpawnRandomButtons();
    }

    void Update()
    {

    }
}`
          }
        ]
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
          "食べていいものをクリックしてスコアを稼ぎ、ダメなものを3回食べると歯が欠けてゲームオーバーになるクリッカーゲームです。",

        // 【追加】担当コードタブに表示するファイル一覧
        codeFiles: [
          {
            name: "UI.cs",
            desc: "クリック入力に応じて噛む状態を切り替え、画像とSEを更新する処理",
            code:
`using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class UI : MonoBehaviour
{
    public enum Status
    {
        Open,
        Close
    }

    [SerializeField] private Image upperJaw;     // 上の画像
    [SerializeField] private Image lowerJaw;     // 下の画像

    [SerializeField] private Sprite[] openSprites;   // 開いている画像配列
    [SerializeField] private Sprite[] closeSprites;  // 閉じている画像配列

    [SerializeField] private Status status = Status.Open;   // 初期状態

    public AudioClip sound1;    // SE
    AudioSource audioSource;

    public void Move()
    {
        if (Input.GetMouseButtonDown(0) || Input.GetMouseButtonDown(1))
        {
            status = Status.Close;

            if (audioSource != null && sound1 != null)
            {
                audioSource.PlayOneShot(sound1);
            }
        }
    }

    // 上下の画像を同時に変更する
    private void SetSprite(Sprite sprite)
    {
        upperJaw.sprite = sprite;
        lowerJaw.sprite = sprite;
    }

    void Start()
    {
        // SE
        audioSource = GetComponent<AudioSource>();
    }

    void Update()
    {
        Move();

        // statusによって画像を切り替える
        switch (status)
        {
            case Status.Open:
                if (openSprites.Length > 0)
                {
                    SetSprite(openSprites[0]);
                }
                break;

            case Status.Close:
                if (closeSprites.Length > 0)
                {
                    SetSprite(closeSprites[0]);
                }
                break;
        }
    }
}`
          },
          {
            name: "ScoreMove.cs",
            desc: "SE再生とフェード演出を組み合わせてシーン遷移を行う処理",
            code:
`using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class ScoreMove: MonoBehaviour
{
    [SerializeField] private AudioSource audio1; // 効果音を鳴らすAudioSource
    [SerializeField] private AudioClip clip1;     // 再生する効果音クリップ
    [SerializeField] FadeObject fedeObject;
    [SerializeField] private string _loadSceneName;

    void Start()
    {

    }

    void Update()
    {
        if (Input.anyKeyDown)
        {
            TimeLag();
        }
    }

    public void TimeLag()
    {
        audio1.PlayOneShot(clip1);            // 効果音を再生
        Invoke("ChangeScene", 2);              // 2秒後にシーン遷移（フェードアニメーションの時間と合わせる）
        StartCoroutine(fedeObject.Fadeout());  // フェードアウトコルーチンを開始
    }

    public void ChangeScene()
    {
        SceneManager.LoadScene(_loadSceneName);
    }
}`
          }
        ]
      },

      // 【追加】Gravity
      "Gravity":
      {
        program:
          "全て",

        specs: [
          {
            l: "プラットフォーム",
            v: "Windows"
          },
          {
            l: "使用言語",
            v: "C# / Unity6"
          }
        ],

        reason:
          "重力を操作して障害物を乗り越え、ステージから脱出を目指す3Dアクションゲームです。",

        // 動画は作成中のため未設定
        codeFiles: []
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

    // 【追加】担当コードタブ関連の要素を取得
    const codeFileTabsEl = document.getElementById("codeFileTabs");
    const codeFileDescEl = document.getElementById("codeFileDesc");
    const codeFileContentEl = document.getElementById("codeFileContent");

    // 【追加】ファイル切り替えピルボタンを生成し、クリックで中身を切り替える関数
    function renderCodeFiles(codeFiles) {
      // ボタンを空にしてから作り直す
      codeFileTabsEl.innerHTML = "";

      if (!codeFiles || codeFiles.length === 0) {
        codeFileDescEl.innerText = "";
        codeFileContentEl.innerText = "";
        return;
      }

      codeFiles.forEach((file, index) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "code-file-tab-btn" + (index === 0 ? " active" : "");
        btn.innerText = file.name;

        // クリックでそのファイルの内容を表示し、選択状態を切り替える
        btn.addEventListener("click", () => {
          document.querySelectorAll(".code-file-tab-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          codeFileDescEl.innerText = file.desc;
          codeFileContentEl.innerText = file.code;

          // 【追加】切り替え時にコードを色付け
          hljs.highlightElement(codeFileContentEl);
        });

        codeFileTabsEl.appendChild(btn);
      });

      // 初期表示は1つ目のファイル
      codeFileDescEl.innerText = codeFiles[0].desc;
      codeFileContentEl.innerText = codeFiles[0].code;

      // 【追加】初期表示のコードを色付け
      hljs.highlightElement(codeFileContentEl);
    }

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

            // 【追加】担当コードタブの中身を生成
            renderCodeFiles(data.codeFiles);

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