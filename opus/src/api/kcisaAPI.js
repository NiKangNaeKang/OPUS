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

  const res = await fetch(`/kcisa/openapi/CNV_060/request?${params.toString()}`);

  if(!res.ok) {
    throw new Error("전시 정보 요청 실패");
  }

  const text = await res.text();

  // XML 파싱하기
  const xmlParser = new DOMParser();
  const xml = xmlParser.parseFromString(text, "text/xml");

  const items = [...xml.getElementsByTagName("item")].map(item => ({
    title : item.getElementsByTagName("title")[0]?.textContent,
    period : item.getElementsByTagName("period")[0]?.textContent,
    eventPeriod : item.getElementsByTagName("eventPeriod")[0]?.textContent,
    eventSite : item.getElementsByTagName("eventSite")[0]?.textContent,
    url : item.getElementsByTagName("url")[0]?.textContent,
    imageObject : item.getElementsByTagName("imageObject")[0]?.textContent,
    description : item.getElementsByTagName("description")[0]?.textContent,
  }))
  
  return items;
} 