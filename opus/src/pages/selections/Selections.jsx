import { useEffect, useMemo, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import Loading from "../../components/common/Loading"
import "../../css/Selections.css";
import { NavLink } from "react-router-dom";

const Selections = () => {

  const [goodsList, setGoodsList] = useState(null); // 상품 목록
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [genre, setGenre] = useState("exhibition"); // 장르 상태
  const [category, setCategory] = useState("all"); // 카테고리 상태
  const [query, setQuery] = useState("");

  // 상품 목록 얻어오는 함수
  const selectGoodsList = async () => {
    try {

      const resp = await axiosApi.get("/selections/selectGoodsList");

      if (resp.status == 200) {
        setGoodsList(resp.data);
      }

    } catch (error) {
      console.error("상품 목록 조회 중 오류 발생 : ", error)
    }
  }

  // 처음 페이지 로딩 시 상품 목록 얻어오기
  useEffect(() => {
    selectGoodsList();
  }, [])

  // 상품 목록 얻어오면 로딩 상태 변경
  useEffect(() => {

    if (goodsList != null) {
      setIsLoading(false);
    }


  }, [goodsList])

  const handleGenre = (genre) => setGenre(genre);
  const handleCategory = (category) => setCategory(category);
  const handleQuery = (query) => {
    const refinedQuery = query.trim().toLowerCase();
    setQuery(refinedQuery);
  };

  const filteredList = useMemo(() => {
    if (!goodsList) return [];

    return goodsList.filter((item) => {
      const matchesGenre = genre === item.goodsSort;
      const matchesCategory =
        category === "all" ? true : item.goodsCategory === category;
      const matchesQuery = query
        ? item.goodsName.toLowerCase().includes(query)
        : true;

      return matchesGenre && matchesCategory && matchesQuery;
    });
  }, [goodsList, genre, category, query]);

  return (
    <main className="main">
      <section id="goods-filter" className="filter">
        <div className="filter__top">
          <div className="toggle" role="tablist">
            <button className={`toggle__btn ${genre === "exhibition" ? "is-active" : ""}`}
              onClick={() => handleGenre("exhibition")}>전시</button>
            <button className={`toggle__btn ${genre === "musical" ? "is-active" : ""}`}
              onClick={() => handleGenre("musical")}>뮤지컬</button>
          </div>
        </div>

        <div className="filter__row">
          <div className="goods_chips">
            <button className={`goods_chip ${category === "all" ? "is-active" : ""}`}
              onClick={() => handleCategory("all")}>전체</button>
            <button className={`goods_chip ${category === "clothes" ? "is-active" : ""}`}
              onClick={() => handleCategory("clothes")}>의류</button>
            <button className={`goods_chip ${category === "accessories" ? "is-active" : ""}`}
              onClick={() => handleCategory("accessories")}>액세서리</button>
            <button className={`goods_chip ${category === "poster" ? "is-active" : ""}`}
              onClick={() => handleCategory("poster")}>포스터/엽서</button>
            { genre === "musical" && 
            <button className={`goods_chip ${category === "record" ? "is-active" : ""}`}
              onClick={() => handleCategory("record")}>음반/DVD</button>}
            <button className={`goods_chip ${category === "etc" ? "is-active" : ""}`}
              onClick={() => handleCategory("etc")}>잡화</button>
          </div>

          <div className="search">
            <input type="text" className="search_input" placeholder="상품명 검색" value={query}
              onChange={(e) => setQuery(e.target.value)} />
            <button className="search_btn" onClick={() => handleQuery(query)}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="loading-box">
          <Loading />
          <p className="loading_msg">상품 목록을 로딩 중입니다.</p>
        </div>
      ) : (
        <section id="goods-grid" className="goods_grid">
          <div className="grid_head">
            <p className="grid_count">
              총 <span id="totalCount" className="grid_countStrong">{filteredList.length}</span>개의 상품
            </p>
          </div>

          <div className="grid_items" id="goodsItems">

            {filteredList.length === 0 ? (
              <h3>상품 목록이 존재하지 않습니다.</h3>
            ) : (
              filteredList.map((goods) => (
                <NavLink className="card-link" to={`/selections/${goods.goodsNo}`} key={goods.goodsNo} >
                  <article className="goods_card">
                    <div className="card_img">
                      <img src={`${import.meta.env.VITE_API_URL}${goods.goodsThumbnail}`} alt={goods.goodsName} />
                    </div>
                    <h3 className="card_title">{goods.goodsName}</h3>
                    <p className="card_price">
                       {Number(goods.goodsPrice).toLocaleString()}원
                      </p>
                  </article>
                </NavLink>
              ))
            )
            }
          </div>
        </section>
      )}

    </main>
  )

}

export default Selections;