"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Search } from "@mui/icons-material";
import Image from "next/image";

// Import images with Next.js Image component for optimization
import Slide1 from "@/images/uaeBanner.png";
import Slide2 from "@/images/UaeBanner2.png";
import Slide3 from "@/images/POST-ADD-WEB-BANNER.webp";
import MSlider1 from "@/images/slider1.webp";
import MSlider2 from "@/images/slider2.webp";
import MSlider3 from "@/images/slider3.webp";
import MSlider4 from "@/images/slider4.webp";
import MSlider5 from "@/images/slider5.webp";

const TopSlider = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const [cities, setCities] = useState([]);
  const [make, setMake] = useState([]);
  const [error, setError] = useState(null);

  const history = useRouter();
  const [searchByUsed, setSearchByUsed] = useState(true);
  const [selectedMake, setSelectedMake] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [search, setSearch] = useState("");
  const sliderRef = useRef(null);
  useEffect(() => {
    sliderRef.current.slickPlay();
  }, []);

  const handleSelectedMake = (_, newValue) => {
    setSelectedMake(newValue);
  };

  const handleSelectedCity = (_, newValue) => {
    setSelectedCity(newValue);
  };

  const openSearch = () => {
    const make = selectedMake?.makeName || "";
    const city = selectedCity?.cityName || "";

    let queryParams = [];

    if (make !== "") {
      queryParams.push(`make=${make}`);
    }
    if (city !== "") {
      queryParams.push(`city=${city}`);
    }

    history.push(`/search?${queryParams.join("&")}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search) {
      history.push(`/search?sr=${search}&condition=used`);
    }
  };

  const settings = {
    dots: true,
    speed: 4000,
    slidesToShow: 1,
    infinite: true,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };

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

  return (
    <>
      <form
        className="mx-2 py-1 px-2 d-flex justify-content-between gap-1 rounded-3"
        id="topSearch"
        onSubmit={handleSubmit}
        style={{ backgroundColor: "#f0f0f0" }}
      >
        <span color="error" className="pt-1 m-0" type="submit">
          <Search fontSize="medium" sx={{ padding: 0, m: 0 }} color="error" />
        </span>
        <input
          type="text"
          className="form-control w-100 border-0"
          style={{ backgroundColor: "transparent", fontSize: "14px" }}
          id="search"
          aria-describedby="search"
          placeholder="Search Used Cars"
          required
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      <div className="position-relative">
        <div
          id="HomeTopCarousel"
          className="carousel slide position-relative"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner topSlider">
            <div className="carousel-item active">
              <Image
                src={Slide1}
                className="d-block w-100"
                alt="Slide1"
                srcSet={Slide1}
              />
            </div>
            <div className="carousel-item">
              <Image
                src={Slide3}
                className="d-block w-100"
                alt="Slide2"
                srcSet={Slide3}
              />
            </div>
            <div className="carousel-item">
              <Image
                src={Slide2}
                className="d-block w-100"
                alt="Slide3"
                srcSet={Slide2}
              />
            </div>
          </div>
        </div>

        <div className="w-100 h-100 mt-4" id="slider_Hero">
          <Slider {...settings} ref={sliderRef}>
            {[MSlider1, MSlider2, MSlider3, MSlider4, MSlider5].map(
              (slide, index) => (
                <div key={index} className="mx-2 mobileSlider_img">
                  <Image
                    src={slide}
                    loading="lazy"
                    alt={`Slide - ${index + 1}`}
                    className="img-fluid rounded-3"
                  />
                </div>
              )
            )}
          </Slider>
        </div>

        <div className="SliderSearchBar">
          <div className="container">
            <div className="SliderSearchBar_bg">
              <h4>Find Your Right Car Here</h4>
              <ul
                className="nav nav-pills mt-3 sliderSearchTabs"
                id="pills-tab"
                role="tablist"
              >
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active fw_br"
                    id="used-cars-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-used"
                    type="button"
                    role="tab"
                    aria-controls="pills-used"
                    aria-selected="true"
                    onClick={() => setSearchByUsed(true)}
                  >
                    Used Cars
                  </button>
                </li>
                <Link
                  href="/search"
                  className="text-white cursorPointer fw_br adv_Btn"
                >
                  <i className="fa-solid fa-magnifying-glass me-2"></i>Advanced
                  Search
                </Link>
              </ul>
              <div className="tab-content" id="pills-tabContent">
                <div
                  className="tab-pane sliderSearchTab show active"
                  id="pills-used"
                  role="tabpanel"
                  aria-labelledby="used-cars-tab"
                >
                  <div className="sidebarFilters">
                    <div className="row">
                      <div className="col-lg-5 col-md-5 col-12">
                        <Box style={{ position: "relative", zIndex: 1 }}>
                          <Autocomplete
                            id="vehicleMake"
                            className="searchBar_feilds"
                            options={make || []}
                            getOptionLabel={(option) => option?.makeName}
                            value={selectedMake}
                            onChange={handleSelectedMake}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select Make"
                                variant="filled"
                                required
                                className="searchTabsInput"
                              />
                            )}
                          />
                        </Box>
                      </div>
                      <div className="col-lg-5 col-md-5 col-12">
                        <Autocomplete
                          id="vehicleMake"
                          options={cities || []}
                          getOptionLabel={(option) => option?.cityName}
                          value={selectedCity}
                          onChange={handleSelectedCity}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select City"
                              variant="filled"
                              required
                              className="searchTabsInput"
                            />
                          )}
                        />
                      </div>
                      <div className="col-lg-2 col-md-2 col-12">
                        <Button
                          variant="contained"
                          className="rounded-pill bgSecondary w-100 py-3 text-white px-4 py-2 fw-normal text-capitalize fw-600"
                          onClick={openSearch}
                        >
                          Search
                        </Button>
                      </div>
                    </div>
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

export default TopSlider;
