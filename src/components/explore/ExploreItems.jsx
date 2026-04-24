import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CountdownPill from "../UI/CountdownPill";

const ExploreItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("likes_high_to_low");
  const [visibleCount, setVisibleCount] = useState(8);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const fetchExploreItems = async () => {
      try {
        const response = await fetch(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore",
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Explore API response:", data);
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch Explore items:", err);
        setError("Failed to load Explore items");
      } finally {
        setLoading(false);
      }
    };

    fetchExploreItems();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getTitle = (item) => item.title || item.name || "Untitled Item";

  const getAuthorId = (item) =>
    item?.authorId || item?.authorID || item?.author || "";

  const getAuthorImage = (item) =>
    item?.authorImage || item?.profileImage || item?.image || "";

  const getAuthorName = (item) =>
    item?.authorName || item?.author || item?.creatorName || "Unknown Creator";

  const getPreviewImage = (item) =>
    item.nftImage || item.image || item.previewImage || "";

  const getPriceValue = (item) => {
    const raw =
      item.price ?? item.eth ?? item.amount ?? item.currentPrice ?? "0";

    if (typeof raw === "string" && raw.toLowerCase().includes("eth")) {
      return parseFloat(raw.replace(/[^\d.]/g, "")) || 0;
    }

    return Number(raw) || 0;
  };

  const getPriceLabel = (item) => {
    const raw =
      item.price ?? item.eth ?? item.amount ?? item.currentPrice ?? "0";

    return typeof raw === "string" && raw.toLowerCase().includes("eth")
      ? raw
      : `${raw} ETH`;
  };

  const getLikes = (item) =>
    Number(item.likes ?? item.likeCount ?? item.favorites ?? 0);

  const sortedItems = useMemo(() => {
    const copy = [...items];

    switch (sortBy) {
      case "price_low_to_high":
        return copy.sort((a, b) => getPriceValue(a) - getPriceValue(b));

      case "price_high_to_low":
        return copy.sort((a, b) => getPriceValue(b) - getPriceValue(a));

      case "likes_high_to_low":
        return copy.sort((a, b) => getLikes(b) - getLikes(a));

      default:
        return copy;
    }
  }, [items, sortBy]);

  const visibleItems = sortedItems.slice(0, visibleCount);
  const hasMore = visibleCount < sortedItems.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 4, sortedItems.length));
  };

  if (loading) {
    return (
      <>
        <div className="explore-filter-wrap">
          <select id="filter-items" value={sortBy} disabled>
            <option value="default">Default</option>
            <option value="price_low_to_high">Price, Low to High</option>
            <option value="price_high_to_low">Price, High to Low</option>
            <option value="likes_high_to_low">Most liked</option>
          </select>
        </div>

        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="d-item explore-skeleton-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
          >
            <div className="nft__item explore-skeleton-card">
              <div className="explore-skeleton-top">
                <div className="explore-skeleton-avatar shimmer"></div>
                <div className="explore-skeleton-pill shimmer"></div>
              </div>

              <div className="explore-skeleton-image shimmer"></div>

              <div className="explore-skeleton-body">
                <div className="explore-skeleton-line explore-skeleton-line--title shimmer"></div>
                <div className="explore-skeleton-line explore-skeleton-line--price shimmer"></div>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (error) {
    return (
      <div className="col-md-12 text-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="explore-filter-wrap">
        <select
          id="filter-items"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="default">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>

      {visibleItems.map((item, index) => (
        <div
          key={item.id ?? index}
          className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
          style={{ display: "block", backgroundSize: "cover" }}
        >
          <div className="nft__item">
            <div className="author_list_pp">
              <Link
                to={`/author?author=${getAuthorId(item)}`}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title={`Creator: ${getAuthorName(item)}`}
              >
                <img src={getAuthorImage(item)} alt={getAuthorName(item)} />
                <i className="fa fa-check"></i>
              </Link>
            </div>

            <CountdownPill expiryDate={item.expiryDate} now={now} />

            <div className="nft__item_wrap">
              <div className="nft__item_extra">
                <div className="nft__item_buttons">
                  <button>Buy Now</button>
                  <div className="nft__item_share">
                    <h4>Share</h4>
                    <a href="/" onClick={(e) => e.preventDefault()}>
                      <i className="fa fa-facebook fa-lg"></i>
                    </a>
                    <a href="/" onClick={(e) => e.preventDefault()}>
                      <i className="fa fa-twitter fa-lg"></i>
                    </a>
                    <a href="/" onClick={(e) => e.preventDefault()}>
                      <i className="fa fa-envelope fa-lg"></i>
                    </a>
                  </div>
                </div>
              </div>

              <Link to="/item-details">
                <img
                  src={getPreviewImage(item)}
                  className="nft__item_preview"
                  alt={getTitle(item)}
                />
              </Link>
            </div>

            <div className="nft__item_info">
              <Link to="/item-details">
                <h4>{getTitle(item)}</h4>
              </Link>
              <div className="nft__item_price">{getPriceLabel(item)}</div>
              <div className="nft__item_like">
                <i className="fa fa-heart"></i>
                <span>{getLikes(item)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {hasMore && (
        <div className="col-md-12 text-center">
          <button
            type="button"
            id="loadmore"
            className="btn-main lead"
            onClick={handleLoadMore}
          >
            Load more
          </button>
        </div>
      )}
    </>
  );
};

export default ExploreItems;
