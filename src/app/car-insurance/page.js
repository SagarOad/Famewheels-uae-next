"use client";

import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Modal, Box } from "@mui/material";
import Button from "@mui/material/Button";
import Rate from "@/images/rate.png";
import Cash from "@/images/amount.png";
import TimerLoader from "@/images/timer.gif";
import SeoMeta from "@/components/meta";
import Confirm from "@/images/blue-tick-success.png";
import InputMask from "react-input-mask";
import CarInsuranceHero from "@/images/car-insurance-hero-image.png";
import Slider from "react-slick";
import Step1 from "@/images/insurance-step1.png";
import Step2 from "@/images/insurance-step2.png";
import Step3 from "@/images/insurance-step3.png";
import Image from "next/image";

const successModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
  minHeight: "10%",
  maxHeight: "95%",
  height: "auto",
  overflowY: "scroll",
};

export default function CarInsurance() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [price, setPrice] = useState(null);
  const [vehicleType, setVehicleType] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [make, setMake] = useState(null);
  const [makeName, setMakeName] = useState(null);
  const [modelName, setModelName] = useState(null);
  const [yearName, setYearName] = useState(null);
  const [makeId, setMakeId] = useState("");
  const [modelId, setModelId] = useState("");
  const [YearId, setYearId] = useState("");
  const [cities, setCities] = useState(null);
  const [modelYear, setModelYear] = useState(null);
  const [getModel, setGetModel] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [registrationNumber, setRegistrationNumber] = useState(null);
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(null);
  const [cnic, setCNIC] = useState(null);
  const [city, setCity] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [company, setCompany] = useState(false);
  const [applicationOpen, setApplicationOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const history = useRouter();

  const [plans, setPlans] = useState(null);

  const InsuranceSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.get(`${baseUrl}/getinsurance?rate=${price}`);
      setPlans(response?.data);
      setIsSubmitting(false);
    } catch (err) {
      setError(err.response);
      setIsSubmitting(false);
    }
  };

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

  const handleYearChange = (e) => {
    const selectedYear = modelYear.find((item) => item.year === e.target.value);
    if (selectedYear) {
      setYearId(selectedYear.yearId);
    } else {
      setYearId("");
    }
    setYearName(e.target.value);
  };

  // all models api

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

  // all years api

  useEffect(() => {
    const fetchYear = async () => {
      try {
        const response = await axios.get(`${baseUrl}/getModelYear`);

        setModelYear(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchYear();
  }, []);
  useEffect(() => {
    const fetchCity = async () => {
      try {
        const response = await axios.get(`${baseUrl}/cities`);

        setCities(response?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCity();
  }, []);
  const onClose = () => {
    setIsOpen(false);
    setApplicationOpen(false);
    setMakeName(null);
    setModelName(null);
    setYearName(null);
    setMakeId("");
    setGetModel(null);
  };

  const handleConfirmVehicle = () => {
    setIsOpen(false);
    setVehicleType(`${makeName} ${modelName} ${yearName}`);
  };

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
      return price?.toLocaleString("en-US", { maximumFractionDigits: 2 });
    }
  };

  const handleSubmitInfo = async (e) => {
    e.preventDefault();
    setApplicationOpen(false);
    try {
      const formData = new FormData();

      formData.append("cnic_number", cnic);
      formData.append("estimated_value", price);
      formData.append("final_amount", company?.final_rate);
      formData.append("registration_status", registrationStatus);
      formData.append("name", fullName);
      formData.append("email", email);
      formData.append("mobile_number", phone);
      formData.append("city_id", city);
      formData.append("make_id", makeId);
      formData.append("model_id", modelId);
      formData.append("year_id", YearId);

      const response = await axios.post(
        `${baseUrl}/insuranceapplication`,
        formData
      );
      setSuccessOpen(true);

      setTimeout(() => {
        setSuccessOpen(false);
        history.push("/");
      }, 2000);
    } catch (err) {
      setError(err.response);
    }
  };

  const handleApply = (item) => {
    setCompany(item);
    setApplicationOpen(true);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    dots: false,
    autoplay: true,
    speed: 4000,
    autoplaySpeed: 4000,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const InsuranceImages = [
    {
      src: `${baseUrl}/public/insurance/askari.png`,
      alt: "Askari Insurance",
    },
    {
      src: `${baseUrl}/public/insurance/united.png`,
      alt: "United Insurance",
    },
  ];

  return (
    <>
      <SeoMeta
        title="Car Insurance | FameWheels"
        desc="Start your journey with Famewheels best car insurance in UAE. Explore comprehensive coverage, competitive rates, and expert advice to ensure peace of mind on the road. Find the perfect car insurance plan for your vehicle today."
        url="car-insurance"
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
                <div className="col-12">
                  {makeId && modelName !== " " && modelYear?.length > 0 ? (
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
                  ) : (
                    <div className="mb-3">
                      <label for="vehicleYear" className="form-label">
                        Year
                      </label>
                      <select
                        className="form-select border-danger"
                        id="vehicleYear"
                        aria-label="Default select example"
                        required
                        disabled
                      >
                        <option selected value=" ">
                          Select Year
                        </option>
                      </select>
                      <div id="CityHelp" className="form-text text-danger">
                        Select Model first
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

      <Modal
        open={applicationOpen}
        onClose={onClose}
        disableAutoFocus={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="Fw-popups"
      >
        <Box className="sm-modal position-relative p-4">
          <form
            onSubmit={handleSubmitInfo}
            className="modalBody_area successBox  px-2"
          >
            <h3 className="pt-2 mb-5">Enter Your Information</h3>

            <div className="container">
              <div className="">
                <div className="mb-md-3">
                  <div>
                    <label for="name" className="form-label text-left">
                      Full Name
                    </label>
                    <div className="input-group">
                      <input
                        name="name"
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Enter You Name"
                        required
                        aria-describedby="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="">
                <div className="mb-md-3">
                  <div>
                    <label for="mobile" className="form-label text-left">
                      Phone
                    </label>
                    <div className="input-group">
                      <InputMask
                        mask="03999999999"
                        maskChar={null}
                        type="text"
                        name="inspectionContact"
                        className="form-control"
                        id="inspectionContact"
                        placeholder="Phone No. (03xxxxxxxxx)"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="">
                <div className="mb-md-3">
                  <div>
                    <label for="email" className="form-label text-left">
                      Email
                    </label>
                    <div className="input-group">
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter Your Email"
                        required
                        aria-describedby="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="mb-md-3">
                  <div>
                    <label for="email" className="form-label text-left">
                      City
                    </label>
                    <div className="input-group">
                      <select
                        className="form-select"
                        id="inspectionCity"
                        aria-label="Default select example"
                        required
                        name="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      >
                        <option value="">Select City</option>
                        {cities &&
                          cities.map((item) => (
                            <option key={item?.cityID} value={item.cityID}>
                              {item.cityName}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="mb-md-3">
                  <div>
                    <label for="cnic" className="form-label text-left">
                      CNIC Number
                    </label>
                    <div className="input-group">
                      <InputMask
                        mask="99999-9999999-9"
                        maskChar={null}
                        type="text"
                        name="ppmpf_4"
                        className="form-control"
                        id="cnic"
                        placeholder="Enter Your Cnic"
                        required
                        value={cnic}
                        onChange={(e) => setCNIC(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="mb-md-3">
                  <div>
                    <label
                      for="registrationstatus"
                      className="form-label text-left"
                    >
                      Registration Status
                    </label>
                    <div className="input-group">
                      <select
                        className="form-select"
                        id="registrationstatus"
                        aria-label="Default select example"
                        required
                        name="registration_status"
                        value={registrationStatus}
                        onChange={(e) => setRegistrationStatus(e.target.value)}
                      >
                        <option value="">Select Registration Status</option>
                        <option value="0">Un-Registered</option>
                        <option value="1">Registered</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              {registrationStatus === "1" && (
                <div className="">
                  <div className="mb-md-3">
                    <div>
                      <label
                        for="registrationnumber"
                        className="form-label text-left"
                      >
                        Registration Number
                      </label>
                      <div className="input-group">
                        <input
                          type="registration_number"
                          name="registration_number"
                          className="form-control"
                          id="registration_number"
                          placeholder="Enter Registration Number"
                          required
                          aria-describedby="registration_number"
                          value={registrationNumber}
                          onChange={(e) =>
                            setRegistrationNumber(e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="text-center">
              <Button
                variant="contained"
                type="submit"
                className="py-2 px-4 mt-3 color-white fw-700 bgSecondary  text-capitalize"
              >
                Confirm
              </Button>
            </div>
          </form>
        </Box>
      </Modal>

      <Modal
        open={successOpen}
        onClose={onClose}
        disableAutoFocus={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="Fw-popups"
      >
        <Box className="sm-modal position-relative p-4">
          <div className="modalBody_area successBox  px-2 text-center">
            <div className="container">
              <div className="modalBody_area successBox  px-2 text-center ">
                <Image
                  width={500}
                  height={500}
                  src={Confirm}
                  className="mb-4"
                  alt="confirm"
                  srcSet={Confirm}
                />
                <h4 className="pb-2 fs-3 ">Insurance Successful</h4>
                <p>We Will Get In Touch With You Shortly</p>
              </div>
            </div>
          </div>
        </Box>
      </Modal>

      <div
        style={{ paddingTop: "11%" }}
        className="container-fluid bgHeroGradient pb-5 "
      >
        <div className="container pb-0 pb-md-4 ">
          <div className="row align-items-center flex-column-reverse flex-md-row ">
            <div className="col-lg-7 col-12  text-start ">
              <h2 className="fw-bold color-white fs-2">
                Find the best <br />
                <span className="fw-bold fs-1">Car Insurance Plan</span>
              </h2>
              <Image
                width={500}
                height={500}
                className="topBanner_img img-fluid "
                src={CarInsuranceHero}
                alt="Car Insurance"
              />
            </div>
            <div className="col-lg-5 col-12 mb-5 mb-md-0 ">
              <div className="inspectionFormbox px-4 py-5 ">
                <div>
                  <h4 className="text-white fw-bold text-center pb-3 fs-4">
                    Car Insurance Calculator
                  </h4>
                </div>
                <form onSubmit={InsuranceSubmit} className=" postAdForm  ">
                  <div className="row mb-3">
                    <div className="col-12 col-4">
                      <div className="mb-3">

                        <input
                          type="text"
                          className="form-control"
                          id="inspectionVehicle"
                          aria-describedby="inspectionVehicleHelp"
                          placeholder="Select car brand"
                          required
                          value={vehicleType}
                          onClick={() => setIsOpen(true)}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-12 col-4">
                      <div className="mb-3">
                        <div>
                          <div className="input-group">
                            <input
                              type="number"
                              className="form-control"
                              id="postPrice"
                              placeholder="Enter Price"
                              min="100000"
                              required
                              aria-describedby="vehiclePrice"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                            />
                          </div>
                          {price !== null && (
                            <div
                              id="vehiclePrice"
                              className="form-text text-white "
                              style={{
                                height: 25,
                                textTransform: "capitalize",
                              }}
                            >
                              {formatPrice(price)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-4 text-center ">
                      <button
                        type="submit"
                        className="btn bgSecondary text-white w-100 rounded-pill py-2 "
                      >
                        Show Plans
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isSubmitting && (
        <div>
          <Image
            width={500}
            height={500}
            className="modalLoaderImg"
            src={TimerLoader}
            alt="Loading..."
            srcSet=""
          />
        </div>
      )}

      {plans && (
        <div className="container">
          <h4 className="pb-4 color-black text-start fs-3 pt-5 fw-700">
            Insurance Packages
          </h4>

          {plans &&
            plans?.map((item) => (
              <div className="boxShadow pe-5 ps-3 mb-4 rounded-4 ">
                <div className="row align-items-center">
                  <div className="col-lg-3">
                    <Image
                      width={500}
                      height={500}
                      src={`${item?.imagepath}/${item?.image}`}
                      alt={item?.title}
                      srcSet=""
                      className="insurnaceImg"
                    />
                  </div>
                  <div className="col-lg-6">
                    <h4 className="fs-5 fw-700 pb-2 text-capitalize">
                      {item?.title}
                    </h4>
                    <div className="insurancePlan_Main">
                      <p className="m-0">
                        <Image
                          width={500}
                          height={500}
                          className="insurance_planIcon"
                          src={Rate}
                          alt="rate"
                          srcSet=""
                        />
                        Rate: <span>{item?.rate}</span>
                      </p>
                      <p>
                        <Image
                          width={500}
                          height={500}
                          className="insurance_planIcon"
                          src={Cash}
                          alt="Amount"
                          srcSet=""
                        />
                        Final Amount: PKR{" "}
                        <span>{item?.final_rate?.toLocaleString()}</span>/Year
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-3 text-center">
                    <Button
                      onClick={() => handleApply(item)}
                      variant="contained"
                      className="py-2 w-75 mt-3 color-white fw-700 bgSecondary  text-capitalize"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      <div className="container card_bg rounded-3 mt-0 mt-md-5">
        <div className="row p-5 ">
          <div className="col-lg-6 d-flex align-items-center pb-4 pb-md-0 ">
            <h2 className="fw-bold color-black fs-2">
              Our Featured <br />
              <span className="fw-bold fs-1 color-secondary">
                Insurance Partner
              </span>
            </h2>
          </div>
          <div className="col-lg-6">
            <div className="slider-container">
              <Slider {...settings}>
                {InsuranceImages?.map((image, index) => (
                  <div className="insuranceLogo" key={index}>
                    <Image
                      width={500}
                      height={500}
                      src={image.src}
                      alt={image.alt}
                      className="slider-image"
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>
      <div className="container py-5">
        <h2 className="fw-bold color-black fs-2 text-center ">
          Get An Insurance Quote{" "}
          <span className="fw-bold fs-2 color-secondary">
            In 3 Simple Steps
          </span>
        </h2>
        <div className="row">
          <div className="col-lg-4 col-md-4 col-12 d-flex px-5 px-md-3 mt-4  ">
            <div>
              <Image
                width={50}
                height={50}
                src={Step1}
                alt="step 1"
                srcSet={Step1}
              />
            </div>
            <div className="ms-3 text-black">
              <h5>Basic Information</h5>
              <p>We need your basic information to process the Application.</p>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 col-12 d-flex px-5 px-md-3 mt-4 ">
            <div>
              <Image
                width={50}
                height={50}
                src={Step2}
                alt="step 2"
                srcSet={Step2}
              />
            </div>
            <div className="ms-3 text-black">
              <h5>Choose an Insurance Plan</h5>
              <p>
                Simply choose your insurance plan from our variety of options
                based on your needs.
              </p>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 col-12 d-flex px-5 px-md-3 mt-4 ">
            <div>
              <Image
                width={50}
                height={50}
                src={Step3}
                alt="step 3"
                srcSet={Step3}
              />
            </div>
            <div className="ms-3 text-black">
              <h5>Call from campany</h5>
              <p>Get a call from company for third party car survey.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="memberFormHead">
          <h4 className="pb-4 color-black text-start fs-3  fw-700">
            Why Choose Fame Wheels Car Insurance?
          </h4>
        </div>

        <div className="row pb-5">
          <div className="col-lg-3 col-6  d-flex justify-content-center align-items-center ">
            <div className="StepperCount">01</div>
            <div className="OurSteppers">
              <h6 className="text-capitalize ">Customer Service</h6>
            </div>
          </div>

          <div className="col-lg-3 col-6 d-flex justify-content-center align-items-center ">
            <div className="StepperCount">02</div>
            <div className="OurSteppers">
              <h6 className="text-capitalize ">Lowest Rates</h6>
            </div>
          </div>

          <div className="col-lg-3 col-6 d-flex justify-content-center align-items-center ">
            <div className="StepperCount">03</div>
            <div className="OurSteppers">
              <h6 className="text-capitalize ">Coverage Plans</h6>
            </div>
          </div>

          <div className="col-lg-3 col-6 d-flex justify-content-center align-items-center ">
            <div className="StepperCount">04</div>
            <div className="OurSteppers">
              <h6 className="text-capitalize ">Compare Rates</h6>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
