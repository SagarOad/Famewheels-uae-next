"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import SeoMeta from "@/components/meta";
import { Skeleton } from "@mui/material";
import NotAvailable from "@/images/not-found.json";
import Lottie from "lottie-react";
import Grid from "@mui/material/Grid";

const page = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const awsImageURL = process.env.NEXT_PUBLIC_AWS_IMAGE_URL;
  const [auctionPosts, setAuctionPosts] = useState([]);
  const [serverTime, setServerTime] = useState({});
  const [loading, setLoading] = useState(true);

  const history = useRouter();

  const posts = auctionPosts || [];

  const fetchAuctionPosts = async () => {
    try {
      // const token = localStorage.getItem("token");
      const response = await axios.get(`${baseUrl}/upcomingauctionpostlist`, {
        params: {
          page: 1,
        },
      });
      setAuctionPosts(response?.data?.data?.data);
      setServerTime({
        servertime: response?.data?.servertime,
        serverdate: response?.data?.serverdate,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchAuctionPosts, 1000); // Call API every 10 seconds

    return () => {
      clearInterval(intervalId); // Clear interval when component unmounts
    };
  }, []);

  const skeletonNumber = [1, 2, 3, 4, 5, 6, 7, 8];

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
      return "Time or Date missing";
    }
  };

  const openPost = (postId) => {
    history.push(`/upcoming-vehicle-details/${postId}`);
  };

  return (
    <>
      <SeoMeta
        title="Upcoming Biddings | FameWheels"
        desc="Explore the new and used cars at the the car auction in UAE. Famewheels has provided a platform for live car bidding in which you can bid on your favorite car and also check Famewheels Auction cars in Karachi for reliable and affordable cars."
        url="upcomming"
      />
      <div className=" colorBg_new d-none d-lg-block "></div>
      <section className="bg-white newcar-main  text-center  pt-5 pb-2">
        <div className="container">
          <h2 className="text-center section-titles pb-lg-0 text-sm-center text-lg-start">
            FameWheels Upcoming Biddings
          </h2>
          <p className="text-center text-sm-start">
            FameWheels brings UAE's first Live Bidding Portal.
          </p>
        </div>
      </section>
      <div className="container">
        {loading ? (
          <div className="No_ads_loading p-3 text-center my-5">
            <div>
              <div className="row row-gap-4">
                {skeletonNumber.map((index) => (
                  <div key={index} className="col-lg-3">
                    <Skeleton
                      animation="wave"
                      variant="rounded"
                      width="100%"
                      height={170}
                    />
                    <div>
                      <div className="text-start">
                        <h4 className="mt-3">
                          <Skeleton
                            animation="wave"
                            variant="rounded"
                            width="80%"
                            height={20}
                          />
                        </h4>
                        <h6>
                          <Skeleton
                            animation="wave"
                            variant="rounded"
                            width="40%"
                            height={20}
                          />
                        </h6>
                      </div>
                      <div className="mb-2">
                        <Skeleton
                          animation="wave"
                          variant="rounded"
                          width="35%"
                          height={8}
                        />
                      </div>
                    </div>
                    <div className="mb-2">
                      <Skeleton
                        animation="wave"
                        variant="rounded"
                        width="55%"
                        height={25}
                      />
                    </div>
                    {/* <div>
                    <Skeleton
                      animation="wave"
                      variant="rounded"
                      width="100%"
                      height={40}
                    />
                  </div> */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {posts?.length === 0 ? (
              <div className="notBidsAvail text-center">
                <Lottie
                  style={{ height: 200 }}
                  animationData={NotAvailable}
                  loop
                />
                <h5 className="fw-600">
                  There are currently no auctions scheduled right now.
                </h5>
              </div>
            ) : (
              <div className="p-3 pb-5">
                <Grid container spacing={2}>
                  {posts &&
                    posts.map((item) => (
                      <Grid
                        lg={3}
                        md={6}
                        sm={12}
                        xs={12}
                        className="col-6 mb-3 p-2"
                        key={item?.auction_post_id}
                        onClick={() => openPost(item?.auction_post_id)}
                      >
                        <div className="adPost biddingPostCover">
                          <div className="position-relative">
                            <img
                              src={`${awsImageURL}/public/posts/${item?.post_token}/${item?.cover}`}
                              alt={`${item?.makeName} ${item?.modelName} ${item?.yearName}`}
                              className="p-2 biddingPostCover"
                            />
                          </div>

                          <div className="pb-2 px-2">
                            <div className="bg-white p-2 rounded-2">
                              <h5 className="fw-600 ad-Title color-black text-capitalize mb-1">
                                {item?.makeName} {item?.modelName}{" "}
                                {item?.yearName} {item?.feature_name}
                              </h5>

                              <p className="adlocation fw-500 mb-2">
                                <i className="fa-solid fa-location-dot me-2 color-secondary"></i>
                                {item?.cityName}
                              </p>
                              <p className="adlocation fw-500 m-0">
                                Starting from
                              </p>
                              <h4 className="color-secondary fs-5 fw-700 mb-1">
                                PKR {formatPrice(item?.starting_amount)}
                              </h4>

                              <div
                                style={{
                                  width: "100%",
                                }}
                                className="bg-dark text-center mt-3 px-2 px-md-3 py-2 rounded-3"
                              >
                                <h6 className="text-white mb-0 fw-700">
                                  <span className="opacity-75 fw-600">
                                    Time Left:{" "}
                                  </span>
                                  {calculateRemainingTime(
                                    item?.auction_start_time,
                                    item?.auction_date,
                                    serverTime.serverdate,
                                    serverTime.servertime
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
            )}
          </>
        )}
      </div>
    </>
  );
};

export default page;
