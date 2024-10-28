"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RandomNewCars from "@/app/new-cars/newCars";
import { Modal } from "react-bootstrap";
import { Carousel } from "react-bootstrap";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import YearIcon from "@/images/year.png";
import bodyTypeIcon from "@/images/exterior.png";
import Image from "next/image";

import FuelIcon from "@/images/fuel.png";
import TransmissionIcon from "@/images/transmisson.png";
import { StageSpinner } from "react-spinners-kit";

import { Box } from "@mui/material";
import LoadingModal from "@/components/modals/loading-modal";
import SeoMeta from "@/components/meta";

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

export default function NewCarSpecs({ params }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const awsImageURL = process.env.NEXT_PUBLIC_AWS_IMAGE_URL;
  const { make, newcarpost_id } = params;

  const history = useRouter();
  const [isLoading, setLoading] = useState(true);
  const [imageLoader, setImageLoader] = useState(true);
  const [data, setData] = useState(null);

  const [carsArr, setCarsArr] = useState([]);
  const lastElement = carsArr[carsArr?.length - 1];

  const [makeid, setMakeId] = useState(null);
  const [modelId, setModelId] = useState(null);
  const [yearId, setYearId] = useState(null);
  const [engine, setEngine] = useState(null);
  const [tranmission, setTransmission] = useState(null);
  const [imagesPath, setImagesPath] = useState("");
  const [vehicleImages, setVehicleImages] = useState(null);
  const [PostToken, setPostToken] = useState(null);

  useEffect(() => {
    const fetchNewCarsDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/newcarpostdetails`, {
          params: {
            newcarpost_id, // use extracted param here
          },
        });

        setData(response?.data?.data);
        setMakeId(response?.data?.data?.make_id);
        setModelId(response?.data?.data?.model_id);
        setYearId(response?.data?.data?.year_id);

        setPostToken(response?.data?.data?.newcarpost_token);
        setEngine(JSON.parse(response?.data?.data?.newcarpost_enginemotor));
        setTransmission(
          JSON.parse(response?.data?.data?.newcarpost_transmission)
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewCarsDetails();
  }, [newcarpost_id]); // add newcarpost_id as dependency

  const brand = data?.make;
  const modelName = data?.model_name;
  const description = `Check out the latest ${brand} ${modelName} car prices in UAE on Famewheels. Explore detailed features and specifications to find the perfect car for your needs.`;

  useEffect(() => {
    const fetchImages = async () => {
      setImageLoader(true);
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
      } finally {
        setImageLoader(false);
      }
    };

    if (PostToken) {
      fetchImages();
    }
  }, [PostToken]);

  // <Helmet>
  //   <title>{`${brand} car price in UAE | Famewheels `} </title>
  //   <meta name="description" content={description} />
  // </Helmet>;

  const [previewOpen, setPreviewOpen] = React.useState(false);
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
  const formatStartingPrice = (price) => {
    if (price >= 100000000000) {
      return (price / 100000000000).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      });
    } else if (price >= 1000000000) {
      return (price / 1000000000).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      });
    } else if (price >= 10000000) {
      return (price / 10000000).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      });
    } else if (price >= 100000) {
      return (price / 100000).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      });
    } else if (price >= 1000) {
      return (price / 1000).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      });
    } else {
      return price?.toLocaleString("en-US", { maximumFractionDigits: 2 });
    }
  };

  const FinancingPrice = data && (data?.newcarpost_price / 100) * 1.65;

  useEffect(() => {
    const getVarients = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/newcarpostvariantdetails`,
          {
            params: {
              make_id: makeid,
              model_id: modelId,
              year_id: yearId,
            },
          }
        );

        setCarsArr(response?.data?.data);
      } catch (error) {
        console.error("Error fetching varients:", error);
      }
    };

    makeid && modelId && yearId && getVarients();
  }, [makeid, modelId, yearId]);

  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };
  const petrolVariants = carsArr.filter(
    (item) => JSON.parse(item?.newcarpost_enginemotor)?.engineType === "Petrol"
  );
  const dieselVariants = carsArr.filter(
    (item) => JSON.parse(item?.newcarpost_enginemotor)?.engineType === "Diesel"
  );

  const tabsContent = [carsArr, petrolVariants, dieselVariants];

  const openCarDetail = (makeName) => {
    history.push(`/new-car-detail?make=${makeName}`);
  };

  return (
    <>
      <LoadingModal open={isLoading} onClose={() => setLoading(false)} />
      {data && (
        <SeoMeta
          title={`${brand} ${modelName} car price in UAE | Famewheels `}
          // title={`${data?.make} ${data?.model_name} ${data?.year} | Famewheels`}
          desc={description}
          url="new-cars"
        />
      )}
      {make ? (
        <>
          <div className="newcar-main">
            <div className="container ">
              <div className=" py-5">
                <h3 className=" newcar-heading text-center">
                  {data?.make} {data?.model_name} {data?.year} Price in UAE,
                  Images, Reviews & Specs
                </h3>

                <div
                  className="row border p-4 py-5"
                  style={{ borderRadius: 5, background: "white" }}
                >
                  <div className="col-lg-12 col-12">
                    <span className="NewCar_pricearea">
                      <h2 className="newcar-price">
                        {" "}
                        <small>PKR</small>{" "}
                        {formatStartingPrice(data?.newcarpost_price)} -{" "}
                        {formatPrice(lastElement?.newcarpost_price)}
                      </h2>
                    </span>
                    <p className="newcar-financing">
                      Insurance starts at PKR {FinancingPrice}/Month
                    </p>
                  </div>

                  <div className="col-lg-12 col-12 px-0">
                    <div className="vehiclePhotos newCarsPhotos ">
                      {imageLoader && (
                        <div
                          className="d-flex w-100 justify-content-center align-items-center"
                          style={{ height: "350px" }}
                        >
                          <StageSpinner
                            size={50}
                            color="#b30000"
                            loading={imageLoader}
                          />
                        </div>
                      )}

                      <Carousel interval={null} indicators={false}>
                        {vehicleImages &&
                          vehicleImages.map((image, index) => (
                            <Carousel.Item
                              key={index}
                              onClick={() => handleImageClick(index)}
                            >
                              <Image
                                width={500}
                                height={500}
                                className="d-block w-100"
                                src={`${awsImageURL}/public/posts/${data?.newcarpost_token}/${image?.filename}`}
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
                                  <Image
                                    width={500}
                                    height={500}
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

                  <div className="col-lg-12 col-12 d-flex justify-content-center align-items-center  ">
                    <div
                      className="row justify-content-between h-100 align-item-center "
                      style={{ background: "white" }}
                    >
                      <div className="col-lg-3 col-md-6 col-6 pt-3">
                        <div className="newcar-topinfo px-5 py-3">
                          <span>
                            <Image
                              width={500}
                              height={500}
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
                            <p> {engine?.engineType} </p>
                          </span>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6 col-6 pt-3">
                        <div className="newcar-topinfo px-5 py-3">
                          <span>
                            <Image
                              width={500}
                              height={500}
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
                            <p> {tranmission?.transmission} </p>
                          </span>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6 col-6 pt-3">
                        <div className="newcar-topinfo px-5 py-3">
                          <span>
                            <Image
                              width={500}
                              height={500}
                              src={YearIcon}
                              alt="icon"
                              srcSet=""
                              style={{ height: 30, width: 30 }}
                            />
                          </span>
                          <span>
                            <h6 className="m-0 p-1 color-secondary">Year</h6>
                            <p> {data?.year} </p>
                          </span>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6 col-6 pt-3">
                        <div className="newcar-topinfo px-5 py-3">
                          <span>
                            <Image
                              width={500}
                              height={500}
                              src={bodyTypeIcon}
                              alt="icon"
                              srcSet=""
                              style={{ height: 25, width: 50 }}
                            />
                          </span>
                          <span>
                            <h6 className="m-0 py-1 color-secondary">
                              Body Type
                            </h6>
                            <p> {data?.bodytype_name} </p>
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
            <div className="container py-5 mb-3">
              <h3 className="newcar-infoheading ">Overview</h3>
              <div
                dangerouslySetInnerHTML={{ __html: data?.newcarpost_overview }}
              />
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

                {carsArr.length > 0 && (
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
                            <p className="px-3 newcar-specheading">
                              Overall Length
                            </p>
                          </div>
                          <div className="col-lg-3 col-md-6 col-6 text-end">
                            <p className="px-3 newcar-specvalue">
                              {" "}
                              {
                                JSON.parse(carsArr[0]?.newcarpost_dimensions)
                                  .overallLength
                              }{" "}
                              mm{" "}
                            </p>
                          </div>
                          <div className="col-lg-3 col-md-6 col-6">
                            {" "}
                            <p className="px-3 newcar-specheading">
                              Kerb Weight
                            </p>
                          </div>
                          <div className="col-lg-3 col-md-6 col-6 text-end">
                            <p className="px-3 newcar-specvalue">
                              {
                                JSON.parse(carsArr[0]?.newcarpost_dimensions)
                                  .kerbWeight
                              }{" "}
                              KG
                            </p>
                          </div>

                          <div className="col-lg-3 col-md-6 col-6">
                            <p className="px-3 newcar-specheading">
                              Overall Width
                            </p>
                          </div>
                          <div className="col-lg-3 col-md-6 col-6 text-end">
                            <p className="px-3 newcar-specvalue">
                              {
                                JSON.parse(carsArr[0]?.newcarpost_dimensions)
                                  .overallWidth
                              }{" "}
                              mm
                            </p>
                          </div>
                          <div className="col-lg-3 col-md-6 col-6">
                            {" "}
                            <p className="px-3 newcar-specheading">
                              Boot Space
                            </p>
                          </div>
                          <div className="col-lg-3 col-md-6 col-6 text-end">
                            <p className="px-3 newcar-specvalue">
                              {
                                JSON.parse(carsArr[0]?.newcarpost_dimensions)
                                  .bootSpaceL
                              }{" "}
                              L
                            </p>
                          </div>

                          <div className="col-lg-3 col-md-6 col-6">
                            {" "}
                            <p className="px-3 newcar-specheading">
                              Seating Capacity
                            </p>
                          </div>
                          <div className="col-lg-3 col-md-6 col-6 text-end">
                            <p className="px-3 newcar-specvalue">
                              {
                                JSON.parse(carsArr[0]?.newcarpost_dimensions)
                                  .seatingCapacity
                              }{" "}
                              persons
                            </p>
                          </div>

                          <div className="col-lg-3 col-md-6 col-6">
                            <p className="px-3 newcar-specheading">
                              Wheel Base
                            </p>
                          </div>
                          <div className="col-lg-3 col-md-6 col-6 text-end">
                            <p className="px-3 newcar-specvalue">
                              {
                                JSON.parse(carsArr[0]?.newcarpost_dimensions)
                                  .wheelBase
                              }{" "}
                              mm
                            </p>
                          </div>
                          <div className="col-lg-3 col-md-6 col-6">
                            {" "}
                            <p className="px-3 newcar-specheading">
                              No. of Doors
                            </p>
                          </div>
                          <div className="col-lg-3 col-md-6 col-6 text-end">
                            <p className="px-3 newcar-specvalue">
                              {
                                JSON.parse(carsArr[0]?.newcarpost_dimensions)
                                  .noOfDoors
                              }{" "}
                              doors
                            </p>
                          </div>

                          <div className="col-lg-3 col-md-6 col-6">
                            <p className="px-3 newcar-specheading">
                              Ground Clearance
                            </p>
                          </div>
                          <div className="col-lg-3 col-md-6 col-6 text-end">
                            <p className="px-3 newcar-specvalue">
                              {
                                JSON.parse(carsArr[0]?.newcarpost_dimensions)
                                  .groundClearance
                              }{" "}
                              mm
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="newcar-main" style={{ background: "white" }}>
            <div className="container pt-5 mb-0">
              <h3 className="newcar-infoheading ">
                {data?.make} {data?.model_name} {data?.year}: Ex-Factory Prices
                and Variants in UAE
              </h3>
              <p className="pb-5">
                Discover the latest {data?.make} {data?.model_name} {data?.year}{" "}
                lineup in UAE, starting from PKR{" "}
                {formatPrice(data?.newcarpost_price)} for the entry-level{" "}
                {data?.newcarpost_variants} variant and reaching up to PKR{" "}
                {formatPrice(lastElement?.newcarpost_price)} for the premium{" "}
                {lastElement?.newcarpost_variants} variant. Explore the
                ex-factory prices of {data?.make} {data?.model_name}, designed
                to elevate your driving experience.
              </p>
            </div>
          </div>
          <div>
            <div className="container mb-4 newcar-main p-4 rounded">
              <div className="row">
                {tabsContent.map((content, index) => (
                  <div className="col-lg-2 col-3">
                    <button
                      key={index}
                      onClick={() => handleTabClick(index)}
                      style={{
                        fontWeight: activeTab === index ? "bold" : "normal",
                      }}
                      className="btn text-start p-0"
                    >
                      {index === 0
                        ? "All Variants"
                        : index === 1
                        ? petrolVariants?.length > 0 && "Petrol Variants"
                        : dieselVariants?.length > 0 && "Diesel Variants"}
                      {activeTab === index ? (
                        <div className="underlineDiv"></div>
                      ) : null}
                    </button>
                  </div>
                ))}
              </div>

              <div className="row mt-4 mb-2">
                <p className="col-6 fw-600 smallVarientText text-dark-emphasis">
                  Varient
                </p>
                <p className="col-6 fw-600 smallVarientText text-dark-emphasis">
                  {" "}
                  Ex-Factory price
                </p>
              </div>

              <div className="row">
                <div className="col-6">
                  {tabsContent[activeTab].map((item, index) => (
                    <div key={index} className="mb-4">
                      <p className="fw-500 my-2">
                        {item.model_name} {item.newcarpost_variants}
                      </p>
                      <p className="text-dark-emphasis smallVarientText my-0">
                        {JSON.parse(item.newcarpost_enginemotor)?.displacement}{" "}
                        CC,{" "}
                        {JSON.parse(item.newcarpost_enginemotor)?.engineType},{" "}
                        {JSON.parse(item.newcarpost_transmission)?.transmission}{" "}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="col-3">
                  {tabsContent[activeTab].map((item, index) => (
                    <div key={index} className="mb-4">
                      <p className="mb-5 mt-3 fw-500">
                        {" "}
                        PKR {formatPrice(item?.newcarpost_price)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="col-3">
                  {tabsContent[activeTab].map((item, index) => (
                    <div key={index} className="mb-4">
                      <button
                        onClick={() =>
                          openCarDetail(`${item?.make}/${item?.newcarpost_id}`)
                        }
                        className="viewMoreButton smallVarientText mb-3 mt-2"
                      >
                        View More Details
                      </button>
                    </div>
                  ))}
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
}
