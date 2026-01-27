import { useEffect, useState } from "react";
import { axiosApi } from "../api/axiosAPI";
import Loading from "./common/Loading"
import '../css/goods.css'
import { NavLink } from "react-router-dom";

const Goods = () => {

  const [goodsList, setGoodsList] = useState(null); // 상품 목록
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태

  // 상품 목록 얻어오는 함수
  const selectGoodsList = async () => {
    try {

      const resp = await axiosApi.get("/goods/selectGoodsList");

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

  return (
    <main className="main">
      <section id="goods-filter" className="filter">
        <div className="filter__top">
          <div className="toggle" role="tablist">
            <button className="toggle__btn is-active">뮤지컬</button>
            <button className="toggle__btn">전시</button>
          </div>
        </div>

        <div className="filter__row">
          <div className="chips">
            <button className="chip is-active">전체</button>
            <button className="chip">의류</button>
            <button className="chip">액세서리</button>
            <button className="chip">문구</button>
            <button className="chip">포스터/엽서</button>
            <button className="chip">음반/DVD</button>
          </div>

          <div className="search">
            <input type="text" className="search__input" placeholder="상품명 검색" />
            <button className="search__btn">
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
        <section id="goods-grid" className="grid">
          <div className="grid__head">
            <p className="grid__count">
              총 <span id="totalCount" className="grid__countStrong">{goodsList.length}</span>개의 상품
            </p>

            <div className="grid__sort">
              <div className="select-wrap select-wrap--ghost">
                <select className="select select--ghost" id="sortSelect" aria-label="정렬">
                  <option value="latest">최신순</option>
                  <option value="popular">인기순</option>
                  <option value="priceLow">낮은 가격순</option>
                  <option value="priceHigh">높은 가격순</option>
                </select>
                <i className="fa-solid fa-chevron-down select__icon" aria-hidden="true"></i>
              </div>
            </div>
          </div>

          <div className="grid__items" id="goodsItems">

            {goodsList.length === 0 ? (
              <p>상품 목록이 존재하지 않습니다.</p>
            ) : (
              goodsList.map((goods) => (
                <NavLink to={`/goods/${goods.goodsNo}`} key={goods.goodsNo} >
                  <article className="card">
                    <div className="card__img">
                      <img src={goods.goodsThumbnail} alt={goods.goodsName} />
                      <button className="wish" type="button" aria-label="찜">
                        <i className="fa-regular fa-heart"></i>
                      </button>
                    </div>
                    <h3 className="card__title">{goods.goodsName}</h3>
                    <p className="card__meta">{goods.goodsType}</p>
                    <p className="card__price">{goods.goodsPrice}</p>
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

export default Goods;