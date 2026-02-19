// ===== Dummy Data =====

const USERS = {
  contractor: {
    id: 'U001', name: '田中 太郎', email: 'tanaka@aircon-pro.co.jp',
    role: 'contractor', accountType: 'individual', company: 'エアコンプロ',
    plan: 'premium', subscriptionPlatform: 'iOS'
  },
  staff: {
    id: 'S001', name: '鈴木 花子', email: 'suzuki@chukai.co.jp',
    role: 'staff', accountType: 'corporate', company: '仲介株式会社',
    plan: 'staff', subscriptionPlatform: 'Web'
  }
};

const ORDER_STATUSES = [
  { key: 'new', label: '新規', css: 'status-new' },
  { key: 'checking', label: '確認中', css: 'status-checking' },
  { key: 'quoted', label: '見積提示', css: 'status-quoted' },
  { key: 'no_stock', label: '在庫なし', css: 'status-no-stock' },
  { key: 'wait_transfer', label: '振込待ち', css: 'status-wait-transfer' },
  { key: 'transferred', label: '振込完了', css: 'status-transferred' },
  { key: 'ordered', label: '発注済', css: 'status-ordered' },
  { key: 'shipped', label: '発送済', css: 'status-shipped' },
  { key: 'completed', label: '完了', css: 'status-completed' },
  { key: 'cancelled', label: 'キャンセル', css: 'status-cancelled' },
];

const ORDERS = [
  {
    id: 'ORD-2024-001',
    requester: USERS.contractor,
    airconModel: 'RAS-X40N2',
    partName: 'コンプレッサー',
    makerName: '日立',
    quantity: 1,
    notes: '急ぎでお願いします。現場が止まっています。',
    status: 'quoted',
    quotePrice: 45000,
    stockStatus: 'available',
    bankInfo: {
      bank: 'みずほ銀行', branch: '新宿支店', type: '普通',
      number: '1234567', holder: '仲介（株）'
    },
    replyComment: '在庫確認取れました。金額をご確認の上、お振込ください。',
    transferReportedAt: null,
    createdAt: '2024-12-15 09:30',
    timeline: [
      { time: '2024-12-15 09:30', actor: '田中 太郎', action: '発注依頼を作成', icon: '📝' },
      { time: '2024-12-15 10:15', actor: '鈴木 花子', action: 'ステータスを「確認中」に変更', icon: '🔍' },
      { time: '2024-12-15 14:00', actor: '鈴木 花子', action: '見積を提示（¥45,000）', icon: '💰' },
    ]
  },
  {
    id: 'ORD-2024-002',
    requester: USERS.contractor,
    airconModel: 'MSZ-ZW5620S',
    partName: '基板（室外機）',
    makerName: '三菱電機',
    quantity: 1,
    notes: '',
    status: 'shipped',
    quotePrice: 32000,
    stockStatus: 'available',
    bankInfo: {
      bank: 'みずほ銀行', branch: '新宿支店', type: '普通',
      number: '1234567', holder: '仲介（株）'
    },
    replyComment: '在庫あり。翌営業日に発送可能です。',
    transferReportedAt: '2024-12-10 16:00',
    createdAt: '2024-12-08 11:00',
    timeline: [
      { time: '2024-12-08 11:00', actor: '田中 太郎', action: '発注依頼を作成', icon: '📝' },
      { time: '2024-12-08 13:00', actor: '鈴木 花子', action: 'ステータスを「確認中」に変更', icon: '🔍' },
      { time: '2024-12-09 10:00', actor: '鈴木 花子', action: '見積を提示（¥32,000）', icon: '💰' },
      { time: '2024-12-10 16:00', actor: '田中 太郎', action: '振込完了を報告', icon: '✅' },
      { time: '2024-12-11 09:00', actor: '鈴木 花子', action: 'メーカーへ発注完了', icon: '📦' },
      { time: '2024-12-12 15:00', actor: '鈴木 花子', action: '発送完了（追跡番号: 1234-5678-9012）', icon: '🚚' },
    ]
  },
  {
    id: 'ORD-2024-003',
    requester: USERS.contractor,
    airconModel: 'AN56YRBKP',
    partName: 'リモコン',
    makerName: 'ダイキン',
    quantity: 2,
    notes: 'ARC478A71と互換性のあるもの',
    status: 'new',
    quotePrice: null,
    stockStatus: null,
    bankInfo: null,
    replyComment: null,
    transferReportedAt: null,
    createdAt: '2024-12-16 08:00',
    timeline: [
      { time: '2024-12-16 08:00', actor: '田中 太郎', action: '発注依頼を作成', icon: '📝' },
    ]
  },
  {
    id: 'ORD-2024-004',
    requester: USERS.contractor,
    airconModel: 'CS-X563D2',
    partName: 'ファンモーター',
    makerName: 'パナソニック',
    quantity: 1,
    notes: '',
    status: 'no_stock',
    quotePrice: null,
    stockStatus: 'unavailable',
    bankInfo: null,
    replyComment: 'メーカーに確認しましたが、生産終了品のため在庫がございません。申し訳ございません。',
    transferReportedAt: null,
    createdAt: '2024-12-05 14:00',
    timeline: [
      { time: '2024-12-05 14:00', actor: '田中 太郎', action: '発注依頼を作成', icon: '📝' },
      { time: '2024-12-05 16:00', actor: '鈴木 花子', action: 'ステータスを「確認中」に変更', icon: '🔍' },
      { time: '2024-12-06 11:00', actor: '鈴木 花子', action: '在庫なしのため終了', icon: '❌' },
    ]
  },
  {
    id: 'ORD-2024-005',
    requester: USERS.contractor,
    airconModel: 'S40ZTAXP',
    partName: '膨張弁',
    makerName: 'ダイキン',
    quantity: 1,
    notes: '',
    status: 'wait_transfer',
    quotePrice: 18500,
    stockStatus: 'available',
    bankInfo: {
      bank: 'みずほ銀行', branch: '新宿支店', type: '普通',
      number: '1234567', holder: '仲介（株）'
    },
    replyComment: '在庫あります。お振込確認後、発注いたします。',
    transferReportedAt: null,
    createdAt: '2024-12-14 10:00',
    timeline: [
      { time: '2024-12-14 10:00', actor: '田中 太郎', action: '発注依頼を作成', icon: '📝' },
      { time: '2024-12-14 11:30', actor: '鈴木 花子', action: 'ステータスを「確認中」に変更', icon: '🔍' },
      { time: '2024-12-14 16:00', actor: '鈴木 花子', action: '見積を提示（¥18,500）', icon: '💰' },
    ]
  },
  {
    id: 'ORD-2024-006',
    requester: USERS.contractor,
    airconModel: 'RAS-E255R',
    partName: '四方弁',
    makerName: '東芝',
    quantity: 1,
    notes: '',
    status: 'transferred',
    quotePrice: 27000,
    stockStatus: 'available',
    bankInfo: {
      bank: 'みずほ銀行', branch: '新宿支店', type: '普通',
      number: '1234567', holder: '仲介（株）'
    },
    replyComment: '在庫ありです。',
    transferReportedAt: '2024-12-16 09:00',
    createdAt: '2024-12-13 09:00',
    timeline: [
      { time: '2024-12-13 09:00', actor: '田中 太郎', action: '発注依頼を作成', icon: '📝' },
      { time: '2024-12-13 11:00', actor: '鈴木 花子', action: '見積を提示（¥27,000）', icon: '💰' },
      { time: '2024-12-16 09:00', actor: '田中 太郎', action: '振込完了を報告', icon: '✅' },
    ]
  }
];

const OFFLINE_ARTICLES = [
  { id: 1, title: 'ダイキン リモコン試運転手順', category: 'ダイキン', updatedAt: '2024-11-20', isDownloaded: true,
    body: 'リモコンの「試運転」ボタンを長押しし、モード選択画面が表示されたら「冷房試運転」を選択します。\n\n1. 室内機のコンセントを入れる\n2. リモコンで試運転モードに設定\n3. 運転ランプが点灯することを確認\n4. 約15分運転し、冷風が出ることを確認\n5. 室外機の運転音に異常がないか確認' },
  { id: 2, title: '三菱電機 リモコン試運転手順', category: '三菱電機', updatedAt: '2024-11-18', isDownloaded: true,
    body: '三菱電機の試運転モードは、リモコンの「点検」ボタンから入ります。\n\n1. ブレーカーをONにして2分以上待つ\n2. リモコンの「点検」→「試運転」を選択\n3. 冷房モードで運転開始\n4. 吹出口温度を確認（室温-8℃以上の温度差）\n5. ドレン水が正常に排出されていることを確認' },
  { id: 3, title: 'パナソニック リモコン試運転手順', category: 'パナソニック', updatedAt: '2024-11-15', isDownloaded: false,
    body: 'パナソニック製品の試運転は以下の手順で行います。' },
  { id: 4, title: '日立 リモコン試運転手順', category: '日立', updatedAt: '2024-11-10', isDownloaded: false,
    body: '日立製品の試運転は以下の手順で行います。' },
  { id: 5, title: '東芝 リモコン試運転手順', category: '東芝', updatedAt: '2024-10-28', isDownloaded: false,
    body: '東芝製品の試運転は以下の手順で行います。' },
  { id: 6, title: '富士通ゼネラル リモコン試運転手順', category: '富士通ゼネラル', updatedAt: '2024-10-20', isDownloaded: false,
    body: '富士通ゼネラル製品の試運転は以下の手順で行います。' },
];

const ERROR_CODES = [
  { id: 1, maker: 'ダイキン', code: 'A3', description: 'ドレン水位異常', cause: 'ドレンホースの詰まり、ドレンポンプの故障', solution: 'ドレンホースの清掃、ポンプ点検・交換' },
  { id: 2, maker: 'ダイキン', code: 'E7', description: '室外ファンモーター異常', cause: 'ファンモーターのロック、基板故障', solution: 'ファンモーター交換、基板交換' },
  { id: 3, maker: 'ダイキン', code: 'F3', description: '吐出管温度異常', cause: '冷媒不足、圧縮機不良', solution: '冷媒漏れ点検・補充、圧縮機点検' },
  { id: 4, maker: 'ダイキン', code: 'L5', description: 'コンプレッサー過電流', cause: '電源電圧不良、圧縮機不良', solution: '電源確認、圧縮機交換' },
  { id: 5, maker: '三菱電機', code: 'E6', description: '室内外通信異常', cause: '配線接続不良、基板故障', solution: '配線確認、基板交換' },
  { id: 6, maker: '三菱電機', code: 'P8', description: '配管温度異常', cause: '冷媒不足、センサー故障', solution: '冷媒補充、センサー交換' },
  { id: 7, maker: 'パナソニック', code: 'H11', description: '室内外通信異常', cause: '信号線接続不良', solution: '配線確認、コネクタ再接続' },
  { id: 8, maker: 'パナソニック', code: 'F91', description: '冷媒系統異常', cause: '冷媒漏れ', solution: '漏れ箇所修理、冷媒補充' },
  { id: 9, maker: '日立', code: '02', description: '室外通信異常', cause: '信号線断線、基板不良', solution: '配線修理、基板交換' },
  { id: 10, maker: '東芝', code: 'E01', description: '室内温度センサー異常', cause: 'センサー断線、ショート', solution: 'センサー交換' },
];

const MAKERS = ['ダイキン', '三菱電機', 'パナソニック', '日立', '東芝', '富士通ゼネラル', 'シャープ', 'コロナ'];

const MANUFACTURER_LINKS = [
  { maker: 'ダイキン', url: 'https://www.daikin.co.jp/', notes: 'サービスナビで図面検索可能' },
  { maker: '三菱電機', url: 'https://www.mitsubishielectric.co.jp/', notes: 'WIN2K で図面ダウンロード' },
  { maker: 'パナソニック', url: 'https://panasonic.jp/', notes: 'エアコン商品情報ページ' },
  { maker: '日立', url: 'https://www.hitachi.co.jp/', notes: '白くまくんサポートサイト' },
  { maker: '東芝', url: 'https://www.toshiba.co.jp/', notes: '東芝キヤリア技術情報' },
  { maker: '富士通ゼネラル', url: 'https://www.fujitsu-general.com/', notes: '技術資料ダウンロード' },
  { maker: 'シャープ', url: 'https://jp.sharp/', notes: 'ビジネスサポートページ' },
  { maker: 'コロナ', url: 'https://www.corona.co.jp/', notes: 'サービスパーツ検索' },
];

const VIDEOS = [
  { id: 1, title: 'エアコン冷媒配管の施工方法【基礎編】', category: '施工技術', duration: '18:30', requiresSub: true, thumbnail: '' },
  { id: 2, title: 'フレア加工のコツと注意点', category: '施工技術', duration: '12:45', requiresSub: true, thumbnail: '' },
  { id: 3, title: 'マルチエアコン設置の完全ガイド', category: '施工技術', duration: '25:10', requiresSub: true, thumbnail: '' },
  { id: 4, title: '真空引きの正しい手順', category: '施工技術', duration: '15:20', requiresSub: true, thumbnail: '' },
  { id: 5, title: 'ルームエアコン取付工事【実演】', category: '施工実演', duration: '22:00', requiresSub: true, thumbnail: '' },
  { id: 6, title: 'エラーコードの読み方【ダイキン編】', category: 'トラブルシューティング', duration: '16:40', requiresSub: true, thumbnail: '' },
  { id: 7, title: 'ガス漏れ検知と修理方法', category: 'トラブルシューティング', duration: '19:55', requiresSub: true, thumbnail: '' },
  { id: 8, title: '電気工事士が教える配線チェック', category: '電気工事', duration: '14:30', requiresSub: true, thumbnail: '' },
];

const VIDEO_CATEGORIES = ['すべて', '施工技術', '施工実演', 'トラブルシューティング', '電気工事'];

const NOTIFICATIONS = [
  { id: 1, title: '見積が届きました', desc: 'ORD-2024-001 コンプレッサー（日立）の見積が¥45,000で提示されました', time: '2時間前', unread: true, link: 'order-detail', orderId: 'ORD-2024-001' },
  { id: 2, title: '発送されました', desc: 'ORD-2024-002 基板（三菱電機）が発送されました。追跡番号: 1234-5678-9012', time: '1日前', unread: false, link: 'order-detail', orderId: 'ORD-2024-002' },
  { id: 3, title: '在庫なし', desc: 'ORD-2024-004 ファンモーター（パナソニック）は在庫なしとなりました', time: '3日前', unread: false, link: 'order-detail', orderId: 'ORD-2024-004' },
  { id: 4, title: '新着動画', desc: '「エラーコードの読み方【ダイキン編】」が追加されました', time: '5日前', unread: false, link: 'video' },
];

const STAFF_NOTIFICATIONS = [
  { id: 1, title: '新規発注依頼', desc: '田中太郎さんから新規依頼（ORD-2024-003 リモコン ダイキン）', time: '30分前', unread: true },
  { id: 2, title: '振込完了報告', desc: '田中太郎さんがORD-2024-006の振込完了を報告しました', time: '3時間前', unread: true },
  { id: 3, title: '振込完了報告', desc: '田中太郎さんがORD-2024-002の振込完了を報告しました', time: '2日前', unread: false },
];
