import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import NotAvailable from "@/images/not-found.json";
import { Grid } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

export default function BiddingPosts({ data, lg, md, sm, xs }) {
    const awsImageURL = process.env.NEXT_PUBLIC_AWS_IMAGE_URL;
  const { user } = React.useContext(AuthContext);

  const [first, setFirst] = useState();
  const [progress, setProgress] = useState(0);

  const posts = data?.data || [];

  useEffect(() => {
    const firstData = posts[0] || [];
    setFirst(firstData);
  }, [data]);

  const history = useRouter();
  const [time, setTime] = useState({
    hours: 0,
    minutes: 15,
    seconds: 0,
  });

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
    }
  }, [time]);

  // const formatTime = (time) => {
  //   const hours = time.hours.toString().padStart(2, "0");
  //   const minutes = time.minutes.toString().padStart(2, "0");
  //   const seconds = time.seconds.toString().padStart(2, "0");
  //   return `${hours}h:${minutes}m:${seconds}s`;
  // };

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
  const calculateRemainingTime = (start, end) => {
    if (start && end) {
      const now = new Date();
      const nowInUAETime = new Date(
        now?.toLocaleString("en-US", { timeZone: "Asia/Karachi" })
      );
      const endDateTime = new Date(
        nowInUAETime?.toDateString() + " " + end
      );
      const startDateTime = new Date(
        nowInUAETime?.toDateString() + " " + start
      );

      const formatTimeDiff = (timeDiff) => {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
        const seconds = Math.floor((timeDiff / 1000) % 60);
        return `${hours}h ${minutes}m ${seconds}s`;
      };

      if (nowInUAETime < startDateTime) {
        const diff = startDateTime - nowInUAETime;

        return ` ${formatTimeDiff(diff)}`;
      } else if (
        nowInUAETime >= startDateTime &&
        nowInUAETime < endDateTime
      ) {
        const diff = endDateTime - nowInUAETime;
        const totalDuration = endDateTime - startDateTime;
        const elapsedDuration = endDateTime - nowInUAETime;
        const progressPercentage = (elapsedDuration / totalDuration) * 100;

        // setProgress(progressPercentage)
        return ` ${formatTimeDiff(diff)}`;
      } else {
        return "Auction has ended";
      }
    } else {
      return "Start time or End time is missing";
    }
  };

  const openPost = (postId) => {
    history.push(`/bidding-vehicle-details/${postId}`);
  };

  const [remainingTime, setRemainingTime] = useState("");

  useEffect(() => {
    if (first) {
      const calculateRemainingTime = () => {
        const now = new Date();
        const nowInUAETime = new Date(
          now.toLocaleString("en-US", { timeZone: "Asia/Karachi" })
        );
        const endDateTime = new Date(
          nowInUAETime.toDateString() + " " + first?.auction_end_time
        );
        const startDateTime = new Date(
          nowInUAETime.toDateString() + " " + first?.auction_start_time
        );

        if (nowInUAETime < startDateTime) {
          const diff = startDateTime - nowInUAETime;
          setRemainingTime(` ${formatTimeDiff(diff)}`);
        } else if (
          nowInUAETime >= startDateTime &&
          nowInUAETime < endDateTime
        ) {
          const diff = endDateTime - nowInUAETime;
          setRemainingTime(` ${formatTimeDiff(diff)}`);
          const totalDuration = endDateTime - startDateTime;
          const elapsedDuration = endDateTime - nowInUAETime;
          const progressPercentage = (elapsedDuration / totalDuration) * 100;
        } else {
          setRemainingTime("Auction has ended");
          // history.push(`/bidding`);
        }
      };

      const formatTimeDiff = (timeDiff) => {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
        const seconds = Math.floor((timeDiff / 1000) % 60);
        return `${hours}h ${minutes}m ${seconds}s`;
      };

      // Call the calculateRemainingTime function initially to set the remaining time
      calculateRemainingTime();

      // Use setInterval to update the remaining time every second
      const intervalId = setInterval(calculateRemainingTime, 1000);

      // Clear the interval when the component unmounts
      return () => clearInterval(intervalId);
    }
  }, [first?.auctionEndTime, first?.auctionStartTime, posts]);

  return (
    <>
      {posts?.length === 0 ? (
        <div className="notBidsAvail text-center">
          <Lottie style={{ height: 200 }} animationData={NotAvailable} loop />
          <h5 className="fw-400">
            There are currently no auctions scheduled right now. Please check
            out our upcoming auctions.
          </h5>
          <button
            type="submit"
            className="btn mt-3 fw-primary model_loginBTn px-4 py-1 fw-500 fs-5"
            onClick={() => history.push("/upcoming-biddings")}
          >
            Upcoming Auctions
          </button>
        </div>
      ) : (
        <>
          <div className="p-3 pb-5">
            {/* <div className="row ">
              {posts?.map((item) => (
                <div
                  className="col-lg-12 col-12 col-md-6 p-0 BidPost"
                  key={item?.auction_post_id}
                >
                  <div className="row boxShadow m-2 biddingCard">
                    <div className="col-lg-2 col-12 ps-lg-0 p-0">
                      <img
                        src={`${baseUrl}/public/posts/${item?.post_token}/${item?.cover}`}
                        alt={item?.title}
                        className="vehicleImg"
                      />
                    </div>
                    <div className="col-lg-6 col-12 vehicleInfo_Area p-3">
                      <div className="vehicleTab1">
                        <h3 className="fw-600 fs-5">
                          {item?.makeName} {item?.modelName} {item?.yearName}
                        </h3>
                      </div>
                      <div className="vehicleTab2 ">
                        <p
                          className="m-0 fw-500 color-secondary"
                          style={{ fontSize: "13px" }}
                        >
                          <i className="fa-solid fa-location-dot me-2"></i>
                          {item?.cityName}
                        </p>

                        <h4 className="fs-6 fw-600">
                          Starting:{" "}
                          <span className=" color-secondary">
                            PKR {formatPrice(item?.starting_amount)}
                          </span>
                        </h4>
                      </div>
                    </div>
                    <div className="col-lg-4 actionBids_btn py-3">
                      <div className="bid">
                        <p className="m-0 fs-6 fw-600">
                          Current Bid:
                          <span className="fw-600 fs-5 color-secondary">
                            PKR 00
                          </span>
                        </p>
                        <p className="m-0 fw-500 fs-6 color-primary">
                          Auction ending in{" "}
                          <span className="m-0 fw-500 fs-6 color-secondary">
                            <i className="fa-regular fa-clock me-2"></i>
                            {calculateRemainingTime(
                              item?.auction_start_time,
                              item?.auction_end_time
                            )}
                          </span>
                        </p>
                      </div>
                      <div></div>
                      <Button
                        key={item?.auction_post_id}
                        onClick={() => openPost(item?.auction_post_id)}
                        variant="contained"
                        className="bgSecondary color-white fw-700 text-capitalize w-100 py-2"
                      >
                        Bid Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div> */}
            <Grid container spacing={2}>
              {posts &&
                posts.map((item) => (
                  <Grid
                  lg={lg}
                  md={md}
                  sm={sm}
                  xs={xs}
                  className=" mb-3 p-2"
                  key={item?.auction_post_id}
                  onClick={() => openPost(item?.auction_post_id)}
                  >
                    <div className="adPost biddingPostCover">
                      <div className="position-relative ">
                        <img
                          src={`${awsImageURL}/public/posts/${item?.post_token}/${item?.cover}`}
                          alt={`${item?.makeName} ${item?.modelName} ${item?.yearName}`}
                          className="p-2 biddingPostCover "
                        />
                      </div>

                      <div className=" pb-2 px-2 ">
                        <div className=" bg-white p-2 rounded-2  ">
                          <h5 className="fw-600 ad-Title color-black text-capitalize mb-1">
                            {item?.makeName} {item?.modelName} {item?.yearName}{" "}
                            {item?.feature_name}
                          </h5>

                          <p className="adlocation fw-500 mb-2">
                            <i className="fa-solid fa-location-dot me-2 color-secondary"></i>
                            {item?.cityName}
                          </p>
                          <p className="adlocation fw-500 m-0">Starting from</p>
                          <h4 className=" color-secondary  fs-5 fw-700 mb-1">
                            PKR {formatPrice(item?.starting_amount)}
                          </h4>

                          <div
                            style={{
                              width: "100%",
                            }}
                            className=" bg-dark text-center mt-3 px-2 px-md-3 py-2  rounded-3 "
                          >
                            <h6 className="text-white mb-0 fw-700">
                              <span className="opacity-75 fw-600 ">
                                Time Left:{" "}
                              </span>
                              {/* <span className="fs-6 fw-500">
                              <i class="fa-regular fa-clock me-2 "></i>
                            </span>{" "} */}
                              {calculateRemainingTime(
                                item?.auction_start_time,
                                item?.auction_end_time
                              )}
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Grid>
                ))}
            </Grid>
          </div>
        </>
      )}
    </>
  );
}