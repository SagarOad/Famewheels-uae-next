"use client"
import React, { useEffect, useState } from "react";
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
import { MemberBanner, CarSuggest } from "@/components/banners/banner";
import moment from "moment-timezone";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AdsResult({ postData, featuredData, loading }) {

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
const awsImageURL = process.env.NEXT_PUBLIC_AWS_IMAGE_URL

  const { user } = React.useContext(AuthContext);

  const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [statusMsg, setStatusMsg] = React.useState("");

  const handleBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

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
      const response = await axios.get(`${baseUrl}/posts/condition`, {
        params: {
          condition: "used",
        },
      });
      const updatedWishlistData = response?.data?.data;

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
    history.push(`/vehicle-details/${post_id}`);
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

  const calculateDaysAgo = (dateString) => {
    const givenDate = moment.tz(dateString, "YYYY-MM-DDTHH:mm:ss.SSSZ", "UTC");
    const currentDate = moment();
    const daysAgo = currentDate.diff(givenDate, "days");

    if (daysAgo === 0) {
      return "Today";
    } else if (daysAgo < 30) {
      return `${daysAgo} Day${daysAgo > 1 ? "s" : ""} ago`;
    } else if (daysAgo < 365) {
      const months = Math.floor(daysAgo / 30);
      return `${months} Month${months > 1 ? "s" : ""} ago`;
    } else {
      const years = Math.floor(daysAgo / 365);
      return `${years} Year${years > 1 ? "s" : ""} ago`;
    }
  };

  const initiateCall = (event, phoneNumber) => {
    event.stopPropagation();
    event.preventDefault();
    window.location.href = `tel:${phoneNumber}`;
  };

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
      {loading ? (
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
      ) : featuredData && featuredData?.length ? (
        <>
          <div className="row">
            {firstFeatured &&
              firstFeatured.map((ad) => (
                <div className="col-lg-12 col-md-6 col-6 ">
                  <div className="myAd card_bg p-2 mb-3 mb-md-4">
                    <Link
                      href={`/vehicle-details/${ad?.post_id}`}
                      className="row"
                    >
                      <div
                        className="col-lg-3 Myads_photos cursorPointer"
                        key={ad?.post_id}
                      >
                        <div className="position-relative">
                          <img
                            src={`${awsImageURL}/public/posts/${ad?.post_token}/${ad?.cover}`}
                            alt={`${ad?.makeName} ${ad?.modelName} ${ad?.yearName}`}
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
                      <div className="col-lg-9 ps-lg-0">
                        <div className="d-flex searchWhite_bg flex-column justify-content-between h-100 bg-white px-3  ">
                          <div className=" flex-column d-md-flex flex-md-row align-items-top justify-content-between pt-2">
                            <div className="vehicleDetails text-capitalize">
                              <h4
                                key={ad.post_id}
                                onClick={() => openPost(ad.post_id)}
                                className=" cursorPointer "
                              >
                                {ad?.makeName} {ad?.modelName} {ad?.yearName}
                              </h4>
                              <h5 className="fw-600 color-secondary">
                                PKR: {formatPrice(ad.price)}{" "}
                              </h5>
                              <p className="postlocation mb-2 mb-md-3">
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
                            <p
                              style={{ color: "#212121", fontSize: 14 }}
                              className="mb-2"
                            >
                              {calculateDaysAgo(ad?.added_date)}
                            </p>
                          </div>
                          <div className="d-none d-lg-flex justify-content-end justify-content-lg-between color-black pb-2">
                            <div className="d-lg-flex align-items-center d-none">
                              <p className="card_bg px-2 py-1 detailsFeature rounded-3 me-3 mb-0">
                                {" "}
                                <img
                                  className="vehicledDetail_icon"
                                  src={Milage}
                                  alt=""
                                  srcSet=""
                                />{" "}
                                {ad?.milage} Km
                              </p>
                              <p className="card_bg px-2 py-1 detailsFeature rounded-3 me-3 mb-0">
                                {" "}
                                <i className="fa-solid fa-gas-pump"></i>{" "}
                                {ad?.vehicle_fuel}{" "}
                              </p>
                              {ad?.transmission &&
                              ad?.transmission === "Automatic" ? (
                                <p className="card_bg px-2 py-1 detailsFeature rounded-3 me-3 mb-0">
                                  <img
                                    className="vehicledDetail_icon"
                                    src={Automatic}
                                    alt=""
                                    srcSet=""
                                  />{" "}
                                  {ad?.transmission}{" "}
                                </p>
                              ) : ad?.transmission &&
                                ad?.transmission === "Manual" ? (
                                <p className="card_bg px-2 py-1 detailsFeature rounded-3 me-3 mb-0">
                                  <img
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
                              <button
                                className="btn bgSecondary text-white ms-3 "
                                type="button"
                                onClick={(event) =>
                                  initiateCall(event, ad?.phone)
                                }
                              >
                                <i className="fa-solid fa-phone me-2"></i>
                                Call
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
          </div>

          {firstFeatured?.length > 0 && <MemberBanner />}

          <div className="row">
            {secondFeatured &&
              secondFeatured.map((ad) => (
                <div className="col-lg-12 col-md-6 col-6 ">
                  <div className="myAd card_bg p-2 mb-3 mb-md-4">
                    <Link
                      href={`/vehicle-details/${ad?.post_id}`}
                      className="row"
                    >
                      <div
                        className="col-lg-3 Myads_photos cursorPointer"
                        key={ad?.post_id}
                      >
                        <div className="position-relative">
                          <img
                            src={`${awsImageURL}/public/posts/${ad?.post_token}/${ad?.cover}`}
                            alt={`${ad?.makeName} ${ad?.modelName} ${ad?.yearName}`}
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
                      <div className="col-lg-9 ps-lg-0">
                        <div className="d-flex searchWhite_bg flex-column justify-content-between h-100 bg-white px-3  ">
                          <div className=" flex-column d-md-flex flex-md-row align-items-top justify-content-between pt-2">
                            <div className="vehicleDetails text-capitalize">
                              <h4
                                key={ad.post_id}
                                onClick={() => openPost(ad.post_id)}
                                className=" cursorPointer "
                              >
                                {ad?.makeName} {ad?.modelName} {ad?.yearName}
                              </h4>
                              <h5 className="fw-600 color-secondary">
                                PKR: {formatPrice(ad.price)}{" "}
                              </h5>
                              <p className="postlocation mb-2 mb-md-3">
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
                            <p
                              style={{ color: "#212121", fontSize: 14 }}
                              className="mb-2"
                            >
                              {calculateDaysAgo(ad?.added_date)}
                            </p>
                          </div>
                          <div className="d-none d-lg-flex justify-content-end justify-content-lg-between color-black pb-2">
                            <div className="d-lg-flex align-items-center d-none">
                              <p className="card_bg px-2 py-1 detailsFeature rounded-3 me-3 mb-0">
                                {" "}
                                <img
                                  className="vehicledDetail_icon"
                                  src={Milage}
                                  alt=""
                                  srcSet=""
                                />{" "}
                                {ad?.milage} Km
                              </p>
                              <p className="card_bg px-2 py-1 detailsFeature rounded-3 me-3 mb-0">
                                {" "}
                                <i className="fa-solid fa-gas-pump"></i>{" "}
                                {ad?.vehicle_fuel}{" "}
                              </p>
                              {ad?.transmission &&
                              ad?.transmission === "Automatic" ? (
                                <p className="card_bg px-2 py-1 detailsFeature rounded-3 me-3 mb-0">
                                  <img
                                    className="vehicledDetail_icon"
                                    src={Automatic}
                                    alt=""
                                    srcSet=""
                                  />{" "}
                                  {ad?.transmission}{" "}
                                </p>
                              ) : ad?.transmission &&
                                ad?.transmission === "Manual" ? (
                                <p className="card_bg px-2 py-1 detailsFeature rounded-3 me-3 mb-0">
                                  <img
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
                              <button
                                className="btn bgSecondary text-white ms-3 "
                                type="button"
                                onClick={(event) =>
                                  initiateCall(event, ad?.phone)
                                }
                              >
                                <i className="fa-solid fa-phone me-2"></i>
                                Call
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
          </div>

          {secondFeatured?.length > 0 && <CarSuggest />}
        </>
      ) : (
        <MemberBanner />
      )}
      <div className="row">
        {loading ? (
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
        ) : postData && postData?.length ? (
          postData &&
          postData.map((ad) => (
            <div className="col-lg-12 col-md-6 col-6 ">
              <div className="myAd card_bg p-2 mb-3 mb-md-4">
                <Link href={`/vehicle-details/${ad?.post_id}`} className="row">
                  <div
                    className="col-lg-3 Myads_photos cursorPointer"
                    key={ad?.post_id}
                  >
                    <img
                      src={`${awsImageURL}/public/posts/${ad?.post_token}/${ad?.cover}`}
                      alt={`${ad?.makeName} ${ad?.modelName} ${ad?.yearName}`}
                      srcSet=""
                      key={ad.post_id}
                      onClick={() => openPost(ad.post_id)}
                    />
                  </div>
                  <div className="col-lg-9 ps-lg-0">
                    <div className="d-flex searchWhite_bg flex-column justify-content-between h-100 bg-white px-3  ">
                      <div className=" flex-column d-md-flex flex-md-row align-items-top justify-content-between pt-2">
                        <div className="vehicleDetails text-capitalize">
                          <h4
                            key={ad.post_id}
                            onClick={() => openPost(ad.post_id)}
                            className=" cursorPointer "
                          >
                            {ad?.makeName} {ad?.modelName} {ad?.yearName}
                          </h4>
                          <h5 className="fw-600 color-secondary">
                            PKR: {formatPrice(ad.price)}{" "}
                          </h5>
                          <p className="postlocation mb-2 mb-md-3">
                            <i className="fa-solid fa-location-dot me-2"></i>
                            {ad?.city_name}
                          </p>
                        </div>
                        <div>
                          <p
                            style={{ color: "#212121", fontSize: 14 }}
                            className="mb-2"
                          >
                            {calculateDaysAgo(ad?.added_date)}
                          </p>
                        </div>
                      </div>
                      <div className="d-none d-lg-flex justify-content-end justify-content-lg-between color-black pb-2">
                        <div className="d-lg-flex align-items-center d-none">
                          <p className=" card_bg px-2 py-1 detailsFeature rounded-3 me-3 mb-0">
                            {" "}
                            <img
                              className="vehicledDetail_icon"
                              src={Milage}
                              alt=""
                              srcSet=""
                            />{" "}
                            {ad?.milage} Km
                          </p>
                          <p className="card_bg px-2 py-1 detailsFeature rounded-3 me-3 mb-0">
                            {" "}
                            <i className="fa-solid fa-gas-pump"></i>{" "}
                            {ad?.vehicle_fuel}{" "}
                          </p>
                          {ad?.transmission &&
                          ad?.transmission === "Automatic" ? (
                            <p className="card_bg px-2 py-1 detailsFeature rounded-3 me-3 mb-0">
                              <img
                                className="vehicledDetail_icon"
                                src={Automatic}
                                alt=""
                                srcSet=""
                              />{" "}
                              {ad?.transmission}{" "}
                            </p>
                          ) : ad?.transmission &&
                            ad?.transmission === "Manual" ? (
                            <p className="card_bg px-2 py-1 detailsFeature rounded-3 me-3 mb-0">
                              <img
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
                          <button
                            className="btn bgSecondary text-white ms-3 "
                            type="button"
                            onClick={(event) => initiateCall(event, ad?.phone)}
                          >
                            <i className="fa-solid fa-phone me-2"></i>
                            Call
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="No_ads p-3 text-center">
            <p>no Available ads</p>
          </div>
        )}
      </div>
    </>
  );
}
