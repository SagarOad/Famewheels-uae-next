"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Lottie from "lottie-react";
import NotAvailable from "@/images/not-found.json";
import { Pagination } from "@mui/material";

export default function NewCarsList({ params }) {
  const { makeName, makeId } = params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const awsImageURL = process.env.NEXT_PUBLIC_AWS_IMAGE_URL;

  const [newCarsList, setNewCarsList] = useState([]); 
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/newcarpostlilst`, { // Fixed endpoint name
        params: {
          make_id: makeId, // Use makeId from URL params
          page: page,
        },
      });

      setNewCarsList(response?.data?.data);
      setTotalPages(response?.data?.last_page);
      setPage(response?.data?.current_page);
      setError(null); // Reset error on successful fetch
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again."); // Set error message
    }
  };

  useEffect(() => {
    if (makeId) {
      fetchData();
    }
  }, [makeId, page]);

  const formatPrice = (price) => {
    if (price >= 1e12) return (price / 1e12).toLocaleString() + " Kharab";
    if (price >= 1e9) return (price / 1e9).toLocaleString() + " Arab";
    if (price >= 1e7) return (price / 1e7).toLocaleString() + " Crore";
    if (price >= 1e5) return (price / 1e5).toLocaleString() + " Lacs";
    if (price >= 1e3) return (price / 1e3).toLocaleString() + " Thousand";
    return price.toLocaleString();
  };

  return (
    <div className="container">
      <div className="text-center py-5">
        <h2 className="text-start section-titles pb-3">
          Explore New {makeName} Cars
        </h2>

        <div>
          {error ? (
            <div className="text-center">
              <h5 className="text-danger">{error}</h5>
            </div>
          ) : newCarsList?.length === 0 ? (
            <div className="notBidsAvail text-center">
              <Lottie
                style={{ height: 200 }}
                animationData={NotAvailable}
                loop
              />
              <h5 className="fw-600">No cars available</h5>
            </div>
          ) : (
            <>
              <div className="row">
                {newCarsList.map((item) => (
                  <div
                    className="col-lg-3 col-md-4 col-6 mb-3 p-2 cursorPointer"
                    key={`${item?.newcarpost_id}${item?.make}`}
                  >
                    <Link
                      href={`/new-car-specs/${item?.make}/${item?.newcarpost_id}`} // Dynamic route link
                    >
                      <div className="adPost text-start">
                        <div className="position-relative m-2">
                          <img
                            src={`${awsImageURL}/public/posts/${item?.newcarpost_token}/${item?.newcarpost_cover}`}
                            alt={`${item?.make} ${item?.model_name}`}
                            style={{
                              boxShadow: "unset",
                              objectFit: "contain",
                            }}
                          />
                        </div>

                        <div className="p-2">
                          <h5 className="fw-600 ad-Title color-black text-capitalize mb-1 text-center">
                            {item?.make} {item?.model_name}
                          </h5>
                          <h4
                            style={{ color: "#20409a" }}
                            className="fw-600 text-center adPrice mb-1"
                          >
                            <span style={{ color: "#20409a" }}>
                              PKR {formatPrice(item?.newcarpost_price)}
                            </span>
                          </h4>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handleChange}
                color="secondary"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
