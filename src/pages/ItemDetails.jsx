import React, { useEffect, useMemo, useState, useCallback } from "react";
import EthImage from "../images/ethereum.svg";
import { Link, useSearchParams } from "react-router-dom";

const DEFAULT_NFT_ID = "17914494";

const ItemDetails = () => {
  const [searchParams] = useSearchParams();
  const nftId = searchParams.get("nftId") || DEFAULT_NFT_ID;

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [nftId]);

  const getTitle = (value) =>
    value?.title || value?.name || value?.itemName || "Untitled Item";

  const getImage = (value) =>
    value?.nftImage || value?.image || value?.previewImage || "";

  const getDescription = (value) =>
    value?.description ||
    value?.details ||
    value?.about ||
    "No description available.";

  const getViews = (value) =>
    value?.views ?? value?.viewCount ?? value?.totalViews ?? 0;

  const getLikes = (value) =>
    value?.likes ?? value?.likeCount ?? value?.favorites ?? 0;

  const getPriceValue = (value) =>
    value?.price ?? value?.eth ?? value?.amount ?? value?.currentPrice ?? "0";

  const getPriceDisplay = useCallback((value) => {
    const raw = getPriceValue(value);
    return typeof raw === "string" && raw.toLowerCase().includes("eth")
      ? raw.replace(" ETH", "")
      : raw;
  }, []);

  const getOwnerId = (value) =>
    value?.ownerId ||
    value?.ownerID ||
    value?.ownerAuthorId ||
    value?.authorId ||
    value?.authorID ||
    value?.author ||
    "";

  const getOwnerName = (value) =>
    value?.ownerName ||
    value?.owner ||
    value?.authorName ||
    value?.author ||
    "Unknown Author";

  const getOwnerImage = (value) =>
    value?.ownerImage ||
    value?.ownerAuthorImage ||
    value?.authorImage ||
    value?.profileImage ||
    value?.image ||
    "";

  const getCreatorId = useCallback((value) => 
    value?.creatorId ||
    value?.creatorID ||
    value?.creatorAuthorId ||
    getOwnerId(value), []);

  const getCreatorName = useCallback((value) => 
    value?.creatorName ||
    value?.creator ||
    value?.artistName ||
    getOwnerName(value), []);

  const getCreatorImage = useCallback((value) => 
    value?.creatorImage ||
    value?.creatorAuthorImage ||
    value?.artistImage ||
    getOwnerImage(value), []);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await fetch(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftId=${nftId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Item Details API response:", data);

        const resolvedItem = Array.isArray(data) ? data[0] : data;
        setItem(resolvedItem || null);
      } catch (err) {
        console.error("Failed to fetch item details:", err);
        setError("Failed to load item details");
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [nftId]);

  const title = useMemo(() => getTitle(item), [item]);
  const image = useMemo(() => getImage(item), [item]);
  const description = useMemo(() => getDescription(item), [item]);
  const views = useMemo(() => getViews(item), [item]);
  const likes = useMemo(() => getLikes(item), [item]);
  const ownerId = useMemo(() => getOwnerId(item), [item]);
  const ownerName = useMemo(() => getOwnerName(item), [item]);
  const ownerImage = useMemo(() => getOwnerImage(item), [item]);
  const creatorId = useMemo(() => getCreatorId(item), [item, getCreatorId]);
  const creatorName = useMemo(() => getCreatorName(item), [item, getCreatorName]);
  const creatorImage = useMemo(() => getCreatorImage(item), [item, getCreatorImage]);
  const priceDisplay = useMemo(() => getPriceDisplay(item), [item, getPriceDisplay]);

  if (loading) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>
          <section aria-label="section" className="mt90 sm-mt-0">
            <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <div className="item-details-image-skeleton shimmer"></div>
                </div>
                <div className="col-md-6">
                  <div className="item-details-content-skeleton">
                    <div className="item-details-line item-details-line--title shimmer"></div>
                    <div className="item-details-stats-skeleton">
                      <div className="item-details-pill-skeleton shimmer"></div>
                      <div className="item-details-pill-skeleton shimmer"></div>
                    </div>
                    <div className="item-details-line item-details-line--text shimmer"></div>
                    <div className="item-details-line item-details-line--text shimmer"></div>
                    <div className="item-details-label-skeleton shimmer"></div>
                    <div className="item-details-owner-skeleton">
                      <div className="item-details-owner-avatar shimmer"></div>
                      <div className="item-details-owner-name shimmer"></div>
                    </div>
                    <div className="item-details-label-skeleton shimmer"></div>
                    <div className="item-details-owner-skeleton">
                      <div className="item-details-owner-avatar shimmer"></div>
                      <div className="item-details-owner-name shimmer"></div>
                    </div>
                    <div className="spacer-40"></div>
                    <div className="item-details-label-skeleton shimmer"></div>
                    <div className="item-details-price-skeleton shimmer"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>
          <section aria-label="section" className="mt90 sm-mt-0">
            <div className="container">
              <div className="text-center">
                <p>{error || "Item not found"}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">
              <div className="col-md-6 text-center">
                <img
                  src={image}
                  className="img-fluid img-rounded mb-sm-30 nft-image"
                  alt={title}
                />
              </div>
              <div className="col-md-6">
                <div className="item_info">
                  <h2>{title}</h2>

                  <div className="item_info_counts">
                    <div className="item_info_views">
                      <i className="fa fa-eye"></i>
                      {views}
                    </div>
                    <div className="item_info_like">
                      <i className="fa fa-heart"></i>
                      {likes}
                    </div>
                  </div>

                  <p>{description}</p>

                  <div className="d-flex flex-row">
                    <div className="mr40">
                      <h6>Owner</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author?author=${ownerId}`}>
                            <img src={ownerImage} alt={ownerName} />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author?author=${ownerId}`}>{ownerName}</Link>
                        </div>
                      </div>
                    </div>
                    <div></div>
                  </div>

                  <div className="de_tab tab_simple">
                    <div className="de_tab_content">
                      <h6>Creator</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author?author=${creatorId}`}>
                            <img src={creatorImage} alt={creatorName} />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author?author=${creatorId}`}>{creatorName}</Link>
                        </div>
                      </div>
                    </div>
                    <div className="spacer-40"></div>
                    <h6>Price</h6>
                    <div className="nft-item-price">
                      <img src={EthImage} alt="" />
                      <span>{priceDisplay}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;