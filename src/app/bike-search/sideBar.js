"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useRouter, useSearchParams } from "next/navigation";

export default function Sidebar({
  onFilterChange,
  selectedFilters,
  searchData,
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const searchParams = useSearchParams(); // Get search parameters
  const router = useRouter(); // Router instance for navigation

  const selectedAdType = searchParams.get("at");
  const selectedCategory = searchParams.get("ctg");
  const searchedCategory = selectedCategory ? selectedCategory.split(",") : [];
  const selectedCity = searchParams.get("ct");
  const searchedCity = selectedCity ? selectedCity.split(",") : [];
  const selectedMake = searchParams.get("mk");
  const searchedMakes = selectedMake ? selectedMake.split(",") : [];
  const selectedModel = searchParams.get("md");
  const searchedModel = selectedModel ? selectedModel.split(",") : [];

  const [allCities, setAllCities] = useState([]);
  const [allMake, setAllMake] = useState([]);
  const [allModel, setAllModel] = useState([]);
  const [SearchInput, setSearchInput] = useState("");
  const [adType, setAdType] = useState(selectedAdType || "");
  const [selectedCategoryState, setSelectedCategoryState] =
    useState(searchedCategory);
  const [selectedCities, setSelectedCities] = useState(searchedCity);
  const [selectedMakes, setSelectedMakes] = useState(searchedMakes);
  const [selectedModels, setSelectedModels] = useState(searchedModel);
  const [modelYear, setModelYear] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);

  // Fetch cities
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await axios.get(`${baseUrl}/cities`);
        setAllCities(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchFilters();
  }, [baseUrl]);

  // Fetch makes
  useEffect(() => {
    const fetchMake = async () => {
      try {
        const response = await axios.get(`${baseUrl}/get-bike-makes`);
        setAllMake(response.data);
      } catch (error) {
        console.error("Error fetching makes:", error);
      }
    };

    fetchMake();
  }, [baseUrl]);

  // Set initial search input
  useEffect(() => {
    if (searchData) {
      setSearchInput(searchData);
    }
  }, [searchData]);

  // Fetch models by selected make
  useEffect(() => {
    const fetchModel = async () => {
      try {
        const response = await axios.get(`${baseUrl}/bike-model-by-make`, {
          params: {
            make_id: selectedMakes,
          },
        });
        setAllModel(response.data);
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };

    if (selectedMakes.length > 0) {
      fetchModel();
    }
  }, [selectedMakes, baseUrl]);

  // Fetch model years by selected model
  useEffect(() => {
    const fetchYear = async () => {
      try {
        const response = await axios.get(`${baseUrl}/getModelYear`);
        setModelYear(response.data);
      } catch (error) {
        console.error("Error fetching years:", error);
      }
    };

    if (selectedModels.length > 0) {
      fetchYear();
    }
  }, [selectedModels, baseUrl]);

  // Format price function
  const formatPrice = (price) => {
    console.log("Input price:", price); // Add this line for debugging
    if (typeof price !== 'number' || isNaN(price)) {
      console.error("Invalid price value"); // Log an error for invalid price
      return "Invalid price"; // Return a default value if price is invalid
    }
    
    if (price >= 100000000000) {
      return `${(price / 100000000000).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })} Kharab`;
    } else if (price >= 1000000000) {
      return `${(price / 1000000000).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })} Arab`;
    } else if (price >= 10000000) {
      return `${(price / 10000000).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })} Crore`;
    } else if (price >= 100000) {
      return `${(price / 100000).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })} Lacs`;
    } else if (price >= 1000) {
      return `${(price / 1000).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })} Thousand`;
    } else {
      return price.toLocaleString("en-US", { maximumFractionDigits: 2 });
    }
  };
  

  // Filter handlers
  const handleConditionChange = (event) => {
    const condition = event.target.value;
    onFilterChange("condition", condition);
  };

  const handleCitiesChange = (city) => {
    const updatedCities = selectedCities.includes(city)
      ? selectedCities.filter((selectedCityId) => selectedCityId !== city)
      : [...selectedCities, city];

    setSelectedCities(updatedCities);
    onFilterChange("city", updatedCities);
  };

  const handleMakeChange = (make) => {
    const updatedMakes = selectedMakes.includes(make)
      ? selectedMakes.filter((selectedMakeId) => selectedMakeId !== make)
      : [...selectedMakes, make];

    setSelectedMakes(updatedMakes);
    onFilterChange("make", updatedMakes);
  };

  const handleModelChange = (model) => {
    const updatedModels = selectedModels.includes(model)
      ? selectedModels.filter((selectedModelId) => selectedModelId !== model)
      : [...selectedModels, model];

    setSelectedModels(updatedModels);
    onFilterChange("model", updatedModels);
  };

  const handleMinPriceChange = (event) => {
    const minPrice = Number(event.target.value);
    if (minPrice <= selectedFilters.maxPrice) {
      onFilterChange("minPrice", minPrice);
    }
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

  const handleFuleChange = (event) => {
    const fule = event.target.value;
    onFilterChange("fule", fule);
  };

  const handleAddChange = (event) => {
    const add = event.target.value;
    setAdType(add);
    onFilterChange("add", add);
  };

  const handleSearchChange = (e) => {
    e.preventDefault();
    onFilterChange("search", SearchInput);
  };

  // Effect to update URL with selected filters
  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedMakes.length) params.set("mk", selectedMakes.join(","));
    if (selectedCities.length) params.set("ct", selectedCities.join(","));
    if (selectedModels.length) params.set("md", selectedModels.join(","));
    if (selectedCategoryState.length)
      params.set("ctg", selectedCategoryState.join(","));
    if (adType) params.set("at", adType);
    if (SearchInput) params.set("sr", SearchInput);

    router.replace(`/bike-search?${params.toString()}`);
  }, [
    selectedMakes,
    selectedCities,
    selectedModels,
    selectedCategoryState,
    adType,
    SearchInput,
    router,
  ]);

  return (
    <>
      <div className="">
        <div>
          <div
            className="accordion sidebarFilters"
            id="accordionPanelsStayOpenExample"
          >
            <div className="accordion-item">
              <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseOne"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseOne"
                >
                  Search By Keyword
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseOne"
                className="accordion-collapse collapse show"
                aria-labelledby="panelsStayOpen-headingOne"
              >
                <div className="accordion-body">
                  <form>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control sideBarSearch"
                        placeholder="(e.g. Honda Civic )"
                        aria-describedby="button-addon2"
                        required
                        value={SearchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                      />
                      <button
                        onClick={handleSearchChange}
                        className="btn bgSecondary text-white"
                        type="Submit"
                        id="button-addon2"
                      >
                        Go
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseTwo"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseTwo"
                >
                  By City
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseTwo"
                className="accordion-collapse collapse show"
                aria-labelledby="panelsStayOpen-headingTwo"
              >
                <div className="accordion-body">
                  <ul className="list-unstyled">
                    {allCities &&
                      allCities.map((item) => (
                        <li key={item?.cityID}>
                          <div className=" m-0 p-0 d-flex justify-content-between w-100">
                            <div
                              onClick={() => {
                                handleCitiesChange(item?.cityName);
                              }}
                              className="form-check form-check-inline"
                            >
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={item?.cityID}
                                value={item?.cityID}
                                checked={selectedCities.includes(
                                  item?.cityName
                                )}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`filter${item.cityName}`}
                              >
                                {item.cityName}
                              </label>
                            </div>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="panelsStayOpen-headingMake">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseMake"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseTwo"
                >
                  By Make
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseMake"
                className="accordion-collapse collapse show"
                aria-labelledby="panelsStayOpen-headingMake"
              >
                <div className="accordion-body">
                  <ul className="list-unstyled">
                    {allMake &&
                      allMake.map((item) => (
                        <li>
                          <div className=" m-0 p-0 d-flex justify-content-between w-100">
                            <div
                              onClick={() => {
                                handleMakeChange(item?.bikemake_name);
                              }}
                              className="form-check form-check-inline"
                            >
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={item.make}
                                value={item.bikemake_id}
                                checked={selectedMakes.includes(
                                  item?.bikemake_name
                                )}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`filter${item.bikemake_name}`}
                              >
                                {item.bikemake_name}
                              </label>
                            </div>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
            {allModel && allModel?.length > 0 && (
              <div className="accordion-item">
                <h2
                  className="accordion-header"
                  id="panelsStayOpen-headingModel"
                >
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#panelsStayOpen-collapseModel"
                    aria-expanded="true"
                    aria-controls="panelsStayOpen-collapseModel"
                  >
                    By Model
                  </button>
                </h2>
                <div
                  id="panelsStayOpen-collapseModel"
                  className="accordion-collapse collapse show"
                  aria-labelledby="panelsStayOpen-headingModel"
                >
                  <div className="accordion-body">
                    <ul className="list-unstyled">
                      {allModel &&
                        allModel.map((item) => (
                          <li>
                            <div className=" m-0 p-0 d-flex justify-content-between w-100">
                              <div className="form-check form-check-inline">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={item?.model_id}
                                  value={item?.model_name}
                                  checked={selectedModels.includes(
                                    item?.model_name
                                  )}
                                  onChange={() =>
                                    handleModelChange(item?.model_name)
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`filter${item?.model_name}`}
                                >
                                  {item?.model_name}
                                </label>
                              </div>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            {modelYear && modelYear?.length > 0 && (
              <div className="accordion-item">
                <h2
                  className="accordion-header"
                  id="panelsStayOpen-headingYear"
                >
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#panelsStayOpen-collapseYear"
                    aria-expanded="true"
                    aria-controls="panelsStayOpen-collapseTwo"
                  >
                    By Year
                  </button>
                </h2>
                <div
                  id="panelsStayOpen-collapseYear"
                  className="accordion-collapse collapse show"
                  aria-labelledby="panelsStayOpen-headingYear"
                >
                  <div className="accordion-body">
                    <ul className="list-unstyled">
                      {modelYear &&
                        modelYear.map((item) => (
                          <li>
                            <div className=" m-0 p-0 d-flex justify-content-between w-100">
                              <div className="form-check form-check-inline">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={item?.yearId}
                                  value={item?.yearId}
                                  checked={selectedYears.includes(item?.yearId)}
                                  onChange={() => handleModelYear(item?.yearId)}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`filter${item?.year}`}
                                >
                                  {item?.year}
                                </label>
                              </div>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            <div className="accordion-item">
              <h2 className="accordion-header" id="panelsStayOpen-headingPrice">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapsePrice"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapse"
                >
                  By Price
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapsePrice"
                className="accordion-collapse collapse show"
                aria-labelledby="panelsStayOpen-headingOne"
              >
                <div className="accordion-body">
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
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2
                className="accordion-header"
                id="panelsStayOpen-headingMileage"
              >
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseMileage"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapse"
                >
                  By Mileage
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseMileage"
                className="accordion-collapse collapse show"
                aria-labelledby="panelsStayOpen-headingOne"
              >
                <div className="accordion-body">
                  <div className="priceFilter">
                    <div className=" d-flex align-items-start justify-content-between ">
                      <div className="w-100">
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <input
                            className="ps-2 py-1"
                            style={{ fontSize: 14 }}
                            placeholder="(e.g. 8000KM)"
                            type="number"
                            onChange={handleMileageChange}
                          />
                          <div className="fw-700">KM</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2
                className="accordion-header"
                id="panelsStayOpen-headingEngine"
              >
                <button
                  className="accordion-button "
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseEngine"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseEngine"
                >
                  Engine Type
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseEngine"
                className="accordion-collapse collapse show"
                aria-labelledby="panelsStayOpen-headingEngine"
              >
                <div className="accordion-body">
                  <ul className="list-unstyled">
                    <li>
                      <button className="btn m-0 p-0 d-flex justify-content-between w-100">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            name="filterCategory"
                            type="radio"
                            value={"2 Strokes"}
                            id={"2 Strokes"}
                            onChange={handleFuleChange}
                          />

                          <label
                            className="form-check-label"
                            htmlFor={"2 Strokes"}
                          >
                            2 Strokes
                          </label>
                        </div>
                      </button>
                    </li>
                    <li>
                      <button className="btn m-0 p-0 d-flex justify-content-between w-100">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            name="filterCategory"
                            type="radio"
                            value={"4 Strokes"}
                            id={"4 Strokes"}
                            onChange={handleFuleChange}
                          />

                          <label
                            className="form-check-label"
                            htmlFor={"4 Strokes"}
                          >
                            4 Strokes
                          </label>
                        </div>
                      </button>
                    </li>

                    <li>
                      <button className="btn m-0 p-0 d-flex justify-content-between w-100">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            name="filterCategory"
                            type="radio"
                            value={"Electric"}
                            id={"Electric"}
                            onChange={handleFuleChange}
                          />

                          <label
                            className="form-check-label"
                            htmlFor={"Electric"}
                          >
                            Electric
                          </label>
                        </div>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="panelsStayOpen-headingAdd">
                <button
                  className="accordion-button "
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseAdd"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseAdd"
                >
                  By Add Type
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseAdd"
                className="accordion-collapse collapse show"
                aria-labelledby="panelsStayOpen-headingAdd"
              >
                <div className="accordion-body">
                  <ul className="list-unstyled">
                    <li>
                      <button className="btn m-0 p-0 d-flex justify-content-between w-100">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            name="filterAdd"
                            type="radio"
                            value={"2"}
                            id={"2"}
                            defaultChecked={adType === "2"}
                            onChange={handleAddChange}
                          />

                          <label
                            className="form-check-label"
                            htmlFor={"Featured Ad"}
                          >
                            Featured Ads
                          </label>
                        </div>
                      </button>
                    </li>
                    <li>
                      <button className="btn m-0 p-0 d-flex justify-content-between w-100">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            name="filterAdd"
                            type="radio"
                            value={"1"}
                            id={"1"}
                            defaultChecked={adType === "1"}
                            onChange={handleAddChange}
                          />

                          <label
                            className="form-check-label"
                            htmlFor={"Normal Ad"}
                          >
                            Normal Ads
                          </label>
                        </div>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
