"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useRouter, useSearchParams } from "next/navigation";
import { Drawer, Button, Box } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  Autocomplete,
  Chip,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
export default function Sidebar({
  vehicleCategory,
  onCategoryChange,
  onFilterChange,
  selectedFilters,
  searchData,
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const searchParams = useSearchParams();
  const histtory = useRouter();

  //   const queryParams = new URLSearchParams(location.search);

  const selectedAdType = searchParams.get("at");
  const keywordSearch = searchParams.get("keyword");

  const selectedCategory = searchParams.get("ctg");
  const searhcedCategory = selectedCategory
    ? selectedCategory.split(",").map(String)
    : null;

  const selectedCity = searchParams.get("city");
  const searhcedCity = selectedCity ? selectedCity.split(",").map(String) : [];

  const selectedMake = searchParams.get("make");
  const searhcedMakes = selectedMake ? selectedMake.split(",").map(String) : [];

  const selectedModel = searchParams.get("model");
  const searhcedModel = selectedModel
    ? selectedModel.split(",").map(String)
    : [];

  const selectedYear = searchParams.get("year");

  const [allCities, setAllCities] = useState([]);
  const [allMake, setAllMake] = useState([]);
  const [allModel, setAllModel] = useState([]);
  const [SearchInput, setSearchInput] = useState("");
  const [adType, setAdType] = useState(selectedAdType);
  const [selectedCategry, setSelectedCategry] = useState(searhcedCategory);
  const [selectedCities, setSelectedCities] = useState(searhcedCity);
  const [selectedMakes, setSelectedMakes] = useState(searhcedMakes);
  const [selectedModels, setSelectedModels] = useState(searhcedModel);
  const [modelYear, setModelYear] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [more, setMore] = useState(11);
  const [openCity, setOpenCity] = useState(false);
  const [openMake, setOpenMake] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [openYear, setOpenYear] = useState(false);

  const toggleDrawerCity = () => {
    setOpenCity(!openCity);
  };

  const toggleDrawerMake = () => {
    setOpenMake(!openMake);
  };

  const toggleDrawerModel = () => {
    setOpenModel(!openModel);
  };

  const toggleDrawerYear = () => {
    setOpenYear(!openYear);
  };

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await axios.get(`${baseUrl}/cities`);
        setAllCities(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchMake = async () => {
      try {
        const response = await axios.get(`${baseUrl}/byMake`);
        setAllMake(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMake();
  }, []);

  useEffect(() => {
    if (keywordSearch) {
      setSearchInput(keywordSearch);
    }
    if (selectedMake && allMake) {
      const makeObject = allMake.find((make) => make.makeName === selectedMake);
      if (makeObject) {
        setSelectedMakeValue(makeObject);
      }
    }
  }, [allMake]);

  useEffect(() => {
    const fetchModel = async () => {
      try {
        const response = await axios.get(`${baseUrl}/multipleModels`, {
          params: {
            makeName: selectedMakes,
          },
        });
        setAllModel(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (selectedMakes.length > 0) {
      fetchModel();
    }
  }, [selectedMakes]);

  useEffect(() => {
    const fetchYear = async () => {
      try {
        const response = await axios.get(`${baseUrl}/getModelYear`);

        setModelYear(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    // if (selectedModels?.length) {
    // }
    fetchYear();
  }, [selectedModels]);

  // console.log(allMake, "all make");

  const formatPrice = (price) => {
    // Ensure price is a valid number
    if (price === undefined || price === null || isNaN(price)) {
      return "0"; // Or any fallback value you prefer
    }

    // Format large numbers into readable units
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
        " Lacs"
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

  const handleConditionChange = (event) => {
    const condition = event.target.value;
    onFilterChange("condition", condition);
  };

  const handleClearAllFilters = () => {
    setSelectedCities([]);
    onFilterChange("city", []);
    setSelectedMakes([]);
    onFilterChange("make", []);
    setSelectedModels([]);
    onFilterChange("Year", []);
    setSelectedYears([]);
    onFilterChange("year", []);
    onFilterChange("category", null);
    setSelectedCityValue(null);
    setSelectedMakeValue(null);
    setSelectedModelValue(null);
    setSelectedYearValue(null);
    setSelectedCategoryValue(null);
    setSelectedCategry(null);
    setSearchInput("");
    onFilterChange("search", []);
    histtory.replace(`/search`);
  };

  const [selectedCityValue, setSelectedCityValue] = useState(null);
  const [selectedMakeValue, setSelectedMakeValue] = useState(null);
  const [selectedModelValue, setSelectedModelValue] = useState(null);
  const [selectedYearValue, setSelectedYearValue] = useState(null);
  const [selectedCategoryValue, setSelectedCategoryValue] = useState(null);

  const handleCitySelect = (city) => {
    if (city) {
      // If a city is selected, update the state to contain only this city
      setSelectedCities([city]);
      onFilterChange("city", [city]);
    } else {
      // If no city is selected, clear the selection
      setSelectedCities([]);
      onFilterChange("city", []);
    }
  };

  const handleAutocompleteCityChange = (event, newValue) => {
    if (newValue) {
      handleCitySelect(newValue.cityName);
      setSelectedCityValue(newValue);
    } else {
      setSelectedCityValue(null);
    }
  };

  const handleMakeSelect = (make) => {
    if (make) {
      // If a city is selected, update the state to contain only this city
      setSelectedMakes([make]);
      onFilterChange("make", [make]);
    } else {
      // If no city is selected, clear the selection
      setSelectedMakes([]);
      onFilterChange("make", []);
    }
  };

  const handleAutocompleteMakeChange = (event, newValue) => {
    console.log("newValue == ", newValue);
    if (newValue) {
      handleMakeSelect(newValue?.makeName);
      setSelectedMakeValue(newValue);
    } else {
      setSelectedMakeValue(null);
    }
  };

  const handleModelSelect = (model) => {
    if (model) {
      // If a city is selected, update the state to contain only this city
      setSelectedModels([model]);
      onFilterChange("model", [model]);
    } else {
      // If no city is selected, clear the selection
      setSelectedModels([]);
      onFilterChange("model", []);
    }
  };

  const handleAutocompleteModelChange = (event, newValue) => {
    if (newValue) {
      handleModelSelect(newValue.model_name);
      setSelectedModelValue(newValue);
    } else {
      setSelectedModelValue(null);
    }
  };

  const handleYearSelect = (year) => {
    if (year) {
      // If a city is selected, update the state to contain only this city
      setSelectedYears([year]);
      onFilterChange("year", [year]);
    } else {
      // If no city is selected, clear the selection
      setSelectedYears([]);
      onFilterChange("year", []);
    }
  };

  const handleAutocompleteYearChange = (event, newValue) => {
    if (newValue) {
      handleYearSelect(newValue.yearId);
      setSelectedYearValue(newValue);
    } else {
      setSelectedYearValue(null);
    }
  };

  const handleCategorySelect = (newValue) => {
    if (newValue) {
      const category = Number(newValue.category);
      setSelectedCategoryValue(newValue);
      setSelectedCategry(category);
      onFilterChange("category", category);
    } else {
      setSelectedCategoryValue(null);
      onFilterChange("category", null);
    }
  };

  const handleCategoryChange = (event) => {
    const category = Number(event.target.value);
    setSelectedCategry(category);
    onFilterChange("category", category);
  };

  const handleCitiesChange = (city) => {
    // Check if the city is already selected
    if (selectedCities.includes(city)) {
      // If selected, remove it
      setSelectedCities(
        selectedCities.filter((selectedCityId) => selectedCityId !== city)
      );
      onFilterChange(
        "city",
        selectedCities.filter((selectedCityId) => selectedCityId !== city)
      );
      // histtory.replace(
      //   `/search?ct=${selectedCities.filter(
      //     (selectedCityId) => selectedCityId !== city
      //   )}`
      // );
    } else {
      // If not selected, add it
      setSelectedCities([...selectedCities, city]);
      onFilterChange("city", [...selectedCities, city]);
      // histtory.replace(`/search/?ct=${[...selectedCities, city]}`);
    }
  };


  const handleMinPriceChange = (event) => {
    const minPrice = Number(event.target.value);
    if (minPrice <= selectedFilters.maxPrice) {
      onFilterChange("minPrice", minPrice);
    }
  };
  const handleSearchChange = (e) => {
    e.preventDefault();
    onFilterChange("search", SearchInput);
  };

  const handleMaxPriceChange = (event) => {
    const maxPrice = Number(event.target.value);
    if (maxPrice >= selectedFilters.minPrice) {
      onFilterChange("maxPrice", maxPrice);
    }
  };
  const handleMileageChange = (event) => {
    const mileage = Number(event.target.value);
    onFilterChange("mileage", mileage);
  };

  const handleTransmitionChange = (event) => {
    const transmition = event.target.value;
    onFilterChange("transmition", transmition);
  };
  const handleFuleChange = (event) => {
    const fule = event.target.value;
    onFilterChange("fule", fule);
  };

  const handleAddChange = (event) => {
    const add = event.target.value;
    setAdType(add);
    onFilterChange("add", add);
  };

  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedMakes?.length || selectedMake)
      params.append("make", selectedMakes || selectedMake);
    if (selectedModels?.length || selectedModel)
      params.append("model", selectedModels || selectedModel);
    if (selectedYearValue !== null || selectedYear)
      params.append("year", selectedYearValue?.year || selectedYear);
    if (selectedCities?.length || selectedCity)
      params.append("city", selectedCities || selectedCity);
    if (selectedCategry !== null)
      params.append("category", selectedCategry + "cc");
    if (adType) params.append("adtype", adType);
    if (SearchInput || keywordSearch)
      params.append("keyword", SearchInput || keywordSearch);

    histtory.replace(`/search?${params.toString()}`);
  }, [
    selectedMakes,
    selectedCities,
    selectedModels,
    selectedCategry,
    adType,
    selectedYearValue,
    SearchInput,
  ]);


  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Adsbygoogle error: ", e);
      // alert(e);
    }
  }, []);

  console.log("selectedMake === > ", selectedMakeValue);

  return (
    <>
      <div className="h-100 container-md px-0 ">
        <div>
          <div className="row searchFilter_Main mx-3 mx-md-0 d-none d-md-flex ">
            <div className="col-lg-2 col-md-3 col-4 px-0 pb-3 pb-md-0 searchBarFilter">
              <TextField
                id="filtercity"
                label="Search"
                variant="filled"
                placeholder="e.g. Alto 2019"
                InputLabelProps={{ shrink: true }}
                className="searchSideTabsInput"
                type="search"
                value={SearchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {SearchInput !== "" && (
                        <IconButton
                          onClick={handleSearchChange}
                          sx={{ padding: 0 }}
                        >
                          <SearchIcon />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <div className="col-lg-2 col-md-3 col-4 px-0 pb-3 pb-md-0 ">
              <Autocomplete
                id="filtercity"
                options={allCities || []}
                getOptionLabel={(option) => option?.cityName}
                value={selectedCityValue}
                onChange={handleAutocompleteCityChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="City"
                    variant="filled"
                    placeholder="e.g. Karachi"
                    InputLabelProps={{ shrink: true }}
                    className="searchSideTabsInput"
                  />
                )}
              />
            </div>

            <div className="col-lg-2 col-md-3 col-4 px-0 pb-3 pb-md-0 ">
              <Autocomplete
                id="vehicleMake"
                className="searchBar_feilds"
                options={allMake || []}
                getOptionLabel={(option) => option?.makeName}
                value={selectedMakeValue}
                onChange={handleAutocompleteMakeChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label=" Make"
                    variant="filled"
                    placeholder="e.g. Toyota"
                    InputLabelProps={{ shrink: true }}
                    className="searchSideTabsInput"
                  />
                )}
              />
            </div>
            <div className="col-lg-2 col-md-3 col-4 px-0 pb-3 pb-md-0 ">
              {allModel && allModel?.length > 0 ? (
                <Autocomplete
                  id="vehicleMake"
                  className="searchBar_feilds"
                  options={allModel || []}
                  getOptionLabel={(option) => option?.model_name}
                  value={selectedModelValue}
                  onChange={handleAutocompleteModelChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label=" Model"
                      variant="filled"
                      className="searchSideTabsInput"
                      placeholder="Select Model"
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              ) : (
                <Autocomplete
                  id="vehicleMake"
                  className="searchBar_feilds"
                  options={allModel || []}
                  getOptionLabel={(option) => option?.model_name}
                  value={selectedModelValue}
                  onChange={handleAutocompleteModelChange}
                  disabled
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Model"
                      variant="filled"
                      className="searchSideTabsInput"
                      placeholder="Select Make First"
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              )}
            </div>
            <div className="col-lg-2 col-md-3 col-4 px-0 pb-3 pb-md-0 ">
              <Autocomplete
                id="vehicleMake"
                className="searchBar_feilds"
                options={modelYear || []}
                getOptionLabel={(option) => option?.year}
                value={selectedYearValue}
                onChange={handleAutocompleteYearChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label=" Year"
                    variant="filled"
                    placeholder="e.g. 2020"
                    InputLabelProps={{ shrink: true }}
                    className="searchSideTabsInput"
                  />
                )}
              />
            </div>
            <div className="col-lg-2 col-md-3 col-4 px-0 pb-3 pb-md-0 ">
              <div className="dropdown">
                <button
                  className="btn border-0 text-start color-black w-100 bg-white  searchDropdown btn-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  More filters
                  <div className="toggle"></div>
                </button>
                <ul
                  style={{ width: 400 }}
                  className="dropdown-menu border-0 shadow-lg "
                >
                  <div style={{ zIndex: 19999 }} className="p-4 ">
                    <h6 className="fw-bold color-secondary">Price</h6>
                    <div className="priceFilter">
                      <div className=" d-flex align-items-start justify-content-between">
                        <label>Min Price:</label>
                        <div className="w-100">
                          <Slider
                            min={200000}
                            max={50000000}
                            step={50000}
                            value={selectedFilters.minPrice}
                            onChange={(value) => {
                              if (value <= selectedFilters.maxPrice) {
                                onFilterChange("minPrice", value);
                              }
                            }}
                          />
                          <div className="d-flex justify-content-between align-items-center mt-2">
                            <input
                              type="number"
                              value={selectedFilters.minPrice}
                              onChange={handleMinPriceChange}
                              min={0}
                              className="priceAmount"
                              max={selectedFilters.maxPrice}
                            />
                            <span>{formatPrice(selectedFilters.minPrice)}</span>
                          </div>
                        </div>
                      </div>
                      <div className=" d-flex align-items-start justify-content-between mt-3">
                        <label>Max Price:</label>
                        <div className="w-100">
                          <Slider
                            min={200000}
                            max={50000000}
                            step={50000}
                            value={selectedFilters.maxPrice}
                            onChange={(value) => {
                              if (value >= selectedFilters.minPrice) {
                                onFilterChange("maxPrice", value);
                              }
                            }}
                          />
                          <div className="d-flex justify-content-between align-items-center mt-2">
                            <input
                              type="number"
                              value={selectedFilters.maxPrice}
                              onChange={handleMaxPriceChange}
                              min={selectedFilters.minPrice}
                              max={100000000}
                              className="priceAmount"
                            />
                            <span>{formatPrice(selectedFilters.maxPrice)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h6 className="fw-bold color-secondary mt-4 mb-3 ">
                      Category ( CC )
                    </h6>

                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      {vehicleCategory?.slice(0, more)?.map((category) => (
                        <button
                          onClick={() => handleCategorySelect(category)}
                          key={category?.categoryId}
                          className="rounded-4 px-3 py-1 moreFilter_btn me-2 mb-1"
                        >
                          {category?.category}cc
                        </button>
                      ))}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (more === 11) {
                            setMore(-1);
                          } else if (more === -1) {
                            setMore(11);
                          }
                        }}
                        style={{ fontSize: 14 }}
                        className="rounded-pill px-3 py-1 border-0 color-secondary fw-600 "
                      >
                        {more === 11 ? "Show More" : "Show Less"}
                      </button>
                    </div>
                  </div>
                </ul>
              </div>
            </div>
          </div>

          <div className="row mx-3 mt-4 d-md-none  ">
            <div className="col-12 px-0 pb-md-0 searchBarFilter">
              <TextField
                id="filtercity"
                // label="Search"
                variant="filled"
                placeholder="e.g. Alto 2019"
                InputLabelProps={{ shrink: true }}
                className="searchSideTabsInputMob w-100"
                type="search"
                value={SearchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleSearchChange}
                        sx={{ padding: 0 }}
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>
          <div className="p-3 d-md-none d-flex justify-content-evenly align-items-center mobileFilters overflow-x-scroll">
            <Button
              variant="text"
              className={`rounded-pill fw-500 border ${
                selectedCityValue ? "bgSecondary text-white" : "text-dark"
              }`}
              onClick={toggleDrawerCity}
              sx={{
                color: "#b80505b",
                width: "100%",
                minWidth: "unset",
                fontSize: "12px", // Adjust the font size as needed
                padding: "5px 10px", // Increase padding for a larger button
                borderRadius: "50px", // Rounded pill shape
                textTransform: "none", // Preserve the text casing
              }}
            >
              {selectedCityValue ? selectedCityValue?.cityName : "City"}
              <KeyboardArrowDownIcon
                color="inherit"
                sx={{ fontSize: 18, pl: 0.5 }}
              />
            </Button>

            <Button
              variant="text"
              className={`rounded-pill fw-500 border ${
                selectedMakeValue?.makeName
                  ? "bgSecondary text-white"
                  : "text-dark"
              }`}
              onClick={toggleDrawerMake}
              sx={{
                color: "#b80505b",
                width: "100%",
                minWidth: "unset",
                fontSize: "12px",
                ml: 1,
                padding: "5px 10px",
                borderRadius: "50px",
                textTransform: "none",
              }}
            >
              {selectedMakeValue?.makeName
                ? selectedMakeValue?.makeName
                : "Make"}
              <KeyboardArrowDownIcon
                color="inherit"
                sx={{ fontSize: 18, pl: 0.5 }}
              />
            </Button>

            <Button
              variant="text"
              className={`rounded-pill fw-500 border ${
                selectedModelValue ? "bgSecondary text-white" : "text-dark"
              } ${selectedMakeValue ? "opacity-100" : "opacity-50"}`}
              onClick={toggleDrawerModel}
              sx={{
                color: "#b80505b",
                width: "100%",
                minWidth: "unset",
                fontSize: "12px",
                ml: 1,
                padding: "5px 10px",
                borderRadius: "50px",
                textTransform: "none",
              }}
            >
              {selectedModelValue ? selectedModelValue?.model_name : "Model"}
              <KeyboardArrowDownIcon
                color="inherit"
                sx={{ fontSize: 18, pl: 0.5 }}
              />
            </Button>

            <Button
              variant="text"
              className={`rounded-pill fw-500 border ${
                selectedYearValue ? "bgSecondary text-white" : "text-dark"
              }`}
              onClick={toggleDrawerYear}
              sx={{
                color: "#b80505b",
                width: "100%",
                minWidth: "unset",
                fontSize: "12px", 
                ml: 1,
                padding: "5px 10px", // Increase padding for a larger button
                borderRadius: "50px", // Rounded pill shape
                textTransform: "none", // Preserve the text casing
              }}
            >
              {selectedYearValue ? selectedYearValue?.year : "Year"}
              <KeyboardArrowDownIcon
                color="inherit"
                sx={{ fontSize: 18, pl: 0.5 }}
              />
            </Button>
          </div>

          <div className="d-flex d-md-none px-3">
            {(selectedMakes?.length !== 0 ||
              selectedCities?.length !== 0 ||
              selectedModels?.length !== 0 ||
              selectedYearValue !== null ||
              selectedCategoryValue !== null ||
              SearchInput !== "") && (
              <Button
                variant="contained"
                onClick={handleClearAllFilters}
                sx={{
                  color: "#ffffff",
                  fontSize: 10,
                  padding: "5px 10px",
                }}
                className="rounded-pill fw-500 bg-dark d-flex"
              >
                Clear All{" "}
                <CancelIcon sx={{ ml: 1, color: "#ffffff", fontSize: 15 }} />
              </Button>
            )}
          </div>

          <div className="d-none d-md-flex">
            {(selectedMakes?.length !== 0 ||
              selectedCities?.length !== 0 ||
              selectedModels?.length !== 0 ||
              selectedYearValue !== null ||
              selectedCategoryValue !== null ||
              SearchInput !== "") && (
              <Chip
                label=" Clear All "
                variant="outlined"
                onDelete={handleClearAllFilters}
                sx={{
                  backgroundColor: "#ffffff42",
                  color: "#000",
                  border: "1px solid #b80505",
                  marginTop: 2,
                }}
                className="clearChip shadow-lg "
              />
            )}
          </div>
          <Drawer
            anchor="bottom"
            open={openMake}
            onClose={toggleDrawerMake}
            PaperProps={{
              sx: {
                minHeight: "30%",
                maxHeight: "80%",
                height: "auto",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                overflow: "auto",
                zIndex: 1000,
              },
            }}
          >
            <Box
              sx={{
                padding: 3,
                height: "100%",
                overflowY: "scroll",
              }}
            >
              <h4 className="text-dark fw-600 fs-6 mx-3 pb-2 border-bottom">
                Select Make
              </h4>

              {allMake?.length > 0 &&
                allMake?.map((make, index) => {
                  return (
                    <Button
                      key={index}
                      onClick={() => {
                        handleAutocompleteMakeChange(index, make);
                        toggleDrawerMake();
                      }}
                      sx={{
                        fontSize: "12px", // Adjust the font size as needed
                        padding: "6px 10px", // Increase padding for a larger button
                        m: 1,
                        borderRadius: "50px", // Rounded pill shape
                        textTransform: "none", // Preserve the text casing
                      }}
                      className="text-black fw-light "
                      style={{ border: "1px solid #b8050580" }}
                    >
                      {make.makeName}
                    </Button>
                  );
                })}
            </Box>
          </Drawer>

          <Drawer
            anchor="bottom"
            open={openCity}
            onClose={toggleDrawerCity}
            PaperProps={{
              sx: {
                minHeight: "30%",
                maxHeight: "80%",
                height: "auto",
                // maxHeight: "75vh", // Adjust height as needed
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                overflow: "auto",
                zIndex: 1000,
              },
            }}
          >
            <Box
              sx={{
                padding: 3,
                height: "100%",
                overflowY: "scroll",
              }}
            >
              <h4 className="text-dark fw-600 fs-6 mx-3 pb-2 border-bottom">
                Select City
              </h4>
              {allCities?.length > 0 &&
                allCities?.map((city, index) => {
                  return (
                    <Button
                      key={index}
                      onClick={() => {
                        handleAutocompleteCityChange(index, city);
                        toggleDrawerCity();
                      }}
                      sx={{
                        color: "#b80505b",
                        fontSize: "12px", // Adjust the font size as needed
                        padding: "6px 10px", // Increase padding for a larger button
                        m: 1,
                        borderRadius: "50px", // Rounded pill shape
                        textTransform: "none", // Preserve the text casing
                      }}
                      className="text-black fw-light "
                      style={{ border: "1px solid #b8050580" }}
                    >
                      {city.cityName}
                    </Button>
                  );
                })}
            </Box>
          </Drawer>

          <Drawer
            anchor="bottom"
            open={openModel}
            onClose={toggleDrawerModel}
            PaperProps={{
              sx: {
                minHeight: "30%",
                maxHeight: "80%",
                height: "auto",
                // maxHeight: "75vh", // Adjust height as needed
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                overflow: "auto",
                zIndex: 1000,
              },
            }}
          >
            <Box
              sx={{
                padding: 3,
                height: "100%",
                overflowY: "scroll",
              }}
            >
              <h4 className="text-dark fw-600 fs-6 mx-3 pb-2 border-bottom">
                Select Model
              </h4>

              {allModel?.length > 0 &&
                allModel?.map((model, index) => {
                  return (
                    <Button
                      key={index}
                      onClick={() => {
                        handleAutocompleteModelChange(index, model);
                        toggleDrawerModel();
                      }}
                      sx={{
                        color: "#b80505b",
                        fontSize: "12px", // Adjust the font size as needed
                        padding: "6px 10px", // Increase padding for a larger button
                        borderRadius: "50px", // Rounded pill shape
                        textTransform: "none", // Preserve the text casing
                        m: 1,
                      }}
                      className="text-black fw-light "
                      style={{ border: "1px solid #b8050580" }}
                    >
                      {model.model_name}
                    </Button>
                  );
                })}
            </Box>
          </Drawer>

          <Drawer
            anchor="bottom"
            open={openYear}
            onClose={toggleDrawerYear}
            PaperProps={{
              sx: {
                minHeight: "30%",
                maxHeight: "80%",
                height: "auto",
                // maxHeight: "75vh", // Adjust height as needed
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                overflow: "auto",
                zIndex: 1000,
              },
            }}
          >
            <Box
              sx={{
                padding: 3,
                height: "100%",
                overflowY: "scroll",
              }}
            >
              <h4 className="text-dark fw-600 fs-6 mx-3 pb-2 border-bottom">
                Select Year
              </h4>

              {modelYear?.length > 0 &&
                modelYear?.map((year, index) => {
                  return (
                    <Button
                      key={index}
                      onClick={() => {
                        handleAutocompleteYearChange(index, year);
                        toggleDrawerYear();
                      }}
                      sx={{
                        color: "#b80505b",
                        fontSize: "12px", // Adjust the font size as needed
                        padding: "6px 10px", // Increase padding for a larger button
                        m: 1,
                        borderRadius: "50px", // Rounded pill shape
                        textTransform: "none", // Preserve the text casing
                      }}
                      className="text-black fw-light "
                      style={{ border: "1px solid #b8050580" }}
                    >
                      {year.year}
                    </Button>
                  );
                })}
            </Box>
          </Drawer>
        </div>
      </div>
    </>
  );
}
