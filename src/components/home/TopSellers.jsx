import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const TopSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopSellers = async () => {
      try {
        const response = await fetch(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Top Sellers API response:", data);
        setSellers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch Top Sellers:", err);
        setError("Failed to load Top Sellers");
      } finally {
        setLoading(false);
      }
    };

    fetchTopSellers();
  }, []);

  const getAuthorId = (seller) =>
    seller?.authorId || seller?.authorID || seller?.author || "";

  const getAuthorName = (seller) =>
    seller?.authorName || seller?.name || seller?.author || "Unknown Seller";

  const getAuthorImage = (seller) =>
    seller?.authorImage || seller?.profileImage || seller?.image || "";

  const formatEth = (seller) => {
    const rawValue =
      seller?.price ??
      seller?.eth ??
      seller?.amount ??
      seller?.volume ??
      seller?.total ??
      "0";

    return typeof rawValue === "string" &&
      rawValue.toLowerCase().includes("eth")
      ? rawValue
      : `${rawValue} ETH`;
  };

  if (loading) {
    return (
      <section id="section-popular" className="pb-5 top-sellers-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="text-center">
                <h2>Top Sellers</h2>
                <div className="small-border bg-color-2"></div>
              </div>
            </div>

            <div className="col-md-12">
              <ol className="author_list top-sellers-skeleton-list">
                {Array.from({ length: 12 }).map((_, index) => (
                  <li key={index} className="top-sellers-skeleton-item">
                    <div className="author_list_pp top-sellers-skeleton-avatar-wrap">
                      <div className="top-sellers-skeleton-avatar shimmer"></div>
                      <div className="top-sellers-skeleton-check"></div>
                    </div>

                    <div className="author_list_info top-sellers-skeleton-info">
                      <div className="top-sellers-skeleton-line top-sellers-skeleton-line--name shimmer"></div>
                      <div className="top-sellers-skeleton-line top-sellers-skeleton-line--eth shimmer"></div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="section-popular" className="pb-5 top-sellers-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="text-center">
                <h2>Top Sellers</h2>
                <div className="small-border bg-color-2"></div>
              </div>
            </div>

            <div className="col-md-12 text-center">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="section-popular" className="pb-5 top-sellers-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          <div className="col-md-12">
            <ol className="author_list">
              {sellers.map((seller, index) => (
                <li key={seller.id ?? index}>
                  <div className="author_list_pp">
                    <Link to={`/author?author=${getAuthorId(seller)}`}>
                      <img
                        className="pp-author"
                        src={getAuthorImage(seller)}
                        alt={getAuthorName(seller)}
                      />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>

                  <div className="author_list_info">
                    <Link to={`/author?author=${getAuthorId(seller)}`}>
                      {getAuthorName(seller)}
                    </Link>
                    <span>{formatEth(seller)}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;