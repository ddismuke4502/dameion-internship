import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AuthorItems from "./AuthorItems";

const DEFAULT_AUTHOR_ID = "73855012";

const AuthorPage = () => {
  const [searchParams] = useSearchParams();
  const authorId = searchParams.get("author") || DEFAULT_AUTHOR_ID;

  const [author, setAuthor] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  const getAuthorName = (value) =>
    value?.authorName || value?.name || value?.author || "Unknown Author";

  const getUsername = (value) =>
    value?.username || value?.handle || value?.authorUserName || "@unknown";

  const getWallet = (value) =>
    value?.address || value?.walletAddress || value?.wallet || "";

  const getAuthorImage = (value) =>
    value?.authorImage || value?.profileImage || value?.image || "";

  const getBannerImage = (value) =>
    value?.bannerImage ||
    value?.coverImage ||
    value?.cover ||
    value?.nftImage ||
    value?.image ||
    "";

  const getFollowers = (value) =>
    Number(
      value?.followers ?? value?.followerCount ?? value?.followersCount ?? 0
    ) || 0;

  const getAuthorId = (value) =>
    value?.authorId || value?.authorID || value?.author || authorId;

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await fetch(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${authorId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Author API response:", data);

        let resolvedAuthor = null;
        let resolvedItems = [];

        if (Array.isArray(data)) {
          resolvedItems = data;
          resolvedAuthor = data[0] || null;
        } else {
          resolvedAuthor =
            data.author || data.profile || data.authorDetails || data;
          resolvedItems =
            data.items ||
            data.nfts ||
            data.collections ||
            data.authorItems ||
            data.data ||
            [];
        }

        setAuthor(resolvedAuthor);
        setItems(Array.isArray(resolvedItems) ? resolvedItems : []);
        setFollowerCount(getFollowers(resolvedAuthor));
      } catch (err) {
        console.error("Failed to fetch author:", err);
        setError("Failed to load author");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [authorId]);

  const profileBanner = useMemo(() => getBannerImage(author), [author]);
  const profileImage = useMemo(() => getAuthorImage(author), [author]);
  const profileName = useMemo(() => getAuthorName(author), [author]);
  const profileUsername = useMemo(() => getUsername(author), [author]);
  const profileWallet = useMemo(() => getWallet(author), [author]);
  const resolvedAuthorId = useMemo(() => getAuthorId(author), [author]);

  const handleFollowToggle = () => {
    setIsFollowing((prev) => {
      const next = !prev;
      setFollowerCount((count) => (next ? count + 1 : Math.max(count - 1, 0)));
      return next;
    });
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

        <div className="container">
          <div className="author-profile-card author-profile-skeleton">
            <div className="author-profile-main">
              <div className="author-avatar-skeleton shimmer"></div>

              <div className="author-meta-skeleton">
                <div className="author-line-skeleton author-line-skeleton--name shimmer"></div>
                <div className="author-line-skeleton author-line-skeleton--username shimmer"></div>
                <div className="author-line-skeleton author-line-skeleton--wallet shimmer"></div>
              </div>
            </div>

            <div className="author-follow-skeleton-wrap">
              <div className="author-line-skeleton author-line-skeleton--followers shimmer"></div>
              <div className="author-button-skeleton shimmer"></div>
            </div>
          </div>

          <AuthorItems loading={true} currentAuthorId={authorId} />
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

      <div className="container">
        <div className="author-profile-card">
          <div className="author-profile-main">
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

            <div className="author-profile-meta">
              <h2>{profileName}</h2>
              <div className="author-profile-username">{profileUsername}</div>

              <div className="author-profile-wallet">
                <span>{profileWallet || `Author ID: ${resolvedAuthorId}`}</span>
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

          <div className="author-profile-actions">
            <div className="author-followers">{followerCount} followers</div>
            <button
              type="button"
              className="btn-main author-follow-btn"
              onClick={handleFollowToggle}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
        </div>

        <AuthorItems
          items={items}
          currentAuthorId={resolvedAuthorId}
          authorName={profileName}
        />
      </div>
    </section>
  );
};

export default AuthorPage;