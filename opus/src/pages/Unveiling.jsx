import { useMemo, useState } from "react";
import { unveilingData } from "../data/unveilingData";
import AuctionGrid from "../components/Unveiling/AuctionGrid";
import AuctionInfo from "../components/Unveiling/AuctionInfo";

const TABS = [
  { key: "ALL", label: "전체" },
  { key: "LIVE", label: "진행중" },
  { key: "UPCOMING", label: "예정" },
  { key: "ENDED", label: "종료" },
];

export default function Unveiling() {
  const [activeTab, setActiveTab] = useState("ALL");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return unveilingData.filter((item) => {
      const matchesTab = activeTab === "ALL" ? true : item.status === activeTab;
      const matchesQuery = q
        ? `${item.title} ${item.artist}`.toLowerCase().includes(q)
        : true;
      return matchesTab && matchesQuery;
    });
  }, [activeTab, query]);

  return (
    <div className="page">
      <main className="main">

        {/* FILTERS */}
        <section id="auction-filters" className="filters">
          <div className="filters__row">
            <div className="filters__tabs" role="tablist" aria-label="경매 상태 필터">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  className={`tab ${activeTab === t.key ? "is-active" : ""}`}
                  type="button"
                  onClick={() => setActiveTab(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="filters__meta">
              <span className="count">
                총 <strong>{filtered.length}</strong>점
              </span>
            </div>
          </div>
        </section>

        {/* GRID */}
        <section id="auction-grid" className="grid-wrap">
          <div className="grid">
            <AuctionGrid items={filtered} />
          </div>
        </section>

        {/* INFO */}
        <AuctionInfo />
      </main>
    </div>
  );
}
