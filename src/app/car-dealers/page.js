"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Skeleton from "@mui/material/Skeleton";

export default function CarDealers() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const awsImageURL = process.env.NEXT_PUBLIC_AWS_IMAGE_URL;

  const [dealerList, setDealerList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${baseUrl}/dealerlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            status_id: 1,
          },
        });

        setDealerList(response?.data?.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const history = useRouter();

  const openPost = (postId) => {
    history.push(`/dealer/${postId}`);
  };

  return (
    <>
      <div className=" colorBg_new d-none d-lg-block "></div>
      <div className="container">
        <h2 className="fw-bolder my-4 fs-4">
          Used Car Trader & Dealers in UAE
        </h2>

        {loading ? (
          <div className="No_ads_loading p-3 text-center">
            <div>
              <div className="row">
                <div className="col-lg-6">
                  <div className="row">
                    <div className="col-lg-4">
                      <Skeleton
                        animation="wave"
                        variant="rounded"
                        width="100%"
                        height={170}
                      />
                    </div>
                    <div className="col-lg-8 d-flex flex-column justify-content-between">
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
                              width={140}
                              height={17}
                            />
                          </h6>
                          <h4 className="mt-4">
                            <Skeleton
                              animation="wave"
                              variant="rounded"
                              width={250}
                              height={20}
                            />
                          </h4>
                          <h4 className="mt-4">
                            <Skeleton
                              animation="wave"
                              variant="rounded"
                              width={180}
                              height={18}
                            />
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : dealerList && dealerList.length ? (
          <div className="row mx-0">
            {dealerList &&
              dealerList.map((item) => (
                <div
                  key={item?.showroom_id}
                  className="col-lg-6 col-md-6 col-12 mb-4"
                >
                  <Link
                    href={`/dealer-detail/${item?.showroom_id}`}
                    key={item?.showroom_id}
                  >
                    <div
                      className="row pe-3 py-3 myAd card_bg me-md-3"
                      // onClick={() => openPost(item.showroom_id)}
                    >
                      <div
                        className="col-lg-4 Myads_photos cursorPointer"
                        key={item?.post_id}
                      >
                        <img
                          src={`${awsImageURL}/public/dealer/${item?.user_id}/${item?.showroom_logo}`}
                          alt={``}
                          srcSet=""
                          //   key={ad.post_id}
                          //   onClick={() => openPost(ad.post_id)}
                        />
                      </div>
                      <div className="col-lg-8 d-flex">
                        <div className="vehicleDetails p-3 rounded-3 bg-white w-100 text-capitalize">
                          <h4
                            //   key={ad.post_id}
                            //   onClick={() => openPost(ad.post_id)}
                            className="fw-600 cursorPointer "
                          >
                            {item?.showroom_name}
                          </h4>

                          <h5
                            style={{
                              color: "#989ead",
                              fontWeight: 400,
                              fontSize: 16,
                            }}
                          >
                            Dealer in Karachi
                          </h5>
                          <div className="postlocation d-flex align-items-center mb-3">
                            <i className="fa-solid fa-location-dot me-3"></i>
                            <p className="m-0">{item?.showroom_address}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
          </div>
        ) : (
          <div className="No_ads p-3 text-center">
            <p>No Dealers Available</p>
          </div>
        )}
      </div>
    </>
  );
}
