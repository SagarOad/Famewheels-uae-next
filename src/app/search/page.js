"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Sidebar from "./sideBar";
import AdsResult from "./adsResult";
import Pagination from "@mui/material/Pagination";
import { useSearchParams } from "next/navigation";
import { Helmet } from "react-helmet";

export default function SearchResult() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const [vehicleCategory, setVehicleCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();

//   const queryParams = new URLSearchParams(location.search);
  const selectedAdType = searchParams.get("at");
  const selectedMake = searchParams.get("make");
  const selectedModel = searchParams.get("model");
  const selectedYear = searchParams.get("year");
  const selectedCity = searchParams.get("city");
  const selectedCategories = searchParams.get("category");
  const selectedCondition = searchParams.get("cnd");
  const selectedMinPrice = searchParams.get("mnp");
  const selectedMaxPrice = searchParams.get("mxp");
  const searchData = searchParams.get("keyword");

  const [filters, setFilters] = useState({
    search: null,
    condition: "used",
    city: 0,
    make: 0,
    model: 0,
    year: 0,
    minPrice: 0,
    maxPrice: 50000000,
    category: 0,
  });
  const [postData, setPostData] = useState([]);
  const [featuredData, setFeaturedData] = useState([]);

  const searchCategory = selectedCategories;

  const searchAdType = selectedAdType;
  const searchMake = selectedMake;
  const searchModel = selectedModel;
  const searchYear = selectedYear;

  const searchCity = selectedCity;

  const searchCondition = selectedCondition;
  const searchMaxPrice = selectedMaxPrice;
  const searchMinPrice = selectedMinPrice;

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await axios.get(`${baseUrl}/bycategory`);
        setVehicleCategory(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchFilters();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleFilterChange = (filterName, value) => {
    setPage(1);
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  const handleRecall = () => {};

  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const user = localStorage.getItem("data");
  const userId = JSON.parse(user)?.id;

  const [freeAdCount, setFreeAdCount] = useState("");

  const fetchData = useCallback(
    async (filters, page) => {
      try {
        const category = filters.category || searchCategory || 0;
        const search = filters.search || searchData || " ";
        const make = filters.make || [searchMake] || 0;
        const model = filters.model || [searchModel] || [];
        const year = filters.year || [searchYear] || [];
        const city = filters.city || [searchCity] || 0;
        const mileage = filters.mileage || 0;
        const transmition = filters.transmition || "";
        const fule = filters.fule || "";
        const add = filters.add || searchAdType || "";
        const minPrice = filters.minPrice || searchMinPrice;
        const maxPrice = filters.maxPrice || searchMaxPrice;

        const response = await axios.get(`${baseUrl}/webfilterpost`, {
          params: {
            page: page,
            search_name: search,
            city_name: city,
            makeName: make,
            modelName: model,
            year_id: year,
            price_from: minPrice,
            price_to: maxPrice,
            engine_capacity: category,
            mileage: mileage,
            transmition: transmition,
            enginetype: fule,
            addtype: add,
            condition: "used",
          },
        });

        setPostData(response?.data?.posts?.data);
        setFeaturedData(response?.data?.featured_adds?.data);
        setFreeAdCount(response?.data?.addcount);
        setTotalPages(response?.data?.posts?.last_page);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    [
      searchCategory,
      searchMake,
      searchCity,
      searchCondition,
      userId,
      searchData,
    ]
  );
  useEffect(() => {
    fetchData(filters, page);
  }, [filters, page]);

  const [state, setState] = useState({
    left: false,
  });

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Adsbygoogle error: ", e);
      // alert(e);
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>
          {selectedMake
            ? `${selectedMake} cars in ${
                selectedCity ? selectedCity : "UAE"
              } | Famewheels`
            : selectedCity
            ? `Cars for sale in ${selectedCity} | Famewheels`
            : `used cars for sale in UAE | Famewheels`}
        </title>
        <meta
          name="description"
          content={
            selectedCity
              ? `Find a used Cars for sale in ${selectedCity} with Famewheels you can buy a used car with a few easy steps and also bid on your favorite car or post free ads and find the best condition car.| Famewheels`
              : "Discover top deals on used cars for sale in UAE with FameWheels. Our expert inspections guarantee the quality and reliability of each vehicle. Find your ideal used car in UAE today."
          }
        />
        <meta
          property="og:title"
          content={
            selectedMake
              ? `${selectedMake} cars in ${
                  selectedCity ? selectedCity : "UAE"
                } | Famewheels`
              : selectedCity
              ? `Cars for sale in ${selectedCity} | Famewheels`
              : `Used cars for sale in UAE | Famewheels`
          }
        />
        <meta
          property="og:description"
          content={
            selectedCity
              ? `Find a used Cars for sale in ${selectedCity} with Famewheels you can buy a used car with a few easy steps and also bid on your favorite car or post free ads and find the best condition car.| Famewheels`
              : "Discover top deals on used cars for sale in UAE with FameWheels. Our expert inspections guarantee the quality and reliability of each vehicle. Find your ideal used car in UAE today."
          }
        />

        <meta property="og:url" content={window.location.href} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={
            selectedMake
              ? `${selectedMake} cars in ${
                  selectedCity ? selectedCity : "UAE"
                } | Famewheels`
              : selectedCity
              ? `Cars for sale in ${selectedCity} | Famewheels`
              : `Used cars for sale in UAE | Famewheels`
          }
        />
        <meta
          name="twitter:description"
          content={
            selectedCity
              ? `Find a used Cars for sale in ${selectedCity} with Famewheels you can buy a used car with a few easy steps and also bid on your favorite car or post free ads and find the best condition car.| Famewheels`
              : "Discover top deals on used cars for sale in UAE with FameWheels. Our expert inspections guarantee the quality and reliability of each vehicle. Find your ideal used car in UAE today."
          }
        />

        <meta property="og:type" content="article" />
        <meta
          property="description"
          content={
            selectedCity
              ? `Find a used Cars for sale in ${selectedCity} with Famewheels you can buy a used car with a few easy steps and also bid on your favorite car or post free ads and find the best condition car.| Famewheels`
              : "Discover top deals on used cars for sale in UAE with FameWheels. Our expert inspections guarantee the quality and reliability of each vehicle. Find your ideal used car in UAE today."
          }
        />
      </Helmet>
      <div className=" search_bg d-none d-lg-block ">
        <div className="container  h-100 d-flex flex-column justify-content-end ">
          <div className="filters_bg px-4 py-4 mb-5 rounded-4 ">
            <h3 className="fw-700 text-white pb-2">Find Used Cars In UAE</h3>
            <div>
              <Sidebar
                vehicleCategory={vehicleCategory}
                onCategoryChange={handleCategoryChange}
                selectedFilters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="used_main text-center p-5 d-none">
        <div className="container h-100 d-flex justify-content-end align-items-center">
          <h3>Search Cars In UAE</h3>
        </div>
      </div>

      <div className="d-block d-lg-none">
        <Sidebar
          vehicleCategory={vehicleCategory}
          onCategoryChange={handleCategoryChange}
          selectedFilters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>
      <div className="mt-3">
        <div className="container d-flex justify-content-start align-items-center mb-4">
          <h3 className=" filtersHead fw-700 mb-0">
            Buy & Sell cars online in UAE
          </h3>
          <span className="filtersHead_span ms-2  rounded-3 fs-6">
            - {freeAdCount} Ads
          </span>
        </div>
      </div>
      <div className="container">
        <div className="row mb-5 mt-2">
          <div className="col-lg-9 col-12">
            <AdsResult
              selectedCategory={selectedCategory}
              postData={postData}
              featuredData={featuredData}
              fetchData={handleRecall}
              loading={loading}
            />
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChange}
              color="secondary"
            />
          </div>
          <div
            className="col-lg-3 col-12 d-none d-md-block position-relative"
            style={{ zIndex: -1 }}
          >
            <div
              className="  "
              style={{ height: 900, position: "sticky", top: 150, zIndex: -2 }}
            >
              <div
                style={{
                  right: 0,
                  fontSize: 14,
                  fontWeight: "600",
                }}
                className=" position-absolute px-2 bg-white border-black border"
              >
                Ad
              </div>
              <ins
                className="adsbygoogle"
                style={{
                  display: "inline-block",
                  width: "300px",
                  height: "800px",
                }}
                data-ad-client="ca-pub-3390551153563969"
                data-ad-slot="2905132142"
              ></ins>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
