import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosApi from "../../api/axiosAPI";
import { toast } from "react-toastify";
import { showConfirm } from "../../components/toast/ToastUtils";
import "../../css/myPosts.css";

export default function MyPosts() {

  console.log("baseURL:", axiosApi.defaults.baseURL); ////////////////////////////////

  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        setLoading(true);
        const res = await axiosApi.get("/api/board/my");
        setList(res.data || []);
      } catch (err) {
        toast.error(err?.response?.data?.message || "작성 게시글 조회 실패");
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, []);

  const goDetail = (boardNo) => navigate(`/proposals/detail/${boardNo}`);
  const goEdit = (boardNo) => navigate(`/proposals/edit/${boardNo}`);

  const handleDelete = (e, boardNo) => {
    e.stopPropagation();

    showConfirm(
      "삭제하시겠습니까?",
      "삭제한 글은 복구가 불가능합니다.",
      async () => {
        try {
          await axiosApi.delete(`/api/board/delete/${boardNo}`);
          toast.success("삭제되었습니다.");
          setList((prev) => prev.filter((it) => it.boardNo !== boardNo));
        } catch (err) {
          toast.error(err?.response?.data || "삭제 실패");
        }
      },
      "삭제"
    );
  };

  return (
    <main className="proposals-page my-posts-page">
      <header className="proposals-header">
        <h2>등록한 컨텐츠</h2>
        <p>내가 작성한 게시글을 확인/수정/삭제할 수 있습니다.</p>
      </header>

      {loading ? (
        <div className="proposals-empty">로딩중...</div>
      ) : list.length === 0 ? (
        <div className="proposals-empty">작성한 글이 없습니다.</div>
      ) : (
        <div className="proposals-grid">
          {list.map((item) => (
            <div
              key={item.boardNo}
              className="proposal-card"
              onClick={() => goDetail(item.boardNo)}
              role="button"
            >
              <div className="proposal-card__top">
                <div className="proposal-card__title">{item.boardTitle}</div>
                <div className="proposal-card__meta">
                  <span>{item.boardWriteDate?.substring(0, 10)}</span>
                  <span>{item.boardCategory}</span>
                </div>
              </div>

              <div className="proposal-card__content">
                {(item.boardContent || "").slice(0, 80)}
                {(item.boardContent || "").length > 80 ? "..." : ""}
              </div>

              <div className="proposal-card__actions">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    goEdit(item.boardNo);
                  }}
                >
                  수정
                </button>

                <button
                  type="button"
                  className="btn"
                  onClick={(e) => handleDelete(e, item.boardNo)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}