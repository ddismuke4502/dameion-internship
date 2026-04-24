import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const DEFAULT_AUTHOR_ID = "73855012";

const AuthorPage = () => {
  const [searchParams] = useSearchParams();
  const authorId = searchParams.get("author") || DEFAULT_AUTHOR_ID;

  const [author, setAuthor] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [baseFollowerCount, setBaseFollowerCount] = useState(0);
  const displayedFollowerCount = baseFollowerCount + (isFollowing ? 1 : 0);

  const getAuthorName = (value) =>
    value?.authorName || value?.name || value?.author || "Unknown Author";

  const getUsername = (value) => {
    const explicitUsername =
      value?.username || value?.handle || value?.authorUserName;

    if (explicitUsername) {
      return explicitUsername.startsWith("@")
        ? explicitUsername
        : `@${explicitUsername}`;
    }

    const fallbackName =
      value?.authorName || value?.name || value?.author || "unknown";

    return `@${String(fallbackName).toLowerCase().replace(/\s+/g, "")}`;
  };

  const getWallet = (value) =>
    value?.address || value?.walletAddress || value?.wallet || "";

  const getAuthorImage = (value) =>
    value?.authorImage || value?.profileImage || value?.image || "";

  const getBannerImage = (value, fallbackItems = []) =>
    value?.bannerImage ||
    value?.coverImage ||
    value?.cover ||
    value?.nftImage ||
    value?.image ||
    fallbackItems?.[0]?.nftImage ||
    fallbackItems?.[0]?.image ||
    "";

  const getFollowers = (value) =>
    Number(
      value?.followers ?? value?.followerCount ?? value?.followersCount ?? 0
    ) || 0;

  const getResolvedAuthorId = (value) =>
    value?.authorId || value?.authorID || value?.author || authorId;

  const getShortWallet = (wallet) => {
    if (!wallet) return "";
    if (wallet.length <= 18) return wallet;
    return `${wallet.slice(0, 12)}...${wallet.slice(-6)}`;
  };

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
    item?.authorImage || item?.profileImage || getAuthorImage(author);

  const getItemImage = (item) =>
    item?.nftImage || item?.image || item?.previewImage || "";

  const getItemAuthorId = (item) =>
    item?.authorId ||
    item?.authorID ||
    item?.author ||
    getResolvedAuthorId(author);

  const findItemsInPayload = (payload) => {
    if (!payload || typeof payload !== "object") return [];

    const candidates = [
      payload?.items,
      payload?.nfts,
      payload?.collections,
      payload?.authorItems,
      payload?.nftItems,
      payload?.data,
      payload?.results,
      payload?.list,
    ];

    for (const candidate of candidates) {
      if (Array.isArray(candidate) && candidate.length) {
        return candidate;
      }
    }

    for (const value of Object.values(payload)) {
      if (Array.isArray(value) && value.length) {
        return value;
      }
    }

    return [];
  };

  useEffect(() => {
    const fetchAuthorPage = async () => {
      try {
        const authorResponse = await fetch(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${authorId}`
        );

        if (!authorResponse.ok) {
          throw new Error(`HTTP error! status: ${authorResponse.status}`);
        }

        const authorData = await authorResponse.json();

        let resolvedAuthor = null;
        let resolvedItems = [];

        if (Array.isArray(authorData)) {
          resolvedAuthor = authorData[0] || null;
          resolvedItems = authorData;
        } else {
          resolvedAuthor =
            authorData?.author ||
            authorData?.profile ||
            authorData?.authorDetails ||
            authorData;
          resolvedItems = findItemsInPayload(authorData);
        }

        const resolvedId =
          resolvedAuthor?.authorId ||
          resolvedAuthor?.authorID ||
          resolvedAuthor?.author ||
          authorId;

        const resolvedName =
          resolvedAuthor?.authorName ||
          resolvedAuthor?.name ||
          resolvedAuthor?.author ||
          "";

        if (!resolvedItems.length) {
          const exploreResponse = await fetch(
            "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore"
          );

          if (!exploreResponse.ok) {
            throw new Error(`HTTP error! status: ${exploreResponse.status}`);
          }

          const exploreData = await exploreResponse.json();
          const allExploreItems = Array.isArray(exploreData) ? exploreData : [];

          resolvedItems = allExploreItems.filter((item) => {
            const itemAuthorId =
              item?.authorId || item?.authorID || item?.author || "";
            const itemAuthorName =
              item?.authorName || item?.author || item?.name || "";

            return (
              String(itemAuthorId) === String(resolvedId) ||
              (resolvedName && itemAuthorName === resolvedName)
            );
          });
        }

        setAuthor(resolvedAuthor);
        setItems(resolvedItems);
        setBaseFollowerCount(getFollowers(resolvedAuthor));
      } catch (err) {
        console.error("Failed to fetch author page:", err);
        setError("Failed to load author page");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorPage();
  }, [authorId]);

  const profileBanner = useMemo(
    () => getBannerImage(author, items),
    [author, items]
  );
  const profileImage = useMemo(() => getAuthorImage(author), [author]);
  const profileName = useMemo(() => getAuthorName(author), [author]);
  const profileUsername = useMemo(() => getUsername(author), [author]);
  const profileWallet = useMemo(() => getWallet(author), [author]);
  const resolvedAuthorId = useMemo(
    () => getResolvedAuthorId(author),
    [author, authorId]
  );

  const handleFollowToggle = () => {
    setIsFollowing((prev) => !prev);
  };

  const handleCopyWallet = async () => {
    if (!profileWallet) return;

    try {
      await navigator.clipboard.writeText(profileWallet);
    } catch (err) {
      console.error("Failed to copy wallet:", err);
    }
  };

  if (loading) {
    return (
      <section className="author-page author-page--loading">
        <div className="author-hero-skeleton shimmer"></div>

        <div className="container author-profile-section">
          <div className="author-profile-card author-profile-skeleton">
            <div className="author-profile-row">
              <div className="author-profile-left">
                <div className="author-avatar-skeleton shimmer"></div>

                <div className="author-meta-skeleton">
                  <div className="author-line-skeleton author-line-skeleton--name shimmer"></div>
                  <div className="author-line-skeleton author-line-skeleton--username shimmer"></div>
                  <div className="author-line-skeleton author-line-skeleton--wallet shimmer"></div>
                </div>
              </div>

              <div className="author-profile-right">
                <div className="author-line-skeleton author-line-skeleton--followers shimmer"></div>
                <div className="author-button-skeleton shimmer"></div>
              </div>
            </div>
          </div>

          <div className="row author-items-grid author-items-section">
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
      </section>
    );
  }

  if (error || !author) {
    return (
      <section className="author-page">
        <div className="container">
          <div className="col-md-12 text-center">
            <p>{error || "Author not found"}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="author-page">
      <div
        className="author-hero"
        style={
          profileBanner ? { backgroundImage: `url(${profileBanner})` } : undefined
        }
      />

      <div className="container author-profile-section">
        <div className="author-profile-card">
          <div className="author-profile-row">
            <div className="author-profile-left">
              <div className="author-profile-avatar-wrap">
                <img
                  className="author-profile-avatar"
                  src={profileImage}
                  alt={profileName}
                />
                <span className="author-verified-badge">
                  <i className="fa fa-check"></i>
                </span>
              </div>

              <div className="author-meta">
                <h2>{profileName}</h2>
                <div className="author-username">{profileUsername}</div>

                <div className="author-wallet-row">
                  <span
                    className="author-wallet"
                    title={profileWallet || `Author ID: ${resolvedAuthorId}`}
                  >
                    {profileWallet
                      ? getShortWallet(profileWallet)
                      : `Author ID: ${resolvedAuthorId}`}
                  </span>

                  {profileWallet && (
                    <button
                      type="button"
                      className="author-copy-btn"
                      onClick={handleCopyWallet}
                    >
                      Copy
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="author-profile-right">
              <div className="author-followers">{displayedFollowerCount} followers</div>
              <button
                type="button"
                className="btn-main author-follow-btn"
                onClick={handleFollowToggle}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            </div>
          </div>
        </div>

        <div className="row author-items-grid author-items-section">
          {items.map((item, index) => (
            <div
              key={item.id ?? index}
              className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
              style={{ display: "block", backgroundSize: "cover" }}
            >
              <div className="nft__item">
                <div className="author_list_pp">
                  <Link to={`/author?author=${getItemAuthorId(item)}`}>
                    <img
                      src={getItemAuthorImage(item)}
                      alt={item?.authorName || profileName}
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
    </section>
  );
};

export default AuthorPage;