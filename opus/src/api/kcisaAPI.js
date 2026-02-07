// 전시 조회
export async function getAllExhibitions({ serviceKey, search }) {
  if(!serviceKey) {
    throw new Error("발급받은 서비스 키가 없습니다.");
  }

  const params = new URLSearchParams({
    serviceKey : serviceKey,
    numOfRows : 20,
    pageNo : 1,
    dtype : "전시",
    title : search.trim() || "",
  });

  const res = await fetch(`https://api.kcisa.kr/openapi/CNV_060/request?${params.toString()}`);

  if(!res.ok) {
    throw new Error("전시 정보 요청 실패");
  }

  const data = await res.json();
  return data;
} 