import { useState, useEffect } from "react";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import axios from "axios";

const PopularNewCars = (page = 1) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const awsImageURL = process.env.NEXT_PUBLIC_AWS_IMAGE_URL;

  const [adData, setAdData] = useState([]);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/newcarpostlilst`, {
          params: {
            page,
          },
        });
        setAdData(response?.data?.data.slice(10, 25));
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      }
    };

    fetchData();
  }, [baseUrl, page]);

  return (
    <>
      <div className="container">
        <div className="my-5">
          <div className="d-flex justify-content-between">
            <h2 className="text-start section-titles ">Popular New Cars</h2>
            <a href="/new-cars" className=" view-text px-2 color-secondary">
              View All New Cars
            </a>
          </div>

          <div>
            <Grid container spacing={2}>
              {adData &&
                adData.map((item) => (
                  <Grid
                    lg={2.4}
                    md={4}
                    sm={6}
                    className=" col-6 mb-3 p-2"
                    key={`${item?.newcarpost_id}${item?.make}`}
                  >
                    <Link
                      href={`/new-car-specs?make=${item?.make}/${item?.newcarpost_id}`}
                      key={item?.newcarpost_id}
                    >
                      <div className="adPost">
                        <div className="position-relative">
                          <img
                            src={`${awsImageURL}/public/posts/${item?.newcarpost_token}/${item?.newcarpost_cover}`}
                            alt={`${item?.make} ${item?.model_name}`}
                            className="p-2"
                          />
                          <div className="d-flex align-items-center justify-content-between position-absolute top-0 w-100 ">
                            <div className="m-0 px-2 py-1 fw-600 featured-badge text-center">
                              New
                            </div>
                          </div>
                        </div>

                        <div className=" pb-2 px-2 ">
                          <div className=" bg-white p-2 rounded-2  ">
                            <h5 className="fw-600 ad-Title color-black text-capitalize mb-1">
                              {item?.make} {item?.model_name}
                            </h5>
                            <h4 className="fw-600 adPrice mb-1">
                              <span>
                                PKR {formatPrice(item?.newcarpost_price)}
                              </span>
                            </h4>
                            <p className="adlocation m-0 fw-500">
                              <i className="fa-solid fa-location-dot me-2 color-secondary"></i>
                              {item?.year}
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
      </div>
    </>
  );
};

export default PopularNewCars;
