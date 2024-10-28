"use client"
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import sellThroughBid from "@/images/sellThroughBid.png";
import buyThroughBid from "@/images/buyThroughBid.png";
import { AuthContext } from "@/context/AuthContext";
import { Box, Grid, Button, Modal } from "@mui/material";
import UpcomingBiddingPosts from "@/components/bidding/upcomingBiddingPosts";
import Skeleton from "@mui/material/Skeleton";
import Link from "next/link";

import DoneIcon from "@mui/icons-material/Done";
import BiddingPosts from "@/components/bidding/biddingPosts";
import MembershipCard from "@/components/membershipBanner";
import Image from "next/image";

const LiveBidding = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const { user } = useContext(AuthContext);

  const [isOpen, setIsOpen] = useState(false);
  const [liveBids, setliveBids] = useState([]);
  const [auctionPosts, setAuctionPosts] = useState([]);

  const [serverTime, setServerTime] = useState({});
  const [loading, setLoading] = useState(true);

  const upcomingPosts = auctionPosts && auctionPosts.slice(0, 4);
  // const LivePosts = liveBids && liveBids.slice(0, 3);

  const fetchLiveBids = async () => {
    try {
      // const token = localStorage.getItem("token");
      const response = await axios.get(`${baseUrl}/currentauctionpostlist`, {
        params: {
          page: 1,
        },
      });
      // console.log(response.data, ' auction post data ====');
      setliveBids(response?.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("liveBids:", liveBids); // Debugging to see what liveBids contains
  }, [liveBids]);

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

  useEffect(() => {
    const intervalId = setInterval(fetchAuctionPosts, 1000); // Call API every 10 seconds

    return () => {
      clearInterval(intervalId); // Clear interval when component unmounts
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(fetchLiveBids, 2000); // Call API every 2 seconds

    return () => {
      clearInterval(intervalId); // Clear interval when component unmounts
    };
  }, []);

  const LoginOpen = () => {
    setIsOpen(true);
  };
  const LoginClose = () => {
    setIsOpen(false);
  };

  const skeletonNumber = [1, 2, 3, 4];

  return (
    <>
      <div className=" colorBg_new d-none d-lg-block "></div>
      <div className="bg_post_category py-5">
        <h2 className=" fs-1 fw-bold text-center">
          UAE’s No 1{" "}
          <span className="color-secondary fw-bold">Bidding Platform</span>
        </h2>
        <h4 className=" text-black fw-normal fs-2 text-center mt-3 mb-5">
          Choose How To Sell Your Car
        </h4>

        <div className="container mb-3 mt-2">
          <div className="row">
            <div className="col-md-6 p-2 mx-auto ">
              <div className="card_bg rounded-5 boxShadow p-3 ">
                <div className="d-flex justify-content-center align-items-center flex-column mt-3">
                  <Image
                    src={sellThroughBid}
                    alt="post-free-ad"
                    className="img-fluid object-fit-contain w-25 rounded"
                  />
                  <h2 className="fs-2 text-center fw-600 text-black">
                    Sell Through{" "}
                    <span className=" color-secondary fw-bold">Bidding</span>
                  </h2>
                  <ul className="mt-3 saleSteps py-0 px-4 w-100">
                    <li className="gap-2 fs-5">
                      <DoneIcon color="error" /> Fill Out The Car Detail Form
                      Steps
                    </li>
                    <li className="gap-2 fs-5">
                      <DoneIcon color="error" /> Get Your Car Inspected
                    </li>
                    <li className="gap-2 fs-5">
                      <DoneIcon color="error" /> Agree on a Price
                    </li>
                    <li className="gap-2 fs-5">
                      <DoneIcon color="error" /> Sell through Live Bidding
                    </li>
                  </ul>

                  <div className="w-75 mt-2">
                    {user ? (
                      <Link href="/post-ad?Free-Ads">
                        <Button
                          variant="contained"
                          fullWidth
                          className="bgSecondary text-white px-4 py-2 fs-5 mt-4 fw-normal rounded-4 text-capitalize fw-600"
                        >
                          Sell by bid
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        variant="conatined"
                        onClick={LoginOpen}
                        fullWidth
                        className="bgSecondary text-white px-4 py-2 fs-5 mt-4 fw-normal rounded-4 text-capitalize fw-600"
                      >
                        Sell by bid
                      </Button>
                    )}
                    <p className="fs-5 text-center mt-3">
                      FameWheels charges 0.5% Service Charges
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 p-2 mx-auto">
              <div className="card_bg rounded-5 boxShadow  p-3  ">
                <div className="d-flex justify-content-center align-items-center flex-column mt-3">
                  <Image
                    src={buyThroughBid}
                    alt="post-free-ad"
                    className="img-fluid object-fit-contain w-25 rounded"
                  />
                  <h2 className="fs-2 text-center fw-600 text-black">
                    Buy Through{" "}
                    <span className=" color-secondary fw-bold">Famewheels</span>
                  </h2>

                  <ul className="mt-3 saleSteps py-0 px-4 w-100">
                    <li className="gap-2 fs-5 ">
                      <DoneIcon color="error" /> Dedicated Sales Expert to Sell
                      your Car
                    </li>
                    <li className="gap-2 fs-5">
                      <DoneIcon color="error" /> We Bargain for you and share
                      the Best Offer
                    </li>
                    <li className="gap-2 fs-5">
                      <DoneIcon color="error" /> We ensure Safe & Secure
                      Transaction
                    </li>
                    <li className="gap-2 fs-5">
                      <DoneIcon color="error" /> Finalize the payment & drive
                      away in your new car
                    </li>
                  </ul>

                  <div className="w-75">
                    {user ? (
                      <Link href="/sell-through-famewheels">
                        <Button
                          variant="contained"
                          fullWidth
                          className="bgSecondary text-white px-4 py-2 fs-5 mt-4 fw-normal rounded-4 text-capitalize fw-600"
                        >
                          Sell For You
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        variant="conatined"
                        onClick={LoginOpen}
                        fullWidth
                        className="bgSecondary text-white px-4 py-2 fs-5 mt-4 fw-normal rounded-4 text-capitalize fw-600"
                      >
                        Post Your Ad
                      </Button>
                    )}
                    <p className="fs-5 text-center mt-3">
                      FameWheels charges 0.5% Service Charges
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6 col-12 p-2 mx-auto dashed-left">
            <h2 className=" fs-3 color-secondary fw-bold text-center">
              Live Bidding
            </h2>
            {/* <h6 className="text-black mb-0  text-center">
              <span className="fw-700 fs-4">
                {auctionPosts.length > 0
                  ? calculateRemainingTime(
                      auctionPosts[0]?.auction_start_time,
                      auctionPosts[0]?.auction_date,
                      serverTime.serverdate,
                      serverTime.servertime
                    )
                  : "No upcoming auctions"}
              </span>
              <span className="fw-200 fs-5"> (open Now)</span>
            </h6> */}
            {loading ? (
              <div className="No_ads_loading p-3 text-center my-5">
                <div>
                  <div className="row row-gap-4">
                    {skeletonNumber.map((index) => (
                      <div key={index} className="col-lg-6">
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
                <BiddingPosts
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  data={liveBids}
                  svrTime={serverTime}
                />
              </>
            )}

            {liveBids?.data?.length > 0 && (
              <div className="text-center mb-5">
                <Link href="/live-bidding">
                  <Button
                    variant="contained"
                    className="bgSecondary text-white px-4 py-2 fs-6 mt-4 fw-normal rounded-2 text-capitalize fw-500"
                  >
                    See All Cars
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <div className="col-md-6 col-12 p-2 mx-auto dashed-right">
            <h2 className=" fs-3 pb-2 text-black fw-bold text-center">
              Upcoming Cars For <span className="color-secondary">Bidding</span>
            </h2>
            <h6 className="text-black my-3  text-center">
              <span className="fw-700 fs-4">
                {auctionPosts.length > 0
                  ? calculateRemainingTime(
                      auctionPosts[0]?.auction_start_time,
                      auctionPosts[0]?.auction_date,
                      serverTime.serverdate,
                      serverTime.servertime
                    )
                  : "No Live auctions"}
              </span>
              <span className="fw-200 fs-5"> Left</span>
            </h6>
            {loading ? (
              <div className="No_ads_loading p-3 text-center my-5">
                <div>
                  <div className="row row-gap-4">
                    {skeletonNumber.map((index) => (
                      <div key={index} className="col-lg-6">
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
              <UpcomingBiddingPosts
                lg={6}
                md={6}
                sm={12}
                xs={12}
                data={upcomingPosts}
                svrTime={serverTime}
              />
            )}
            {upcomingPosts?.length > 0 && (
              <div className="text-center pb-4">
                <Link href="/upcoming-biddings">
                  <Button
                    variant="contained"
                    className="bgSecondary text-white px-4 py-2 fs-6 mt-4 fw-normal rounded-2 text-capitalize fw-500"
                  >
                    See All Cars
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className=" card_bg">
        <div className="container py-5">
          <h2 className=" fs-1 text-black mb-5 fw-bold text-center">
            How FameWheels Live{" "}
            <span className="color-secondary">Online Car Bidding</span> Work?
          </h2>
          <Grid container>
            <Grid lg={3} md={6} sm={6} xs={12} className="px-1 pb-1">
              <iframe
                width="100%"
                height="450"
                src="https://www.youtube.com/embed/dJVbV6ZK61s"
                title="YouTube video player"
                allowFullScreen
              ></iframe>
            </Grid>
            <Grid lg={3} md={6} sm={6} xs={12} className="px-1 pb-1">
              <iframe
                width="100%"
                height="450"
                src="https://www.youtube.com/embed/blx9K1Onp6c"
                title="YouTube video player"
                allowFullScreen
              ></iframe>
            </Grid>
            <Grid lg={3} md={6} sm={6} xs={12} className="px-1 pb-1">
              <iframe
                width="100%"
                height="450"
                src="https://www.youtube.com/embed/js4GdflL1Cs"
                title="YouTube video player"
                allowFullScreen
              ></iframe>
            </Grid>
            <Grid lg={3} md={6} sm={6} xs={12} className="px-1 pb-1">
              <iframe
                width="100%"
                height="450"
                src="https://www.youtube.com/embed/dR1Z5RMkfNQ"
                title="YouTube video player"
                allowFullScreen
              ></iframe>
            </Grid>
          </Grid>
        </div>
      </div>

      <MembershipCard />
    </>
  );
};

export default LiveBidding;
