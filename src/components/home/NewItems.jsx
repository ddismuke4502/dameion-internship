import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import CountdownPill from "../UI/CountdownPill";
import AOS from "aos";

function NextArrow({ onClick }) {
  return (
    <button
      type="button"
      className="new-items-arrow new-items-arrow--next"
      onClick={onClick}
      aria-label="Next items"
    >
      ›
    </button>
  );
}

function PrevArrow({ onClick }) {
  return (
    <button
      type="button"
      className="new-items-arrow new-items-arrow--prev"
      onClick={onClick}
      aria-label="Previous items"
    >
      ‹
    </button>
  );
}

function formatPrice(item) {
  const rawPrice =
    item?.price ?? item?.ethPrice ?? item?.amount ?? item?.currentPrice ?? "0.00";

  return typeof rawPrice === "string" && rawPrice.toLowerCase().includes("eth")
    ? rawPrice
    : `${rawPrice} ETH`;
}

const NewItems = () => {
  const [items, setItems] = useState([]);
  const [now, setNow] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getAuthorId = (item) =>
    item?.authorId || item?.authorID || item?.author || "";

  const getAuthorImage = (item) =>
    item?.authorImage || item?.profileImage || item?.image || "";

  const getItemTitle = (item) =>
    item?.title || item?.name || "Untitled Item";

  const getLikes = (item) =>
    item?.likes ?? item?.likeCount ?? item?.favorites ?? 0;

  const getNftId = (item) => item?.nftId || item?.nftID || item?.id || "";

  useEffect(() => {
    const fetchNewItems = async () => {
      try {
        const response = await fetch(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("New Items API response:", data);
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch New Items:", err);
        setError("Failed to load New Items");
      } finally {
        setLoading(false);
      }
    };

    fetchNewItems();
  }, []);

  useEffect(() => {
  if (!loading) {
    window.requestAnimationFrame(() => {
      AOS.refreshHard();
    });
  }
}, [loading, items.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const sliderSettings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    adaptiveHeight: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) {
    return (
      <section id="section-items" className="no-bottom new-items-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="text-center" data-aos="fade-up">
                <h2>New Items</h2>
                <div className="small-border bg-color-2"></div>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="new-items-slider-wrap new-items-loading-wrap">
                <button
                  type="button"
                  className="new-items-arrow new-items-arrow--prev new-items-arrow--disabled"
                  disabled
                  aria-label="Previous items"
                >
                  ‹
                </button>

                <div className="new-items-loading-track">
                  {[1, 2, 3, 4].map((card) => (
                    <div className="new-items-loading-slide" key={card}>
                      <div className="nft__item new-items-card new-items-skeleton-card">
                        <div className="new-items-skeleton-top">
                          <div className="new-items-skeleton-avatar shimmer"></div>
                          <div className="new-items-skeleton-pill shimmer"></div>
                        </div>

                        <div className="new-items-skeleton-image shimmer"></div>

                        <div className="new-items-skeleton-body">
                          <div className="new-items-skeleton-line new-items-skeleton-line--title shimmer"></div>
                          <div className="new-items-skeleton-line new-items-skeleton-line--price shimmer"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="new-items-arrow new-items-arrow--next new-items-arrow--disabled"
                  disabled
                  aria-label="Next items"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="section-items" className="no-bottom new-items-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="text-center">
                <h2>New Items</h2>
                <div className="small-border bg-color-2"></div>
              </div>
            </div>
            <div className="col-12 text-center">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="section-items" className="no-bottom new-items-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          <div className="col-lg-12">
            <div className="new-items-slider-wrap">
              <Slider {...sliderSettings}>
                {items.map((item, index) => (
                  <div className="new-items-slide" key={item.id}>
                    <div className="nft__item new-items-card" data-aos="fade-up" data-aos-delay={(index % 4) * 100}>
                      <div className="author_list_pp">
                        <Link to={`/author?author=${getAuthorId(item)}`}>
                          <img
                            src={getAuthorImage(item)}
                            alt={`${getItemTitle(item)} creator`}
                          />
                          <i className="fa fa-check"></i>
                        </Link>
                      </div>

                      <CountdownPill
                        expiryDate={item.expiryDate}
                        now={now}
                        className="new-items-countdown"
                      />

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

                        <Link to={`/item-details?nftId=${getNftId(item)}`}>
                          <img
                            src={item.nftImage}
                            className="nft__item_preview"
                            alt={getItemTitle(item)}
                          />
                        </Link>
                      </div>

                      <div className="nft__item_info">
                        <Link to={`/item-details?nftId=${getNftId(item)}`}>
                          <h4>{getItemTitle(item)}</h4>
                        </Link>
                        <div className="nft__item_price">
                          {formatPrice(item)}
                        </div>
                        <div className="nft__item_like">
                          <i className="fa fa-heart"></i>
                          <span>{getLikes(item)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewItems;