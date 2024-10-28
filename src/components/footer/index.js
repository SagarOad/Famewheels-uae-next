"use client";
import footer1 from "@/images/footer-badge1.png";
import footer2 from "@/images/car-sold.png";
import footer3 from "@/images/offers-tag.png";
import footer4 from "@/images/compare.png";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Button from "@mui/material/Button";
import { YouTube } from "@mui/icons-material";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import { Modal, Box } from "@mui/material";
import Image from "next/image";
import Ipo from "@/images/ipo-logo.png";
import ISO from "@/images/iso-27001.png";
import Pasha from "@/images/pasha-logo.png";

// import NumberLogin from "../loginModal/number";

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

const index = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const date = new Date().getFullYear();

  const formRef = useRef(null);
  const btnRef = useRef(null);
  const history = useRouter();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [make, setMake] = useState([]);
  const [error, setError] = useState(null);
  const [cities, setCities] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

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
    const fetchFilters = async () => {
      try {
        const response = await axios.get(`${baseUrl}/bycategory`);
        setCategoryData(response?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      }
    };

    fetchFilters();
  }, [baseUrl]);

  const LoginOpen = () => {
    setIsOpen(true);
  };

  const LoginClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    let replicafetchData = localStorage.getItem("data");
    let fetchData = JSON.parse(replicafetchData);
    setUser(fetchData);
  }, []);

  const limitedMake = make?.slice(0, 10);
  const limitedCategory = categoryData?.slice(0, 10);
  const limitedCity = cities?.slice(0, 10);


  const openCategory = (category) => {
    history.push(`/search?ctg=${category}&`);
  };
  const openByMake = (makeName) => {
    history.push(`/search?mk=${makeName}&`);
  };
  const openByCity = (cityName) => {
    history.push(`/search?ct=${cityName}&`);
  };

  const AdSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("subscriber_email", email);

      const response = await axios.post(`${baseUrl}/savesubscriber`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setEmail("");

      setOpenSuccessModal(true);

      setTimeout(() => {
        setOpenSuccessModal(false);
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <footer>
        <div className="newColorGrad_bg py-5 ">
          <div className="container flex-wrap row-gap-4  d-flex align-items-center justify-content-between">
            <div className="footer_badges d-flex align-items-center justify-content-center ">
              <Image src={footer1} alt="Live Bidding" srcSet={footer1} />
              <div className="text-white ">
                <h4>UAE’s No 1</h4>
                <p className="m-0">Live Bidding Portal</p>
              </div>
            </div>
            <div className="footer_badges d-flex align-items-center justify-content-center ">
              <Image src={footer2} alt="Car Sold" srcSet={footer2} />
              <div className="text-white ">
                <h4>Car Sold</h4>
                <p className="m-0">Every 15 Minutes</p>
              </div>
            </div>
            <div className="footer_badges d-flex align-items-center justify-content-center ">
              <Image src={footer3} alt="Offers" srcSet={footer3} />
              <div className="text-white ">
                <h4>Offers</h4>
                <p className="m-0">Stay updated pay less</p>
              </div>
            </div>
            <div className="footer_badges d-flex align-items-center justify-content-center ">
              <Image src={footer4} alt="Compare" srcSet={footer4} />
              <div className="text-white ">
                <h4>Compare</h4>
                <p className="m-0">Decode the right car</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bgFooter p-4 ">
          <div className="container">
            <div className="bgWhite subsFrom">
              <div className="row py-4 px-md-5 px-4 mb-5 mt-3 align-items-center ">
                <div className="col-lg-6 col-12 text-center text-md-start">
                  <h4 className="fw-600 fs-3 color-black">
                    Subscribe to our{" "}
                    <span className="color-secondary">Newsletter</span>{" "}
                  </h4>
                </div>
                <div className="col-lg-6">
                  <div className="row flex-wrap">
                    <div className="col-lg-12 col-md-12 col-12">
                      <form
                        ref={formRef}
                        onSubmit={AdSubmit}
                        className="postAdForm"
                      >
                        <div className="input-group emailBar boxShadow">
                          <input
                            name="email"
                            type="email"
                            className="form-control"
                            placeholder="Enter your email address"
                            aria-label="email"
                            aria-describedby="basic-addon2"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                          />
                          <div className="m-auto btnArea pe-3">
                            <Button
                              ref={btnRef}
                              type="submit"
                              variant="contained"
                              className=" bgSecondary color-white text-capitalize px-md-5 py-md-2"
                            >
                              Subscribe
                            </Button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row px-0 ">
              <div className="col-lg-2 col-md-3 col-6 footer-services">
                <h5 className="color-black footerHeading text-capitalize fs-6 fw-700">
                  Company
                </h5>
                <ul className="">
                  <li>
                    <a href="/about_us">About Us</a>
                  </li>
                  <li>
                    <a href="/contact_us">Contact Us</a>
                  </li>
                  <li>
                    <a href="/faq">FAQ's</a>
                  </li>
                  <li>
                    <a href="/policy">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="/terms">Terms and Conditions</a>
                  </li>
                  <li>
                    <a href="/refund_return">Refund Policy</a>
                  </li>
                  <li>
                    <a href="/subscribe">Subscribe To Live Bidding</a>
                  </li>
                </ul>
              </div>
              <div className="col-lg-2 col-md-3 col-6 footer-services ">
                <h5 className="color-black footerHeading text-capitalize fs-6 fw-700">
                  Cars By Make
                </h5>
                <ul>
                  {limitedMake &&
                    limitedMake?.map((item) => (
                      <li
                        key={item?.makeId}
                        onClick={() => openByMake(item?.makeName)}
                      >{`${item.makeName} Cars for sale `}</li>
                    ))}
                </ul>
              </div>
              <div className="col-lg-2 col-md-3 col-6 footer-services ">
                <h5 className="color-black footerHeading text-capitalize fs-6 fw-700">
                  Cars By Cities
                </h5>
                <ul>
                  {limitedCity &&
                    limitedCity?.map((item) => (
                      <li
                        key={item?.cityID}
                        onClick={() => openByCity(item?.cityName)}
                      >{`Cars in ${item.cityName}`}</li>
                    ))}
                </ul>
              </div>
              <div className="col-lg-2 col-md-3 col-6 footer-services ">
                <h5 className="color-black footerHeading text-capitalize fs-6 fw-700">
                  Cars by category
                </h5>
                <ul>
                  {limitedCategory &&
                    limitedCategory?.map((item) => (
                      <li
                        key={item?.categoryId}
                        onClick={() => openCategory(item?.category)}
                      >{`${item.category}cc Cars `}</li>
                    ))}
                </ul>
              </div>

              <div className="col-lg-2 col-md-3 col-6 footer-services ">
                <h5 className="color-black footerHeading text-capitalize fs-6 fw-700">
                  Sell on FameWheels
                </h5>
                <ul>
                  {user && user ? (
                    <>
                      <li>
                        <a href="/post-ad?Free-Ads">Sell on famewheels</a>
                      </li>
                      <li>
                        <a href="/post-ad?Sell-to-fameWheels">
                          Sell to famewheels
                        </a>
                      </li>
                    </>
                  ) : (
                    <>
                      <li onClick={LoginOpen}>Sell on famewheels</li>
                      <li onClick={LoginOpen}>Sell to famewheels</li>
                    </>
                  )}
                  <li>
                    <a href="/become-a-member">Become a Member</a>
                  </li>
                </ul>
                <h5 className="color-black footerHeading text-capitalize fs-6 fw-700">
                  Certified by
                </h5>
                <div className="certifiedLogo">
                  <Image
                    src={Ipo}
                    srcSet={Ipo}
                    className="Image-fluid"
                    alt="certified logo"
                  />
                  <Image
                    src={ISO}
                    srcSet={ISO}
                    className="Image-fluid"
                    alt="certified logo"
                  />
                  <Image
                    src={Pasha}
                    srcSet={Pasha}
                    className="Image-fluid"
                    alt="certified logo"
                  />
                </div>
              </div>
              <div className="col-lg-2 col-md-4 col-6 footer-services">
                <h5 className="color-black footerHeading text-capitalize fs-6 fw-700">
                  Customer Support
                </h5>
                <ul className="">
                  <li className="pb-2">
                    <a
                      style={{ textTransform: "lowercase", fontSize: 13 }}
                      href="mailto:support@famewheels.com"
                    >
                      <i className="fa-solid fa-envelope me-2"></i>
                      support@famewheels.com
                    </a>
                  </li>
                  <li>
                    <a
                      style={{ textTransform: "lowercase", fontSize: 13 }}
                      href="tel:+923001113263"
                    >
                      <i className="fa-solid fa-phone me-2"></i>
                      03001113263 <br />
                      <span className="me-3"></span> +92 326 2226222
                    </a>
                  </li>
                </ul>
                <h5 className="color-black footerHeading text-capitalize fs-6 fw-700">
                  Follow Us
                </h5>
                <p>
                  <a
                    target="_blank"
                    href="https://www.facebook.com/famewheelsUAE"
                    rel="noreferrer"
                  >
                    <FacebookOutlinedIcon
                      sx={{ color: "#dc0002", marginRight: 1.5 }}
                    />
                  </a>
                  <a
                    target="_blank"
                    href="https://www.instagram.com/famewheels_UAE/"
                    rel="noreferrer"
                  >
                    <InstagramIcon
                      sx={{ color: "#dc0002", marginRight: 1.5 }}
                    />
                  </a>
                  <a
                    target="_blank"
                    href="https://www.tiktok.com/@fame.wheels"
                    rel="noreferrer"
                  >
                    <i
                      style={{ color: "#dc0002", fontSize: 17 }}
                      className="fa-brands fa-tiktok me-2"
                    ></i>
                  </a>
                  {/* <a
                    target="_blank"
                    href="https://twitter.com/fame_wheels"
                    rel="noreferrer"
                  >
                    <TwitterIcon sx={{ color: "#dc0002", marginRight: 1.5 }} />
                  </a> */}
                  <a
                    target="_blank"
                    href="http://www.youtube.com/@FameWheelsUAE"
                    rel="noreferrer"
                  >
                    <YouTube sx={{ color: "#dc0002", marginRight: 1.5 }} />
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bgSecondary fw-copyright text-center text-white py-1">
          Design and Developed by{" "}
          <a
            style={{ color: "white" }}
            href="https://famebusinesssolutions.com/"
          >
            Fame Business Solutions
          </a>
          , Copyright ©2021-{date} Fame Wheels (SMC-Pvt.) Ltd, All Rights
          Reserved.
        </div>
      </footer>
      <Modal
        open={openSuccessModal}
        onClose={() => setOpenSuccessModal(false)}
        disableAutoFocus={true}
      >
        <Box className="text-center successModal" sx={successModal}>
          <h3>Success!</h3>
          <h5>You have subscribed successfully.</h5>
          <p>Redirecting... </p>
        </Box>
      </Modal>

      {/* <Modal
        open={isOpen}
        onClose={LoginClose}
        disableAutoFocus={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="Fw-popups"
      >
        <Box className="sm-modal p-3 p-md-4">
          <div className="modalBody_area  px-2 ">
            <NumberLogin />
          </div>
        </Box>
      </Modal> */}
    </>
  );
};

export default index;
