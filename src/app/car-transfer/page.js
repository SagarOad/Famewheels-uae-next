"use client";
import { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Modal, Box } from "@mui/material";
import Button from "@mui/material/Button";
import InputMask from "react-input-mask";
import SeoMeta from "@/components/meta";
import Confirm from "@/images/blue-tick-success.png";

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

export default function CarTransfer() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [registration, setRegistration] = useState(null);
  const [filer, setFiler] = useState(null);
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
      formData.append("registration_in", registration);
      formData.append("phone_number", phone);
      formData.append("make_id", makeId);
      formData.append("model_id", modelId);
      formData.append("year_id", YearId);
      formData.append("is_filer", filer);

      const response = await axios.post(`${baseUrl}/cartransfer`, formData);
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
    const selectedYear = modelYear?.find((item) => item.year === e.target.value);
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
        title="Car Transfer | Famewheels"
        desc="Explore car transfer and associated fees with FameWheels for a seamless ownership transfer process. Understand the costs involved and ensure a hassle-free experience today."
        url="car-transfer"
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
                  {makeId && getModel.length > 0 ? (
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

      <div className="container-fluid grad-bg90 py-0 ">
        <div className="container ">
          <div className="row align-items-center w-100">
            <div className="col-lg-12 col-12 text-center py-5 ">
              <h2 className="fw-600 color-white fs-1">
                Car Ownership Transfer By <br />
                <span className="fw-bold fs-1">Fame Wheels</span>
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <h3 className="pb-3 py-md-5 fw-title fw-700" id="appointment">
          Book Car Ownership Transfer
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
                  Are you filer?
                </label>
                <select
                  className="form-select"
                  id="inspectionCity"
                  aria-label="Default select example"
                  required
                  value={filer}
                  onChange={(e) => setFiler(e.target.value)}
                >
                  <option value="">Are you filer?</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
            <div className="col-md-4 col-6">
              <div className="mb-md-3">
                <label for="inspectionCity" className="form-label">
                  Registration In
                </label>

                {/* {user && user ? ( */}
                <select
                  className="form-select"
                  id="inspectionCity"
                  aria-label="Default select example"
                  required
                  value={registration}
                  onChange={(e) => setRegistration(e.target.value)}
                >
                  <option value="">Registration In</option>
                  <option value="Sindh">Sindh</option>
                  <option value="Punjab">Punjab</option>
                  <option value="KPK">KPK</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Islamabad">Islamabad</option>
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
                  Transfer
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
              <h6 className="text-capitalize ">Hassle-Free Process</h6>
            </div>
          </div>

          <div className="col-lg-3 col-6 d-flex justify-content-center align-items-center ">
            <div className="StepperCount">03</div>
            <div className="OurSteppers">
              <h6 className="text-capitalize ">Quick Processing</h6>
            </div>
          </div>

          <div className="col-lg-3 col-6 d-flex justify-content-center align-items-center ">
            <div className="StepperCount">04</div>
            <div className="OurSteppers">
              <h6 className="text-capitalize ">Secure and Reliable</h6>
            </div>
          </div>
        </div>
      </div>

      {/* success modal */}

      <Modal
        open={openSuccessModal}
        onClose={() => setOpenSuccessModal(false)}
        disableAutoFocus={true}
      >
        <Box className="text-center successModal" sx={successModal}>
          <img
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

      {/* <Chatbot /> */}
    </>
  );
}
