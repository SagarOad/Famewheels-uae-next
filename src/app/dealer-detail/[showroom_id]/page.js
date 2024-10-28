"use client";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Skeleton from "@mui/material/Skeleton";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
} from "react-share";
import { Grid, Tabs, Tab, Box } from "@mui/material";
import Lottie from "lottie-react";
import NotAvailable from "@/images/not-found.json";
import PropTypes from "prop-types";
import { FeaturedVideo, Movie, SlowMotionVideo } from "@mui/icons-material";
import Modal from "@mui/material/Modal";
import { AuthContext } from "@/context/AuthContext";
import MediaDone from "@/images/done-tick.json";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function DealerProfile({ params }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const awsImageURL = process.env.NEXT_PUBLIC_AWS_IMAGE_URL;
  const { showroom_id } = params;

  const user  = useContext(AuthContext);
  const [showroomDetails, setShowRoomDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [posts, setPosts] = useState([]);

  const [mediaType, setMediaType] = useState("");
  const [mediaLink, setMediaLink] = useState("");
  const [isValidLink, setIsValidLink] = useState(true);
  const [videoId, setVideoId] = useState("");

  const handleLinkChange = (e) => {
    const link = e.target.value;
    const youtubeLinkPattern =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/|shorts\/|.*\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})(.*)?$/;
    const match = link.match(youtubeLinkPattern);

    if (match) {
      setIsValidLink(true);
      setVideoId(match[5]);
    } else {
      setIsValidLink(false);
      setVideoId("");
    }

    setMediaLink(link);
  };

  const token = localStorage.getItem("token");

  //   const extractPostIdFromUrl = (url) => {
  //     const parts = url.split("/");
  //     return parts[parts.length - 1];
  //   };

  //   useEffect(() => {
  //     const url = window.location.href;
  //     const postIdUrl = extractPostIdFromUrl(url);
  //     setPostId(postIdUrl);

  //     postId && fetchData(postId);
  //   }, [postId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/dealerdetails`, {
        params: {
          showroom_id: showroom_id,
        },
      });

      setShowRoomDetails(response?.data?.details);
      setUserId(response?.data?.details?.user_id);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showroom_id) {
      fetchData();
      console.log("Fetching data for showroom_id:", showroom_id);
    } else {
      console.error("showroom_id is undefined");
    }
  }, [showroom_id]);

  const fetchUserPosts = async (userId) => {
    try {
      const response = await axios.get(`${baseUrl}/userpost`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          user_id: userId,
          statusId: 1,
          postTypeId: 1,
        },
      });
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    userId && fetchUserPosts(userId);
  }, [userId]);

  const history = useRouter();

  const [uploadOpen, setUploadOpen] = useState(false);

  const openPost = (postId) => {
    history.push(`/vehicle-details/${postId}`);
  };

  const shareUrl = window.location.href;
  const title = `Check ${showroomDetails?.showroom_name} on fameWheels`;

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

  const [videoData, setVideoData] = useState([]);
  const [reelData, setReelData] = useState([]);

  console.log(videoData, " videos ");

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${baseUrl}/dealerfeedlist`, {
        params: {
          feed_type: "video",
          showroom_id: showroomDetails?.showroom_id,
        },
      });

      setVideoData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchReel = async () => {
    try {
      const response = await axios.get(`${baseUrl}/dealerfeedlist`, {
        params: {
          feed_type: "reel",
          showroom_id: showroomDetails?.showroom_id,
        },
      });

      setReelData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (showroomDetails) {
      fetchVideos();
      fetchReel();
    }
  }, [showroomDetails]);

  const loadingItems = [1, 2, 3, 4];

  const [tabValue, setTabValue] = React.useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const [uploaded, setUploaded] = useState(false);

  const mediaUpload = async (e) => {
    e.preventDefault();
    if (mediaType !== "" && mediaLink !== "") {
      try {
        const token = localStorage.getItem("token");
        setIsLoading(true);

        const formData = new FormData();

        formData.append("feed_type", mediaType);
        formData.append("feed_link", mediaLink);
        formData.append("showroom_id", showroomDetails?.showroom_id);

        const response = await axios.post(
          `${baseUrl}/savedealerfeed`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response?.data);

        setUploaded(true);

        setTimeout(() => {
          setIsLoading(false);
          setMediaType("");
          setMediaLink("");
          setVideoId("");
          setUploadOpen(false);
          setUploaded(false);
          fetchVideos();
          fetchReel();
        }, 3000);
      } catch (err) {
        console.error(err.response);
        setIsLoading(false);
      }
    }
  };

  const getVideoIdFromUrl = (url) => {
    try {
      const urlParts = new URL(url);

      // Handle 'youtu.be' format
      if (urlParts.hostname === "youtu.be") {
        return urlParts.pathname.slice(1);
      }

      // Handle standard watch URL
      let videoId = urlParts.searchParams.get("v");
      if (videoId) return videoId;

      // Handle 'shorts' URL format
      const pathParts = urlParts.pathname.split("/");
      if (pathParts[1] === "shorts" && pathParts[2]) {
        return pathParts[2];
      }

      // Handle older YouTube formats and additional cases
      if (pathParts[1] === "watch" && urlParts.searchParams.get("v")) {
        return urlParts.searchParams.get("v");
      }

      return null;
    } catch (error) {
      console.error("Invalid URL:", url, error);
      return null;
    }
  };

  return (
    <>
      <div className=" colorBg_new d-none d-lg-block "></div>
      <div className="pb-4 mb-md-3 container position-relative ">
        <div style={{ zIndex: 999 }} className=" profileArea h-100 row  py-4  ">
          <div className=" col-lg-2 col-12  text-center">
            <img
              className="dealerLogo"
              src={`${awsImageURL}/public/dealer/${showroomDetails?.user_id}/${showroomDetails?.showroom_logo}`}
              alt="Profile Pic"
              loading="lazy"
            />
            <h4 className="pt-2 text-black text-capitalize ms-2 fw-600">
              {showroomDetails?.showroom_name}
            </h4>
          </div>
          <div className=" col-lg-10 col-12  position-relative d-flex mb-2">
            <div className="ps-md-5 px-2 pt-3 w-100">
              <h4 className="fw-700 cursorPointer fs-3 mb-3 d-none d-md-block  ">
                Car Dealer Information
              </h4>
              <div className="postlocation  d-flex align-items-start mb-3">
                <i className="fa-solid fa-location-dot me-2 mt-1"></i>
                <p className="m-0">{showroomDetails?.showroom_address}</p>
              </div>
              <p className="postlocation">
                <i className="fa-solid fa-envelope me-2"></i>
                {showroomDetails?.email}
              </p>
              <p className="postlocation ">
                <i className="fa-solid fa-phone me-2"></i>
                {showroomDetails?.showroom_no}
              </p>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <h6 className="mb-0 me-2 d-none d-md-block">
                    <i className="fa-solid fa-up-right-from-square me-2"></i>{" "}
                    Share :
                  </h6>
                  <div className="">
                    <FacebookShareButton
                      className="me-2"
                      url={shareUrl}
                      quote={title}
                    >
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TwitterShareButton
                      className="me-2"
                      url={shareUrl}
                      title={title}
                    >
                      <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    <WhatsappShareButton
                      className="me-2"
                      url={shareUrl}
                      title={title}
                    >
                      <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                    <FacebookMessengerShareButton
                      className="me-2"
                      url={shareUrl}
                      title={title}
                    >
                      <FacebookMessengerIcon size={32} round />
                    </FacebookMessengerShareButton>
                  </div>
                </div>
                <div>
                  {user?.id === showroomDetails?.user_id && (
                    <button
                      onClick={() => setUploadOpen(true)}
                      className="btn bgSecondary text-white fw_br px-3 fw-500 "
                    >
                      Upload Media
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="container">
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderTop: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleChange}
                aria-label="dealers profile options"
                centered
                allowScrollButtonsMobile
                textColor="inherit"
                TabIndicatorProps={{
                  style: {
                    backgroundColor: "#b80505",
                    top: 0,
                    bottom: "unset",
                    height: 3,
                  },
                }}
                sx={{
                  "& .MuiTab-root": { color: "#b80505", marginX: 2 },
                  "& .Mui-selected": { color: "#b80505" },
                  "& .MuiTabs-indicator": {
                    top: 0,
                    bottom: "unset",
                    height: 3,
                  },
                }}
              >
                <Tab
                  icon={<FeaturedVideo />}
                  iconPosition="start"
                  label="Ads"
                  {...a11yProps(0)}
                />
                <Tab
                  icon={<Movie />}
                  iconPosition="start"
                  label="Videos"
                  {...a11yProps(1)}
                />
                <Tab
                  icon={<SlowMotionVideo />}
                  iconPosition="start"
                  label="Reels"
                  {...a11yProps(2)}
                />
              </Tabs>
            </Box>
            <CustomTabPanel value={tabValue} index={0}>
              <div className="row ">
                <div className="col-lg-12 col-12">
                  {loading ? (
                    <div className="No_ads_loading text-center  ">
                      <div>
                        <Grid container spacing={3}>
                          {loadingItems?.map((item, index) => (
                            <Grid
                              key={index}
                              lg={3}
                              md={4}
                              sm={6}
                              className=" col-6 mb-3 p-2"
                            >
                              <div className="border rounded-4 p-2">
                                <div className="position-relative m-2">
                                  <Skeleton
                                    animation="wave"
                                    variant="rounded"
                                    width="100%"
                                    height={160}
                                  />
                                </div>

                                <div className=" p-2 ">
                                  <h5 className="mb-2">
                                    <Skeleton
                                      animation="wave"
                                      variant="rounded"
                                      width="80%"
                                      height={20}
                                    />
                                  </h5>
                                  <h4 className="mb-2">
                                    {" "}
                                    <Skeleton
                                      animation="wave"
                                      variant="rounded"
                                      width="40%"
                                      height={20}
                                    />
                                  </h4>
                                  <p className="m-0">
                                    <Skeleton
                                      animation="wave"
                                      variant="rounded"
                                      width="20%"
                                      height={20}
                                    />
                                  </p>
                                </div>
                              </div>
                            </Grid>
                          ))}
                        </Grid>
                      </div>
                    </div>
                  ) : posts?.length > 0 ? (
                    <>
                      <Grid container spacing={2}>
                        {posts &&
                          posts?.map((item) => (
                            <Grid
                              lg={2.4}
                              md={4}
                              sm={6}
                              className=" col-6 mb-3 p-2"
                              key={item?.post_id}
                            >
                              <Link
                                href={`/vehicle-details/${item?.post_id}`}
                                key={item?.post_id}
                              >
                                <div className="adPost">
                                  <div className="position-relative ">
                                    <div className="img_box">
                                      <img
                                        src={`${awsImageURL}/public/posts/${item?.post_token}/${item?.cover}`}
                                        alt={`${item?.makeName} ${item?.modelName} ${item?.yearName}`}
                                        className="p-2  "
                                      />
                                    </div>
                                  </div>

                                  <div className=" pb-2 px-2 ">
                                    <div className=" bg-white p-2 rounded-2  ">
                                      <h5 className="fw-600 ad-Title color-black text-capitalize mb-1">
                                        {item?.makeName} {item?.modelName}{" "}
                                        {item?.yearName}
                                      </h5>
                                      <h4 className="fw-600 adPrice mb-1">
                                        <span>
                                          PKR {formatPrice(item?.price)}
                                        </span>
                                      </h4>
                                      <p className="adlocation m-0 fw-500">
                                        <i className="fa-solid fa-location-dot me-2 color-secondary"></i>
                                        {item?.city_name}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </Grid>
                          ))}
                      </Grid>
                    </>
                  ) : (
                    <div className="p-3 text-center">
                      <Lottie
                        style={{ height: 150 }}
                        animationData={NotAvailable}
                        loop
                      />
                      <p className="fw-500 fs-5">No Active ads</p>
                    </div>
                  )}
                </div>
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={tabValue} index={1}>
              {videoData?.length > 0 ? (
                <Grid container spacing={2}>
                  {videoData &&
                    videoData?.map((item) => {
                      const videoUrl = item?.feed_link;
                      const videoId = videoUrl
                        ? getVideoIdFromUrl(videoUrl)
                        : null;
                      console.log(videoId, " video idddd ");
                      const embedUrl = videoId
                        ? `https://www.youtube.com/embed/${videoId}`
                        : "";
                      return (
                        <>
                          <Grid
                            lg={4}
                            md={6}
                            sm={6}
                            xs={12}
                            className="px-1 pb-1"
                            key={item?.feed_id}
                          >
                            <iframe
                              width="100%"
                              height="315"
                              src={embedUrl}
                              title="YouTube video player"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </Grid>
                        </>
                      );
                    })}
                </Grid>
              ) : (
                <div className="p-3 text-center">
                  <Lottie
                    style={{ height: 150 }}
                    animationData={NotAvailable}
                    loop
                  />
                  <p className="fw-500 fs-5">No Video Uploaded</p>
                </div>
              )}
            </CustomTabPanel>
            <CustomTabPanel value={tabValue} index={2}>
              {reelData?.length > 0 ? (
                <Grid container spacing={2}>
                  {reelData &&
                    reelData?.map((item) => {
                      const videoUrl = item?.feed_link;
                      const videoId = videoUrl
                        ? getVideoIdFromUrl(videoUrl)
                        : null;
                      console.log(videoId, " video idddd ");
                      const embedUrl = videoId
                        ? `https://www.youtube.com/embed/${videoId}`
                        : "";
                      return (
                        <>
                          <Grid
                            lg={3}
                            md={6}
                            sm={6}
                            xs={12}
                            className="px-1 pb-1"
                            key={item?.feed_id}
                          >
                            <iframe
                              width="100%"
                              height="400"
                              src={embedUrl}
                              title="YouTube video player"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </Grid>
                        </>
                      );
                    })}
                </Grid>
              ) : (
                <div className="p-3 text-center">
                  <Lottie
                    style={{ height: 150 }}
                    animationData={NotAvailable}
                    loop
                  />
                  <p className="fw-500 fs-5">No Reel Uploaded</p>
                </div>
              )}
            </CustomTabPanel>
          </Box>
        </div>
      </div>

      <Modal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        disableAutoFocus={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="Fw-popups"
      >
        <Box className="sm-modal p-3 p-md-4">
          <div className="modalBody_area  px-2 ">
            {uploaded ? (
              <>
                <Lottie
                  style={{ height: 250 }}
                  animationData={MediaDone}
                  loop={false}
                />
                <p className="fw-500 fs-4 text-center  ">
                  Media Uploaded Successfully
                </p>
              </>
            ) : (
              <div>
                <h6>Upload Video or Reel</h6>
                <form onSubmit={mediaUpload}>
                  <div className="col-12 mt-3">
                    <div className="mb-3">
                      <label for="inspectionCity" className="form-label">
                        Select Media Type
                      </label>

                      <select
                        className="form-select"
                        id="inspectionCity"
                        aria-label="Default select example"
                        required
                        value={mediaType}
                        onChange={(e) => setMediaType(e.target.value)}
                      >
                        <option value="">Select </option>
                        <option value="video">Video</option>
                        <option value="reel">Reel</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className=" mb-3">
                      <label
                        for="inspectionAddres "
                        className="form-label text-capitalize "
                      >
                        Enter {mediaType} link
                      </label>
                      <input
                        type="url"
                        className={`form-control ${
                          isValidLink ? "" : "is-invalid"
                        }`}
                        id="inspectionAddress"
                        aria-describedby="inspectionAddressHelp"
                        placeholder={`Enter YouTube ${mediaType} embed link`}
                        required
                        accept="url"
                        disabled={mediaType === ""}
                        value={mediaLink}
                        onChange={handleLinkChange}
                      />

                      {!isValidLink && (
                        <div className="invalid-feedback inputErrorTip color-secondary ">
                          <i className="fa-solid fa-circle-exclamation me-2"></i>
                          Please enter a valid YouTube link.
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-12 text-center mb-2">
                    {isValidLink && videoId && (
                      <div className="mt-3">
                        <iframe
                          width="100%"
                          height="315"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="btn boxShadow rounded-pill border-0 w-100 bgSecondary text-white py-2 "
                    disabled={
                      mediaType === "" || mediaLink === "" || !isValidLink
                    }
                  >
                    {isLoading ? "uploading.." : " Upload"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </Box>
      </Modal>
    </>
  );
}
