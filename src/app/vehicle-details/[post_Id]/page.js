"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import LoginModal from "@/components/loginModal";
import NumberLogin from "@/components/modals/loginModal/number";
import PhoneIcon from "@mui/icons-material/Phone";
import Zoom from "@mui/material/Zoom";
import { StageSpinner } from "react-spinners-kit";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import { Carousel } from "react-bootstrap";

import InspectedImage from "@/images/famewheels-inspected-icon.png";
import InspectedIcon from "@/images/inspection.svg";
import Avatar from "@/images/user-profile.png";
import DocumentIcon from "@/images/document.svg";
import TransactionIcon from "@/images/transaction.svg";
import CertifiedImage from "@/images/famewheels-certified-icon.png";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import BlueTick from "@/images/blue-tick-success.png";
import InspectionTemp from "@/images/report-temp.png";
import { format, parseISO } from "date-fns";
import { Alert, Snackbar, Tooltip } from "@mui/material";
import moment from "moment-timezone";
import LoadingModal from "@/components/modals/loading-modal";

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

const settings = {
  dots: true,
  speed: 1000,
  slidesToShow: 5,
  infinite: false,
  slidesToScroll: 1,
  autoplay: false,
  autoplaySpeed: 2000,
  arrows: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 2,
        initialSlide: 1,
        arrows: false,
      },
    },
  ],
};

const VehicleDetails = ({ params }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const awsImageURL = process.env.NEXT_PUBLIC_AWS_IMAGE_URL;

  const history = useRouter();

  const { post_Id } = params;
  const { user } = useContext(AuthContext);
  const [vehicleDetail, setVehicleDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [PostToken, setPostToken] = useState(null);
  const [inspectionToken, setInspectionToken] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [daysAgo, setDaysAgo] = useState(null);
  const [vehicleImages, setVehicleImages] = useState([]);
  const [imageLoader, setImageLoader] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [vehicleFeatures, setVehicleFeatures] = useState(null);
  const [userDate, setUserDate] = useState("");
  const [imagesPath, setImagesPath] = useState("");
  const [CarData, setCarData] = useState([]);
  const [relatedLoader, setRelatedLoader] = useState(true);


  const [showFullNumber, setShowFullNumber] = useState(false);
  const mobileNumber = vehicleDetail && vehicleDetail?.phone;

  const handlePreviewClose = () => setPreviewOpen(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/vehicle-details`, {
        params: {
          post_id: post_Id,
          user_id: user?.id,
        },
      });
      setVehicleDetail(response.data);
      setVehicleFeatures(JSON.parse(response?.data?.car_features));
      setPostToken(response?.data?.post_token);
      setInspectionToken(response?.data?.user?.iinitial_token);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (post_Id) {
      fetchData(); // Fetch data when post_Id is available
      console.log("Fetching data for post_Id:", post_Id);
    } else {
      console.error("post_Id is undefined");
    }
  }, [post_Id]);

  useEffect(() => {
    const fetchImages = async () => {
      setImageLoader(true);
      try {
        const response = await axios.get(`${baseUrl}/postimages`, {
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

  useEffect(() => {
    const fetchRelatedData = async () => {
      console.log(
        vehicleDetail,
        "vehicle detail testing in related post useEffect"
      );
      setRelatedLoader(true);
      try {
        const response = await axios.get(`${baseUrl}/relatedposts`, {
          params: {
            makeName: vehicleDetail.makeName,
            modelName: vehicleDetail.modelName,
            yearName: vehicleDetail.yearName,
            post_id: post_Id,
          },
        });

        console.log("API Response:", response.data);
        setCarData(response?.data);
      } catch (error) {
        console.error("Error fetching related data:", error);
      } finally {
        setRelatedLoader(false);
      }
    };

    fetchRelatedData();
  }, [vehicleDetail, post_Id]);

  const openPost = (postId) => {
    history.push(`/vehicle-details/${postId}`);
  };

  const ViewInspection = () => {
    window.open(
      `https://inspectionreport.famewheels.com/inspection-report/${inspectionToken}`
    );
  };
  const openWhatsApp = () => {
    const whatsappUrl = `http://api.whatsapp.com/send?phone=${mobileNumber}&text=${encodeURIComponent(
      "Hi"
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleMoreAds = (id) => {
    if (vehicleDetail?.user?.role_id == 6) {
      history.push(`/dealer/${id}`);
    }
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

  const LoginOpen = () => {
    setIsOpen(true);
  };

  const LoginClose = () => {
    setIsOpen(false);
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

  useEffect(() => {
    if (vehicleDetail?.user?.add_date) {
      const dateToFormat = parseISO(
        `${vehicleDetail && vehicleDetail?.user?.add_date}` || "0000-00-00"
      );

      const formattedDate = format(dateToFormat, "MMM dd, yyyy");
      setUserDate(formattedDate);
    }
  }, [vehicleDetail?.user?.add_date]);

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

  // if (loading) {
  //   return <LoadingModal open={loading} onClose={() => setLoading(false)} />;
  // }

  return (
    <>
      <div className=" colorBg_new d-none d-lg-block "></div>

      <div className="container pt-3 pb-5">
        {vehicleDetail ? (
          <div className="row">
            <div className="col-lg-12  px-3 py-2" style={{ borderRadius: 10 }}>
              <div className="d-block d-lg-flex align-items-stretch justify-content-between">
                <div className="vehicleDetails_title pt-2 ">
                  <h4 className="m-0 p-0">
                    {vehicleDetail?.makeName} {vehicleDetail?.modelName}{" "}
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
                        {vehicleDetail?.city_name}
                      </h6>
                    </div>
                    <div className="vehicle_pills  card_bg px-3 py-2 rounded-3 me-3 ">
                      <h6>
                        <i class="fa-regular fa-calendar me-1 "></i>{" "}
                        {vehicleDetail?.yearName}
                      </h6>
                    </div>
                    <div className="vehicle_pills  card_bg px-3 py-2 rounded-3 me-3 ">
                      <h6>
                        <i class="fa-solid fa-car-side me-1 "></i>{" "}
                        {vehicleDetail?.vehicle_condition}
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
                        <img
                          className="inspected_icon"
                          src={InspectedImage}
                          alt="Inspected Car"
                        />
                      </>
                    )}
                    {vehicleDetail?.post_type_id === 4 && (
                      <>
                        <img
                          className="inspected_icon"
                          src={InspectedImage}
                          alt="Inspected Car"
                        />
                        <img
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
                      <img
                        className="d-block w-100 rounded-4"
                        src={`${imagesPath}/${vehicleDetail?.post_token}/${vehicleImages[0]?.filename}`}
                        alt={`${vehicleDetail?.makeName} ${vehicleDetail?.modelName} ${vehicleDetail?.yearName}`}
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
                          <img
                            className="d-block w-100 rounded-4"
                            src={`${imagesPath}/${vehicleDetail?.post_token}/${image?.filename}`}
                            alt={`${vehicleDetail?.makeName} ${vehicleDetail?.modelName} ${vehicleDetail?.yearName}`}
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
                          <img
                            className="d-block w-100 rounded-4"
                            src={`${imagesPath}/${vehicleDetail?.post_token}/${vehicleImages[5]?.filename}`}
                            alt={`${vehicleDetail?.makeName} ${vehicleDetail?.modelName} ${vehicleDetail?.yearName}`}
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

                <div className="d-flex gap-1"></div>

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
                            <img
                              className="d-block w-100 rounded-4"
                              src={`${imagesPath}/${vehicleDetail?.post_token}/${image?.filename}`}
                              alt={`${vehicleDetail?.makeName} ${vehicleDetail?.modelName} ${vehicleDetail?.yearName}`}
                            />
                          </Carousel.Item>
                        ))}
                    </Carousel>
                  </Box>
                </Modal>
              </div>
            </div>

            <div className="col-lg-8 col-12 ">
              <div style={{}}>
                <div className="vehicle_description card_bg my-4 p-4 rounded-4">
                  <div className="d-lg-flex w-100 justify-content-between align-items-start vehicle_key_features ">
                    <div>
                      <div className="d-flex justify-content-between my-1">
                        <strong>Registered In :</strong>
                        {vehicleDetail?.registered_in}
                      </div>
                      {vehicleDetail?.registered_in !== "unregistered" && (
                        <div className="d-flex justify-content-between my-1">
                          <strong>Registration Year :</strong>
                          {vehicleDetail?.registration_year}
                        </div>
                      )}

                      <div className="d-flex justify-content-between my-2">
                        <strong>Assembly :</strong>
                        {vehicleDetail?.assembly}
                      </div>
                    </div>
                    <div>
                      {vehicleDetail?.assembly !== "Local" &&
                        vehicleDetail?.assembly !== "LOCAL" && (
                          <div className="d-flex justify-content-between my-2">
                            <strong>Import Year</strong>
                            {vehicleDetail?.import_year}
                          </div>
                        )}
                      <div className="d-flex justify-content-between my-2">
                        <strong>Engine Capacity(cc):</strong>
                        {vehicleDetail?.engine_capacity}
                      </div>
                      <div className="d-flex justify-content-between my-2">
                        <strong>Mileage(km):</strong>
                        {vehicleDetail?.milage}
                      </div>
                    </div>
                    <div>
                      <div className="d-flex justify-content-between my-2">
                        <strong>Fuel:</strong>
                        {vehicleDetail?.vehicle_fuel}
                      </div>
                      <div className="d-flex justify-content-between my-2">
                        <strong>Transmission</strong>
                        {vehicleDetail?.transmission}
                      </div>
                      <div className="d-flex justify-content-between my-2">
                        <strong>Color :</strong>
                        {vehicleDetail?.vehicle_colour}
                      </div>
                    </div>
                  </div>
                  <h4 className=" fs-5 color-primary mb-3 fw-700">
                    Seller’s notes about this car
                  </h4>
                  <p>{vehicleDetail?.description}</p>
                </div>
                <div className="p-4 rounded-4 postAdForm card_bg vehicleDetails_info color-black text-capitalize pt-4">
                  <h4 className=" fs-5 color-primary mb-3 fw-800">
                    Car Features
                  </h4>
                  <div className="row mx-0 vehicle_car_features  ">
                    {vehicleFeatures?.abs === "true" ? (
                      <div className="col-lg-2 col-4 mb-3 form-check md-radioStyle2">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="exampleCheck1"
                          readOnly
                          checked={vehicleFeatures?.abs}
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          ABS
                        </label>
                      </div>
                    ) : null}
                    {vehicleFeatures?.air_bags === "true" ? (
                      <div className="col-lg-2 col-4 mb-3 form-check md-radioStyle2">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="exampleCheck1"
                          readOnly
                          checked={vehicleFeatures?.air_bags}
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          Air Bags
                        </label>
                      </div>
                    ) : null}
                    {vehicleFeatures?.air_conditioning === "true" ? (
                      <div className="col-lg-2 col-4 mb-3 form-check md-radioStyle2">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="exampleCheck1"
                          readOnly
                          checked={vehicleFeatures?.air_conditioning}
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          AC
                        </label>
                      </div>
                    ) : null}
                    {vehicleFeatures?.alloy_rims === "true" ? (
                      <div className="col-lg-2 col-4 mb-3 form-check md-radioStyle2">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="exampleCheck1"
                          readOnly
                          checked={vehicleFeatures?.alloy_rims}
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          Alloy Rims
                        </label>
                      </div>
                    ) : null}
                    {vehicleFeatures?.am_fm_radio === "true" ? (
                      <div className="col-lg-2 col-4 mb-3 form-check md-radioStyle2">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="exampleCheck1"
                          readOnly
                          checked={vehicleFeatures?.am_fm_radio}
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          FM Radio
                        </label>
                      </div>
                    ) : null}
                    {vehicleFeatures?.cassette_player === "true" ? (
                      <div className="col-lg-2 col-4 mb-3 form-check md-radioStyle2">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="exampleCheck1"
                          readOnly
                          checked={vehicleFeatures?.cassette_player}
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          Cassette Player
                        </label>
                      </div>
                    ) : null}
                    {vehicleFeatures?.cd_player === "true" ? (
                      <div className="col-lg-2 col-4 mb-3 form-check md-radioStyle2">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="exampleCheck1"
                          readOnly
                          checked={vehicleFeatures?.cd_player}
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          CD Player
                        </label>
                      </div>
                    ) : null}
                    {vehicleFeatures?.dvd_player === "true" ? (
                      <div className="col-lg-2 col-4 mb-3 form-check md-radioStyle2">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="exampleCheck1"
                          readOnly
                          checked={vehicleFeatures?.dvd_player}
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          DVD Player
                        </label>
                      </div>
                    ) : null}
                    {vehicleFeatures?.climate_control === "true" ? (
                      <div className="col-lg-2 col-4 mb-3 form-check md-radioStyle2">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="exampleCheck1"
                          readOnly
                          checked={vehicleFeatures?.climate_control}
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          Climate Control
                        </label>
                      </div>
                    ) : null}
                    {vehicleFeatures?.front_camera === "true" ? (
                      <div className="col-lg-2 col-4 mb-3 form-check md-radioStyle2">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="exampleCheck1"
                          readOnly
                          checked={vehicleFeatures?.front_camera}
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          Front Camera
                        </label>
                      </div>
                    ) : null}
                    {vehicleFeatures?.front_speaker === "true" ? (
                      <div className="col-lg-2 col-4 mb-3 form-check md-radioStyle2">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="exampleCheck1"
                          readOnly
                          checked={vehicleFeatures?.front_speakers}
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          Front Speakers
                        </label>
                      </div>
                    ) : null}
                    {vehicleFeatures?.heated_seats === "true" ? (
                      <div className="col-lg-2 col-4 mb-3 form-check md-radioStyle2">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="exampleCheck1"
                          readOnly
                          checked={vehicleFeatures?.heated_seats}
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          Heated Seats
                        </label>
                      </div>
                    ) : null}
                    {vehicleFeatures?.immobilizer_key === "true" ? (
                      <div className="col-lg-2 col-4 mb-3 form-check md-radioStyle2">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="exampleCheck1"
                          readOnly
                          checked={vehicleFeatures?.immobilizer_key}
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          Immobilizer Key
                        </label>
                      </div>
                    ) : null}
                    {vehicleFeatures?.keyless_entry === "true" ? (
                      <div className="col-lg-2 col-4 mb-3 form-check md-radioStyle2">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="exampleCheck1"
                          readOnly
                          checked={vehicleFeatures?.keyless_entry}
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          Keyless Entry
                        </label>
                      </div>
                    ) : null}
                    {vehicleFeatures?.navigation_system === "true" ? (
                      <div className="col-lg-2 col-4 mb-3 form-check md-radioStyle2">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="exampleCheck1"
                          readOnly
                          checked={vehicleFeatures?.navigation_system}
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          Navigation System
                        </label>
                      </div>
                    ) : null}
                    {vehicleFeatures?.power_locks === "true" ? (
                      <div className="col-lg-2 col-4 mb-3 form-check md-radioStyle2">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="exampleCheck1"
                          readOnly
                          checked={vehicleFeatures?.power_locks}
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          Power Locks
                        </label>
                      </div>
                    ) : null}
                    {vehicleFeatures?.power_mirrors === "true" ? (
                      <div className="col-lg-2 col-4 mb-3 form-check md-radioStyle2">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="exampleCheck1"
                          readOnly
                          checked={vehicleFeatures?.power_mirrors}
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          Power Mirrors
                        </label>
                      </div>
                    ) : null}
                    {vehicleFeatures?.power_steering === "true" ? (
                      <div className="col-lg-2 col-4 mb-3 form-check md-radioStyle2">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="exampleCheck1"
                          readOnly
                          checked={vehicleFeatures?.power_steering}
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          Power Steering
                        </label>
                      </div>
                    ) : null}
                    {vehicleFeatures?.power_windows === "true" ? (
                      <div className="col-lg-2 col-4 mb-3 form-check md-radioStyle2">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="exampleCheck1"
                          readOnly
                          checked={vehicleFeatures?.power_windows}
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          Power Window
                        </label>
                      </div>
                    ) : null}
                    {vehicleFeatures?.rear_ac_vents === "true" ? (
                      <div className="col-lg-2 col-4 mb-3 form-check md-radioStyle2">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="exampleCheck1"
                          readOnly
                          checked={vehicleFeatures?.rear_ac_vents}
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          Rear AC Vents
                        </label>
                      </div>
                    ) : null}
                    {vehicleFeatures?.rear_camera === "true" ? (
                      <div className="col-lg-2 col-4 mb-3 form-check md-radioStyle2">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="exampleCheck1"
                          readOnly
                          checked={vehicleFeatures?.rear_camera}
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          Rear Camera
                        </label>
                      </div>
                    ) : null}
                    {vehicleFeatures?.rear_seat_entertainment === "true" ? (
                      <div className="col-lg-2 col-4 mb-3 form-check md-radioStyle2">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="exampleCheck1"
                          readOnly
                          checked={vehicleFeatures?.rear_seat_entertainment}
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          Rear Seat Entertainment
                        </label>
                      </div>
                    ) : null}
                    {vehicleFeatures?.rear_speakers === "true" ? (
                      <div className="col-lg-2 col-4 mb-3 form-check md-radioStyle2">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="exampleCheck1"
                          readOnly
                          checked={vehicleFeatures?.rear_speakers}
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          Rear Speakers
                        </label>
                      </div>
                    ) : null}
                    {vehicleFeatures?.steering_switches === "true" ? (
                      <div className="col-lg-2 col-4 mb-3 form-check md-radioStyle2">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="exampleCheck1"
                          readOnly
                          checked={vehicleFeatures?.steering_switches}
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          Steering Switches
                        </label>
                      </div>
                    ) : null}
                    {vehicleFeatures?.sun_roof === "true" ? (
                      <div className="col-lg-2 col-4 mb-3 form-check md-radioStyle2">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="exampleCheck1"
                          readOnly
                          checked={vehicleFeatures?.sun_roof}
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          Sun Roof
                        </label>
                      </div>
                    ) : null}
                    {vehicleFeatures?.usb_and_auxillary_cable === "true" ? (
                      <div className="col-lg-2 col-4 mb-3 form-check md-radioStyle2">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="exampleCheck1"
                          readOnly
                          checked={vehicleFeatures?.usb_and_auxillary_cable}
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          USB and Auxillary Cable
                        </label>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
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
                          <img
                            src={InspectedIcon}
                            alt="Inspected By FameWheels"
                          />
                          <p>Inspected By FameWheels</p>
                        </div>
                        <div className="col-4">
                          <img src={DocumentIcon} alt="Documents Checked" />
                          <p>Documents Checked</p>
                        </div>
                        <div className="col-4">
                          <img src={TransactionIcon} alt="Secure Transaction" />
                          <p>Secure Transaction</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    {inspectionToken !== 0 ? (
                      <>
                        <div className="mb-4 ">
                          <img
                            src={InspectionTemp}
                            alt="Car inspection"
                            srcSet={InspectionTemp}
                            className=" img-fluid reportTemp "
                          />
                          <button
                            className="btn bgSecondary text-white w-100 fw_br"
                            onClick={ViewInspection}
                          >
                            <div className="d-flex justify-content-center align-items-center  ">
                              <span className="text-start ps-2 fs-6 fw-500 text-white">
                                View Inspection Report
                              </span>
                            </div>
                          </button>
                        </div>
                      </>
                    ) : null}
                  </div>
                  <div
                    className="card_bg  p-3 my-4"
                    style={{ borderRadius: 10 }}
                  >
                    <div className="text-center align-items-top managed_sec m-0">
                      <h4 className="vehicleDetails_title fs-5 fw-800 pb-3 font-lato ">
                        About Seller
                      </h4>

                      <div className="text-center user-info">
                        <div
                          style={{ width: "fit-content", margin: "auto" }}
                          className="rounded-circle "
                        >
                          <img src={Avatar} alt="avatar" />
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
                                <img
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
                            <h5
                              className="more-ads text-capitalize "
                              onClick={() =>
                                handleMoreAds(
                                  vehicleDetail?.user?.role_id == 6
                                    ? vehicleDetail?.user?.dealer_id
                                    : vehicleDetail?.user?.id
                                )
                              }
                            >
                              See Profile{" "}
                              <i class="fa-solid fa-angle-right"></i>
                            </h5>
                          )}
                        </div>
                      </div>
                      <div className="d-flex justify-content-center gap-3  pt-3 ">
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
            <div className="col-lg-12"></div>
          </div>
        ) : (
          <p>No vehicle details found.</p>
        )}

        <div className="my-4">
          {vehicleDetail && (
            <>
              <div className="vehicleDetails_title pt-2">
                <h4>Similar cars</h4>
              </div>

              {relatedLoader && (
                <div className="d-flex w-100 justify-content-center align-items-center">
                  <StageSpinner
                    size={50}
                    color="#b30000"
                    loading={relatedLoader}
                  />
                </div>
              )}

              <div>
                <Slider {...settings}>
                  {CarData?.map((item, index) => (
                    <div className="col-lg-2 col-6 mb-3 p-2" key={item?.postId}>
                      <div className="adPost text-start">
                        <div className="position-relative">
                          <img
                            onClick={() => openPost(item?.postId)}
                            src={`${awsImageURL}/public/posts/${item?.post_token}/${item?.cover}`}
                            alt={`${item?.makeName} ${item?.modelName} ${item?.yearName}`}
                            className="p-2"
                          />
                          <div
                            className="d-flex align-items-center justify-content-end position-absolute top-0"
                            style={{ right: 0 }}
                          >
                            {item?.wish === 0 ? (
                              <div
                                onClick={() => addToWishlist(item.postId)}
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
                                  <button className="btn boxShadow card_bg rounded-circle">
                                    <i className="fa-regular fa-heart"></i>
                                  </button>
                                </Tooltip>
                              </div>
                            ) : (
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
                            )}
                          </div>
                        </div>

                        <div className="pb-2 px-2">
                          <div className=" bg-white p-2 rounded-2  ">
                            <h5 className="fw-600 ad-Title color-black text-capitalize mb-1">
                              {item?.makeName} {item?.modelName}{" "}
                              {item?.yearName}
                            </h5>
                            <h4 className="fw-600 adPrice mb-1">
                              <span>RS {formatPrice(item?.price)}</span>
                            </h4>
                            <p className="adlocation m-0 fw-500">
                              <i className="fa-solid fa-location-dot me-2 color-secondary"></i>
                              {item?.cityName}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default VehicleDetails;
