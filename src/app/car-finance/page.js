"use client";
import React, { useState, useEffect } from "react";
import SeoMeta from "@/components/meta";
import financeImage from "@/images/finance-new-image.png";
import axios from "axios";
import { Box, Button, Modal } from "@mui/material";
import dubaiIslamicLogo from "../../images/dubai-islamic-logo.png";
import CarFinanceFAQs from "./faq";
import CarFinanceRates from "./rates";
import Image from "next/image";

const page = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const [tab, setTab] = useState(2);
  const [cities, setCities] = useState(null);
  const [cityName, setCityName] = useState(null);
  const [make, setMake] = useState(null);
  const [makeName, setMakeName] = useState(null);
  const [modelName, setModelName] = useState(null);
  const [yearName, setYearName] = useState(null);
  const [makeId, setMakeId] = useState(null);
  const [modelId, setModelId] = useState(null);
  const [YearId, setYearId] = useState(null);
  const [modelYear, setModelYear] = useState(null);
  const [getModel, setGetModel] = useState(null);
  const [variantList, setVariantList] = useState([]);
  const [variant, setVariant] = useState(null);
  const [variantId, setVariantId] = useState(null);
  const [category, setCategory] = useState(null);
  const [assembly, setAssembly] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [vehicleType, setVehicleType] = useState(null);
  const [tenure, setTenure] = useState(null);
  const [downPayment, setDownPayment] = useState(null);
  const [price, setPrice] = useState(null);
  const [result, setResult] = useState([]);

  useEffect(() => {
    const fetchMake = async () => {
      try {
        const response = await axios.get(`${baseUrl}/byMake`);

        setMake(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMake();
  }, []);

  const fetchYear = async () => {
    try {
      const response = await axios.get(`${baseUrl}/recentfivemodelyear`);

      setModelYear(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchYear();
  }, []);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await axios.get(`${baseUrl}/getVarient`, {
          params: {
            variant_id: variantId,
          },
        });

        setCategory(response.data?.engine_capacity);
        setAssembly(response.data?.assembly);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (variant) {
      fetchFeatures();
    }
  }, [variant]);

  useEffect(() => {
    const fetchVariant = async () => {
      try {
        const response = await axios.get(`${baseUrl}/getVarientList`, {
          params: {
            modelId: modelId,
            yearId: YearId,
          },
        });

        setVariantList(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (yearName) {
      fetchVariant();
    } else {
      setVariantList([]);
    }
  }, [modelName, yearName]);

  const handleMakeChange = (e) => {
    const selectedMake = make?.find((item) => item.makeName === e.target.value);
    if (selectedMake) {
      setMakeId(selectedMake.makeId);
    } else {
      setMakeId("");
    }
    setMakeName(e.target.value);
  };

  const handleModelChange = (e) => {
    const selectedModel = getModel.find(
      (item) => item.modelName === e.target.value
    );
    if (selectedModel) {
      setModelId(selectedModel.modelId);
    } else {
      setModelId("");
    }
    setModelName(e.target.value);
  };
  const handleVariantChange = (e) => {
    const selectedVariant = variantList.find(
      (item) => item.featureName === e.target.value
    );
    if (selectedVariant) {
      setVariantId(selectedVariant.featuresId);
    } else {
      setVariantId("");
    }

    setVariant(e.target.value);
  };

  const handleYearChange = (e) => {
    const selectedYear = modelYear.find((item) => item.year === e.target.value);
    if (selectedYear) {
      setYearId(selectedYear.yearId);
    } else {
      setYearId("");
    }
    setYearName(e.target.value);
  };

  useEffect(() => {
    const fetchModel = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/model-by-make?make_id=${makeId}`
        );

        setGetModel(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (makeId) {
      fetchModel();
    } else {
      setGetModel([]);
    }
  }, [makeId]);

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const response = await axios.get(`${baseUrl}/cities`);

        setCities(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCity();
  }, []);

  const onClose = () => {
    setIsOpen(false);
    setMakeName(null);
    setModelName(null);
    setYearName(null);
    setMakeId("");
    setGetModel(null);
  };

  const handleConfirmVehicle = () => {
    setIsOpen(false);

    setVehicleType(`${makeName} ${modelName} ${variant} ${yearName}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("carpice", price);
      formData.append("customercontribution", downPayment);
      formData.append("financerate_tenure", tenure);
      formData.append("financerate_kiber", 21.58);

      const response = await axios.post(
        `${baseUrl}/listbankfinancing`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResult(response?.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <SeoMeta
        title="Car Finance UAE | Famewheels"
        desc="Discover affordable car finance options in UAE with Famewheels and Dubai Islamic Bank Car Finance. Drive your dream car with easy financing plans tailored to your needs. Apply now for flexible, Sharia-compliant car loans."
        url="car-finance"
      />

      <Modal
        open={isOpen}
        onClose={onClose}
        disableAutoFocus={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="Fw-popups"
      >
        <Box className="sm-modal position-relative p-4">
          <div className="modalBody_area successBox  px-2 text-center">
            <h3 className="pt-2 mb-5">Select Your Vehicle</h3>

            <div className="container">
              <div className="col-12">
                <div className="mb-3 text-start">
                  <label for="vehicleYear" className="form-label">
                    Year
                  </label>
                  <select
                    className="form-select"
                    id="vehicleYear"
                    aria-label="Default select example"
                    required
                    value={yearName}
                    onChange={handleYearChange}
                  >
                    <option selected value=" ">
                      Select Year
                    </option>
                    {modelYear &&
                      modelYear.map((item) => (
                        <option key={item.yearId} value={item.year}>
                          {item.year}
                        </option>
                      ))}
                  </select>

                  <div id="CityHelp" className="form-text">
                    Mention your vehicle's Year (e.g. 2018)
                  </div>
                </div>
              </div>

              {yearName && yearName !== "" && (
                <div className="col-12">
                  <div className="mb-3 text-start">
                    <label for="vehicleMake" className="form-label">
                      Select Make
                    </label>
                    <select
                      className="form-select"
                      id="vehicleMake"
                      aria-label="Default select example"
                      required
                      value={makeName}
                      onChange={handleMakeChange}
                    >
                      <option selected value=" ">
                        Select Make
                      </option>
                      {make &&
                        make.map((item) => (
                          <option key={item.makeId} value={item.makeName}>
                            {item.makeName}
                          </option>
                        ))}
                    </select>
                    <div id="CityHelp" className="form-text">
                      Mention your vehicle's make (e.g. Honda)
                    </div>
                  </div>
                </div>
              )}

              {makeName !== null && (
                <div className="col-12">
                  {makeId && getModel?.length > 0 ? (
                    <div className="mb-3 text-start">
                      <label for="vehicleModel" className="form-label">
                        Model
                      </label>
                      <select
                        className="form-select"
                        id="vehicleModel"
                        aria-label="Default select example"
                        required
                        value={modelName}
                        onChange={handleModelChange}
                      >
                        <option selected value=" ">
                          Select {makeName && makeName} Model
                        </option>
                        {getModel &&
                          getModel.map((item) => (
                            <option key={item.modelId} value={item.modelName}>
                              {item.modelName}
                            </option>
                          ))}
                      </select>

                      <div id="CityHelp" className="form-text">
                        Mention your vehicle's Model (e.g. Civic)
                      </div>
                    </div>
                  ) : (
                    <div className="mb-3 text-start">
                      <label for="vehicleModel" className="form-label">
                        Model
                      </label>
                      <select
                        className="form-select border-danger"
                        id="vehicleModel"
                        aria-label="Default select example"
                        required
                        disabled
                      >
                        <option selected value=" ">
                          Select {makeName && makeName} Model
                        </option>
                      </select>

                      <div id="CityHelp" className="form-text text-danger">
                        Select make first
                      </div>
                    </div>
                  )}
                </div>
              )}

              {modelName && modelName !== "" && (
                <div className="col-12 text-start">
                  {modelName && yearName !== " " && variantList?.length > 0 ? (
                    <div className="mb-3 text-start">
                      <label for="vehicleYear" className="form-label">
                        Variant (optional)
                        {/* <span  className="form-text"> (Optional) </span> */}
                      </label>
                      <select
                        className="form-select"
                        id="vehicleYear"
                        aria-label="Default select example"
                        value={variant}
                        onChange={handleVariantChange}
                      >
                        <option selected value=" ">
                          Select {modelName && modelName} {yearName && yearName}{" "}
                          Variant
                        </option>
                        {variantList &&
                          variantList.map((item) => {
                            return (
                              <option
                                key={item.featuresId}
                                value={item.featureName}
                              >
                                {item.featureName}
                              </option>
                            );
                          })}
                      </select>

                      <div id="CityHelp" className="form-text">
                        Mention {modelName && modelName} {yearName && yearName}{" "}
                        Variant
                      </div>
                    </div>
                  ) : modelName &&
                    yearName !== " " &&
                    variantList?.length === 0 ? (
                    <>
                      <label
                        for="vehicleYear"
                        className="form-label text-start"
                      >
                        Variant
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="varient"
                        aria-describedby="VarientHelp"
                        value={variant}
                        onChange={(e) => setVariant(e.target.value)}
                      />
                      <div id="VarientHelp" className="form-text text-danger">
                        Mention {modelName && modelName} {yearName && yearName}{" "}
                        Varient
                      </div>
                    </>
                  ) : (
                    <div className="mb-3 text-start">
                      <label for="vehicleVariant" className="form-label">
                        Variant
                      </label>
                      <select
                        className="form-select border-danger"
                        id="vehicleVariant"
                        aria-label="Default select example"
                        required
                        disabled
                      >
                        <option selected value=" ">
                          Select Variant
                        </option>
                      </select>
                      <div id="CityHelp" className="form-text text-danger">
                        Select Year first
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button
              onClick={handleConfirmVehicle}
              variant="contained"
              className="py-2 px-4 mt-3 color-white fw-700 bgSecondary  text-capitalize"
            >
              Confirm
            </Button>
          </div>
        </Box>
      </Modal>

      <div className="bgHeroGradient py-5">
        <div className="container py-5">
          <div class="row pt-5 mt-5">
            <div class="carFinanceLeft col-md-6 col-sm-12  text-white px-4 mt-3">
              <h3 className="fw-700">Get Fame Wheels</h3>
              <h1 className="fw-700">Car Finance</h1>

              <p className="py-4 textSmallFinance">
                FameWheels proudly offers premier Financing services in UAE,
                <br />
                Make a calculation online for the car Financing service.
              </p>

              <Image
                width={500}
                height={300}
                src={financeImage}
                alt="finance-image"
                srcSet={financeImage}
                className="w-100"
              />
            </div>

            <div class="col-md-6 col-sm-12 mt-3 px-sm-4 px-2">
              <form
                className="carFinanceForm py-3 px-sm-3 px-1 rounded-4"
                onSubmit={handleSubmit}
              >
                <h3 className="text-white text-center px-2 fs-3">
                  Calculate Fame Wheels Car Finance
                </h3>

                <ul className="text-white fs-6 d-flex align-items-center justify-content-center list-unstyled gap-sm-5 gap-3 mt-3">
                  {/* <li
                    onClick={() => setTab(1)}
                    className={`${
                      tab === 1 ? "financeTabSelected" : ""
                    } financeTab`}
                  >
                    New Cars
                  </li> */}
                  <li
                    onClick={() => setTab(2)}
                    className={`${
                      tab === 2 ? "financeTabSelected" : ""
                    } financeTab`}
                  >
                    Used Cars
                  </li>
                </ul>

                <div className="mt-4 px-2 flex justify-content-center align-items-center flex-column">
                  <select
                    className="form-select financeInput p-sm-3 p-2 fs-6"
                    id="post-city"
                    aria-label="Default select example"
                    required
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                  >
                    <option selected value=" ">
                      Select City
                    </option>
                    {cities &&
                      cities.map((item) => (
                        <option key={item?.cityID} value={item.cityID}>
                          {item.cityName}
                        </option>
                      ))}
                  </select>

                  <input
                    type="text"
                    className="form-control mt-3 financeInput p-sm-3 p-2 bg-white"
                    id="carDetal"
                    aria-describedby="carDetalHelp"
                    placeholder="Enter Make/Model/Year"
                    required
                    value={vehicleType}
                    onClick={() => setIsOpen(true)}
                    readOnly
                  />

                  {assembly === "IMPORTED" && (
                    <p className="finance-price-warning">
                      Imported vehicles cannot be financed
                    </p>
                  )}
                  {tab === 2 && (
                    <>
                      <input
                        type="number"
                        className="form-control mt-3 financeInput p-sm-3 p-2 bg-white"
                        id="price"
                        aria-describedby="priceHelp"
                        placeholder="e.g 4500000"
                        required
                        value={price}
                        onChange={(e) => setPrice(parseInt(e.target.value))}
                      />
                      {price > 10000000 && (
                        <p className="finance-price-warning">
                          This value should be lower than or equal to 10000000
                        </p>
                      )}
                    </>
                  )}

                  <select
                    className="form-select financeInput p-sm-3 p-2 fs-6 mt-3"
                    id="post-tenure"
                    aria-label="Default select example"
                    required
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value)}
                  >
                    <option selected value=" ">
                      Select Tenure
                    </option>

                    <option value="3">1 year</option>

                    <option value="3">2 year</option>

                    <option value="3">3 year</option>
                    {category <= 1000 && (
                      <>
                        <option value="5">4 year</option>

                        <option value="5">5 year</option>
                      </>
                    )}
                  </select>

                  <select
                    className="form-select financeInput p-sm-3 p-2 fs-6 mt-3"
                    id="post-down-payment"
                    aria-label="Default select example"
                    required
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                  >
                    <option selected value=" ">
                      Select Down Payment
                    </option>

                    <option value="30">30%</option>

                    <option value="35">35%</option>

                    <option value="40">40%</option>
                    <option value="45">45%</option>

                    <option value="50">50%</option>

                    <option value="55">55%</option>

                    <option value="60">60%</option>

                    <option value="66">65%</option>

                    <option value="70">70%</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="btn w-100 mt-3 p-sm-3 p-2 financeInput bgSecondary text-white"
                  disabled={price > 10000000 || assembly === "IMPORTED"}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="container rounded-4 my-4 p-4">
        {result?.map((result) => (
          <div className="myAd card_bg p-2 mb-4" key={result?.financebank_id}>
            <div className="row">
              <div className="col-lg-3 Myads_photos cursorPointer">
                <Image
                  width={500}
                  height={300}
                  src={`https://gallery.famewheels.com/financebanks/${result?.financebank_logo}`}
                  alt={`${result?.financebank_name}`}
                  srcSet=""
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className="col-lg-9 ps-lg-0">
                <div className="d-flex searchWhite_bg flex-column justify-content-between h-100 bg-white px-3  ">
                  <div className="d-flex align-items-top justify-content-between pt-2">
                    <div className="vehicleDetails text-capitalize">
                      <h4 className=" cursorPointer ">
                        {result?.financebank_name}
                      </h4>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end justify-content-md-between color-black pb-2">
                    <div className="d-md-flex align-items-center d-none">
                      <div className="">
                        <p className="postlocation me-2">
                          <i class="fa-solid fa-money-bill me-2"></i>
                          <span className="fw-700"> Monthly Installment: </span>
                          PKR {result?.installmentamount}
                        </p>
                        <p className="postlocation">
                          <i class="fa-solid fa-money-bill-transfer me-2"></i>
                          <span className="fw-700">
                            {" "}
                            Initial Deposit:
                          </span> PKR {result?.initialdeposit}
                        </p>
                        <p className="postlocation">
                          <i class="fa-solid fa-receipt me-2"></i>
                          <span className="fw-700">
                            {" "}
                            Processing Fee:
                          </span> PKR {result?.processfee}
                        </p>
                      </div>
                    </div>
                    <div className="text-end ad_controls">
                      <button className="btn bgSecondary text-white ms-3 fw_br">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="container rounded-4 my-4 p-4">
        <h4 className="fs-2 fw-700">
          Our Financing
          <span className="color-secondary fw-700 fs-2"> Partner</span>
        </h4>
      </div>

      <div
        className="container rounded-4 my-4 p-4"
        style={{ backgroundColor: "#fafbfc" }}
      >
        <div className="row">
          <div className="col-lg-3">
            <Image
              width={250}
              src={dubaiIslamicLogo}
              className="w-md-50 object-fit-contain"
            />
          </div>
          <div className="col-lg-8 finance-info">
            <p>
              Dubai Islamic Bank UAE commenced in 2006, is a renowned bank
              offering Islamic Banking in UAE. DIBP is known for offering
              banking based on a combination of Islamic traditions and latest
              technology.{" "}
              <b className="color-secondary">Dubai Islamic Bank Car Finance</b>{" "}
              is one of Sharia’s compliant product offered by the bank.{" "}
              <b className="color-secondary">Dubai Islamic Car Finance</b>{" "}
              scheme helps you in getting a vehicle in a completely
              sharia-compliant way.
            </p>
            <br />
            <h5 className=" fw-700">Key Features and Benefits:</h5>
            <p>
              <b className="color-secondary">Dubai Islamic bank car finance</b>{" "}
              offer is based on the Musharka cum Ijarah model. One can get{" "}
              <b className="color-secondary">Dubai Islamic Bank car loan</b> for
              new or used local vehicles. The Loan tenure ranges between 1 and 5
              years. DIBP will finance up to 70% of the car value depending upon
              the need of the customer. The maximum financing amount is PKR
              3,000,000. <br />
              <br />
              <b className="color-secondary">
                {" "}
                Dubai Islamic Bank car finance
              </b>{" "}
              offers guaranteed lowest insurance/takaful rates compared to any
              other bank in UAE. Moreover, DIBP all financed cars come with a
              tracking device. In advance booking scenario, the bank doesn’t
              charge monthly installments before delivery of the car.DIB holds
              eminent recognition in Islamic Banking and Islamic Car Financing,
              offering the best deal for financing with least Interest rates.
            </p>
            <br />
            <h5 className=" fw-700">
              Dubai Islamic Bank Car Finance Calculator:
            </h5>
            <p>
              Dubai Islamic Bank Car Loan Calculator is an online tool available
              on Famewheels.com that helps in getting different financing
              options. The user is asked to input required car type (new/old),
              Car make, car model, user’s city, loan tenure, and initial down
              payment. The calculator will output total initial deposit,
              estimated monthly payment, and yearly payment plan. The user can
              vary initial deposit or loan tenure to compare different plan and
              choose most suitable one.
            </p>
            <br />
            <h5 className=" fw-700">Eligibility:</h5>
            <p>
              A salaried person or self-employed businessman/professional can
              apply for{" "}
              <b className="color-secondary">Dubai Islamic Bank Car Finance</b>.
              The minimum required income, to be eligible for the car financing,
              is PKR 55,000. Moreover, the age requirement for a salaried person
              is between 22 and 65 years, and for self-employed
              businessman/professional it is between 22 and 70 years.{" "}
            </p>
            <br />
            <h5 className=" fw-700">Required Documents:</h5>
            <p>
              The required documents are latest salary slip, 2 passport size,
              copy of CNIC, and proof of income.
            </p>
          </div>
        </div>
      </div>
      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <h3>Best Car Financing Bank And Rates In UAE</h3>
          </div>
        </div>
        <div className="row pb-5">
          <div className="col-12">
            <CarFinanceRates />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <h3>Car Finance FAQs</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <CarFinanceFAQs />
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
