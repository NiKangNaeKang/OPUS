// JS Date의 형식을 YYYYMMDD로 만들기(stdate, eddate에 적용)
export function formatYYYYMMDD(d) {
  const yyyy = String(d.getFullYear());
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  
  return `${yyyy}${mm}${dd}`;
}

// XML을 JS 배열 형태로 변환하기
export function parseKopisXML(xmlText) {
  const doc = new DOMParser().parseFromString(xmlText, "text/xml");
  const dbNodes = Array.from(doc.getElementsByTagName("db"));

  const items = dbNodes.map((db) => {
    const get = (tag) => db.getElementsByTagName(tag)?.[0]?.textContent?.trim() ?? "";

    return {
      mt20id : get("mt20id"),
      poster : get("poster"),
      prfnm : get("prfnm"),
      prfstate : get("prfstate"),
      prfpdfrom : get("prfpdfrom"),
      prfpdto : get("prfpdto"),
      fcltynm : get("fcltynm"),
      prfruntime : get("prfruntime"),
      prfage : get("prfage"),
      prfcast : get("prfcast"),
    };
  });

  return items;
}

// 전체 뮤지컬 공연 조회
export async function getAllMusicals({serviceKey, startDate, endDate, page = 1, rows = 100, search=""}) {
  if(!serviceKey) throw new Error("발급받은 서비스 키가 없습니다.");
  
  const params = new URLSearchParams({
    service : serviceKey,
    stdate : startDate,
    eddate : endDate,
    cpage : page,
    rows,
    shcate : 'GGGA',
    signgucode : 11,
    kidstate : 'N'
  })
  
  if(search.trim()) {
    params.set("shprfnm", search.trim())
  }
  
  const res = await fetch(`/kopis/openApi/restful/pblprfr?${params.toString()}`);
  
  if(!res.ok) {
    throw new Error(`KOPIS 요청 실패 : ${res.status}`);
  }
  
  const xmlText = await res.text();
  const items = parseKopisXML(xmlText);
  
  return { items, page }
}

// 상세 정보 이미지 리스트 형태로
function parseStyurls(db) {
  return Array.from(db.getElementsByTagName("styurl")).map(
    (node) => node.textContent.trim()
  )
}

// 예매처 정보(예매처명, URL) 리스트 형태로
function parseRelates(db) {
  return Array.from(db.getElementsByTagName("relate")).map((relate) => ({
    name : relate.getElementsByTagName("relatenm")?.[0]?.textContent?.trim() ?? "",
    url : relate.getElementsByTagName("relateurl")?.[0]?.textContent?.trim() ?? "",
  }))
}

// 상세 뮤지컬 공연 조회
export async function getMusicalDetail(serviceKey, mt20id) {
  if(!serviceKey) throw new Error("발급받은 서비스 키가 없습니다.");

  const res = await fetch(`/kopis/openApi/restful/pblprfr/${mt20id}?service=${serviceKey}`)

  if(!res.ok) {
    throw new Error(`KOPIS 요청 실패 : ${res.status}`);
  }

  const xmlText = await res.text();

  const doc = new DOMParser().parseFromString(xmlText, "text/xml");
  const db = doc.getElementsByTagName("db")[0];
  
  if(!db) return null;

  return {
    ...parseKopisXML(xmlText)[0],
    styurls : parseStyurls(db),
    relates : parseRelates(db),
  }
}