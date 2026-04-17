import type { Customer, ReviewInvite, ReviewRecord, Store } from "./types";

export const demoStore: Store = {
  id: "store_01",
  name: "小春日和 Cafe",
  industry: "早午餐 / 咖啡廳",
  brandVoice:
    "溫暖、親切、像是老朋友閒聊的口吻，偶爾加入一點日式元素（比如「謝謝您今天來玩」）。避免太官方或罐頭感。",
  googlePlaceId: "ChIJXXXXXXXXXXXXXX",
  linkReview: "https://g.page/r/xxxxxxx/review",
};

export const demoCustomers: Customer[] = [
  {
    id: "c_001",
    name: "林小姐",
    phone: "0912-345-678",
    lineId: "lin_xiaojie",
    lastVisitAt: "2026-04-16",
    totalSpend: 3480,
    visits: 7,
    tags: ["常客", "愛鬆餅", "週末造訪"],
    notes: "喜歡點肉桂捲＋拿鐵，通常 10:30 左右來。生日 6/12。",
  },
  {
    id: "c_002",
    name: "Alex Chen",
    phone: "0922-111-222",
    email: "alex.chen@example.com",
    lastVisitAt: "2026-04-17",
    totalSpend: 780,
    visits: 1,
    tags: ["新客", "單人"],
    notes: "第一次來，點酪梨蛋吐司。用電腦工作約 2 小時。",
  },
  {
    id: "c_003",
    name: "王太太一家",
    phone: "0933-555-888",
    lineId: "wang_family",
    lastVisitAt: "2026-04-15",
    totalSpend: 2150,
    visits: 3,
    tags: ["家庭", "小孩", "週末"],
    notes: "兩大兩小，小孩對花生過敏。曾誇讚兒童椅很乾淨。",
  },
  {
    id: "c_004",
    name: "黃先生",
    phone: "0988-777-333",
    lastVisitAt: "2026-04-10",
    totalSpend: 9200,
    visits: 18,
    tags: ["VIP", "商務", "每週來"],
    notes: "每週二、四固定獨自用餐，會議客人。常點拿鐵續杯。",
  },
  {
    id: "c_005",
    name: "Sarah Liu",
    email: "sarah@startup.io",
    lastVisitAt: "2026-04-14",
    totalSpend: 1420,
    visits: 2,
    tags: ["外國人", "下午茶"],
    notes: "和朋友拍照打卡。讚美抹茶蛋糕的擺盤。",
  },
];

export const demoInvites: ReviewInvite[] = [
  {
    id: "i_001",
    customerId: "c_001",
    customerName: "林小姐",
    channel: "line",
    status: "reviewed",
    message:
      "林小姐～謝謝您今天又來找我們玩！聽說您一如往常帶走了肉桂捲搭拿鐵，店長覺得超幸福 ☺ 如果今天的餐點合您的胃口，方便花 30 秒幫我們在 Google 留個心得嗎？您的鼓勵會讓夥伴們開心整週～",
    platform: "google",
    createdAt: "2026-04-16T11:20:00+08:00",
    sentAt: "2026-04-16T11:20:10+08:00",
    reviewedAt: "2026-04-16T18:44:00+08:00",
    rating: 5,
  },
  {
    id: "i_002",
    customerId: "c_002",
    customerName: "Alex Chen",
    channel: "sms",
    status: "opened",
    message:
      "Hi Alex，我是小春日和的店長。第一次造訪就選了我們家人氣的酪梨蛋吐司，希望您吃得開心！方便聊聊您今天的體驗嗎？Google 留言：https://g.page/r/xxx",
    platform: "google",
    createdAt: "2026-04-17T14:02:00+08:00",
    sentAt: "2026-04-17T14:02:15+08:00",
  },
  {
    id: "i_003",
    customerId: "c_003",
    customerName: "王太太一家",
    channel: "line",
    status: "sent",
    message:
      "王太太您好～今天一家四口來玩得開心嗎？店長有特別交代夥伴留意小朋友花生過敏的狀況 🥜 如果我們做得還可以，想邀請您留個 Google 心得給其他帶小孩的爸媽看～",
    platform: "google",
    createdAt: "2026-04-15T20:10:00+08:00",
    sentAt: "2026-04-15T20:10:05+08:00",
  },
  {
    id: "i_004",
    customerId: "c_004",
    customerName: "黃先生",
    channel: "email",
    status: "reviewed",
    message:
      "黃先生，您好：每週二、四能在店裡看到您，已成為團隊的小小儀式感 😊 若您不介意，可以在 Google 幫我們留下幾句話嗎？對其他商務客來說會是很重要的參考。",
    platform: "google",
    createdAt: "2026-04-10T19:50:00+08:00",
    sentAt: "2026-04-10T19:50:20+08:00",
    reviewedAt: "2026-04-11T09:12:00+08:00",
    rating: 5,
  },
  {
    id: "i_005",
    customerId: "c_005",
    customerName: "Sarah Liu",
    channel: "email",
    status: "declined",
    message:
      "Hi Sarah, we noticed you loved the matcha cake presentation — would you mind sharing a quick Google review? It means the world to a small cafe like us.",
    platform: "google",
    createdAt: "2026-04-14T17:30:00+08:00",
    sentAt: "2026-04-14T17:30:10+08:00",
  },
];

export const demoReviews: ReviewRecord[] = [
  {
    id: "r_001",
    platform: "google",
    author: "林小姐",
    rating: 5,
    content:
      "每週必訪！肉桂捲剛出爐時的香氣根本違規 😂 拿鐵也一直穩定，夥伴永遠記得我喜歡的溫度。",
    createdAt: "2026-04-16T18:44:00+08:00",
    repliedAt: "2026-04-16T19:02:00+08:00",
    aiReply:
      "林小姐～看到這則評論店長鼻子都酸了 🥹 肉桂捲那一爐永遠為您留一個！下次見～",
    source: "invited",
  },
  {
    id: "r_002",
    platform: "google",
    author: "黃先生",
    rating: 5,
    content:
      "作為幾乎天天跑咖啡廳談事情的人，這裡的 Wi-Fi 穩、插座多、服務恰到好處不打擾，是我最常帶客戶的地點之一。",
    createdAt: "2026-04-11T09:12:00+08:00",
    repliedAt: "2026-04-11T09:30:00+08:00",
    aiReply:
      "黃先生，謝謝您信任我們作為會議的延伸！我們會繼續把這裡維持得適合深度工作 🙏",
    source: "invited",
  },
  {
    id: "r_003",
    platform: "google",
    author: "路過食客",
    rating: 3,
    content: "餐點好吃，但假日等太久，希望可以線上候位。",
    createdAt: "2026-04-13T14:20:00+08:00",
    source: "organic",
  },
];
