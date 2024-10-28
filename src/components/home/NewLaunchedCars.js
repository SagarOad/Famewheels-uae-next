import Link from "next/link";
import { Grid } from "@mui/material";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";

const NewLaunchedCars = (page = 1) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const awsImageURL = process.env.NEXT_PUBLIC_AWS_IMAGE_URL;

  const [adData, setAdData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/newlylaunchedcarlist`, {
          params: { page },
        });
        setAdData(response?.data?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      }
    };

    fetchData();
  }, [baseUrl, page]);

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

  const limitedData = adData && adData.slice(0, 15);

  return (
    <>
      <div className="container">
        <div className="my-5">
          <h2 className="text-start section-titles ">Newly Launched Cars</h2>

          <div>
            <Grid container spacing={2}>
              {limitedData &&
                limitedData?.map((item) => (
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
                          <Image
                            src={`${awsImageURL}/public/posts/${item?.newcarpost_token}/${item?.newcarpost_cover}`}
                            alt={`${item?.make} ${item?.model_name}`}
                            className="p-2"
                            width={500}
                            height={500}
                          />
                          <div className="d-flex align-items-center justify-content-between position-absolute top-0 w-100 ">
                            <div className="m-0 px-2 py-1 fw-600 featured-badge text-center">
                              Newly Launched
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

export default NewLaunchedCars;
