"use client";
import React, { useEffect, useState, forwardRef } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Milage from "@/images/mileage.png";
import Automatic from "@/images/automatic.png";
import Manual from "@/images/manual.png";
import { AuthContext } from "@/context/AuthContext";
import { CarSuggest } from "@/components/banners/banner";
import { MemberBanner } from "@/components/banners/banner";
import Image from "next/image";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AdsResult({ postData, featuredData, loader }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const awsImageURL = process.env.NEXT_PUBLIC_AWS_IMAGE_URL;

  const { user } = React.useContext(AuthContext);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [statusMsg, setStatusMsg] = React.useState("");

  const handleBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    if (postData?.length || featuredData?.length) {
      setLoading(false);
    }
  }, [postData?.length, featuredData?.length]);

  const addToWishlist = async (post_id) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("post_id", post_id);
      formData.append("Id", user?.id);
      await axios.post(`${baseUrl}/fame/addToWishlist`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Fetch the updated wishlist data
      const response = await axios.get(`${baseUrl}/posts/condition`, {
        params: {
          condition: "used",
        },
      });
      const updatedWishlistData = response?.data?.data;

      // Update the state with the updated wishlist data
      setData(updatedWishlistData);

      setStatusMsg("Added to saved ads");
      setOpen(true);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  const removeFromWishlist = async (post_id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${baseUrl}/fame/deletewishlist`, {
        params: {
          userId: user?.id,
          post_id: post_id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await axios.get(`${baseUrl}/posts/condition`, {
        params: {
          condition: "used",
        },
      });
      const updatedWishlistData = response?.data?.data;

      setData(updatedWishlistData);

      setStatusMsg("Remove from saved ads");
      setOpen(true);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const history = useRouter();

  const openPost = (post_id) => {
    history.push(`/bike-details/${post_id}`);
  };

  const formatPrice = (price) => {
    if (price >= 100000000000) {
      return (
        (price / 100000000000).toLocaleString("en-US", {
          maximumFractionDigits: 2,
        }) + " Kharab"
      );
    } else if (price >= 1000000000) {
      return (
        (price / 1000000000).toLocaleString("en-US", {
          maximumFractionDigits: 2,
        }) + " Arab"
      );
    } else if (price >= 10000000) {
      return (
        (price / 10000000).toLocaleString("en-US", {
          maximumFractionDigits: 2,
        }) + " Crore"
      );
    } else if (price >= 100000) {
      return (
        (price / 100000).toLocaleString("en-US", { maximumFractionDigits: 2 }) +
        " lacs"
      );
    } else if (price >= 1000) {
      return (
        (price / 1000).toLocaleString("en-US", { maximumFractionDigits: 2 }) +
        " Thousand"
      );
    } else {
      return price.toLocaleString("en-US", { maximumFractionDigits: 2 });
    }
  };
  const firstFeatured = featuredData && featuredData.slice(0, 5);
  const secondFeatured = featuredData && featuredData.slice(6, 12);

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleBarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleBarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {statusMsg}
        </Alert>
      </Snackbar>
      {loader ? (
        <div className="No_ads_loading p-3 text-center">
          <div>
            <div className="row">
              <div className="col-lg-3">
                <Skeleton
                  animation="wave"
                  variant="rounded"
                  width="100%"
                  height={170}
                />
              </div>
              <div className="col-lg-9 d-flex flex-column justify-content-between">
                <div className="d-flex align-items-top justify-content-between">
                  <div className="text-start">
                    <h4>
                      <Skeleton
                        animation="wave"
                        variant="rounded"
                        width={300}
                        height={20}
                      />
                    </h4>
                    <h6>
                      <Skeleton
                        animation="wave"
                        variant="rounded"
                        width={150}
                        height={20}
                      />
                    </h6>
                  </div>
                  <div>
                    <Skeleton
                      animation="wave"
                      variant="rounded"
                      width={8}
                      height={20}
                    />
                  </div>
                </div>
                <div className="d-flex align-items-center ">
                  <p>
                    <Skeleton
                      sx={{ marginRight: 2 }}
                      animation="wave"
                      variant="rounded"
                      width={30}
                      height={15}
                    />
                  </p>
                  <p>
                    <Skeleton
                      sx={{ marginRight: 2 }}
                      animation="wave"
                      variant="rounded"
                      width={30}
                      height={15}
                    />
                  </p>
                  <p>
                    <Skeleton
                      sx={{ marginRight: 2 }}
                      animation="wave"
                      variant="rounded"
                      width={30}
                      height={15}
                    />
                  </p>
                </div>
                <div>
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    width={60}
                    height={20}
                  />
                </div>
                <div className=" d-flex justify-content-end ">
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    width={100}
                    height={35}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : featuredData && featuredData?.length > 0 ? (
        <>
          {firstFeatured &&
            firstFeatured.map((ad) => (
              <div className="myAd p-3 mb-4">
                <Link href={`/bike-details/${ad?.post_id}`} className="row">
                  <div
                    className="col-lg-3 Myads_photos cursorPointer"
                    key={ad?.post_id}
                  >
                    <div className="position-relative m-2">
                      <Image
                        width={500}
                        height={500}
                        src={`${awsImageURL}/public/posts/${ad?.post_token}/${ad?.cover}`}
                        alt={`${ad?.bikemake_name} ${ad?.modelName} ${ad?.yearName}`}
                        srcSet=""
                        key={ad.post_id}
                        onClick={() => openPost(ad.post_id)}
                      />
                      <div className="d-flex align-items-center justify-content-between position-absolute top-0 w-100 ">
                        <div className="m-0 px-2 py-1 fw-600 featured-badge text-center">
                          FEATURED
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-9 d-flex flex-column justify-content-between">
                    <div className="d-flex align-items-top justify-content-between">
                      <div className="vehicleDetails text-capitalize">
                        <h4
                          key={ad.post_id}
                          onClick={() => openPost(ad.post_id)}
                          className="fw-500 cursorPointer "
                        >
                          {ad?.bikemake_name} {ad?.modelName}
                        </h4>
                        <h5 className="fw-600 color-secondary">
                          PKR: {formatPrice(ad.price)}{" "}
                        </h5>
                        <p className="postlocation">
                          <i className="fa-solid fa-location-dot me-2"></i>
                          {ad?.city_name}
                        </p>
                      </div>
                      {ad?.wish === 0 ? (
                        <div
                          onClick={() => addToWishlist(ad?.post_id)}
                          className="ms-auto ad-share-btns position-relative"
                        >
                          <Tooltip
                            title="Save this Ad"
                            arrow
                            placement="top"
                            TransitionComponent={Zoom}
                            enterDelay={40}
                            leaveDelay={200}
                          >
                            <button className="btn boxShadow">
                              <i className="fa-regular fa-heart"></i>
                            </button>
                          </Tooltip>
                        </div>
                      ) : ad?.wish === 1 ? (
                        <div
                          onClick={() => removeFromWishlist(ad?.post_id)}
                          className="ms-auto ad-share-btns position-relative"
                        >
                          <Tooltip
                            title="Added to Saved Ads"
                            arrow
                            placement="top"
                            TransitionComponent={Zoom}
                            enterDelay={40}
                            leaveDelay={200}
                          >
                            <div className="ms-auto ad-share-btns">
                              <button className="btn boxShadow">
                                <i className="fa-solid fa-heart"></i>
                              </button>
                            </div>
                          </Tooltip>
                        </div>
                      ) : null}
                    </div>
                    <div className="d-flex justify-content-end justify-content-md-between color-black">
                      <div className="d-md-flex align-items-center d-none">
                        <p className="pe-4 detailsFeature m-0">
                          {" "}
                          <i className="fa-solid fa-calendar-days"></i>{" "}
                          {ad?.yearName}{" "}
                        </p>
                        <p className="pe-4 detailsFeature m-0">
                          {" "}
                          <Image
                            width={500}
                            height={500}
                            className="vehicledDetail_icon"
                            src={Milage}
                            alt=""
                            srcSet=""
                          />{" "}
                          {ad?.milage} Km
                        </p>
                        <p className="pe-4 detailsFeature m-0">
                          {" "}
                          <i className="fa-solid fa-gas-pump"></i>{" "}
                          {ad?.vehicle_fuel}{" "}
                        </p>
                        {ad?.transmission &&
                        ad?.transmission === "Automatic" ? (
                          <p className="pe-4 detailsFeature m-0">
                            <Image
                              width={500}
                              height={500}
                              className="vehicledDetail_icon"
                              src={Automatic}
                              alt=""
                              srcSet=""
                            />{" "}
                            {ad?.transmission}{" "}
                          </p>
                        ) : ad?.transmission &&
                          ad?.transmission === "Manual" ? (
                          <p className="pe-4 detailsFeature m-0">
                            <Image
                              width={500}
                              height={500}
                              className="vehicledDetail_icon"
                              src={Manual}
                              alt=""
                              srcSet=""
                            />{" "}
                            {ad?.transmission}{" "}
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="text-end ad_controls">
                        <Link
                          className="btn bgSecondary text-white ms-3 fw_br"
                          href={`/bike-details/${ad?.post_id}`}
                        >
                          View Ad
                        </Link>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}

          {firstFeatured?.length > 0 && <MemberBanner />}

          {secondFeatured &&
            secondFeatured.map((ad) => (
              <div className="myAd p-3 mb-4">
                <Link href={`/bike-details/${ad?.post_id}`} className="row">
                  <div
                    className="col-lg-3 Myads_photos cursorPointer"
                    key={ad?.post_id}
                  >
                    <Image
                      width={500}
                      height={500}
                      src={`${baseUrl}/public/posts/${ad?.post_token}/${ad?.cover}`}
                      alt={`${ad?.bikemake_name} ${ad?.modelName} ${ad?.yearName}`}
                      srcSet=""
                      key={ad.post_id}
                      onClick={() => openPost(ad.post_id)}
                    />
                    <div className="d-flex align-items-center justify-content-between position-absolute top-0 w-100 ">
                      <div className="m-0 px-2 py-1 fw-600 featured-badge text-center">
                        FEATURED
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-9 d-flex flex-column justify-content-between">
                    <div className="d-flex align-items-top justify-content-between">
                      <div className="vehicleDetails text-capitalize">
                        <h4
                          key={ad.post_id}
                          onClick={() => openPost(ad.post_id)}
                          className="fw-500 cursorPointer "
                        >
                          {ad?.bikemake_name} {ad?.modelName}
                        </h4>
                        <h5 className="fw-600 color-secondary">
                          PKR: {formatPrice(ad.price)}{" "}
                        </h5>
                        <p className="postlocation">
                          <i className="fa-solid fa-location-dot me-2"></i>
                          {ad?.city_name}
                        </p>
                      </div>
                      {ad?.wish === 0 ? (
                        <div
                          onClick={() => addToWishlist(ad?.post_id)}
                          className="ms-auto ad-share-btns position-relative"
                        >
                          <Tooltip
                            title="Save this Ad"
                            arrow
                            placement="top"
                            TransitionComponent={Zoom}
                            enterDelay={40}
                            leaveDelay={200}
                          >
                            <button className="btn boxShadow">
                              <i className="fa-regular fa-heart"></i>
                            </button>
                          </Tooltip>
                        </div>
                      ) : ad?.wish === 1 ? (
                        <div
                          onClick={() => removeFromWishlist(ad?.post_id)}
                          className="ms-auto ad-share-btns position-relative"
                        >
                          <Tooltip
                            title="Added to Saved Ads"
                            arrow
                            placement="top"
                            TransitionComponent={Zoom}
                            enterDelay={40}
                            leaveDelay={200}
                          >
                            <div className="ms-auto ad-share-btns">
                              <button className="btn boxShadow">
                                <i className="fa-solid fa-heart"></i>
                              </button>
                            </div>
                          </Tooltip>
                        </div>
                      ) : null}
                    </div>
                    <div className="d-flex justify-content-end justify-content-md-between color-black">
                      <div className="d-md-flex align-items-center d-none">
                        <p className="pe-4 detailsFeature m-0">
                          {" "}
                          <i className="fa-solid fa-calendar-days"></i>{" "}
                          {ad?.yearName}{" "}
                        </p>
                        <p className="pe-4 detailsFeature m-0">
                          {" "}
                          <Image
                            width={500}
                            height={500}
                            className="vehicledDetail_icon"
                            src={Milage}
                            alt=""
                            srcSet=""
                          />{" "}
                          {ad?.milage} Km
                        </p>
                        <p className="pe-4 detailsFeature m-0">
                          {" "}
                          <i className="fa-solid fa-gas-pump"></i>{" "}
                          {ad?.vehicle_fuel}{" "}
                        </p>
                        {ad?.transmission &&
                        ad?.transmission === "Automatic" ? (
                          <p className="pe-4 detailsFeature m-0">
                            <Image
                              width={500}
                              height={500}
                              className="vehicledDetail_icon"
                              src={Automatic}
                              alt=""
                              srcSet=""
                            />{" "}
                            {ad?.transmission}{" "}
                          </p>
                        ) : ad?.transmission &&
                          ad?.transmission === "Manual" ? (
                          <p className="pe-4 detailsFeature m-0">
                            <Image
                              width={500}
                              height={500}
                              className="vehicledDetail_icon"
                              src={Manual}
                              alt=""
                              srcSet=""
                            />{" "}
                            {ad?.transmission}{" "}
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="text-end ad_controls">
                        <Link
                          className="btn bgSecondary text-white ms-3 fw_br"
                          href={`/bike-details/${ad?.post_id}`}
                        >
                          View Ad
                        </Link>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          {secondFeatured?.length > 0 && <CarSuggest />}
        </>
      ) : (
        <MemberBanner />
      )}
      {loader ? (
        <div className="No_ads_loading p-3 text-center">
          <div>
            <div className="row">
              <div className="col-lg-3">
                <Skeleton
                  animation="wave"
                  variant="rounded"
                  width="100%"
                  height={170}
                />
              </div>
              <div className="col-lg-9 d-flex flex-column justify-content-between">
                <div className="d-flex align-items-top justify-content-between">
                  <div className="text-start">
                    <h4>
                      <Skeleton
                        animation="wave"
                        variant="rounded"
                        width={300}
                        height={20}
                      />
                    </h4>
                    <h6>
                      <Skeleton
                        animation="wave"
                        variant="rounded"
                        width={150}
                        height={20}
                      />
                    </h6>
                  </div>
                  <div>
                    <Skeleton
                      animation="wave"
                      variant="rounded"
                      width={8}
                      height={20}
                    />
                  </div>
                </div>
                <div className="d-flex align-items-center ">
                  <p>
                    <Skeleton
                      sx={{ marginRight: 2 }}
                      animation="wave"
                      variant="rounded"
                      width={30}
                      height={15}
                    />
                  </p>
                  <p>
                    <Skeleton
                      sx={{ marginRight: 2 }}
                      animation="wave"
                      variant="rounded"
                      width={30}
                      height={15}
                    />
                  </p>
                  <p>
                    <Skeleton
                      sx={{ marginRight: 2 }}
                      animation="wave"
                      variant="rounded"
                      width={30}
                      height={15}
                    />
                  </p>
                </div>
                <div>
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    width={60}
                    height={20}
                  />
                </div>
                <div className=" d-flex justify-content-end ">
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    width={100}
                    height={35}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : postData && postData?.length > 0 ? (
        postData &&
        postData.map((ad) => (
          <div className="myAd p-3 mb-4">
            <Link href={`/bike-details/${ad?.post_id}`} className="row">
              <div
                className="col-lg-3 Myads_photos cursorPointer"
                key={ad?.post_id}
              >
                <Image
                  width={500}
                  height={500}
                  src={`${awsImageURL}/public/bike_post/${ad?.post_token}/${ad?.cover}`}
                  alt={`${ad?.bikemake_name} ${ad?.modelName} ${ad?.yearName}`}
                  srcSet=""
                  key={ad.post_id}
                />
              </div>
              <div className="col-lg-9 d-flex flex-column justify-content-between">
                <div className="d-flex align-items-top justify-content-between">
                  <div className="vehicleDetails text-capitalize">
                    <h4
                      key={ad.post_id}
                      onClick={() => openPost(ad.post_id)}
                      className="fw-500 cursorPointer "
                    >
                      {ad?.bikemake_name} {ad?.bikemodel_name} {ad?.year_name}
                    </h4>
                    <h5 className="fw-600 color-secondary">
                      PKR: {formatPrice(ad.price)}{" "}
                    </h5>
                    <p className="postlocation">
                      <i className="fa-solid fa-location-dot me-2"></i>
                      {ad?.city}
                    </p>
                  </div>
                  {ad?.wish === 0 ? (
                    <div
                      onClick={() => addToWishlist(ad?.post_id)}
                      className="ms-auto ad-share-btns position-relative"
                    >
                      <Tooltip
                        title="Save this Ad"
                        arrow
                        placement="top"
                        TransitionComponent={Zoom}
                        enterDelay={40}
                        leaveDelay={200}
                      >
                        <button className="btn boxShadow">
                          <i className="fa-regular fa-heart"></i>
                        </button>
                      </Tooltip>
                    </div>
                  ) : ad?.wish === 1 ? (
                    <div
                      onClick={() => removeFromWishlist(ad?.post_id)}
                      className="ms-auto ad-share-btns position-relative"
                    >
                      <Tooltip
                        title="Added to Saved Ads"
                        arrow
                        placement="top"
                        TransitionComponent={Zoom}
                        enterDelay={40}
                        leaveDelay={200}
                      >
                        <div className="ms-auto ad-share-btns">
                          <button className="btn boxShadow">
                            <i className="fa-solid fa-heart"></i>
                          </button>
                        </div>
                      </Tooltip>
                    </div>
                  ) : null}
                </div>
                <div className="d-flex justify-content-end justify-content-md-between color-black">
                  <div className="d-md-flex align-items-center d-none">
                    <p className="pe-4 detailsFeature m-0">
                      {" "}
                      <i className="fa-solid fa-calendar-days"></i>{" "}
                      {ad?.year_name}{" "}
                    </p>
                    <p className="pe-4 detailsFeature m-0">
                      {" "}
                      <Image
                        width={500}
                        height={500}
                        className="vehicledDetail_icon"
                        src={Milage}
                        alt=""
                        srcSet=""
                      />{" "}
                      {ad?.mileage} Km
                    </p>
                  </div>
                  <div className="text-end ad_controls">
                    <Link
                      className="btn bgSecondary text-white ms-3 fw_br"
                      href={`/bike-details/${ad?.post_id}`}
                    >
                      View Ad
                    </Link>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))
      ) : (
        <div className="No_ads p-3 text-center">
          <p>no Available ads</p>
        </div>
      )}
    </>
  );
}
