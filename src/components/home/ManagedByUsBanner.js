import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import CertifiedImage from "@/images/famewheels-certified-icon.png";

const ManagedByUsBanner = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const awsImageURL = process.env.NEXT_PUBLIC_AWS_IMAGE_URL;

  const [adData, setAdData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/managedbyfamewheels`);
        setAdData(response?.data?.data?.data?.slice(0, 15));
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
      <div className="container">
        <div className="my-5">
          <div>
            {adData && (
              <div className="d-flex justify-content-between">
                <h2 className="text-start section-titles ">
                  Managed by <span className="color-secondary">FameWheels</span>
                </h2>
              </div>
            )}
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
                          <div className="img_box">
                            <img
                              src={`${awsImageURL}/public/posts/${item?.post_token}/${item?.cover}`}
                              alt={`${item?.makeName} ${item?.modelName} ${item?.yearName}`}
                              className="p-2  "
                            />
                          </div>
                          <div className="d-flex align-items-center justify-content-between position-absolute top-0 mt-3 ms-2 ">
                            <img
                              className="badge_img "
                              src={CertifiedImage}
                              alt="Certified Car"
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
      </div>
    </>
  );
};

export default ManagedByUsBanner;
