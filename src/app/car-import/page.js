"use client";

import { useState, useEffect } from "react";
import SeoMeta from "@/components/meta";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Modal, Box } from "@mui/material";
import Button from "@mui/material/Button";
import InputMask from "react-input-mask";
import Confirm from "@/images/blue-tick-success.png";
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

const page = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(null);
  const [city, setCity] = useState(null);
  const [vehicleType, setVehicleType] = useState("");
  const [error, setError] = useState("");
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const [make, setMake] = useState(null);
  const [makeName, setMakeName] = useState(null);
  const [modelName, setModelName] = useState(null);
  const [yearName, setYearName] = useState(null);
  const [makeId, setMakeId] = useState("");
  const [modelId, setModelId] = useState("");
  const [YearId, setYearId] = useState("");

  const [modelYear, setModelYear] = useState(null);
  const [getModel, setGetModel] = useState(null);
  const [cities, setCities] = useState(null);

  const [isOpen, setIsOpen] = useState(false);

  const history = useRouter();

  const ImportCar = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // Append form field values
      formData.append("name", fullName);
      formData.append("email", email);
      formData.append("mobile_no", phone);
      formData.append("city_id", 1);
      formData.append("make_id", makeId);
      formData.append("model_id", modelId);
      formData.append("year_id", YearId);

      const response = await axios.post(`${baseUrl}/carimport`, formData);
      setOpenSuccessModal(true);
      setTimeout(() => {
        setOpenSuccessModal(false);
        history.push("/");
      }, 2000);
    } catch (err) {
      setError(err.response);
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
    const selectedModel = getModel?.find(
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
    setMakeName(null);
    setModelName(null);
    setYearName(null);
    setMakeId("");
    setModelYear(null);
    setGetModel(null);
  };

  const handleConfirmVehicle = () => {
    setIsOpen(false);

    setVehicleType(`${makeName} ${modelName} ${yearName}`);
  };

  return (
    <>
      <SeoMeta
        title="Japanese Car Import in UAE | Famewheels"
        desc="Discover your dream import car from Japan to UAE with Famewheels, and our user-friendly platform simplifies the process, ensuring the best import car buying experience from start to finish."
        url="new-cars"
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
                  {makeId && modelName !== " " && modelYear.length > 0 ? (
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

      <div className="container-fluid grad-bg90 py-0 ">
        <div className="container ">
          <div className="row align-items-center w-100">
            <div className="col-lg-12 col-12 text-center py-5 ">
              <h2 className="fw-600 color-white fs-1">
                Import Cars to UAE By <br />
                <span className="fw-bold fs-1">Fame Wheels</span>
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <h3 className="pb-3 py-md-5 fw-title fw-700" id="appointment">
          Import My Car
        </h3>
        {error && <p> {error} </p>}
        <form
          onSubmit={ImportCar}
          className="inspectionForm postAdForm boxShadow p-4 mb-5 mx-3 mx-md-3 "
        >
          <div className="row mb-3">
            <div className="col-md-4 col-6">
              <div className="mb-md-3">
                <label for="inspectionVehicle" className="form-label">
                  Make/Model/Year
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inspectionVehicle"
                  aria-describedby="inspectionVehicleHelp"
                  placeholder="Enter Make/Model/Year"
                  required
                  value={vehicleType}
                  onClick={() => setIsOpen(true)}
                  readOnly
                />
                <div id="inspectionVehicleHelp" className="form-text">
                  (e.g. Honda Civic RS 2022)
                </div>
              </div>
            </div>
            <div className="col-md-4 col-6">
              <div>
                <label for="inspectionName" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inspectionName"
                  placeholder="Enter Full Name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4 col-6">
              <div>
                <label for="inspectionName" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="inspectionName"
                  placeholder="Enter Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4 col-6">
              <div className="mb-md-3">
                <label for="inspectionCity" className="form-label">
                  Select City
                </label>

                {/* {user && user ? ( */}
                <select
                  className="form-select"
                  id="inspectionCity"
                  aria-label="Default select example"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="">Select City</option>
                  {cities &&
                    cities.map((item) => (
                      <option key={item?.cityID} value={item.cityName}>
                        {item.cityName}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="col-md-4 col-6">
              <div>
                <label for="inspectionContact" className="form-label">
                  Phone Number
                </label>
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
            <div className="col-md-4 col-6">
              <div className="text-center pt-4">
                <button
                  type="submit"
                  className="btn bgSecondary text-white w-100 mt-2"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="container py-5">
        <div className="memberFormHead">
          <h4 className="pb-4 color-black text-start fs-3  fw-700">
            Why Choose Fame Wheels?
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

      <div className="container pb-5 carImport_sum ">
        <h4>Car Import:</h4>
        <p>
          Importing a car opens doors to a world of variety, quality, and
          exclusivity, offering personalized driving experiences beyond local
          options. Enjoy unique features, potential cost savings, and investment
          opportunities with imported vehicles. If you are considering importing
          a car, explore here the numerous benefits and simplified procedures.
        </p>
        <h4>Benefits of car importation:</h4>

        <p>
          If you are considering importing a car, explore here the numerous
          benefits and simplified procedures.
        </p>
        <h6>Access to Variety:</h6>

        <p>
          Break the chains and go beyond local limits to enjoy the widest
          possible choice of brands, models and various types that may be
          missing in your area.
        </p>

        <h6>Cost Efficiency:</h6>
        <p>
          Saves money on potential taxes and tariffs by looking for imports
          instead of local vehicles.
        </p>

        <h6>Premium Quality:</h6>
        <p>
          Choose the better-known manufacturing facilities, such as Japan famous
          for its excellent working methods and latest developments, and you
          will certainly get high-quality riding witha Japanese car.
        </p>

        <h6>Unique Features:</h6>
        <p>
          Get introduced to cars that have extras which no other competitor
          offers you. Driving safety is improved with the latest gadgets, while
          also enabling you to enjoy your time on the road with all modern
          comforts.
        </p>
        <h6>Exclusivity:</h6>
        <p>
          Distinguish with models unavailable elsewhere in the market or with a
          range that changes periodically, adding some quality and uniqueness to
          the vehicle ownership experience.
        </p>

        <h6>Personalization:</h6>
        <p>
          Modify your car manifold until you are a hundred per cent content;
          pick the colors, trim levels, and other optional items and design a
          car that is the best outward manifestation of yourself.
        </p>
        <h6>Investment Potential:</h6>
        <p>
          Tapping into limited or collectable editions that have the potential
          to reinforce their value over time permits getting a return on
          investment through an exciting long-term ownership advantage.
        </p>
        <h4>Here are the Procedures for Importing Car:</h4>
        <h6>Vehicle Selection:</h6>
        <p>
          Initiate your trip by opting for your preferred vehicle from
          prestigious websites and dealers, assuring proper functioning
          corresponding to your needs and satisfaction.
        </p>
        <h6>Documentation:</h6>
        <p>
          Gather necessary documents like service vouchers, export certificates
          etc., In addition to the criteria for import regulations. These are
          the necessary documents for importing a car:
        </p>

        <ul>
          <li>Copies of the original Bill of Lading</li>
          <li>Original Export certificate in Japanese</li>
          <li>Translated Export certificate in English</li>
          <li>Original invoice of the car</li>
        </ul>

        <h6>Customs Clearance:</h6>
        <p>
          Overcome customs procedures and allow verification of agent’s
          documents, clearance of port charges, and other processes with our
          guidance.
        </p>
        <h6>Shipping and Delivery:</h6>
        <p>
          Progress status as your vehicle ships and notifies you of its arrival
          at the specified port where our team will bring the delivery to your
          doorstep in perfect condition.
        </p>
        <h6>Ownership Transfer:</h6>
        <p>
          Complete the process of taking over the ownership promptly, ensuring
          all legal requirements are complete and your car is insured under your
          name.
        </p>
        <h6>After-Sales Support:</h6>
        <p>
          And just like that, we will be just a phone call away, taking care of
          any concerns or issues you may have during the process and even after
          you have received your valuables.
          <br />
          <br />
          Ready to import a car? contact the mentioned below dealersto get
          started on your import journey with confidence.
        </p>
      </div>

      {/* success modal */}

      <Modal
        open={openSuccessModal}
        onClose={() => setOpenSuccessModal(false)}
        disableAutoFocus={true}
      >
        <Box className="text-center successModal" sx={successModal}>
          <Image
            src={Confirm}
            className="mb-4 w-25 h-25 "
            alt="confirm"
            srcSet=""
          />

          <h3 className="fw-600">Success</h3>

          <p className="m-0">Our Representative will contact you shortly!</p>
          <p style={{ fontSize: 15 }} className="pt-1 m-0 color-black ">
            Redirecting...{" "}
          </p>
        </Box>
      </Modal>
    </>
  );
};

export default page;
