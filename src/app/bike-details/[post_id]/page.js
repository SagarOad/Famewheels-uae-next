"use client";
import { useState, useEffect, useContext } from "react";
import PhoneIcon from "@mui/icons-material/Phone";
import LoginModal from "@/components/modals/loginModal/index.js";
import { Carousel } from "react-bootstrap";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Helmet } from "react-helmet";
import moment from "moment-timezone";
import LoadingModal from "@/components/modals/loading-modal.js";
import { AuthContext } from "@/context/AuthContext";
import { Alert, Snackbar, Tooltip } from "@mui/material";
import Zoom from "@mui/material/Zoom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { StageSpinner } from "react-spinners-kit";
import InspectedImage from "@/images/famewheels-inspected-icon.png";
import InspectedIcon from "@/images/inspection.svg";
import Avatar from "@/images/user-icon-3d.webp";
import DocumentIcon from "@/images/document.svg";
import TransactionIcon from "@/images/transaction.svg";
import CertifiedImage from "@/images/famewheels-certified-icon.png";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import BlueTick from "@/images/blue-tick-success.png";
import { format, parseISO } from "date-fns";
import Image from "next/image";
const FullPreview = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  bgcolor: "#00000000",
  p: 4,
  borderRadius: "10px",
  maxHeight: "95%",
  height: "100%",
  overflowY: "scroll",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const page = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const awsImageURL = process.env.NEXT_PUBLIC_AWS_IMAGE_URL;

  const { user } = useContext(AuthContext);

  const history = useRouter();
  const [featureView, setFeatureView] = useState(false);
  const [vehicleDetail, setVehicleDetails] = useState(null);
  const [vehicleFeatures, setVehicleFeatures] = useState(null);
  const [imagesPath, setImagesPath] = useState("");
  const [vehicleImages, setVehicleImages] = useState([]);
  const [postId, setPostId] = useState(null);
  const [open, setOpen] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [PostToken, setPostToken] = useState(null);
  const [inspectionToken, setInspectionToken] = useState(null);
  const [userDate, setUserDate] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [imageLoader, setImageLoader] = useState(true);
  const [severity, setSeverity] = useState("success");
  const [daysAgo, setDaysAgo] = useState(null);

  const handleBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
  };

  useEffect(() => {
    if (vehicleDetail?.user?.add_date) {
      const dateToFormat = parseISO(
        `${vehicleDetail && vehicleDetail?.user?.add_date}` || "0000-00-00"
      );

      const formattedDate = format(dateToFormat, "MMM dd, yyyy");
      setUserDate(formattedDate);
    }
  }, [vehicleDetail?.user?.add_date]);

  useEffect(() => {
    if (vehicleDetail?.added_date) {
      const givenDate = moment.tz(
        vehicleDetail.added_date,
        "YYYY-MM-DDTHH:mm:ss.SSSZ",
        "UTC"
      );

      const currentDate = moment();

      const days = currentDate.diff(givenDate, "days");

      setDaysAgo(days);
    }
  }, [vehicleDetail?.added_date]);

  const formatTimeAgo = () => {
    if (daysAgo !== null) {
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
    }
    return "";
  };

  useEffect(() => {
    const url = window.location.href;
    const postIdUrl = extractPostIdFromUrl(url);
    setPostId(postIdUrl);

    postId && fetchData(postId);
  }, [postId]);

  const fetchData = async (postId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/bikedetails`, {
        params: {
          post_id: postId,
          user_id: user?.id,
        },
      });

      setVehicleDetails(response?.data?.bikes);
      setFeatureView((response?.data?.bikes?.features).includes("true"));
      setVehicleFeatures(JSON.parse(response?.data?.bikes?.features));
      setPostToken(response?.data?.bikes?.post_token);
      setInspectionToken(response?.data?.bikes?.user?.iinitial_token);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      setImageLoader(true);
      try {
        const response = await axios.get(`${baseUrl}/bikepostimages`, {
          params: {
            post_id: PostToken,
          },
        });

        setVehicleImages(response.data?.images);
        setImagesPath(response?.data?.imagepath);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setImageLoader(false);
      }
    };
    if (PostToken) {
      fetchImages();
    }
  }, [PostToken]);

  const extractPostIdFromUrl = (url) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  const [isOpen, setIsOpen] = useState(false);

  const [showFullNumber, setShowFullNumber] = useState(false);
  const mobileNumber = vehicleDetail && vehicleDetail?.user?.phone;
  const LoginOpen = () => {
    setIsOpen(true);
  };

  const LoginClose = () => {
    setIsOpen(false);
  };

  const showNumber = () => {
    setShowFullNumber(!showFullNumber);
  };

  const [previewOpen, setPreviewOpen] = useState(false);
  const handlePreviewClose = () => setPreviewOpen(false);

  const handleImageClick = (index) => {
    setPreviewOpen(true);
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
      return price?.toLocaleString("en-US", { maximumFractionDigits: 2 });
    }
  };

  const addToWishlist = async () => {
    try {
      const url = window.location.href;
      const postId = extractPostIdFromUrl(url);
      const token = localStorage.getItem("token");

      await axios.get(`${baseUrl}/addToWishlist`, {
        params: {
          user_id: user?.id,
          post_id: postId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchData(postId);

      setStatusMsg("Added to saved ads");
      setOpen(true);
    } catch (error) {
      console.error("Error deleting post:", error);
      setSeverity("error");

      setStatusMsg("Network Error");
      setOpen(true);
    }
  };
  const removeFromWishlist = async () => {
    try {
      const url = window.location.href;
      const postId = extractPostIdFromUrl(url);
      const token = localStorage.getItem("token");

      await axios.get(`${baseUrl}/addToWishlist`, {
        params: {
          user_id: user?.id,
          post_id: postId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchData(postId);
      setStatusMsg("Remove from saved ads");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const openWhatsApp = () => {
    const whatsappUrl = `http://api.whatsapp.com/send?phone=${mobileNumber}&text=${encodeURIComponent(
      "Hi"
    )}`;
    window.open(whatsappUrl, "_blank");
  };
  const handleMoreAds = (id) => {
    history.push(`dealer/${id}`);
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
          severity={severity}
          sx={{ width: "100%" }}
        >
          {statusMsg}
        </Alert>
      </Snackbar>
      <Helmet>
        <title>
          {`${vehicleDetail?.bikemake_name} ${vehicleDetail?.bikemodel_name} ${vehicleDetail?.year_name} for sale in ${vehicleDetail?.city} | Famewheels `}{" "}
        </title>
        <meta name="description" content={vehicleDetail?.description} />
        <meta
          content={`${vehicleDetail?.bikemake_name} ${vehicleDetail?.bikemodel_name} ${vehicleDetail?.year_name} for sale in ${vehicleDetail?.city} | Famewheels `}
          property="og:title"
        />
        <meta property="og:description" content={vehicleDetail?.description} />
        <meta
          content={`${baseUrl}/public/posts/${vehicleDetail?.post_token}/${vehicleDetail?.cover}`}
          property="og:image"
        />
        <meta content={window.location.href} property="og:url" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${vehicleDetail?.bikemake_name} ${vehicleDetail?.bikemodel_name} ${vehicleDetail?.year_name} for sale in ${vehicleDetail?.city} | Famewheels `}
        />
        <meta name="twitter:description" content={vehicleDetail?.description} />
        <meta
          name="twitter:image"
          content={`${baseUrl}/public/posts/${vehicleDetail?.post_token}/${vehicleDetail?.cover}`}
        />

        <meta property="og:type" content="article" />
      </Helmet>

      <LoadingModal open={isLoading} onClose={() => setLoading(false)} />

      <div className=" colorBg_new d-none d-lg-block "></div>
      <div className="container pt-3 pb-5">
        {vehicleDetail && (
          <div className="row">
            <div className="col-lg-12  px-3 py-2" style={{ borderRadius: 10 }}>
              <div className="d-block d-lg-flex align-items-stretch justify-content-between">
                <div className="vehicleDetails_title pt-2 ">
                  <h4 className="m-0 p-0">
                    {vehicleDetail?.bikemake_name}{" "}
                    {vehicleDetail?.bikemodel_name}{" "}
                    {vehicleDetail?.feature_name}
                  </h4>

                  <div className="vehicleDetails_price pb-2 d-flex align-items-center justify-content-between ">
                    <div>
                      <strong>PKR {formatPrice(vehicleDetail?.price)} </strong>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-start mb-3 ">
                    <div className="vehicle_pills  card_bg px-3 py-2 rounded-3 me-3 ">
                      <h6>
                        <i className="fa-solid fa-location-dot me-2"></i>
                        {vehicleDetail?.city}
                      </h6>
                    </div>
                    <div className="vehicle_pills  card_bg px-3 py-2 rounded-3 me-3 ">
                      <h6>
                        <i class="fa-regular fa-calendar me-1 "></i>{" "}
                        {vehicleDetail?.year_name}
                      </h6>
                    </div>
                  </div>
                  <div>
                    {vehicleDetail?.post_type_id === 2 && (
                      <div className="managed_head bgSecondary vehicle_pills rounded-3 px-3 py-1 mb-1 mb-lg-3 ">
                        <h6 className="mb-0 color-white ">Featured</h6>
                      </div>
                    )}

                    {vehicleDetail?.post_type_id === 4 && (
                      <div className="managed_head bgSecondary vehicle_pills rounded-3 px-3 py-2 mb-3 ">
                        <h6 className="mb-0 color-white ">
                          Managed by FameWheels
                        </h6>
                      </div>
                    )}
                  </div>
                </div>

                <div className="d-flex flex-row-reverse flex-lg-column mb-2 mb-lg-0 justify-content-between align-items-end ">
                  <div className="d-flex align-items-center">
                    {inspectionToken !== 0 && (
                      <>
                        <Image
                          className="inspected_icon"
                          src={InspectedImage}
                          alt="Inspected Car"
                        />
                      </>
                    )}
                    {vehicleDetail?.post_type_id === 4 && (
                      <>
                        <Image
                          width={500}
                          height={500}
                          className="inspected_icon"
                          src={InspectedImage}
                          alt="Inspected Car"
                        />
                        <Image
                          width={500}
                          height={500}
                          className="inspected_icon"
                          src={CertifiedImage}
                          alt="Inspected Car"
                        />
                      </>
                    )}

                    {user ? (
                      <div className="vehicleDetails_price">
                        {vehicleDetail?.wish === 0 ? (
                          <div
                            onClick={() =>
                              addToWishlist(vehicleDetail?.post_id)
                            }
                            className="ms-auto ad-share-btns  position-relative"
                          >
                            <Tooltip
                              title="Save this Ad"
                              arrow
                              placement="top"
                              TransitionComponent={Zoom}
                              enterDelay={40}
                              leaveDelay={200}
                            >
                              <button className="btn card_bg">
                                <i className="fa-regular fa-heart"></i>
                              </button>
                            </Tooltip>
                          </div>
                        ) : vehicleDetail?.wish === 1 ? (
                          <div
                            onClick={() =>
                              removeFromWishlist(vehicleDetail?.post_id)
                            }
                            className="ms-auto ad-share-btns position-relative"
                          >
                            <Tooltip
                              title="Remove from Saved Ads"
                              arrow
                              placement="top"
                              TransitionComponent={Zoom}
                              enterDelay={40}
                              leaveDelay={200}
                            >
                              <div className="ms-auto ad-share-btns">
                                <button className="btn card_bg ">
                                  <i className="fa-solid fa-heart"></i>
                                </button>
                              </div>
                            </Tooltip>
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <div className="vehicleDetails_price">
                        <div
                          onClick={LoginOpen}
                          className="ms-auto ad-share-btns position-relative"
                        >
                          <Tooltip
                            title="Login to Save this Ad"
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
                      </div>
                    )}
                  </div>
                  <div>
                    {daysAgo !== null && (
                      <p className="mb-2 fw-600 font-lato vehiclePost_time ">
                        {formatTimeAgo()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="image-gallery">
                {vehicleImages && vehicleImages.length > 0 && (
                  <>
                    <div className="main-image">
                      <Image
                        width={500}
                        height={500}
                        className="d-block w-100 rounded-4"
                        src={`${awsImageURL}/public/bike_post/${vehicleDetail?.post_token}/${vehicleImages[0]?.image_name}`}
                        alt={`${vehicleDetail?.bikemake_name} ${vehicleDetail?.bikemodel_name} ${vehicleDetail?.year_name}`}
                        onClick={() => handleImageClick(0)}
                      />
                    </div>
                    <div className="side-images">
                      {vehicleImages.slice(1, 4).map((image, index) => (
                        <div
                          key={index + 1}
                          className="side-image"
                          onClick={() => handleImageClick(index + 1)}
                        >
                          <Image
                            width={500}
                            height={500}
                            className="d-block w-100 rounded-4"
                            src={`${awsImageURL}/public/bike_post/${vehicleDetail?.post_token}/${image?.image_name}`}
                            alt={`${vehicleDetail?.bikemake_name} ${vehicleDetail?.bikemodel_name} ${vehicleDetail?.year_name}`}
                          />
                        </div>
                      ))}
                      {vehicleImages.length > 5 && (
                        <div className="more-images">
                          <div
                            className="overlay"
                            onClick={() => handleImageClick(5)}
                          >
                            +{vehicleImages.length - 5}
                          </div>
                          <Image
                            width={500}
                            height={500}
                            className="d-block w-100 rounded-4"
                            src={`${awsImageURL}/public/bike_post/${vehicleDetail?.post_token}/${vehicleImages[5]?.image_name}`}
                            alt={`${vehicleDetail?.bikemake_name} ${vehicleDetail?.bikemodel_name} ${vehicleDetail?.year_name}`}
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="vehiclePhotos d-none ">
                {imageLoader && (
                  <div
                    className="d-flex w-100 justify-content-center align-items-center"
                    style={{ height: "350px" }}
                  >
                    <StageSpinner
                      size={50}
                      color="#b30000"
                      loading={imageLoader}
                    />
                  </div>
                )}

                <Modal
                  open={previewOpen}
                  onClose={handlePreviewClose}
                  disableAutoFocus={true}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                  className="VehiclePhotos_FullPreview VehiclePhotos_PreviewCarousel"
                >
                  <Box sx={FullPreview}>
                    <button
                      className="btn close_primary PreviewModal_CloseBtn"
                      onClick={handlePreviewClose}
                    >
                      <CloseIcon />
                    </button>
                    <Carousel interval={null}>
                      {vehicleImages &&
                        vehicleImages.map((image, index) => (
                          <Carousel.Item
                            key={index}
                            onClick={() => handleImageClick(index)}
                          >
                            <Image
                              width={500}
                              height={500}
                              className="d-block w-100 rounded-4"
                              src={`${imagesPath}${vehicleDetail?.post_token}/${image?.image_name}`}
                              alt={`${vehicleDetail?.bikemake_name} ${vehicleDetail?.bikemodel_name} ${vehicleDetail?.year_name}`}
                            />
                          </Carousel.Item>
                        ))}
                    </Carousel>
                  </Box>
                </Modal>
              </div>
            </div>

            <div className="col-lg-8 col-12 ">
              <div className="vehicle_description card_bg my-4 p-4 rounded-4">
                <div className="d-lg-flex w-100 justify-content-between align-items-start vehicle_key_features ">
                  <div>
                    <div className="d-flex justify-content-between my-1">
                      <strong>Registered In :</strong>
                      {vehicleDetail?.registered_in}
                    </div>
                  </div>
                  <div>
                    <div className="d-flex justify-content-between my-2">
                      <strong>Mileage(km):</strong>
                      {vehicleDetail?.mileage}
                    </div>
                  </div>
                  <div>
                    <div className="d-flex justify-content-between my-2">
                      <strong>Engine:</strong>
                      {vehicleDetail?.engine_type}
                    </div>
                  </div>
                </div>
                <h4 className="color-primary mb-3 fw-700">Seller’s notes</h4>
                <p>{vehicleDetail?.description}</p>
              </div>
              {featureView && (
                <div className="p-4 rounded-4 postAdForm card_bg vehicleDetails_info color-black text-capitalize pt-4">
                  <h4 className="color-primary mb-3 fw-800">Features</h4>

                  <div className="row mx-0 vehicle_car_features  ">
                    {vehicleFeatures?.antiTheftLock === "true" ? (
                      <div className="col-lg-2 col-4 mb-3 form-check md-radioStyle2">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="exampleCheck1"
                          readOnly
                          checked={vehicleFeatures?.antiTheftLock}
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          Anti Theft Lock
                        </label>
                      </div>
                    ) : null}
                    {vehicleFeatures?.diskBrake === "true" ? (
                      <div className="col-lg-2 col-4 mb-3 form-check md-radioStyle2">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="exampleCheck1"
                          readOnly
                          checked={vehicleFeatures?.diskBrake}
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          Disk Brake
                        </label>
                      </div>
                    ) : null}
                    {vehicleFeatures?.ledLight === "true" ? (
                      <div className="col-lg-2 col-4 mb-3 form-check md-radioStyle2">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="exampleCheck1"
                          readOnly
                          checked={vehicleFeatures?.ledLight}
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          LED Light
                        </label>
                      </div>
                    ) : null}
                    {vehicleFeatures?.windShield === "true" ? (
                      <div className="col-lg-2 col-4 mb-3 form-check md-radioStyle2">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="exampleCheck1"
                          readOnly
                          checked={vehicleFeatures?.windShield}
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          Wind Shield
                        </label>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>

            <div className="col-lg-4 col-12">
              <div className="mx-2 h-100 mt-4 ">
                <div style={{ position: "sticky", top: "150px", bottom: 0 }}>
                  {vehicleDetail?.post_type_id === 4 && (
                    <div
                      className="new-grad-bg  pt-3 px-2 mb-4"
                      style={{ borderRadius: 10 }}
                    >
                      <div className="row text-center align-items-top managed_sec m-0">
                        <h6>Buy Managed By FameWheels</h6>
                        <h6>Car with Trust</h6>
                        <div className="col-4">
                          <Image
                            width={500}
                            height={500}
                            src={InspectedIcon}
                            alt="Inspected By FameWheels"
                          />
                          <p>Inspected By FameWheels</p>
                        </div>
                        <div className="col-4">
                          <Image
                            width={500}
                            height={500}
                            src={DocumentIcon}
                            alt="Documents Checked"
                          />
                          <p>Documents Checked</p>
                        </div>
                        <div className="col-4">
                          <Image
                            width={500}
                            height={500}
                            src={TransactionIcon}
                            alt="Secure Transaction"
                          />
                          <p>Secure Transaction</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div
                    className="card_bg  p-3 my-4"
                    style={{ borderRadius: 10 }}
                  >
                    <div className="text-center align-items-top managed_sec m-0">
                      <h4 className="vehicleDetails_title fs-4 fw-800 pb-3 font-lato ">
                        Seller
                      </h4>

                      <div className="text-center user-info">
                        <div className="">
                          <Image
                            width={500}
                            height={500}
                            src={Avatar}
                            alt="avatar"
                          />
                        </div>
                        <div className="">
                          <div className=" d-flex justify-content-center ">
                            <h4 className=" text-capitalize font-lato fw-800">
                              M/s {vehicleDetail?.user?.name}
                            </h4>{" "}
                            {vehicleDetail?.user?.is_verified === 1 && (
                              <Tooltip
                                title="Verified User"
                                arrow
                                placement="top"
                                enterDelay={40}
                                leaveDelay={200}
                              >
                                <Image
                                  width={500}
                                  height={500}
                                  src={BlueTick}
                                  className="membertick"
                                  alt="Blue tick"
                                  srcSet=""
                                />
                              </Tooltip>
                            )}
                          </div>
                          <p>Member Since {userDate}</p>
                          {vehicleDetail?.user?.userpostcount > 1 && (
                            <>
                              {vehicleDetail?.user?.role_id === 6 && (
                                <h5
                                  className="more-ads text-capitalize "
                                  onClick={() =>
                                    handleMoreAds(vehicleDetail?.user?.id)
                                  }
                                >
                                  See Profile{" "}
                                  <i class="fa-solid fa-angle-right"></i>
                                </h5>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="d-flex justify-content-between mx-3 pt-3 ">
                        <div className="text-center d-flex justify-content-center align-items-center  mb-1 contactSellerBtn rounded-3  ">
                          {user && user ? (
                            <button
                              className="btn showNumber w-100"
                              onClick={showNumber}
                            >
                              {user && showFullNumber ? (
                                <div className="d-flex justify-content-center align-items-center">
                                  <span>
                                    <PhoneIcon sx={{ color: "#ffffff" }} />
                                  </span>
                                  <span className="text-start ps-2 fw-500 text-white ">
                                    {mobileNumber} <br />
                                  </span>
                                </div>
                              ) : (
                                <div className="d-flex justify-content-center align-items-center">
                                  <span>
                                    <PhoneIcon sx={{ color: "#ffffff" }} />
                                  </span>
                                  <span className="text-start ps-2 fw-500 text-white">
                                    {mobileNumber?.slice(0, 5)}******* <br />
                                  </span>
                                </div>
                              )}
                            </button>
                          ) : (
                            <button
                              className="btn showNumber color-white"
                              onClick={LoginOpen}
                            >
                              <div className="d-flex justify-content-center align-items-center">
                                <span>
                                  <PhoneIcon sx={{ color: "#ffffff" }} />
                                </span>
                                <span className="text-start ps-2 fw-500 text-white">
                                  {mobileNumber?.slice(0, 5)}******* <br />
                                </span>
                              </div>
                            </button>
                          )}

                          <LoginModal open={isOpen} onClose={LoginClose} />
                        </div>
                        <div className="text-center d-flex align-items-center justify-content-center  mb-1 contactSellerWhatsappBtn rounded-3  ">
                          {user && user ? (
                            <button className="btn showNumber w-100">
                              <div className="d-flex justify-content-center align-items-center">
                                <span>
                                  <WhatsAppIcon sx={{ color: "#ffffff" }} />
                                </span>
                                <a
                                  onClick={openWhatsApp}
                                  className="text-start ps-2 fw-500 text-white "
                                >
                                  Whatsapp
                                </a>
                              </div>
                            </button>
                          ) : (
                            <button
                              className="btn showNumber color-white"
                              onClick={LoginOpen}
                            >
                              <div className="d-flex justify-content-center align-items-center">
                                <span>
                                  <WhatsAppIcon sx={{ color: "#ffffff" }} />
                                </span>
                                <span className="text-start ps-2 fw-500 text-white">
                                  Whatsapp
                                </span>
                              </div>
                            </button>
                          )}

                          <LoginModal open={isOpen} onClose={LoginClose} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="card_bg border py-3 px-2 my-4"
                    style={{ borderRadius: 10 }}
                  >
                    <div className="row text-center align-items-top transaction-safety m-0">
                      <h4 className=" fs-6 fw-700 mt-3">
                        Tips for ensuring safety during transactions
                      </h4>

                      <div className="transaction-safety">
                        <ol>
                          <li>
                            Arrange to meet the seller in a secure location.
                          </li>
                          <li>Steer clear of cash transactions.</li>
                          <li>
                            Be cautious of offers that seem too good to be true.
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default page;
