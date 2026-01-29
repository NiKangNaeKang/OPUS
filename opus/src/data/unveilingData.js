export const unveilingData = [
  {
    id: 1,
    title: "Untitled #47",
    artist: "김민준",
    image:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/47bea1f016-8b691c32c78631a5e0ba.png",
    alt: "abstract modern art painting with bold colors on white canvas in gallery",
    status: "LIVE", // LIVE | UPCOMING | ENDED

    pricing: {
      label: "현재가",
      amount: 3200000,
      currency: "KRW",
      display: "3,200,000원",
    },

    timing: {
      label: "마감",
      display: "2일 14시간",
      // endsAt: "2026-02-10T12:00:00+09:00", // 나중에 자동계산 시 사용
    },

    stats: {
      type: "BID", // BID | ALERT
      label: "입찰",
      count: 23,
      display: "입찰 23건",
    },

    actionText: "입찰하기",
  },

  {
    id: 2,
    title: "Silent Form",
    artist: "박서연",
    image:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/4136dde6a0-881f656a722a776b31e3.png",
    alt: "minimalist sculpture marble white contemporary art in studio",
    status: "LIVE",
    pricing: { label: "현재가", amount: 5800000, currency: "KRW", display: "5,800,000원" },
    timing: { label: "마감", display: "1일 8시간" },
    stats: { type: "BID", label: "입찰", count: 41, display: "입찰 41건" },
    actionText: "입찰하기",
  },

  {
    id: 3,
    title: "Metropolitan Nights",
    artist: "이지훈",
    image:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/37ffb51aae-5223b0925524f5225662.png",
    alt: "urban landscape painting cityscape modern art acrylic on canvas",
    status: "UPCOMING",
    pricing: { label: "시작가", amount: 2500000, currency: "KRW", display: "2,500,000원" },
    timing: { label: "시작", display: "3일 후" },
    stats: { type: "ALERT", label: "알림 신청", count: 156, display: "알림 신청 156명" },
    actionText: "알림받기",
  },

  {
    id: 4,
    title: "산수화 재해석",
    artist: "정수아",
    image:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/0d11f21d43-49fdc76c8058583365bc.png",
    alt: "traditional korean ink painting landscape mountain modern interpretation",
    status: "LIVE",
    pricing: { label: "현재가", amount: 4100000, currency: "KRW", display: "4,100,000원" },
    timing: { label: "마감", display: "5시간" },
    stats: { type: "BID", label: "입찰", count: 67, display: "입찰 67건" },
    actionText: "입찰하기",
  },

  {
    id: 5,
    title: "Moment in Time",
    artist: "최현우",
    image:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/185feb98da-24f923aefd81cc0f73fd.png",
    alt: "contemporary photography black and white portrait artistic fine art",
    status: "LIVE",
    pricing: { label: "현재가", amount: 1900000, currency: "KRW", display: "1,900,000원" },
    timing: { label: "마감", display: "4일 2시간" },
    stats: { type: "BID", label: "입찰", count: 15, display: "입찰 15건" },
    actionText: "입찰하기",
  },

  {
    id: 6,
    title: "Layers of Memory",
    artist: "강예진",
    image:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/5b82e823e9-3b4f78282149ebcea55f.png",
    alt: "mixed media collage contemporary art texture layers modern",
    status: "ENDED",
    pricing: { label: "낙찰가", amount: 7200000, currency: "KRW", display: "7,200,000원" },
    timing: { label: "종료", display: "2일 전" },
    stats: { type: "BID", label: "입찰", count: 89, display: "입찰 89건" },
    actionText: null,
  },

  {
    id: 7,
    title: "Geometric Dreams",
    artist: "윤태영",
    image:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/0a614de7f8-73b0251f63cab87a970f.png",
    alt: "geometric abstract art colorful shapes modern painting on canvas",
    status: "LIVE",
    pricing: { label: "현재가", amount: 2700000, currency: "KRW", display: "2,700,000원" },
    timing: { label: "마감", display: "3일 19시간" },
    stats: { type: "BID", label: "입찰", count: 32, display: "입찰 32건" },
    actionText: "입찰하기",
  },

  {
    id: 8,
    title: "Vessel Series #3",
    artist: "임하늘",
    image:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/32036aff0e-bea04333bd6eee69e1ec.png",
    alt: "ceramic sculpture contemporary art pottery modern design white",
    status: "UPCOMING",
    pricing: { label: "시작가", amount: 3800000, currency: "KRW", display: "3,800,000원" },
    timing: { label: "시작", display: "1일 후" },
    stats: { type: "ALERT", label: "알림 신청", count: 203, display: "알림 신청 203명" },
    actionText: "알림받기",
  },

  {
    id: 9,
    title: "Emotion in Motion",
    artist: "송민지",
    image:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/653400e34f-3fa8cfb14f4e5aa9d0a7.png",
    alt: "expressionist painting vibrant colors emotional modern art oil on canvas",
    status: "LIVE",
    pricing: { label: "현재가", amount: 6500000, currency: "KRW", display: "6,500,000원" },
    timing: { label: "마감", display: "1일 16시간" },
    stats: { type: "BID", label: "입찰", count: 54, display: "입찰 54건" },
    actionText: "입찰하기",
  },

  
];
