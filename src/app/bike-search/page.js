"use client"
import React, { Fragment, useState, useEffect, useCallback } from "react";
import SeoMeta from "@/components/meta/index.js";
import axios from "axios";
import Sidebar from "./sideBar.js";
import AdsResult from "./adsResult.js";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Pagination from "@mui/material/Pagination";
import { useSearchParams } from "next/navigation";

export default function BikeSearch() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const [vehicleCategory, setVehicleCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState([]);
  const [featuredData, setFeaturedData] = useState([]);
  const [filters, setFilters] = useState({});

  const searchParams = useSearchParams();
  const selectedAdType = searchParams.get("at");
  const selectedMake = searchParams.get("mk");
  const selectedModel = searchParams.get("md");
  const selectedYear = searchParams.get("year");
  const selectedCity = searchParams.get("ct");
  const selectedCategories = searchParams.get("ctg");
  const selectedCondition = searchParams.get("cnd");
  const selectedMinPrice = searchParams.get("mnp");
  const selectedMaxPrice = searchParams.get("mxp");
  const searchData = searchParams.get("sr");

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
    setPage(0);
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  const handleChange = (event, value) => {
    setPage(value);
  };

  const user = localStorage.getItem("data");
  const userId = user ? JSON.parse(user)?.id : null;

  const fetchData = useCallback(
    async (filters, page) => {
      try {
        setLoading(true);
        const category = filters.category || selectedCategory || 0;
        const search = filters.search || searchData || " ";
        const make = filters.make || selectedMake || 0;
        const model = filters.model || selectedModel || [];
        const year = filters.year || selectedYear || [];
        const city = filters.city || selectedCity || 0;
        const mileage = filters.mileage || 0;
        const fule = filters.fule || "";
        const add = filters.add || selectedAdType || "";
        const minPrice = filters.minPrice || selectedMinPrice;
        const maxPrice = filters.maxPrice || selectedMaxPrice;

        const response = await axios.get(`${baseUrl}/bike-filter-post`, {
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
            enginetype: fule,
            addtype: add,
            condition: "used",
          },
        });

        setPostData(response?.data?.posts?.data);
        setFeaturedData(response?.data?.featured_adds?.data);
        setTotalPages(response?.data?.posts?.last_page);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    },
    [
      selectedCategory,
      selectedMake,
      selectedCity,
      selectedCondition,
      userId,
      searchData,
    ]
  );

  useEffect(() => {
    fetchData(filters, page);
  }, [fetchData, filters, page]);

  const [state, setState] = useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <>
      <SeoMeta
        title="Search Used Bikes | FameWheels"
        desc="Find Reliable and Affordable used bikes in Excellent Condition at our dealership. we are choose from  large selection of automobiles here to find the perfect used bikes today."
        url="search"
      />

      <div className="used_main text-center p-5 d-none">
        <div className="container h-100 d-flex justify-content-start align-items-center">
          <h3>Search Bikes In UAE</h3>
        </div>
      </div>
      <div className=" text-center mt-3">
        <div className="container d-flex justify-content-md-start justify-content-center align-items-center">
          <h3 className="fw-700">Find Used Bikes In UAE</h3>
        </div>
      </div>
      <div className="container">
        <div className="row mb-5 mt-2">
          <div className="text-end ">
            <button
              className=" toggleLeftIcon float-end btn d-block d-md-none fw-600 focusUnset"
              onClick={toggleDrawer("left", true)}
            >
              <i className="fa-solid fa-bars-staggered mb-3 me-2"></i>
              Filters
            </button>
            <div>
              <Fragment key="left">
                <SwipeableDrawer
                  anchor="left"
                  open={state.left}
                  onClose={toggleDrawer("left", false)}
                  onOpen={toggleDrawer("left", true)}
                  className="filterSidebar"
                >
                  {/* Content for the "right" drawer */}
                  <div className="p-3 filterSidebar">
                    <h5 className="fs-6 fw-500 mb-3">Apply filters</h5>
                    <Sidebar
                      vehicleCategory={vehicleCategory}
                      onCategoryChange={handleCategoryChange}
                      selectedFilters={filters}
                      onFilterChange={handleFilterChange}
                      searchData={searchData}
                    />
                  </div>
                </SwipeableDrawer>
              </Fragment>
            </div>
          </div>
          <div className="col-lg-3 col-md-4 d-none d-md-block">
            {/* Sidebar */}
            <Sidebar
              vehicleCategory={vehicleCategory}
              onCategoryChange={handleCategoryChange}
              selectedFilters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
          <div className="col-lg-9 col-md-8">
            {/* Ads */}
            <AdsResult
              selectedCategory={selectedCategory}
              selectedAdType={selectedAdType}
              featuredData={featuredData}
              postData={postData}
              loading={loading}
            />
          </div>
        </div>
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChange}
              color="primary"
            />
          </div>
        )}
      </div>
    </>
  );
}
