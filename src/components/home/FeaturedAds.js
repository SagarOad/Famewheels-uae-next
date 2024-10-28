"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Grid from "@mui/material/Grid";

const FeaturedAds = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const awsImageURL = process.env.NEXT_PUBLIC_AWS_IMAGE_URL;

  const [adData, setAdData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/featuredadds`);
        setAdData(response?.data?.featured?.data.slice(0, 15));
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      }
    };

    fetchData();
  }, [baseUrl]);

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

  return (
    <>
      <div className=" container">
        <div className=" mt-5 mb-4">
          <div className="d-flex justify-content-between">
            <h2 className="text-start section-titles ">
              Featured <span className="color-secondary"> Used Cars</span>
            </h2>
            <a href="/search?at=2" className=" view-text px-2 color-secondary">
              View All Featured Cars
            </a>
          </div>
          <Grid container spacing={2}>
            {adData &&
              adData.map((item) => (
                <Grid
                  lg={2.4}
                  md={4}
                  sm={6}
                  className=" col-6 mb-3 p-2"
                  key={item?.postId}
                >
                  <Link
                    href={`/vehicle-details/${item?.postId}`}
                    key={item?.postId}
                  >
                    <div className="adPost">
                      <div className="position-relative ">
                        <img
                          src={`${awsImageURL}/public/posts/${item?.post_token}/${item?.cover}`}
                          alt={`${item?.makeName} ${item?.modelName} ${item?.yearName}`}
                          className="p-2"
                        />
                        <div className="d-flex align-items-center justify-content-between position-absolute top-0 w-100 ">
                          <div className="m-0 px-2 py-1 fw-500 featured-badge text-center">
                            Featured
                          </div>
                        </div>
                      </div>

                      <div className=" pb-2 px-2 ">
                        <div className=" bg-white p-2 rounded-2  ">
                          <h5 className="fw-600 ad-Title color-black text-capitalize mb-1">
                            {item?.makeName} {item?.modelName} {item?.yearName}
                          </h5>
                          <h4 className="fw-600 adPrice mb-1">
                            <span>PKR {formatPrice(item?.price)}</span>
                          </h4>
                          <p className="adlocation m-0 fw-500">
                            <i className="fa-solid fa-location-dot me-2 color-secondary"></i>
                            {item?.cityName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Grid>
              ))}
          </Grid>
        </div>
      </div>
    </>
  );
};

export default FeaturedAds;
