import React from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import NotAvailable from "@/images/not-found.json";
import { AuthContext } from "@/context/AuthContext";
import Grid from "@mui/material/Grid";

export default function UpcomingBiddingPosts({
  data,
  svrTime,
  lg,
  md,
  sm,
  xs,
}) {
  const awsImageURL = process.env.NEXT_PUBLIC_AWS_IMAGE_URL;
    const { user } = React.useContext(AuthContext);
  const history = useRouter();

  const posts = data || [];

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
      {posts?.length === 0 ? (
        <div className="notBidsAvail text-center">
          <Lottie style={{ height: 200 }} animationData={NotAvailable} loop />
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
                  lg={lg}
                  md={md}
                  sm={sm}
                  xs={xs}
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
                          {item?.makeName} {item?.modelName} {item?.yearName}{" "}
                          {item?.feature_name}
                        </h5>

                        <p className="adlocation fw-500 mb-2">
                          <i className="fa-solid fa-location-dot me-2 color-secondary"></i>
                          {item?.cityName}
                        </p>
                        <p className="adlocation fw-500 m-0">Starting from</p>
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
                              svrTime.serverdate,
                              svrTime.servertime
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
  );
}
