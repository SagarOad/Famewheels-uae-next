"use client";

import { useRouter } from "next/navigation";
import React from "react";
import Manufactures from "../manufacturers";
import Cities from "../cities";
import { useState, useEffect } from "react";
import Image from "next/image";

const CategorySlider = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const [cities, setCities] = useState([]);
  const [make, setMake] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  const [error, setError] = useState(null);

  const getData = () => {
    fetch("categories.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {});
  };

  useEffect(() => {
    getData();
  }, []);

  const history = useRouter();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${baseUrl}/cities`);
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      }
    };

    fetchCities();
  }, [baseUrl]);

  useEffect(() => {
    const fetchMake = async () => {
      try {
        const response = await axios.get(`${baseUrl}/byMake`);
        setMake(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      }
    };

    fetchMake();
  }, [baseUrl]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await axios.get(`${baseUrl}/bycategory`);
        setCategoryData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      }
    };

    fetchFilters();
  }, [baseUrl]);

  const openCategory = (category) => {
    history.push(`/search?ctg=${category}&`);
  };

  const limitedCategoryData = categoryData.slice(0, 12);

  return (
    <>
      <div>
        <ul
          className="nav nav-pills mb-3 categoryTabs mt-5 justify-content-start justify-align-content-md-center "
          id="pills-tab"
          role="tablist"
        >
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active"
              id="pills-home-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-home"
              type="button"
              role="tab"
              aria-controls="pills-home"
              aria-selected="true"
            >
              By Make
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="pills-profile-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-profile"
              type="button"
              role="tab"
              aria-controls="pills-profile"
              aria-selected="false"
            >
              By City
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="pills-contact-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-contact"
              type="button"
              role="tab"
              aria-controls="pills-contact"
              aria-selected="false"
            >
              By Category
            </button>
          </li>
        </ul>
        <div className="tab-content" id="pills-tabContent">
          <div
            className="tab-pane  show active"
            id="pills-home"
            role="tabpanel"
            aria-labelledby="pills-home-tab"
          >
            <Manufactures make={make} />
          </div>
          <div
            className="tab-pane "
            id="pills-profile"
            role="tabpanel"
            aria-labelledby="pills-profile-tab"
          >
            <Cities cities={cities} />
          </div>
          <div
            className="tab-pane "
            id="pills-contact"
            role="tabpanel"
            aria-labelledby="pills-contact-tab"
          >
            <div
              id="carouselExampleControls"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner categoryInner">
                <div className="carousel-item active">
                  <div className="row">
                    {limitedCategoryData &&
                      limitedCategoryData.map((item) => (
                        <div
                          className="col-lg-2 col-4 my-2"
                          key={item?.categoryId}
                        >
                          <div className="categpryBtn text-center p-3">
                            <button
                              onClick={() => openCategory(item?.category)}
                              className="btn w-100 h-100"
                            >
                              <Image
                                width={500}
                                height={500}
                                src={`https://gallery.famewheels.com/images/Category/${item?.image_name}`}
                                alt="icon"
                              />
                              <h6 className="pt-1 mt-2">{item?.category}cc</h6>
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategorySlider;
