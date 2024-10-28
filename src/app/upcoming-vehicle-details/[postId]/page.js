"use client"
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { Carousel } from "react-bootstrap";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { Helmet } from "react-helmet";
import { AuthContext } from "@/context/AuthContext";
import ReportDumy from "@/images/report-dumy.png";

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

export default function UpcomingDeatils() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const { user } = useContext(AuthContext);

  const history = useRouter();
  const [details, setDetails] = useState(null);
  const [postDetails, setPostDetails] = useState(null);
  const [imagesPath, setImagesPath] = useState("");
  const [vehicleImages, setVehicleImages] = useState(null);
  const [hours, setHours] = useState();
  const [minutes, setMinutes] = useState();
  const [seconds, setSeconds] = useState();
  const [vehicleFeatures, setVehicleFeatures] = useState(null);

  const handleReport = () => {
    window.open(
      `https://inspectionreport.famewheels.com/inspection-report/${details?.iinitial_token}`,
      "_blank"
    );
  };

  const [time, setTime] = useState({
    hours: 0,
    minutes: minutes | 15,
    seconds: seconds | 0,
  });

  const extractPostIdFromUrl = (url) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  const url = window.location.href;
  const postId = extractPostIdFromUrl(url);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/auctionpostdetail`, {
        params: {
          post_id: postId,
          userId: user?.id || 0,
        },
      });

      setDetails(response?.data?.data);
      setPostDetails(response?.data?.postDetail);
      setVehicleFeatures(JSON.parse(response?.data?.postDetail?.car_features));

      const [hoursStr, minutesStr, secondsStr] =
        response?.data?.auctionStartTime.split(":");
      setTime({
        hours: 0,
        minutes: parseInt(minutesStr, 10),
        seconds: parseInt(secondsStr, 10),
      });
      setHours(parseInt(hoursStr, 10));
      setMinutes(parseInt(minutesStr, 10));
      setSeconds(parseInt(secondsStr, 10));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${baseUrl}/postimages`, {
          params: {
            post_id: postDetails?.post_token,
          },
        });

        setVehicleImages(response?.data?.images);
        setImagesPath(response?.data?.imagepath);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (postDetails?.post_token) {
      fetchImages();
    }
  }, [postDetails?.post_token]);


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

  const limitedImages = vehicleImages && vehicleImages.slice(0, 7);
  useEffect(() => {
    const totalSeconds = time.hours * 3600 + time.minutes * 60 + time.seconds;

    if (totalSeconds > 0) {
      const interval = setInterval(() => {
        setTime((prevTime) => {
          const seconds = prevTime.seconds - 1;

          if (seconds < 0) {
            const minutes = prevTime.minutes - 1;

            if (minutes < 0) {
              const hours = prevTime.hours - 1;

              if (hours < 0) {
                clearInterval(interval);
                return prevTime;
              }

              return {
                hours,
                minutes: 59,
                seconds: 59,
              };
            }

            return {
              hours: prevTime.hours,
              minutes,
              seconds: 59,
            };
          }

          return {
            hours: prevTime.hours,
            minutes: prevTime.minutes,
            seconds,
          };
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      // history.push("/bidding");
    }
  }, [history, time]);

  useEffect(() => {
    const intervalId = setInterval(fetchData, 1000); // Call API every 10 seconds

    return () => {
      clearInterval(intervalId); // Clear interval when component unmounts
    };
  }, []);

  const calculateRemainingTime = (start, date, serverDate, serverTime) => {
    if (start && date && serverDate && serverTime) {
      // Parse the server date and time
      const serverDateTime = new Date(`${serverDate}T${serverTime}Z`);

      // Parse the auction start date and time
      const auctionStartTimeParts = start.split(":");
      const auctionStartDateTime = new Date(
        `${date}T${auctionStartTimeParts[0]}:${auctionStartTimeParts[1]}:${auctionStartTimeParts[2]}Z`
      );

      if (serverDateTime < auctionStartDateTime) {
        const timeDiff = auctionStartDateTime - serverDateTime;
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        let remainingTime = "";

        if (days > 0) {
          remainingTime += `${days}d${days > 1 ? "" : ""} `;
        }
        if (hours > 0) {
          remainingTime += `${hours}h${hours > 1 ? "" : ""} `;
        }
        if (minutes > 0) {
          remainingTime += `${minutes}m${minutes > 1 ? "" : ""} `;
        }
        if (seconds > 0) {
          remainingTime += `${seconds}s${seconds > 1 ? "" : ""}`;
        }

        return `${remainingTime}`;
      } else {
        return "Bidding has already started or server date/time is incorrect";
      }
    } else {
      return "Something wrong";
    }
  };

  return (
    <>
      <Helmet>
        <title>{`  ${postDetails?.makeName} ${postDetails?.modelName} ${postDetails?.yearName} | FameWheels`}</title>
        <meta name="description" content={postDetails?.description} />
        {/* Open Graph (Facebook) */}
        <meta
          property="og:title"
          content={`${postDetails?.makeName} ${postDetails?.modelName} ${postDetails?.yearName}`}
        />
        <meta property="og:description" content={postDetails?.description} />
        <meta
          property="og:image"
          content={`${baseUrl}/public/posts/${postDetails?.post_token}/${postDetails?.cover}`}
        />
        <meta property="og:url" content={window.location.href} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${postDetails?.makeName} ${postDetails?.modelName} ${postDetails?.yearName}`}
        />
        <meta name="twitter:description" content={postDetails?.description} />
        <meta
          name="twitter:image"
          content={`${baseUrl}/public/posts/${postDetails?.post_token}/${postDetails?.cover}`}
        />

        {/* WhatsApp */}
        <meta property="og:type" content="article" />
      </Helmet>

      <div className=" colorBg_new d-none d-lg-block "></div>
      <div className="container pt-3 pb-5">
        <div className="row">
          <div className="col-lg-12 px-3 py-2" style={{ borderRadius: 10 }}>
            <div className="d-block d-lg-flex align-items-stretch justify-content-between">
              <div>
                <div className="vehicleDetails_title text-capitalize">
                  <h4>
                    {" "}
                    {postDetails?.makeName} {postDetails?.modelName}{" "}
                    {postDetails?.yearName}{" "}
                  </h4>

                  <div className="vehicle_pills  card_bg px-3 py-2 rounded-3 me-3 ">
                    <h6>
                      <i class="fa-solid fa-car-side me-1 "></i>{" "}
                      {postDetails?.transmission}
                    </h6>
                  </div>
                  <div className="vehicle_pills  card_bg px-3 py-2 rounded-3 me-3 ">
                    <h6>
                      <i class="fa-solid fa-gas-pump me-1 "></i>{" "}
                      {postDetails?.vehicle_fuel}
                    </h6>
                  </div>
                  <div className="vehicle_pills  card_bg px-3 py-2 rounded-3 me-3 ">
                    <h6>
                      <i class="fa-solid fa-arrow-up-right-dots me-1 "></i>{" "}
                      {postDetails?.milage} KM
                    </h6>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-row-reverse flex-lg-column mb-2 mb-lg-0 justify-content-end ">
                <div
                  style={{ minWidth: 160, maxWidth: 500, width: "auto" }}
                  className="bg-dark mb-3 px-2 px-md-3 py-2  rounded-3 "
                >
                  <h6 className="text-white mb-0 fw-700">
                    <span className="opacity-75 fs-6 fw-500">
                      <i class="fa-regular fa-clock me-2 "></i>Bidding starts in
                    </span>{" "}
                    {calculateRemainingTime(
                      details?.auction_start_time,
                      details?.auction_date,
                      details?.serverdate,
                      details?.servertime
                    )}
                  </h6>
                </div>
              </div>
            </div>

            <div className="image-gallery">
              {vehicleImages && vehicleImages.length > 0 && (
                <>
                  <div className="main-image">
                    <img
                      className="d-block w-100 rounded-4"
                      src={`${imagesPath}/${postDetails?.post_token}/${vehicleImages[0]?.filename}`}
                      alt={`${postDetails?.makeName} ${postDetails?.modelName} ${postDetails?.yearName}`}
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
                          src={`${imagesPath}/${postDetails?.post_token}/${image?.filename}`}
                          alt={`${postDetails?.makeName} ${postDetails?.modelName} ${postDetails?.yearName}`}
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
                          src={`${imagesPath}/${postDetails?.post_token}/${vehicleImages[5]?.filename}`}
                          alt={`${postDetails?.makeName} ${postDetails?.modelName} ${postDetails?.yearName}`}
                        />
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="vehiclePhotos">
          
              {/* preview modal */}
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
                            className="d-block w-100"
                            src={`${imagesPath}/${postDetails?.post_token}/${image?.filename}`}
                            alt={`${postDetails?.makeName} ${postDetails?.modelName} ${postDetails?.yearName}`}
                          />
                        </Carousel.Item>
                      ))}
                  </Carousel>
                </Box>
              </Modal>
            </div>
          </div>
        </div>
        <div className="row flex-column-reverse flex-md-row ">
          <div className="col-lg-8">
            <div className="row card_bg text-capitalize vehicle_key_features p-3 rounded-4 ms-md-1 my-3">
              <h4 className="color-black mb-3 fs-5 fw-700">More Details</h4>
              <div className="col-lg-6 mb-1">
                <div className="d-flex justify-content-between">
                  <strong>Registered In :</strong>
                  {postDetails?.registered_in}
                </div>
              </div>
              <div className="col-lg-6 mb-1">
                <div className="d-flex justify-content-between">
                  <strong>Color :</strong>
                  {postDetails?.vehicle_colour}
                </div>
              </div>
              <div className="col-lg-6 mb-1">
                <div className="d-flex justify-content-between">
                  <strong>Assembly :</strong>
                  Local
                </div>
              </div>
              <div className="col-lg-6 mb-1">
                <div className="d-flex justify-content-between">
                  <strong>Engine Capacity(cc):</strong>
                  {postDetails?.engine_capacity}
                </div>
              </div>
              <div className="col-lg-6 mb-1">
                <div className="d-flex justify-content-between">
                  <strong>Body Type :</strong>
                  ....
                </div>
              </div>
              <div className="col-lg-6 mb-1">
                <div className="d-flex justify-content-between">
                  <strong>Make</strong>
                  {postDetails?.makeName}
                </div>
              </div>
              <div className="col-lg-6 mb-1">
                <div className="d-flex justify-content-between">
                  <strong>Model</strong>
                  {postDetails?.modelName}
                </div>
              </div>
              <div className="col-lg-6 mb-1">
                <div className="d-flex justify-content-between">
                  <strong>Condition</strong>
                  {postDetails?.vehicle_condition}
                </div>
              </div>
            </div>
            <div className=" ps-0 ps-md-2 vehicle_description mb-3 mt-5">
              <h4 className="color-black mb-3 fs-3 fw-700 ">Description</h4>
              <p className="m-0">{postDetails?.description}</p>
            </div>

            {vehicleFeatures && (
              <div className="row ps-0 ps-md-2 vehicle_car_features postAdForm postDetailss_info color-black text-capitalize mt-5 ">
                <h4 className="color-black mb-3 fs-3 fw-700">Features</h4>
                <div className="row mx-0">
                  {vehicleFeatures?.abs === "true" ? (
                    <div className="col-lg-3 col-4 mb-3 form-check md-radioStyle2">
                      <input
                        type="checkbox"
                        className="form-check-input"
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
                    <div className="col-lg-3 col-4 mb-3 form-check md-radioStyle2">
                      <input
                        type="checkbox"
                        className="form-check-input"
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
                    <div className="col-lg-3 col-4 mb-3 form-check md-radioStyle2">
                      <input
                        type="checkbox"
                        className="form-check-input"
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
                    <div className="col-lg-3 col-4 mb-3 form-check md-radioStyle2">
                      <input
                        type="checkbox"
                        className="form-check-input"
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
                    <div className="col-lg-3 col-4 mb-3 form-check md-radioStyle2">
                      <input
                        type="checkbox"
                        className="form-check-input"
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
                    <div className="col-lg-3 col-4 mb-3 form-check md-radioStyle2">
                      <input
                        type="checkbox"
                        className="form-check-input"
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
                    <div className="col-lg-3 col-4 mb-3 form-check md-radioStyle2">
                      <input
                        type="checkbox"
                        className="form-check-input"
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
                    <div className="col-lg-3 col-4 mb-3 form-check md-radioStyle2">
                      <input
                        type="checkbox"
                        className="form-check-input"
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
                    <div className="col-lg-3 col-4 mb-3 form-check md-radioStyle2">
                      <input
                        type="checkbox"
                        className="form-check-input"
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
                    <div className="col-lg-3 col-4 mb-3 form-check md-radioStyle2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="exampleCheck1"
                        readOnly
                        checked={vehicleFeatures?.front_camera}
                      />
                      <label className="form-check-label" for="exampleCheck1">
                        Front Camera
                      </label>
                    </div>
                  ) : null}
                  {vehicleFeatures?.front_speakers === "true" ? (
                    <div className="col-lg-3 col-4 mb-3 form-check md-radioStyle2">
                      <input
                        type="checkbox"
                        className="form-check-input"
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
                    <div className="col-lg-3 col-4 mb-3 form-check md-radioStyle2">
                      <input
                        type="checkbox"
                        className="form-check-input"
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
                    <div className="col-lg-3 col-4 mb-3 form-check md-radioStyle2">
                      <input
                        type="checkbox"
                        className="form-check-input"
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
                    <div className="col-lg-3 col-4 mb-3 form-check md-radioStyle2">
                      <input
                        type="checkbox"
                        className="form-check-input"
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
                    <div className="col-lg-3 col-4 mb-3 form-check md-radioStyle2">
                      <input
                        type="checkbox"
                        className="form-check-input"
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
                    <div className="col-lg-3 col-4 mb-3 form-check md-radioStyle2">
                      <input
                        type="checkbox"
                        className="form-check-input"
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
                    <div className="col-lg-3 col-4 mb-3 form-check md-radioStyle2">
                      <input
                        type="checkbox"
                        className="form-check-input"
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
                    <div className="col-lg-3 col-4 mb-3 form-check md-radioStyle2">
                      <input
                        type="checkbox"
                        className="form-check-input"
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
                    <div className="col-lg-3 col-4 mb-3 form-check md-radioStyle2">
                      <input
                        type="checkbox"
                        className="form-check-input"
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
                    <div className="col-lg-3 col-4 mb-3 form-check md-radioStyle2">
                      <input
                        type="checkbox"
                        className="form-check-input"
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
                    <div className="col-lg-3 col-4 mb-3 form-check md-radioStyle2">
                      <input
                        type="checkbox"
                        className="form-check-input"
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
                    <div className="col-lg-3 col-4 mb-3 form-check md-radioStyle2">
                      <input
                        type="checkbox"
                        className="form-check-input"
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
                    <div className="col-lg-3 col-4 mb-3 form-check md-radioStyle2">
                      <input
                        type="checkbox"
                        className="form-check-input"
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
                    <div className="col-lg-3 col-4 mb-3 form-check md-radioStyle2">
                      <input
                        type="checkbox"
                        className="form-check-input"
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
                    <div className="col-lg-3 col-4 mb-3 form-check md-radioStyle2">
                      <input
                        type="checkbox"
                        className="form-check-input"
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
                    <div className="col-lg-3 col-4 mb-3 form-check md-radioStyle2">
                      <input
                        type="checkbox"
                        className="form-check-input"
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
            )}
          </div>
          <div className="col-lg-4 pt-3 px-4 ">
            <h4 className="color-black mb-3 fs-3 fw-700 text-center">
              Inspection Report
            </h4>
            <img
              className="img-fluid"
              src={ReportDumy}
              alt="Inspection Report"
              srcSet=""
            />
            {details?.iinitial_token !== 0 &&
              details?.iinitial_token !== null && (
                <button
                  variant="contained"
                  onClick={handleReport}
                  className="mt-3 bgSecondary rounded-3 fw-600 w-100 color-white py-2 border-0"
                >
                  View Report
                </button>
              )}
          </div>
        </div>
      </div>
    </>
  );
}
