"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RandomNewCars from "./newCars";
import { Modal } from "react-bootstrap";
import { Carousel } from "react-bootstrap";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import YearIcon from "@/images/year.png";
import KmIcon from "@/images/milage.png";
import FuelIcon from "@/images/fuel.png";
import TransmissionIcon from "@/images/transmisson.png";
import { Box } from "@mui/material";

const FullPreview = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  bgcolor: "#00000000",
  p: 4,
  borderRadius: "10px",
  maxHeight: "95%",
  height: "100%",
  overflowY: "scroll",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const page = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const location = useRouter();

  const queryParams = new URLSearchParams(location.search);
  const makeWithId = queryParams.get("make");

  const makeParts = makeWithId?.split("/");

  const make = makeParts && makeParts[0];
  const makeId = makeParts && makeParts[1];

  const [data, setData] = useState(null);

  const [dimensions, setDimensions] = useState(null);
  const [engine, setEngine] = useState(null);
  const [tranmission, setTransmission] = useState(null);
  const [steering, setSteering] = useState(null);
  const [wheels, setWheels] = useState(null);
  const [fuel, setFuel] = useState(null);
  const [safety, setSafety] = useState(null);
  const [exterior, setExterior] = useState(null);
  const [instrument, setInstrument] = useState(null);
  const [infotain, setInfotain] = useState(null);
  const [comfort, setComfort] = useState(null);
  const [imagesPath, setImagesPath] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const [vehicleImages, setVehicleImages] = useState(null);
  const [PostToken, setPostToken] = useState(null);

  useEffect(() => {
    const fetchNewCarsDetails = async () => {
      try {
        const response = await axios.get(`${baseUrl}/newcarpostdetails`, {
          params: {
            newcarpost_id: makeId,
          },
        });

        setData(response?.data?.data);
        setPostToken(response?.data?.data?.newcarpost_token);
        setDimensions(JSON.parse(response?.data?.data?.newcarpost_dimensions));
        setEngine(JSON.parse(response?.data?.data?.newcarpost_enginemotor));
        setTransmission(
          JSON.parse(response?.data?.data?.newcarpost_transmission)
        );
        setSteering(JSON.parse(response?.data?.data?.newcarpost_steering));
        setWheels(JSON.parse(response?.data?.data?.newcarpost_wheeltyres));
        setFuel(JSON.parse(response?.data?.data?.newcarpost_fueleconomy));
        setSafety(JSON.parse(response?.data?.data?.newcarpost_safety));
        setExterior(JSON.parse(response?.data?.data?.newcarpost_exterior));
        setInstrument(
          JSON.parse(response?.data?.data?.newcarpost_instrumentation)
        );
        setInfotain(JSON.parse(response?.data?.data?.newcarpost_Infotainment));
        setComfort(
          JSON.parse(response?.data?.data?.newcarpost_comfortconvenience)
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchNewCarsDetails();
  }, []);

  const handleImageClick = (index) => {
    setPreviewOpen(true);
  };
  const handlePreviewClose = () => setPreviewOpen(false);

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

  const FinancingPrice = data && (data?.newcarpost_price / 100) * 1.65;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${baseUrl}/postimages`, {
          params: {
            post_id: PostToken,
          },
        });

        setVehicleImages(response?.data?.images);
        setImagesPath(response?.data?.imagepath);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (PostToken) {
      fetchImages();
    }
  }, [PostToken]);

  return (
    <>
      {make ? (
        <>
          <div className="newcar-main">
            <div className="container ">
              <div className=" py-5">
                <h3 className=" newcar-heading">
                  {data?.make} {data?.model_name} {data?.year} Price in UAE,
                  Images, Reviews & Specs
                </h3>

                {/* Ad card component */}
                <div
                  className="row border p-4 py-5"
                  style={{ borderRadius: 5, background: "white" }}
                >
                  <div className="col-lg-12 col-12">
                    <span className="NewCar_pricearea">
                      <p className="price-extra">PKR</p>{" "}
                      <h2 className="newcar-price">
                        {" "}
                        {formatPrice(data?.newcarpost_price)}{" "}
                      </h2>
                      <sub className="price-extra">(*Ex-Factory Price)</sub>
                    </span>
                    <p className="newcar-financing">
                      Financing starts at PKR {FinancingPrice}/Month
                    </p>
                  </div>

                  <div className="col-lg-9 col-12 px-0">
                    <div className="vehiclePhotos newCarsPhotos ">
                      <Carousel interval={null} indicators={false}>
                        {vehicleImages &&
                          vehicleImages.map((image, index) => (
                            <Carousel.Item
                              key={index}
                              onClick={() => handleImageClick(index)}
                            >
                              <img
                                className="d-block w-100"
                                src={`${imagesPath}/${data?.newcarpost_token}/${image?.filename}`}
                                alt={`${make} `}
                              />
                            </Carousel.Item>
                          ))}
                      </Carousel>

                      <Modal
                        open={previewOpen}
                        onClose={handlePreviewClose}
                        disableAutoFocus={true}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        className="VehiclePhotos_FullPreview VehiclePhotos_PreviewCarousel"
                      >
                        <Box sx={FullPreview}>
                          <button
                            className="btn close_primary PreviewModal_CloseBtn"
                            onClick={handlePreviewClose}
                          >
                            <CloseIcon />
                          </button>
                          <Carousel interval={null}>
                            {vehicleImages &&
                              vehicleImages.map((image, index) => (
                                <Carousel.Item
                                  key={index}
                                  onClick={() => handleImageClick(index)}
                                >
                                  <img
                                    className="d-block w-100"
                                    src={`${imagesPath}/${data?.newcarpost_token}/${image?.filename}`}
                                    alt={`${make} `}
                                  />
                                </Carousel.Item>
                              ))}
                          </Carousel>
                        </Box>
                      </Modal>
                    </div>
                  </div>

                  <div className="col-lg-3 col-12 d-flex justify-content-center align-items-center  ">
                    <div
                      className="row justify-content-between h-100"
                      style={{ background: "white" }}
                    >
                      <div className="col-lg-6 col-md-6 col-6 ps-3 pb-3">
                        <div className="newcar-topinfo">
                          <span>
                            <img
                              src={KmIcon}
                              alt="icon"
                              srcSet=""
                              style={{ height: 25, width: 40 }}
                            />
                          </span>
                          <span>
                            <h6 className="m-0 p-1 color-secondary">
                              MILEAGE <br /> (KM/LITER)
                            </h6>
                            <p> {50000} </p>
                          </span>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-6 pb-3">
                        <div className="newcar-topinfo">
                          <span>
                            <img
                              src={FuelIcon}
                              alt="icon"
                              srcSet=""
                              style={{ height: 30, width: 30 }}
                            />
                          </span>
                          <span>
                            <h6 className="m-0 p-1 color-secondary">
                              Fuel Type
                            </h6>
                            <p> Petrol </p>
                          </span>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-6 pt-3">
                        <div className="newcar-topinfo">
                          <span>
                            <img
                              src={TransmissionIcon}
                              alt="icon"
                              srcSet=""
                              style={{ height: 30, width: 30 }}
                            />
                          </span>
                          <span>
                            <h6 className="m-0 p-1 color-secondary">
                              Transmission
                            </h6>
                            <p> Automatic & Manual </p>
                          </span>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-6 pt-3">
                        <div className="newcar-topinfo">
                          <span>
                            <img
                              src={YearIcon}
                              alt="icon"
                              srcSet=""
                              style={{ height: 30, width: 30 }}
                            />
                          </span>
                          <span>
                            <h6 className="m-0 p-1 color-secondary">Year</h6>
                            <p> {2023} </p>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="newcar-main">
            <div className="container pt-5 ">
              <div className="row">
                <div className="col-12 text-center">
                  <h3 className="newcar-infoheading ">
                    {data?.make} {data?.model_name} {data?.year} Specifications
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="newcar-main">
            <div className="container pt-5 pb-4">
              <div className="row">
                <div className="col-6 text-left">
                  <h3 className="newcar-infoheading ">Dimensions</h3>
                </div>
              </div>

              <div className="" style={{ background: "white" }}>
                <div
                  className="row pt-3"
                  style={{
                    borderBottom: "1px solid lightgray",
                    margin: 0,
                    padding: 0,
                  }}
                >
                  <div className="col-lg-3 col-md-6 col-6 ">
                    <p className="px-3 newcar-specheading">Overall Length</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {" "}
                      {dimensions?.overallLength} mm{" "}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Kerb Weight</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {dimensions?.kerbWeight} KG
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">Overall Width</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {dimensions?.overallWidth} mm
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Boot Space</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {dimensions?.bootSpaceL} L
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Seating Capacity</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {dimensions?.seatingCapacity} persons
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">Wheel Base</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {dimensions?.wheelBase} mm
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">No. of Doors</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {dimensions?.noOfDoors} doors
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">Ground Clearance</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {dimensions?.groundClearance} mm
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="newcar-main">
            <div className="container pt-5 pb-4">
              <div className="row">
                <div className="col-6 text-left">
                  <h3 className="newcar-infoheading ">Engine/ Motor</h3>
                </div>
              </div>

              <div className="" style={{ background: "white" }}>
                <div
                  className="row pt-3"
                  style={{
                    borderBottom: "1px solid lightgray",
                    margin: 0,
                    padding: 0,
                  }}
                >
                  <div className="col-lg-3 col-md-6 col-6 ">
                    <p className="px-3 newcar-specheading">Engine Type</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {" "}
                      {engine?.engineType}{" "}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Turbo Charger</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {engine?.turboCharger}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">Displacement</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {engine?.displacement} cc
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">No. of Cylinders</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {engine?.noOfCylinders}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">Horse Power</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {engine?.horsePower} @ {engine?.rpm}{" "}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">
                      Valves per Cylinder
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {engine?.valvesPerCylinder}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">Fuel System</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {engine?.fuelSystem}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">Max Speed</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {engine?.maxSpeed} KM/H
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="newcar-main">
            <div className="container pt-5 pb-4">
              <div className="row">
                <div className="col-6 text-left">
                  <h3 className="newcar-infoheading ">Transmission</h3>
                </div>
              </div>

              <div className="" style={{ background: "white" }}>
                <div
                  className="row pt-3"
                  style={{
                    borderBottom: "1px solid lightgray",
                    margin: 0,
                    padding: 0,
                  }}
                >
                  <div className="col-lg-3 col-md-6 col-6 ">
                    <p className="px-3 newcar-specheading">Transmission Type</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {tranmission?.transmission}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Gearbox</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {tranmission?.gearBox} - speed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="newcar-main">
            <div className="container pt-5 pb-4">
              <div className="row">
                <div className="col-6 text-left">
                  <h3 className="newcar-infoheading ">Steering</h3>
                </div>
              </div>

              <div className="" style={{ background: "white" }}>
                <div
                  className="row pt-3"
                  style={{
                    borderBottom: "1px solid lightgray",
                    margin: 0,
                    padding: 0,
                  }}
                >
                  <div className="col-lg-3 col-md-6 col-6 ">
                    <p className="px-3 newcar-specheading">Steering Type</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {steering?.steeringType}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 ">
                    <p className="px-3 newcar-specheading">Power Assisted</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {steering?.powerAssisted}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="newcar-main">
            <div className="container pt-5 pb-4">
              <div className="row">
                <div className="col-6 text-left">
                  <h3 className="newcar-infoheading ">Wheels and Tyres</h3>
                </div>
              </div>

              <div className="" style={{ background: "white" }}>
                <div
                  className="row pt-3"
                  style={{
                    borderBottom: "1px solid lightgray",
                    margin: 0,
                    padding: 0,
                  }}
                >
                  <div className="col-lg-3 col-md-6 col-6 ">
                    <p className="px-3 newcar-specheading">Wheel Type</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">{wheels?.wheelType}</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Tyre Sizes</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {wheels?.tyreSizeWidth}/{wheels?.tyreSizeRatio}/
                      {wheels?.tyreSizeDiameter}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 ">
                    <p className="px-3 newcar-specheading">Wheel Size</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {wheels?.wheelSize} in
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Spare Tyre</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    {wheels?.spareTyre === "yes" ? (
                      <p className="px-3 newcar-specvalue">
                        <i className="fa-solid fa-check"></i>
                      </p>
                    ) : (
                      <p className="px-3 newcar-specvalue">
                        <i className="fa-solid fa-xmark"></i>
                      </p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Spare Tyre Size</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {wheels?.spareTyreSize} in
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="newcar-main">
            <div className="container pt-5 pb-4">
              <div className="row">
                <div className="col-6 text-left">
                  <h3 className="newcar-infoheading ">Fuel Economy</h3>
                </div>
              </div>

              <div className="" style={{ background: "white" }}>
                <div
                  className="row pt-3"
                  style={{
                    borderBottom: "1px solid lightgray",
                    margin: 0,
                    padding: 0,
                  }}
                >
                  <div className="col-lg-3 col-md-6 col-6 ">
                    <p className="px-3 newcar-specheading">Mileage City</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {fuel?.mileageCity} KM/L
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">
                      Fuel Tank Capacity
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {fuel?.fuelTankCapacity} L
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 ">
                    <p className="px-3 newcar-specheading">Mileage Highway</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {fuel?.mileageHighway} KM/L
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="newcar-main">
            <div className="container pt-5 pb-4">
              <div className="row">
                <div className="col-6 text-left">
                  <h3 className="newcar-infoheading ">Safety</h3>
                </div>
              </div>

              <div className="" style={{ background: "white" }}>
                <div
                  className="row pt-3"
                  style={{
                    borderBottom: "1px solid lightgray",
                    margin: 0,
                    padding: 0,
                  }}
                >
                  <div className="col-lg-3 col-md-6 col-6 ">
                    <p className="px-3 newcar-specheading">No. of Airbags</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">{safety?.airbags}</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">
                      Speed Sensing Auto Door Lock
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {safety?.speedSensingDoorLock === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">No. of Seatbelts</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">{safety?.seatbelts}</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">
                      Anti-Theft Alarm System
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {safety?.antiTheftAlarmSystem === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">
                      Driver Seat Belt Warning
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {safety?.driverSeatBeltWarning === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">
                      Down Hill Assist Control
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {safety?.downHillAssistControl === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">
                      Passenger Seat Belt Warning
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {safety?.passengerSeatBeltWarning === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">
                      Hill Start Assist Control
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {safety?.hillStartAssistControl === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">Immobilizer</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {safety?.immobilizer === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Traction Control</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {safety?.tractionControl === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">
                      Door Opening Warning
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {safety?.doorOpeningWarning === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">
                      Vehicle Stability Control
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {safety?.vehicleStabilityControl === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">
                      BlindSpot Detection (BSD)
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {safety?.blindSpotDetection === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">
                      Anti-Lock Braking System (ABS)
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {safety?.antiTheftAlarmSystem === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">
                      Electronic Brake-Force Distribution (EBD)
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {safety?.electricBrakeForce === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">
                      Lane Keep Assist System (LKAS)
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {safety?.laneKeepAssistSystem === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="newcar-main">
            <div className="container pt-5 pb-4">
              <div className="row">
                <div className="col-6 text-left">
                  <h3 className="newcar-infoheading ">Exterior</h3>
                </div>
              </div>

              <div className="" style={{ background: "white" }}>
                <div
                  className="row pt-3"
                  style={{
                    borderBottom: "1px solid lightgray",
                    margin: 0,
                    padding: 0,
                  }}
                >
                  <div className="col-lg-3 col-md-6 col-6 ">
                    <p className="px-3 newcar-specheading">Alloy Wheels</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {exterior?.alloyWheels === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">
                      Adjustable Headlights
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {exterior?.adjustableHeadlights === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Rear Spoiler</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {exterior?.rearSpoiler === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">
                      Side Mirrors with Indicators
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {exterior?.sideMirrorIndicators === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Sun Roof</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {exterior?.sunRoof === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Panaromic Roof</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {exterior?.panaromic === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Fog Lights</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {exterior?.fogLights === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">DRLs</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {exterior?.DRLs === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">Side Steps</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {exterior?.sideSteps === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Dual Exhaust</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {exterior?.dualExhaust === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Rear Spoiler</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {exterior?.rearSpoiler === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="newcar-main">
            <div className="container pt-5 pb-4">
              <div className="row">
                <div className="col-6 text-left">
                  <h3 className="newcar-infoheading ">Instrumentation</h3>
                </div>
              </div>

              <div className="" style={{ background: "white" }}>
                <div
                  className="row pt-3"
                  style={{
                    borderBottom: "1px solid lightgray",
                    margin: 0,
                    padding: 0,
                  }}
                >
                  <div className="col-lg-3 col-md-6 col-6 ">
                    <p className="px-3 newcar-specheading">Tachometer</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {instrument?.tachometer === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Multi Info</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {instrument?.tachometer === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">
                      Information Cluster
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {instrument?.infoCluster}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="newcar-main">
            <div className="container pt-5 pb-4">
              <div className="row">
                <div className="col-6 text-left">
                  <h3 className="newcar-infoheading ">Infotainment</h3>
                </div>
              </div>

              <div className="" style={{ background: "white" }}>
                <div
                  className="row pt-3"
                  style={{
                    borderBottom: "1px solid lightgray",
                    margin: 0,
                    padding: 0,
                  }}
                >
                  <div className="col-lg-3 col-md-6 col-6 ">
                    <p className="px-3 newcar-specheading">CD Player</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {infotain?.cdPlayer === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">DVD Player</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {infotain?.dvdPlayer === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">
                      Number of Speakers
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {infotain?.noOfSpeakers}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">
                      USB and Auxillary Cable
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {infotain?.usbAuxilaryCable === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">Front Speakers</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {infotain?.frontSpeakers === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">Rear Speakers</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {infotain?.rearSpeakers === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Display Size</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {infotain?.displaySize} in Standard LCD
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">Apple Carplay</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {infotain?.appleCarPlay === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">
                      Rear Seat Entertainment
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {infotain?.rearSeatEntertainment === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">Voice Control</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {infotain?.voiceControl === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Android Auto</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {infotain?.androidAuto === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="newcar-main">
            <div className="container pt-5 pb-4">
              <div className="row">
                <div className="col-6 text-left">
                  <h3 className="newcar-infoheading ">
                    Comfort and Convenience
                  </h3>
                </div>
              </div>

              <div className="" style={{ background: "white" }}>
                <div
                  className="row pt-3"
                  style={{
                    borderBottom: "1px solid lightgray",
                    margin: 0,
                    padding: 0,
                  }}
                >
                  <div className="col-lg-3 col-md-6 col-6 ">
                    <p className="px-3 newcar-specheading">Air Conditioner</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.airconditioning === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">
                      Rain Sensing Wipers
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.rainSensingWiper === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">Climate Control</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.climateControl === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Cruise Control</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.cruiseControl === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">Rear AC Vents</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.rearACVents === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Driving Modes</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.drivingModes === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Paddle Shifter</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.paddleShifter === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">Heater</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.heater === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Key Type</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">{comfort?.keyType}</p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">Heated Seats</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.heatedSeats === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Keyless Entry</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.keylessEntry === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Push Start</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.pushStart === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">CoolBox</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.coolBox === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">
                      Remote Engine Start
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.remoteEngineStart === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">Navigation</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.navigation === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Central Locking</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.centralLocking === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Power Door Locks</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.powerDoorLocks === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">Front Camera</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.frontCamera === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Rear Camera</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.rearCamera === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Power Windows</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.powerWindows === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">360 Camera</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.Camera360 === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Power Mirrors</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.powerMirrors === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">
                      Front Parking Sensors
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.frontParkingSensors === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">
                      Auto Retractable Side Mirrors
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.autoRetractableSideMirror === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">
                      Rear Parking Sensors
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.rearParkingSensors === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Arm Rest</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.armRest === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">Rear Folding Seat</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.rearFoldingSeat === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Auto Brake Hold</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.autoBrakeHold === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">Rear Wiper</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.rearWiper === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">
                      Auto Parking System
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.autoParkingSystem === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">
                      Seat Material Type
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.seatMaterialType}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">
                      Driver Seat Electric Adjustment
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.driverSeatElectricAdjustment === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">
                      Driver Seat Lumbar Support
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.driverSeatLumbarSupport === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">
                      Driver Seat Memory Function
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.driverSeatMemoryFunction === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">
                      Front Power Outlet
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.frontPowerOutlet === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">
                      Passenger Seat Electric Adjustment
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.passengerSeatElectricAdjustment === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Rear Power Outlet</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.reartPowerOutlet === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">
                      Steering Adjustment
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.steeringAdjustment === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">
                      Tyre Pressure Monitoring System (TPMS)
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.tyrePressureMonitoringSystem === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">Steering Switches</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.steeringSwitches === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Wireless Charger</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.wirelessCharger === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">
                      Headlight On Reminder
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.headlightReminder === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    {" "}
                    <p className="px-3 newcar-specheading">Boss Seat Switch</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.bossSeatSwitch === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>

                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="px-3 newcar-specheading">
                      Automatic Head Lamps
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6 text-end">
                    <p className="px-3 newcar-specvalue">
                      {comfort?.automaticHeadLamps === "true" ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <RandomNewCars />
      )}
    </>
  );
};

export default page;
