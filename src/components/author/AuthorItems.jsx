import React from "react";
import { Link } from "react-router-dom";

const AuthorItems = ({
  items = [],
  currentAuthorId = "",
  authorName = "Author",
  loading = false,
}) => {
  const getItemTitle = (item) => item?.title || item?.name || "Untitled Item";

  const getItemPrice = (item) => {
    const raw =
      item?.price ?? item?.eth ?? item?.amount ?? item?.currentPrice ?? "0";

    return typeof raw === "string" && raw.toLowerCase().includes("eth")
      ? raw
      : `${raw} ETH`;
  };

  const getItemLikes = (item) =>
    item?.likes ?? item?.likeCount ?? item?.favorites ?? 0;

  const getItemAuthorImage = (item) =>
    item?.authorImage || item?.profileImage || item?.image || "";

  const getItemImage = (item) =>
    item?.nftImage || item?.image || item?.previewImage || "";

  const getItemAuthorId = (item) =>
    item?.authorId || item?.authorID || item?.author || currentAuthorId || "";

  if (loading) {
    return (
      <div className="de_tab_content">
        <div className="tab-1">
          <div className="row author-items-grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
                style={{ display: "block", backgroundSize: "cover" }}
              >
                <div className="nft__item author-item-skeleton-card">
                  <div className="author-item-skeleton-top">
                    <div className="author-item-skeleton-avatar shimmer"></div>
                  </div>

                  <div className="author-item-skeleton-image shimmer"></div>

                  <div className="author-item-skeleton-body">
                    <div className="author-line-skeleton author-line-skeleton--title shimmer"></div>
                    <div className="author-line-skeleton author-line-skeleton--price shimmer"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="de_tab_content">
      <div className="tab-1">
        <div className="row author-items-grid">
          {items.map((item, index) => (
            <div
              className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
              key={item.id ?? index}
            >
              <div className="nft__item">
                <div className="author_list_pp">
                  <Link to={`/author?author=${getItemAuthorId(item)}`}>
                    <img
                      src={getItemAuthorImage(item)}
                      className="nft__item_author_img"
                      alt={authorName}
                    />
                    <i className="fa fa-check"></i>
                  </Link>
                </div>

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
                      src={getItemImage(item)}
                      className="nft__item_preview"
                      alt={getItemTitle(item)}
                    />
                  </Link>
                </div>

                <div className="nft__item_info">
                  <Link to="/item-details">
                    <h4>{getItemTitle(item)}</h4>
                  </Link>
                  <div className="nft__item_price">{getItemPrice(item)}</div>
                  <div className="nft__item_like">
                    <i className="fa fa-heart"></i>
                    <span>{getItemLikes(item)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthorItems;