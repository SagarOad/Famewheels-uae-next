import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button, Pagination } from "@mui/material";
import Image from "next/image";
import InnerLoader from "@/components/loader/innerLoader";
import Link from "next/link";
import FwBecomeMember from "@/images/famewheels-become-a-member.png";
import CarSuggestionIcon from "@/images/car-suggestion-icon-1.png";
import { Helmet } from "react-helmet";

export default function RandomNewCars() {
  const awsImageURL = process.env.NEXT_PUBLIC_AWS_IMAGE_URL;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const nowYear = new Date().getFullYear();

  const [make, setMake] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [showBodyType, setShowBodyType] = useState(false);
  const [newlyLaunched, setShowNewlyLaunched] = useState(false);
  const [showPrice, setShowPrice] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);

  const [newlyLaunchedCarsList, setNewlyLaunchedCarsList] = useState([]);
  const [newCarsList, setNewCarsList] = useState([]);
  const fetchNewlistData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/newcarpostlilst`, {
        params: {
          make_id: "",
          page: page,
        },
      });
      setNewCarsList(response?.data?.data);
      setTotalPages(response?.data?.last_page);
      setPage(response?.data?.current_page);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  const fetchNewlyLaunchedlistData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/newlylaunchedcarlist`, {
        params: {
          make_id: "",
          page: page,
        },
      });
      setNewlyLaunchedCarsList(response?.data?.data);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchNewlistData();
    fetchNewlyLaunchedlistData();
  }, [page]);

  useEffect(() => {
    const fetchMake = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/byMakelimited`);

        setMake(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchMake();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const history = useRouter();

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
      return price.toLocaleString("en-US", { maximumFractionDigits: 2 });
    }
  };

  const openByMake = (makeName) => {
    history.push(`/new-cars-list?/${makeName}`);
  };

  const openCarDetail = (makeName) => {
    history.push(`/new-car-specs/${makeName}`);
  };

  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const [activePriceTab, setActivePriceTab] = useState(0);

  const handlePriceTabClick = (index) => {
    setActivePriceTab(index);
  };

  const SedanVariants = newCarsList.filter(
    (item) => item?.bodytype_name === "Sedan"
  );
  const CrossoverVariants = newCarsList.filter(
    (item) => item?.bodytype_name === "Crossover"
  );
  const SUVVariants = newCarsList.filter(
    (item) =>
      item?.bodytype_name === "SUV" || item?.bodytype_name === "Compact SUV"
  );
  const HatchbackVariants = newCarsList.filter(
    (item) =>
      item?.bodytype_name === "Hatchback" ||
      item?.bodytype_name === "Compact hatchback"
  );

  const PickUpVariants = newCarsList.filter(
    (item) => item?.bodytype_name === "Pick Up"
  );
  const DoubleCabinVariants = newCarsList.filter(
    (item) => item?.bodytype_name === "Double Cabin"
  );

  const tabsContent = [
    newCarsList,
    HatchbackVariants,
    SedanVariants,
    SUVVariants,
    PickUpVariants,
    DoubleCabinVariants,
    CrossoverVariants,
  ];

  const FirstVariants = newCarsList.filter(
    (item) =>
      item?.newcarpost_price >= "1000000" && item?.newcarpost_price <= "3000000"
  );
  const SecondVariants = newCarsList.filter(
    (item) =>
      item?.newcarpost_price >= "3100000" && item?.newcarpost_price <= "5000000"
  );
  const ThirdVariants = newCarsList.filter(
    (item) =>
      item?.newcarpost_price >= "5100000" && item?.newcarpost_price <= "8000000"
  );
  const FourVariants = newCarsList.filter(
    (item) =>
      item?.newcarpost_price >= "8100000" &&
      item?.newcarpost_price <= "10000000"
  );
  const FiveVariants = newCarsList.filter(
    (item) => item?.newcarpost_price > "10000000"
  );

  const tabsPriceContent = [
    FirstVariants,
    SecondVariants,
    ThirdVariants,
    FourVariants,
    FiveVariants,
  ];

  return (
    <>
      <Helmet>
        <title>New car Prices in UAE | Famewheels</title>
        <meta
          name="description"
          content="Discover top deals on used cars for sale in UAE with FameWheels. Our expert inspections guarantee the quality and reliability of each vehicle. Find your ideal used car in UAE today."
        />
        <meta
          property="og:title"
          content="New car Prices in UAE | Famewheels"
        />
        <meta
          property="og:description"
          content="Discover the latest new car prices in UAE with Famewheels. Stay updated and make informed decisions about new cars. Explore now for accurate and reliable pricing information."
        />

        <meta property="og:url" content={window.location.href} />
      </Helmet>
      <div className=" newcar-main">
        <section className="container text-center py-5">
          <h2 className="text-start section-titles">Newly Launched Cars</h2>
          <p className="text-start ">
            FameWheels brings a complete range of new cars in {nowYear} in UAE
            with prices. You can search cars by applying filters such as by
            price, by bodytype, by brand, by seating capacity & more.{" "}
          </p>
        </section>
        <div className="container text-center ">
          <section
            className="p-3 mb-3 "
            style={{ borderRadius: 2, background: "white" }}
          >
            <div className="row">
              {newlyLaunched ? (
                <>
                  {newlyLaunchedCarsList.map((item, index) => (
                    <Link
                      href={`/new-car-specs/${encodeURIComponent(
                        item?.make
                      )}/${encodeURIComponent(item?.newcarpost_id)}`}
                      className="col-lg-3 col-md-4 col-6 mb-3 p-2 cursorPointer"
                      key={`${item?.newcarpost_id}${item?.make}`}
                    >
                      <div className="adPost text-start">
                        <div className="position-relative m-2">
                          <Image
                            width={500}
                            height={500}
                            src={`${awsImageURL}/public/posts/${item?.newcarpost_token}/${item?.newcarpost_cover}`}
                            alt={`${item?.make} ${item?.model_name}`}
                            style={{ boxShadow: "unset", objectFit: "contain" }}
                          />
                          <div className="d-flex align-items-center justify-content-between position-absolute top-0 w-100 ">
                            <div className="m-0 px-2 py-1 fw-600 featured-badge text-center">
                              Newly Launched
                            </div>
                          </div>
                        </div>

                        <div className=" p-2 ">
                          <h5 className="fw-600 ad-Title color-black text-capitalize mb-1 text-center">
                            {item?.make} {item?.model_name}
                          </h5>
                          <h4
                            style={{ color: "#20409a" }}
                            className="fw-600 text-center adPrice mb-1"
                          >
                            <span style={{ color: "#20409a" }}>
                              PKR {formatPrice(item?.newcarpost_price)}
                            </span>
                          </h4>

                          <h4 className="fw-500 text-center adPrice mt-2">
                            <span> {item?.newcarpost_launchdate}</span>
                          </h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </>
              ) : (
                <>
                  {newlyLaunchedCarsList?.slice(0, 8)?.map((item, index) => (
                    <Link
                      href={`/new-car-specs/${encodeURIComponent(
                        item?.make
                      )}/${encodeURIComponent(item?.newcarpost_id)}`}
                      className="col-lg-3 col-md-4 col-6 mb-3 p-2 cursorPointer "
                      key={`${item?.newcarpost_id}${item?.make}`}
                    >
                      <div className="adPost text-start">
                        <div className="position-relative m-2">
                          <Image
                            width={500}
                            height={500}
                            src={`${awsImageURL}/public/posts/${item?.newcarpost_token}/${item?.newcarpost_cover}`}
                            alt={`${item?.make} ${item?.model_name}`}
                            style={{ boxShadow: "unset", objectFit: "contain" }}
                          />
                          <div className="d-flex align-items-center justify-content-between position-absolute top-0 w-100 ">
                            <div className="m-0 px-2 py-1 fw-600 featured-badge text-center">
                              Newly Launched
                            </div>
                          </div>
                        </div>

                        <div className=" p-2 ">
                          <h5 className="fw-600 ad-Title color-black text-capitalize mb-1 text-center">
                            {item?.make} {item?.model_name}
                          </h5>
                          <h4
                            style={{ color: "#20409a" }}
                            className="fw-600 text-center adPrice mb-1"
                          >
                            <span style={{ color: "#20409a" }}>
                              PKR {formatPrice(item?.newcarpost_price)}
                            </span>
                          </h4>

                          <h4 className="fw-500 text-center adPrice mt-2">
                            <span> {item?.newcarpost_launchdate}</span>
                          </h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </>
              )}
            </div>
            {newlyLaunchedCarsList && newlyLaunchedCarsList?.length > 8 && (
              <>
                {newlyLaunched ? (
                  <button
                    className="btn fw-600 btnText d-flex gap-3 align-items-center"
                    onClick={() => setShowNewlyLaunched(!newlyLaunched)}
                  >
                    View Less Cars <i className="fa-solid fa-caret-up"></i>
                  </button>
                ) : (
                  <button
                    className="btn fw-600 btnText d-flex gap-3 align-items-center"
                    onClick={() => setShowNewlyLaunched(!newlyLaunched)}
                  >
                    View All Cars <i className="fa-solid fa-caret-down"></i>
                  </button>
                )}
              </>
            )}
          </section>
        </div>
        <div className="container text-center ">
          <section
            className="p-3 mb-3"
            style={{ borderRadius: 2, background: "white" }}
          >
            <h2 className="text-start section-titles py-3 ">
              Search New Cars By Brand
            </h2>

            {isLoading ? (
              <InnerLoader />
            ) : (
              <>
                <div className="row">
                  {show ? (
                    <>
                      {make &&
                        make?.map((item) => (
                          <div
                            className="col-lg-2 col-4 mt-2 mb-4"
                            key={`${item?.makeId}${item?.makeName}`}
                            // onClick={() =>
                            //   openByMake(`${item?.makeName}/${item?.makeId}`)
                            // }
                          >
                            <Link
                              href={`/new-cars-list/${encodeURIComponent(
                                item?.makeName
                              )}/${item?.makeId}`}
                            >
                              <div className="makeBtn text-center">
                                <button className="btn w-100 h-100">
                                  <Image
                                    width={500}
                                    height={500}
                                    src={`https://gallery.famewheels.com/images/makeLogos/${item?.makeImage}`}
                                    alt={item?.makeName}
                                    className="makeLogos"
                                  />
                                </button>
                                <div>
                                  <h6 className="pt-1 mt-2">
                                    {item?.makeName}
                                  </h6>
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                    </>
                  ) : (
                    <>
                      {make &&
                        make?.slice(0, 12)?.map((item) => (
                          <div
                            className="col-lg-2 col-4 mt-2 mb-4"
                            key={`${item?.makeId}${item?.makeName}`}
                            // onClick={() =>
                            //   openByMake(`${item?.makeName}/${item?.makeId}`)
                            // }
                          >
                            <Link
                              href={`new-cars-list/${encodeURIComponent(
                                item?.makeName
                              )}/${item?.makeId}`}
                            >
                              <div className="makeBtn text-center">
                                <button className="btn w-100 h-100">
                                  <Image
                                    width={500}
                                    height={500}
                                    src={`https://gallery.famewheels.com/images/makeLogos/${item?.makeImage}`}
                                    alt={item?.makeName}
                                    className="makeLogos"
                                  />
                                </button>
                                <div>
                                  <h6 className="pt-1 mt-2">
                                    {item?.makeName}
                                  </h6>
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                    </>
                  )}
                </div>
                {show ? (
                  <button
                    className="btn fw-600 btnText d-flex gap-3 align-items-center"
                    onClick={() => setShow(!show)}
                  >
                    View Less Brands <i className="fa-solid fa-caret-up"></i>
                  </button>
                ) : (
                  <button
                    className="btn fw-600 btnText d-flex gap-3 align-items-center"
                    onClick={() => setShow(!show)}
                  >
                    View All Brands <i className="fa-solid fa-caret-down"></i>
                  </button>
                )}
              </>
            )}
          </section>
        </div>

        <div className="container  py-3">
          <div className="row grad-bg align-items-center px-5 py-4 rounded-3  ">
            <div className="col-lg-6">
              <h5 className="m-0 text-white">Become a Member</h5>
              <h2 className=" fw-600 fs-1 color-white">
                <span className="fs-2">To Bid on </span> <br /> Your Favorite
                Car
              </h2>
              <Link href="/become-a-member">
                <Button
                  variant="conatined"
                  className="bgSecondary my-2 color-white text-capitalize"
                >
                  Become a Member
                </Button>
              </Link>
            </div>
            <div className="col-lg-6 text-end">
              <Image
                width={500}
                height={500}
                src={FwBecomeMember}
                className="ourBid_img  "
                alt="Famewheels Become a member"
                srcSet=""
              />
            </div>
          </div>
        </div>

        <div className="container text-center ">
          <section
            className="p-3 mb-3"
            style={{ borderRadius: 2, background: "white" }}
          >
            <h2 className="text-start section-titles py-3 ">
              Find right new cars by body type
            </h2>
            <div className="row">
              {tabsContent.map((content, index) => (
                <div className="col-lg col-2">
                  <button
                    key={index}
                    onClick={() => handleTabClick(index)}
                    style={{
                      fontWeight: activeTab === index ? "bold" : "normal",
                    }}
                    className="btn text-start p-0"
                  >
                    {index === 0
                      ? newCarsList?.length > 0 && "All"
                      : index === 1
                      ? HatchbackVariants?.length > 0 && "Hatchback"
                      : index === 2
                      ? SedanVariants?.length > 0 && "Sedan"
                      : index === 3
                      ? SUVVariants?.length > 0 && "SUV"
                      : index === 4
                      ? PickUpVariants?.length > 0 && "Pick Up"
                      : index === 5
                      ? DoubleCabinVariants?.length > 0 && "Double Cabin"
                      : CrossoverVariants?.length > 0 && "Crossover"}
                  </button>

                  {activeTab === index ? (
                    <div className=" underlineDiv"></div>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="row">
              {showBodyType ? (
                <>
                  {tabsContent[activeTab].map((item, index) => (
                    <Link
                      href={`/new-car-specs/${encodeURIComponent(
                        item?.make
                      )}/${encodeURIComponent(item?.newcarpost_id)}`}
                      className="col-lg-3 col-md-4 col-6 mb-3 p-2 cursorPointer "
                      key={`${item?.newcarpost_id}${item?.make}`}
                    >
                      <div className="adPost text-start">
                        <div className="position-relative m-2">
                          <Image
                            width={500}
                            height={500}
                            src={`${awsImageURL}/public/posts/${item?.newcarpost_token}/${item?.newcarpost_cover}`}
                            alt={`${item?.make} ${item?.model_name}`}
                            style={{ boxShadow: "unset", objectFit: "contain" }}
                          />
                        </div>

                        <div className=" p-2 ">
                          <h5 className="fw-600 ad-Title color-black text-capitalize mb-1 text-center">
                            {item?.make} {item?.model_name}
                          </h5>
                          <h4
                            style={{ color: "#20409a" }}
                            className="fw-600 text-center adPrice mb-1"
                          >
                            <span style={{ color: "#20409a" }}>
                              PKR {formatPrice(item?.newcarpost_price)}
                            </span>
                          </h4>

                          <h4 className="fw-500 text-center adPrice mt-2">
                            <span> {item?.year}</span>
                          </h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </>
              ) : (
                <>
                  {tabsContent[activeTab]?.slice(0, 8)?.map((item, index) => (
                    <Link
                      href={`/new-car-specs/${encodeURIComponent(
                        item?.make
                      )}/${encodeURIComponent(item?.newcarpost_id)}`}
                      className="col-lg-3 col-md-4 col-6 mb-3 p-2 cursorPointer "
                      key={`${item?.newcarpost_id}${item?.make}`}
                    >
                      <div className="adPost text-start">
                        <div className="position-relative m-2">
                          <Image
                            width={500}
                            height={500}
                            src={`${awsImageURL}/public/posts/${item?.newcarpost_token}/${item?.newcarpost_cover}`}
                            alt={`${item?.make} ${item?.model_name}`}
                            style={{ boxShadow: "unset", objectFit: "contain" }}
                          />
                        </div>

                        <div className=" p-2 ">
                          <h5 className="fw-600 ad-Title color-black text-capitalize mb-1 text-center">
                            {item?.make} {item?.model_name}
                          </h5>
                          <h4
                            style={{ color: "#20409a" }}
                            className="fw-600 text-center adPrice mb-1"
                          >
                            <span style={{ color: "#20409a" }}>
                              PKR {formatPrice(item?.newcarpost_price)}
                            </span>
                          </h4>

                          <h4 className="fw-500 text-center adPrice mt-2">
                            <span> {item?.year}</span>
                          </h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </>
              )}
            </div>
            {showBodyType ? (
              <button
                className="btn fw-600 btnText d-flex gap-3 align-items-center"
                onClick={() => setShowBodyType(!showBodyType)}
              >
                View Less Cars <i className="fa-solid fa-caret-up"></i>
              </button>
            ) : (
              <button
                className="btn fw-600 btnText d-flex gap-3 align-items-center"
                onClick={() => setShowBodyType(!showBodyType)}
              >
                View All Cars <i className="fa-solid fa-caret-down"></i>
              </button>
            )}
          </section>
        </div>

        <div className="pt-5">
          <div className="wantBecomeColor">
            <div
              style={{ backgroundSize: `${(2 * scrollY) / 30}% auto` }}
              className="wantBecome container py-5 "
            >
              <h5 className="fw-700 font-lato text-center ">
                FameWheels Car Suggest
              </h5>
              <div className=" bg_blur px-5 py-5 my-3 d-md-flex text-center text-md-start justify-content-between align-items-center">
                <div>
                  <h3 className="font-lato">
                    Not Sure, <br /> <span>Which car to buy?</span>
                  </h3>
                  <p>Let us help you find the dream car</p>
                </div>
                <div className="d-flex flex-column justify-content-center align-items-center">
                  <Image
                    width={500}
                    height={500}
                    src={CarSuggestionIcon}
                    alt="car suggestion"
                    srcSet={CarSuggestionIcon}
                  />
                  <Link href="/car-suggest">
                    <button
                      type="button"
                      className="btn bgWhite fw_br px-4 py-2 fw-600 mt-3 mt-md-0 text-capitalize"
                      style={{ fontSize: 15 }}
                    >
                      Show me best car
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container text-center ">
          <section
            className="p-3 mb-3"
            style={{ borderRadius: 2, background: "white" }}
          >
            <h2 className="text-start section-titles py-3 ">
              Search New Cars By Price
            </h2>
            <div className="row">
              {tabsPriceContent.map((content, index) => (
                <div className="col-lg-2 col-3">
                  <button
                    key={index}
                    onClick={() => handlePriceTabClick(index)}
                    style={{
                      fontWeight: activePriceTab === index ? "bold" : "normal",
                    }}
                    className="btn text-start p-0"
                  >
                    {index === 0
                      ? FirstVariants?.length > 0 && "10 - 30 Lacs"
                      : index === 1
                      ? SecondVariants?.length > 0 && "31 - 50 Lacs"
                      : index === 2
                      ? ThirdVariants?.length > 0 && "51 - 80 Lacs"
                      : index === 3
                      ? FourVariants?.length > 0 && "81 Lacs - 1 Crore"
                      : FiveVariants?.length > 0 && "Above 1 Crore"}
                  </button>
                  {activePriceTab === index ? (
                    <div className="underlineDiv"></div>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="row">
              {showBodyType ? (
                <>
                  {tabsPriceContent[activePriceTab].map((item, index) => (
                    <Link
                      href={`/new-car-specs/${encodeURIComponent(
                        item?.make
                      )}/${encodeURIComponent(item?.newcarpost_id)}`}
                      className="col-lg-3 col-md-4 col-6 mb-3 p-2 cursorPointer "
                      key={`${item?.newcarpost_id}${item?.make}`}
                    >
                      <div className="adPost text-start">
                        <div className="position-relative m-2">
                          <Image
                            width={500}
                            height={500}
                            src={`${awsImageURL}/public/posts/${item?.newcarpost_token}/${item?.newcarpost_cover}`}
                            alt={`${item?.make} ${item?.model_name}`}
                            style={{ boxShadow: "unset", objectFit: "contain" }}
                          />
                        </div>

                        <div className=" p-2 ">
                          <h5 className="fw-600 ad-Title color-black text-capitalize mb-1 text-center">
                            {item?.make} {item?.model_name}
                          </h5>
                          <h4
                            style={{ color: "#20409a" }}
                            className="fw-600 text-center adPrice mb-1"
                          >
                            <span style={{ color: "#20409a" }}>
                              PKR {formatPrice(item?.newcarpost_price)}
                            </span>
                          </h4>

                          <h4 className="fw-500 text-center adPrice mt-2">
                            <span> {item?.year}</span>
                          </h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </>
              ) : (
                <>
                  {tabsPriceContent[activePriceTab]
                    ?.slice(0, 8)
                    ?.map((item, index) => (
                      <Link
                        href={`/new-car-specs/${encodeURIComponent(
                          item?.make
                        )}/${encodeURIComponent(item?.newcarpost_id)}`}
                        className="col-lg-3 col-md-4 col-6 mb-3 p-2 cursorPointer "
                        key={`${item?.newcarpost_id}${item?.make}`}
                        onClick={() =>
                          openCarDetail(`${item?.make}/${item?.newcarpost_id}`)
                        }
                      >
                        <div className="adPost text-start">
                          <div className="position-relative m-2">
                            <Image
                              width={500}
                              height={500}
                              src={`${awsImageURL}/public/posts/${item?.newcarpost_token}/${item?.newcarpost_cover}`}
                              alt={`${item?.make} ${item?.model_name}`}
                              style={{
                                boxShadow: "unset",
                                objectFit: "contain",
                              }}
                            />
                          </div>

                          <div className=" p-2 ">
                            <h5 className="fw-600 ad-Title color-black text-capitalize mb-1 text-center">
                              {item?.make} {item?.model_name}
                            </h5>
                            <h4
                              style={{ color: "#20409a" }}
                              className="fw-600 text-center adPrice mb-1"
                            >
                              <span style={{ color: "#20409a" }}>
                                PKR {formatPrice(item?.newcarpost_price)}
                              </span>
                            </h4>

                            <h4 className="fw-500 text-center adPrice mt-2">
                              <span> {item?.year}</span>
                            </h4>
                          </div>
                        </div>
                      </Link>
                    ))}
                </>
              )}
            </div>
            {showPrice ? (
              <button
                className="btn fw-600 btnText d-flex gap-3 align-items-center"
                onClick={() => setShowPrice(!showPrice)}
              >
                View Less Cars <i className="fa-solid fa-caret-up"></i>
              </button>
            ) : (
              <button
                className="btn fw-600 btnText d-flex gap-3 align-items-center"
                onClick={() => setShowPrice(!showPrice)}
              >
                View All Cars <i className="fa-solid fa-caret-down"></i>
              </button>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
