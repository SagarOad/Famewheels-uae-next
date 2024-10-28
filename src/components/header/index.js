"use client";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Link from "next/link";
import { usePathname } from "next/navigation";
import setAuthToken from "@/auth/auth";
import logo from "@/images/fame-wheels-logo.png";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import PostFW from "@/images/post-on-fw.png";
import SellFW from "@/images/sell-to-fw.png";
import CreditIcon from "@/images/credits-icon.png";
import Crown from "@/images/crown.png";
import Upcomming from "@/images/upcoming.png";
import LiveBid from "@/images/auction.png";
import InspectionIcon from "@/images/inspectionIcon.png";
import InspectionOrders from "@/images/inspection-orders.png";
import SellThroughBid from "@/images/bidding-selling.png";
import UsedCars from "@/images/used-cars.png";
import UsedBikes from "@/images/offroad-bike-3700502_1280.webp";
import SellCar from "@/images/sellcar.png";
import { useAuthContext } from "@/hooks/useAuthContext";
import { AuthContext } from "@/context/AuthContext";

import CircularProgress from "@mui/material/CircularProgress";
import DynamicFeedOutlinedIcon from "@mui/icons-material/DynamicFeedOutlined";
import Button from "@mui/material/Button";
import BottomNavigation from "@mui/material/BottomNavigation";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import StreamRoundedIcon from "@mui/icons-material/StreamRounded";
import BlueTick from "@/images/blue-tick-success.png";
import SuccessTick from "@/images/success-tick.gif";
import InputMask from "react-input-mask";
import jwtDecode from "jwt-decode";

import Cookies from "js-cookie";
import SpeedDial from "@mui/material/SpeedDial";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CloseIcon from "@mui/icons-material/Close";
import UAEFlag from "../../images/uae.png";
import SendIcon from "@mui/icons-material/Send";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import DealerIcon from "@/images/dealer-icon.png";
import LoginModal from "../modals/loginModal";
import SignUpOtp from "../modals/signUpOtp";
import NumberLogin from "../modals/loginModal/number";
import useGoogleTranslate from "../translator";
import Chatbot from "./ChatBot";
import { useRouter } from "next/navigation";
import Image from "next/image";

const xorEncrypt = (data, key) => {
  const encryptedData = data
    .split("")
    .map((char, i) =>
      String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
    )
    .join("");
  return encryptedData;
};

const Header = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const pathname = usePathname(); // Get the current pathname

  const [cities, setCities] = useState([]);
  const [make, setMake] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [error, setError] = useState(null);

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
    const fetchFilters = async () => {
      try {
        const response = await axios.get(`${baseUrl}/bycategory`);
        setCategoryData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      }
    };

    fetchFilters();
  }, [baseUrl]);

  const { dispatch } = useAuthContext();
  const { user } = useContext(AuthContext);

  const [isOnline, setIsOnline] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [passwordMatchError, setPasswordMatchError] = useState(null);
  const [otpPopup, setOtpPopup] = useState(false);
  const [speedOpen, setSpeedOpen] = useState(false);
  const [openWhatsapp, setOpenWhatsapp] = useState(false);
  const [waMassage, setWaMessage] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [successSignup, setSuccessSignup] = useState(false);
  const [isSignSubmitting, setIsSignSubmitting] = useState(false);
  const [userName, setUserName] = useState(" ");
  const [userCredit, setUserCredit] = useState(null);
  const [isValid, setisValid] = useState(true);
  const [isValidNum, setisValidNum] = useState(true);
  const [isValidSymbol, setisValidSymbol] = useState(true);
  const [isValidSmallLetter, setisValidSmallLetter] = useState(true);
  const [isValidCapitalLetter, setisValidCapitalLetter] = useState(true);
  const [isValidCommonWord, setisValidCommonWord] = useState(true);
  const [isValidMinimumChar, setisValidMinimumChar] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [bottomValue, setBottomValue] = useState(0);
  const [isSticky, setSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [postOpen, setPostOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  const router = useRouter();

  const [showHeader, setShowHeader] = useState(true);
  const [showWhiteHeader, setShowWhiteHeader] = useState(true);

  useEffect(() => {
    if (!router.isReady) return; // Ensure router is ready before accessing pathname

    const currentPath = router.pathname;
    setShowHeader(currentPath === "/");

    const whiteHeaderPaths = [
      "/vehicle-details/",
      "/search",
      "/car-finance",
      "/bike-details",
      "/car-inspection",
      "/car-insurance",
      "/upcoming-vehicle-details",
      "/bidding_agreement",
      "/upcoming-biddings",
      "/bidding",
      "/ad-category",
      "/profile",
      "/add-dealer",
      "/my-ads",
      "/become-a-member",
      "/dealer",
      "/car-dealers",
      "/won-bids",
      "/loss-bids",
      "/dashboard",
      "/live-bidding",
    ];

    const shouldShowWhiteHeader = whiteHeaderPaths.some((path) =>
      currentPath.startsWith(path)
    );
    setShowWhiteHeader(shouldShowWhiteHeader);
  }, [router.isReady, router.pathname]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp <= currentTime) {
        setIsSessionExpired(true);
        localStorage.removeItem("token");
        localStorage.removeItem("data");
        setAuthToken(null);
        Cookies.remove("%8564C%27");
        dispatch({ type: "LOGOUT", payload: null });
        setSuccessLogin(false);
        setSessionError("Session has been Expired.");
      }
    } else {
    }
  }, []);

  const [dealerProfile, setDealerProfile] = useState(null);

  useEffect(() => {
    const fetchMakeData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/showroomdetails`, {
          params: {
            user_id: user?.id,
          },
        });

        setDealerProfile(response?.data?.details);
        console.log(response?.data?.details, " dealer profile response ");
      } catch (error) {
        console.error(
          "Error fetching make data:",
          error?.response?.data || error?.response || error
        );
        // IsLoading(false);
      }
    };

    if (user?.role_id === 6) {
      fetchMakeData();
    }
  }, [user]);

  const handleDataFromChild = (data) => {
    setDataFromChild(data);
  };

  const handleSpeedToggle = () => {
    setSpeedOpen(!speedOpen);
    setOpenWhatsapp(false);
    setWaMessage(null);
  };

  const phoneNumber = "03001113263";
  const formattedPhoneNumber = phoneNumber ? `92${phoneNumber.slice(1)}` : "";

  const openWhatsApp = () => {
    const whatsappUrl = `http://api.whatsapp.com/send?phone=${formattedPhoneNumber}&text=${encodeURIComponent(
      waMassage
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (password !== value) {
      setPasswordMatchError("Passwords did not match");
    } else {
      setPasswordMatchError("");
    }
  };

  useEffect(() => {
    const handleConnectionChange = () => {
      setIsOnline(window.navigator.onLine);
    };

    window.addEventListener("online", handleConnectionChange);
    window.addEventListener("offline", handleConnectionChange);

    handleConnectionChange();

    return () => {
      window.removeEventListener("online", handleConnectionChange);
      window.removeEventListener("offline", handleConnectionChange);
    };
  }, []);

  const handlePostClose = () => setPostOpen(false);

  const handleLoginOpen = () => setLoginOpen(true);
  const handleLoginClose = () => {
    setPassword("");
    setName("");
    setLoginOpen(false);
  };

  const handleSignupOpen = () => setSignupOpen(true);
  const handleSignupClose = () => {
    setUserName("");
    setConfirmPassword("");
    setPhone("");
    setSignupOpen(false);
  };

  // useEffect(() => {
  //   setRoleName("ROLE_USER");
  // }, []);

  const onPasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?!.*(?:1234|abcd)).{8,}$/;

    const passwordNumRegex = /.*\d.*/;
    const passwordSymbolRegex = /.*[!@#$%&*_=].*/;
    const passwordCapitalLetterRegex = /.*[A-Z].*/;
    const passwordSmallLetterRegex = /.*[a-z].*/;
    const passwordCommonRegex = /^(?:(?!abcd|1234|123).)*$/;
    const passwordMinimunCharRegex = /^.{8,}$/;

    setisValid(passwordRegex.test(val));

    setisValidCommonWord(passwordCommonRegex.test(val));
    setisValidNum(passwordNumRegex.test(val));
    setisValidSymbol(passwordSymbolRegex.test(val));
    setisValidCapitalLetter(passwordCapitalLetterRegex.test(val));
    setisValidSmallLetter(passwordSmallLetterRegex.test(val));
    setisValidMinimumChar(passwordMinimunCharRegex.test(val));
  };

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${baseUrl}/getTotalAmount`, {
          params: {
            user_id: user?.id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserCredit(response?.data);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };

    if (user) {
      fetchCredits();
    }
  }, [user]);

  const limitedCity = cities?.slice(0, 10);

  const limitedMake = make?.slice(0, 6);
  const limitedMake2 = make?.slice(7, 13);
  const limitedMake3 = make?.slice(14, 20);

  const openByCity = (cityName) => {
    router.push(`/search?ct=${cityName}&`);
  };
  const openBikeByCity = (cityName) => {
    router.push(`/bike-search?ct=${cityName}&`);
  };

  const openByMake = (makeName) => {
    router.push(`/new-cars-list/${makeName}`);
  };

  const limitedCategory = categoryData?.slice(0, 10);

  const openCategory = (category) => {
    router.push(`/search?ctg=${category}`);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSignSubmitting(true);
    try {
      const formData = new FormData();

      formData.append("user_name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phone", phone);
      formData.append("role_id", 2);

      const response = await axios.post(`${baseUrl}/signup`, formData);

      if (response?.status === 200) {
        handleSignupClose(false);
        setOtpPopup(true);

        try {
          const emailVerify = await axios.get(`${baseUrl}/sendotp`, {
            params: {
              email: email,
            },
          });
          handleLogin();
        } catch (error) {
          setOtpPopup(false);
        }
      }

      setSuccessSignup(true);
      setIsSignSubmitting(false);
    } catch (err) {
      setError(err.response?.data?.error);
      setIsSignSubmitting(false);
      setErrOpen(true);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${baseUrl}/login`, {
        email: userName,
        password: confirmPassword || password,
      });

      localStorage.setItem("token", response.data.token);
      setAuthToken(response.data.token);
      setSuccessLogin(true);

      const userResponse = await axios.get(`${baseUrl}/getUser`, {
        headers: {
          Authorization: `Bearer ${response.data.token}`,
        },
      });

      const encryptedUserData = xorEncrypt(
        JSON.stringify(userResponse.data),
        "FameBusiness@214"
      );
      Cookies.set("%8564C%27", encryptedUserData, {
        expires: 7,
      });

      await dispatch({ type: "LOGIN", payload: userResponse.data });

      router.push("/");
    } catch (err) {
      setError(err.response?.data?.error);
      console.log(err.response?.data?.error);
      setIsSubmitting(false);
      setErrOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("data");
    localStorage.removeItem("apple_email");
    setAuthToken(null);
    Cookies.remove("%8564C%27");
    dispatch({ type: "LOGOUT", payload: null });
    router.push("/login");
  };

  const formatNumbers = (number) => {
    return number?.toLocaleString("en-IN");
  };

  const handleCallClick = () => {
    const phoneNumber = "+923001113263";
    window.open(`tel:${phoneNumber}`, "_self");
  };

  const handleEmailClick = () => {
    const email = "support@famewheels.com";
    window.open(`mailto:${email}`, "_self");
  };

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const LoginClose = () => {
    setError("");
    setIsOpen(false);
  };

  const OtpClose = () => {
    setOtpPopup(false);
  };

  useGoogleTranslate();

  return (
    <div className={`header_main ${isSticky ? "sticky boxShadow" : ""}`}>
      <Box className=" position-relative  d-none">
        <SpeedDial
          ariaLabel=""
          sx={{ position: "fixed", bottom: 40, right: 30 }}
          icon={
            speedOpen ? (
              <div className=" d-flex gap-2  ">
                <CloseIcon /> Close
              </div>
            ) : (
              <div className=" d-flex gap-2  ">
                <QuestionAnswerOutlinedIcon /> Need Help?
              </div>
            )
          }
          onClick={handleSpeedToggle}
          open={speedOpen}
          className="SpeedDailBtn "
        ></SpeedDial>
        {speedOpen && (
          <div className="supportPopup  p-3">
            <div className="p-3">
              <h4 className="fs-2 text-white fw-bold  ">
                Hi 👋 <br />
                How can we help?
              </h4>
            </div>

            <div
              style={{
                borderRadius: 10,
                backgroundColor: "#28D146",
                cursor: "pointer ",
              }}
              className="p-3 mb-3"
            >
              <div
                className=" d-flex align-items-center justify-content-between "
                onClick={() => setOpenWhatsapp(true)}
              >
                <div className=" messageBox">
                  <h6 className="mb-1">Whatsapp Chat</h6>
                  <p className="m-0">Easy Help, Anytime You Need!</p>
                </div>
                <div>
                  <WhatsAppIcon sx={{ color: "#ffffff", fontSize: 34 }} />
                </div>
              </div>
              {openWhatsapp && (
                <div className="mt-4 d-flex align-items-center justify-content-between  ">
                  <div className="w-100 me-2">
                    <input
                      className="form-control wa_input rounded-pill bg-white "
                      type="text"
                      placeholder="Message "
                      value={waMassage}
                      onChange={(e) => setWaMessage(e.target.value)}
                    />
                  </div>
                  <button
                    style={{
                      backgroundColor: "#075E54",
                      height: "45px",
                      width: "45px",
                      borderRadius: 100,
                    }}
                    className="btn"
                    onClick={openWhatsApp}
                  >
                    <SendIcon sx={{ color: "#ffffff" }} />
                  </button>
                </div>
              )}
            </div>
            <div
              style={{ borderRadius: 10, cursor: "pointer " }}
              className=" bg-white shadow px-3 py-2 mt-auto mb-3 "
              onClick={handleCallClick}
            >
              <div className="text-start d-flex justify-content-between  align-items-center  chatNav">
                <div className=" messageBox">
                  <h6 className="mb-1">Call Us</h6>
                  <p className="m-0">03001113263</p>
                </div>
                <div>
                  <LocalPhoneRoundedIcon sx={{ color: "#b80505" }} />
                </div>
              </div>
            </div>
            <div
              style={{ borderRadius: 10, cursor: "pointer " }}
              className=" bg-white shadow px-3 py-2 mt-auto mb-3 "
              onClick={handleEmailClick}
            >
              <div className="text-start d-flex justify-content-between  align-items-center  chatNav">
                <div className=" messageBox">
                  <h6 className="mb-1">Email</h6>
                  <p className="m-0">support@famewheels.com</p>
                </div>
                <div>
                  <EmailRoundedIcon sx={{ color: "#b80505" }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </Box>

      <Chatbot />

      {!isOnline && (
        <div
          className="text-center py-1  position-sticky "
          style={{ backgroundColor: "#8175e3" }}
        >
          <p className="mb-0 color-white">
            You are currently offline. Please check your internet connection.
          </p>
        </div>
      )}
      <div
        className={` ${
          showHeader || showWhiteHeader ? " headerAbsolute z-3  " : " z-3"
        }   w-100  `}
      >
        <div
          className={` ${
            showHeader || showWhiteHeader ? "" : " bgSecondary  "
          } ${isSticky ? "bgSecondary pt-0 " : "preHeaderBg"}`}
        >
          <div className="container d-flex justify-content-between align-items-center flex-nowrap px-2 m-auto py-1">
            <div className="d-flex justify-content-start align-items-center callUs text-white ">
              <h5 className="pe-2 m-0 fw-300">
                <Image
                  style={{ height: "16px" }}
                  width={30}
                  className="me-2 "
                  src={UAEFlag}
                  alt="UAE flag"
                  srcSet=""
                />
                UAE
              </h5>
            </div>
            <div className="">
              <div className="d-flex justify-content-end preHeader_authBtns">
                {user && user ? (
                  <>
                    <div className="userDetails">
                      <p className="m-0 dropdown-toggle fw-500 text-capitalize">
                        Welcome! <b>{user?.name}</b>
                      </p>
                      <ul className="userDetails-subMenu ps-2 py-2">
                        {user?.role_id !== 5 ? (
                          <>
                            <li>
                              <Link className="w-100 d-block" href="/my-ads">
                                My Ads
                              </Link>
                            </li>

                            <li>
                              <Link
                                className="w-100 d-block"
                                href="/pending-ads"
                              >
                                Pending Ads
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="w-100 d-block"
                                href="/rejected-ads"
                              >
                                Rejected Ads
                              </Link>
                            </li>

                            <li>
                              <Link
                                className="w-100 d-block"
                                href="/my-saved-ads"
                              >
                                My Saved Ads
                              </Link>
                            </li>
                            <li>
                              <Link className="w-100 d-block" href="/my-orders">
                                Inspection History
                              </Link>
                            </li>

                            <li>
                              <Link
                                className="w-100 d-block"
                                href="/payment-history"
                              >
                                Payment History
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="w-100 d-block"
                                href="/bidding-requests"
                              >
                                Bidding Requests
                              </Link>
                            </li>
                          </>
                        ) : user?.role_id === 5 ? (
                          <></>
                        ) : (
                          <>
                            <li>
                              <Link className="w-100 d-block" href="/my-ads">
                                My Ads
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="w-100 d-block"
                                href="/pending-ads"
                              >
                                Pending Ads
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="w-100 d-block"
                                href="/rejected-ads"
                              >
                                Rejected Ads
                              </Link>
                            </li>

                            <li>
                              <Link
                                className="w-100 d-block"
                                href="/my-saved-ads"
                              >
                                My Saved Ads
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="w-100 d-block"
                                href="/inspection-orders"
                              >
                                Inspection Orders
                              </Link>
                            </li>

                            <li>
                              <Link
                                className="w-100 d-block"
                                href="/payment-history"
                              >
                                Payment History
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="w-100 d-block"
                                href="/bidding-requests"
                              >
                                Bidding Requests
                              </Link>
                            </li>
                          </>
                        )}

                        {user?.is_bidder === 1 ? (
                          <>
                            <li>
                              <Link className="w-100 d-block" href="/won-bids">
                                Won Bids
                              </Link>
                            </li>
                            <li>
                              <Link className="w-100 d-block" href="/loss-bids">
                                Loss Bids
                              </Link>
                            </li>
                          </>
                        ) : null}

                        {user?.role_id === 6 && dealerProfile !== null ? (
                          <li>
                            <Link
                              className="w-100 d-block"
                              href={`/dealer/${dealerProfile?.showroom_id}`}
                            >
                              My Dealer Profile
                            </Link>
                          </li>
                        ) : null}

                        <li>
                          <Link className="w-100 d-block" href="/profile">
                            Profile Settings
                          </Link>
                        </li>
                        <li onClick={handleLogout}>
                          <Link className="w-100 d-block" href="">
                            <i className="fa-solid fa-arrow-right-from-bracket pe-2"></i>
                            Logout
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <p className="m-0 px-2 d-none d-md-block">|</p>
                  </>
                ) : (
                  " "
                )}
                {user && user ? (
                  <>
                    <div className="userDetails">
                      {user?.role_id === 2 && user?.is_bidder === 0 ? (
                        <Link href="/become-a-member">
                          <p className="m-0 fw-600">Become a member</p>
                        </Link>
                      ) : user?.role_id === 2 && user?.is_bidder === 1 ? (
                        <Link href="/profile">
                          <div className="d-flex ">
                            <Image
                              src={BlueTick}
                              className="membertick"
                              alt="blue tick"
                              srcSet=""
                            />
                            <p className="m-0 fw-600">You are a member</p>
                          </div>
                        </Link>
                      ) : user?.role_id === 5 ? (
                        <p className="m-0 fw-600">Vehicle Inspector</p>
                      ) : user?.role_id === 6 ? (
                        <Link href="/profile">
                          <div className="d-flex ">
                            <Image
                              src={BlueTick}
                              className="membertick"
                              alt="blue tick"
                              srcSet=""
                            />
                            <p className="m-0 fw-600">Dealer</p>
                          </div>
                        </Link>
                      ) : (
                        <Link href="/become-a-member">
                          <p className="m-0 fw-600">Become a member</p>
                        </Link>
                      )}
                    </div>
                  </>
                ) : null}
                {user && user ? (
                  <>
                    <div className="userDetails">
                      {user?.is_bidder === 1 ? (
                        <Link href="/become-a-member">
                          <div className="d-flex ">
                            <Image
                              src={CreditIcon}
                              className="membertick"
                              alt="credits"
                              srcSet="credits icon"
                            />
                            {userCredit === 0 ? (
                              <>
                                <p className="m-0 fw-600">
                                  Credits:{" "}
                                  {formatNumbers(userCredit?.totalamount)} PKR
                                </p>
                                <Link href="/become-a-member">
                                  <p className="m-0 fw-600">Buy Credits</p>
                                </Link>
                              </>
                            ) : (
                              // <Tooltip
                              //   title={`Available Bids: ${availableBids}`}
                              //   arrow
                              //   placement="top"
                              //   TransitionComponent={Zoom}
                              //   enterDelay={40}
                              //   leaveDelay={200}
                              // >
                              //   <p className="m-0 fw-600">
                              //     Credits:{" "}
                              //     {formatNumbers(userCredit?.totalamount)} PKR
                              //   </p>
                              // </Tooltip>
                              <p className="m-0 fw-600">
                                Credits:{" "}
                                {formatNumbers(userCredit?.totalamount)} PKR
                              </p>
                            )}
                          </div>
                        </Link>
                      ) : (
                        <></>
                      )}
                    </div>
                  </>
                ) : null}
                {!user ? (
                  <button
                    className="btn p-0 me-2 fw-300"
                    href="/"
                    onClick={() => {
                      handleLoginOpen();
                      handlePostClose();
                    }}
                  >
                    <i className="IconStyle fa-regular fa-circle-user pe-2"></i>
                    Login
                  </button>
                ) : null}
                {user && (
                  <button
                    className="btn p-0 me-2 fw-300 d-md-none"
                    onClick={handleLogout}
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket pe-2"></i>
                    Logout
                  </button>
                )}
                {/* <div id="google_translate_element"></div> */}
              </div>
            </div>
          </div>
        </div>
        <nav
          className={` ${
            showHeader
              ? "header_bg"
              : showWhiteHeader
              ? "bg-white fw_br boxShadow_Header "
              : "  bg-white fw_br "
          }  mt-2 responseTab container m-auto flex-column navbar navbar-expand-lg navbar-light pb-2 py-0 px-4 pt-2 py-md-3`}
        >
          <div className="w-100 d-lg-none ">
            <Link className="navbar-brand m-0" href="/">
              <Image
                className="FW-logo"
                srcSet={logo}
                src={logo}
                alt="Famewheels"
              />
            </Link>
          </div>
          <div className="w-100 w-md-unset d-response">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <Link className="navbar-brand" href="/">
              <Image
                className="FW-logo"
                src={logo}
                alt="FameWheels - Car Live Bidding and Cars for sale in UAE"
              />
            </Link>
            <div
              className="collapse navbar-collapse "
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav m-auto mt-2 mb-lg-0 fw-navbar justify-content-between  w-100">
                <li className="nav-item dropdown serviceDrop-main">
                  <Link
                    href="/search"
                    className={`${
                      showHeader ? "text-white" : "text-black"
                    } nav-link dropdown-toggle m-0 serviceDrop ${
                      pathname === "/search" ? "active" : ""
                    }`}
                  >
                    Used Cars
                  </Link>
                  <ul
                    style={{ width: "700px", zIndex: 99999999999 }}
                    className="Services-subMenu ps-3 py-3"
                  >
                    <div className="row">
                      <div className="col-lg-4 pe-0">
                        <li>
                          <Link
                            href="/search"
                            className={pathname === "/search" ? "active" : ""}
                          >
                            <Image
                              src={UsedCars}
                              className="membertick m-0 mb-1 me-2"
                              alt=""
                              srcSet=""
                            />
                            Find Best Used Cars
                          </Link>
                        </li>

                        <li>
                          <Link
                            href="/ad-category"
                            className={
                              pathname === "/ad-category" ? "active" : ""
                            }
                          >
                            <Image
                              src={SellCar}
                              className="membertick m-0 mb-1 me-2"
                              alt=""
                              srcSet=""
                            />
                            Sell Your Car
                          </Link>
                        </li>

                        <li>
                          <Link
                            href="/car-inspection"
                            className={
                              pathname === "/car-inspection" ? "active" : ""
                            }
                          >
                            <Image
                              src={InspectionIcon}
                              className="membertick m-0 mb-1 me-2"
                              alt=""
                              srcSet=""
                            />
                            Car Inspection
                          </Link>
                        </li>

                        <li>
                          <Link
                            href="/car-dealers"
                            className={
                              pathname === "/car-dealers" ? "active" : ""
                            }
                          >
                            <Image
                              src={SellThroughBid}
                              className="membertick m-0 me-2"
                              alt=""
                              srcSet=""
                            />
                            Car Dealers
                          </Link>
                        </li>

                        <li>
                          <Link
                            href="/search?at=4&"
                            className={
                              pathname === "/search?at=4&" ? "active" : ""
                            }
                          >
                            <Image
                              src={DealerIcon}
                              className="membertick m-0 mb-1 me-2"
                              alt=""
                              srcSet=""
                            />
                            Manage By Famewheels
                          </Link>
                        </li>
                      </div>
                      <div className="col-lg-4 pe-0">
                        <h6
                          style={{ fontSize: 15 }}
                          className="py-1 px-2 fw-700"
                        >
                          Find By Cities
                        </h6>
                        {limitedCity &&
                          limitedCity?.map((item) => (
                            //<Link
                            //   key={item?.cityID}
                            //   href={`/search?ct=${item?.cityName}&`}
                            // >
                            <li
                              key={item?.cityID}
                              onClick={() => openByCity(item?.cityName)}
                            >{`Cars in ${item.cityName}`}</li>
                            // </Link>
                          ))}
                      </div>
                      <div className="col-lg-4 pe-0">
                        <h6
                          style={{ fontSize: 15 }}
                          className="py-1 px-2 fw-700"
                        >
                          Find By Category
                        </h6>
                        {limitedCategory &&
                          limitedCategory?.map((item) => (
                            <li
                              key={item?.categoryId}
                              onClick={() => openCategory(item?.category)}
                            >{`${item?.category}cc Cars `}</li>
                          ))}
                      </div>
                    </div>
                  </ul>
                </li>
                <li className="nav-item dropdown newServiceDrop-main">
                  <Link
                    href="/new-cars"
                    className={`${
                      showHeader ? "text-white" : "text-black"
                    } nav-link dropdown-toggle m-0 serviceDrop ${
                      pathname === "/new-cars" ? "active" : ""
                    }`}
                  >
                    New Cars
                  </Link>
                  <ul
                    style={{ width: "400px", zIndex: 99999999999 }}
                    className="Services-subMenu ps-3 py-3"
                  >
                    <div className="row">
                      <div className="col-lg-5 pe-0">
                        <h6
                          style={{ fontSize: 15 }}
                          className="py-1 px-2 fw-700"
                        >
                          Popular Brands
                        </h6>
                        <div>
                          {limitedMake &&
                            limitedMake?.map((item) => (
                              <li
                                key={`${item?.makeId}${item?.makeName}`}
                                onClick={() =>
                                  openByMake(
                                    `${item?.makeName}/${item?.makeId}`
                                  )
                                }
                              >{`${item.makeName} Cars`}</li>
                            ))}
                        </div>
                      </div>

                      <div className="col-lg-7">
                        {limitedMake2 &&
                          limitedMake2?.map((item) => (
                            <li
                              key={`${item?.makeId}${item?.makeName}`}
                              onClick={() =>
                                openByMake(`${item?.makeName}/${item?.makeId}`)
                              }
                            >{`${item.makeName} Cars`}</li>
                          ))}
                      </div>
                    </div>
                  </ul>
                </li>

                <li className="nav-item dropdown serviceDrop-main">
                  <Link
                    href="/bike-search"
                    className={`${
                      showHeader ? "text-white" : "text-black"
                    } nav-link dropdown-toggle m-0 serviceDrop ${
                      pathname === "/bike-search" ? "active" : ""
                    }`}
                  >
                    Bikes
                  </Link>
                  <ul
                    style={{ width: "500px", zIndex: 99999999999 }}
                    className="Services-subMenu ps-3 py-3"
                  >
                    <div className="row">
                      <div className="col-lg-6 pe-0">
                        <li>
                          <Link
                            href="/bike-search"
                            className={
                              pathname === "/bike-search" ? "active" : ""
                            }
                          >
                            <Image
                              src={UsedBikes}
                              className="header-icon m-0 mb-1 me-2"
                              alt="Find Best Used Bikes"
                            />
                            Find Best Used Bikes
                          </Link>
                        </li>
                      </div>
                      <div className="col-lg-4 pe-0">
                        <h6
                          style={{ fontSize: 15 }}
                          className="py-1 px-2 fw-700"
                        >
                          Find By Cities
                        </h6>
                        {limitedCity &&
                          limitedCity.map((item) => (
                            <li
                              key={item.cityID}
                              onClick={() => openBikeByCity(item.cityName)}
                            >
                              {`Bikes in ${item.cityName}`}
                            </li>
                          ))}
                      </div>
                    </div>
                  </ul>
                </li>
                {user?.role_id === 1 || user?.role_id === 5 ? (
                  <li className="nav-item dropdown serviceDrop-main">
                    <Link
                      href="/car-inspection"
                      className={`${
                        showHeader ? "text-white" : "text-black"
                      } nav-link ${
                        pathname === "/car-inspection" ? "active" : ""
                      }`}
                    >
                      <p className="nav-link pad-0 m-0 serviceDrop">
                        Car Inspection
                      </p>
                    </Link>
                  </li>
                ) : (
                  <li className="nav-item">
                    <Link
                      href="/car-inspection"
                      className={`${
                        showHeader ? "text-white" : "text-black"
                      } nav-link ${
                        pathname === "/car-inspection" ? "active" : ""
                      }`}
                    >
                      Car Inspection
                    </Link>
                  </li>
                )}

                <li className="nav-item dropdown serviceDrop-main">
                  <p
                    className={`${
                      showHeader ? " text-white " : "text-black"
                    } nav-link dropdown-toggle m-0 serviceDrop`}
                  >
                    Bidding
                  </p>
                  <ul
                    style={{ width: "290px" }}
                    className="Services-subMenu ps-3 py-3"
                  >
                    <li>
                      <Link
                        href="/become-a-member"
                        className={
                          pathname === "/become-a-member" ? "active" : ""
                        }
                      >
                        <Image
                          src={Crown}
                          className="membertick m-0 me-2"
                          alt=""
                          srcSet=""
                        />
                        Become a member
                      </Link>
                    </li>
                    <li className="d-flex justify-content-between align-items-center">
                      <Link
                        href="/sell-through-live-bidding"
                        className={
                          pathname === "/sell-through-live-bidding"
                            ? "active"
                            : ""
                        }
                      >
                        <Image
                          src={SellThroughBid}
                          className="membertick m-0 me-2"
                          alt=""
                          srcSet=""
                        />
                        Sell Through Bidding
                      </Link>
                      <div
                        style={{ fontSize: "12px" }}
                        className="bgSecondary color-white px-2 rounded-1 Blink-animation"
                      >
                        New
                      </div>
                    </li>
                    <li>
                      <Link
                        href="/upcoming-biddings"
                        className={
                          pathname === "/upcoming-biddings" ? "active" : ""
                        }
                      >
                        <Image
                          src={Upcomming}
                          className="membertick m-0 me-2"
                          alt=""
                          srcSet=""
                        />
                        Upcoming Biddings
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/bidding"
                        className={pathname === "/bidding" ? "active" : ""}
                      >
                        <Image
                          src={LiveBid}
                          className="membertick m-0 me-2"
                          alt=""
                          srcSet=""
                        />
                        Live Biddings
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="nav-item">
                  <a
                    href="https://blog.famewheels.com/"
                    target="_blank"
                    className={`${
                      showHeader ? " text-white " : "text-black"
                    } nav-link`}
                    rel="noreferrer"
                  >
                    Blog
                  </a>
                </li>

                <li className="nav-item">
                  <Link
                    href="/car-finance"
                    className={`${
                      showHeader ? " text-white " : "text-black"
                    } nav-link ${pathname === "/car-finance" ? "active" : ""}`}
                  >
                    Car Finance
                  </Link>
                </li>

                <li className="nav-item dropdown serviceDrop-main">
                  <p
                    className={`${
                      showHeader ? " text-white " : "text-black"
                    } nav-link dropdown-toggle m-0 serviceDrop`}
                  >
                    More
                  </p>
                  <ul
                    style={{ width: "260px" }}
                    className="Services-subMenu ps-3 py-3"
                  >
                    <li className="nav-item">
                      <i
                        style={{ width: 17 }}
                        className="fa-solid fa-store me-2 "
                      ></i>
                      <a
                        href="https://store.famewheels.com/MainPage"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Auto Store
                      </a>
                    </li>
                    <li className="d-flex justify-content-between align-items-center">
                      <Link
                        href="/car-suggest"
                        className={pathname === "/car-suggest" ? "active" : ""}
                      >
                        <Image
                          src={SellThroughBid}
                          className="membertick m-0 me-2"
                          alt=""
                          srcSet=""
                        />
                        Car Suggestion
                      </Link>
                    </li>
                    <li className="d-flex justify-content-between align-items-center">
                      <Link
                        href="/car-insurance"
                        className={
                          pathname === "/car-insurance" ? "active" : ""
                        }
                      >
                        <Image
                          src={SellThroughBid}
                          className="membertick m-0 me-2"
                          alt=""
                          srcSet=""
                        />
                        Car Insurance
                      </Link>
                    </li>
                    <li className="d-flex justify-content-between align-items-center">
                      <Link
                        href="/car-import"
                        className={pathname === "/car-import" ? "active" : ""}
                      >
                        <Image
                          src={SellThroughBid}
                          className="membertick m-0 me-2"
                          alt=""
                          srcSet=""
                        />
                        Car Import
                      </Link>
                    </li>
                    <li className="d-flex justify-content-between align-items-center">
                      <Link
                        href="/car-registration"
                        className={
                          pathname === "/car-registration" ? "active" : ""
                        }
                      >
                        <Image
                          src={SellThroughBid}
                          className="membertick m-0 me-2"
                          alt=""
                          srcSet=""
                        />
                        Car Registration
                      </Link>
                    </li>
                    <li className="d-flex justify-content-between align-items-center">
                      <Link
                        href="/car-transfer"
                        className={pathname === "/car-transfer" ? "active" : ""}
                      >
                        <Image
                          src={SellThroughBid}
                          className="membertick m-0 me-2"
                          alt=""
                          srcSet=""
                        />
                        Car Transfer
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/mtmis-online-vehicle-verification"
                        className={
                          pathname === "/mtmis-online-vehicle-verification"
                            ? "active"
                            : ""
                        }
                      >
                        <Image
                          src={Upcomming}
                          className="membertick m-0 me-2"
                          alt=""
                          srcSet=""
                        />
                        MTMIS UAE
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="nav-item dropdown serviceDrop-main">
                  <Button
                    variant="contained"
                    className="bgSecondary rounded-pill text-white px-4  fw-normal text-capitalize fw-600  dropdown-toggle m-0 serviceDrop"
                  >
                    Post your Ad
                  </Button>

                  <ul
                    style={{ width: "170px", left: 0, top: 40 }}
                    className="Services-subMenu ps-3 py-3"
                  >
                    <li className="d-flex justify-content-between align-items-center">
                      <Link
                        href="/ad-category"
                        className={pathname === "/ad-category" ? "active" : ""}
                      >
                        <Image
                          src={SellThroughBid}
                          className="membertick m-0 me-2"
                          alt=""
                          srcSet=""
                        />
                        Sell Your Car
                      </Link>
                    </li>
                    <li className="d-flex justify-content-between align-items-center">
                      <Link
                        href="/used-bikes/sell"
                        className={
                          pathname === "/used-bikes/sell" ? "active" : ""
                        }
                      >
                        <Image
                          src={SellThroughBid}
                          className="membertick m-0 me-2"
                          alt=""
                          srcSet=""
                        />
                        Sell Your Bike
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>

      <Box
        className="position-fixed bottomNavigation bottom-0 w-100 bg-white bottomNagivation_res "
        style={{ zIndex: 10 }}
      >
        <div className="bottomArea">
          <BottomNavigation
            showLabels
            show
            value={bottomValue}
            onChange={(event, newValue) => {
              setBottomValue(newValue);
            }}
            className=" align-items-center Nav-Btns w-100 justify-content-between position-relative"
          >
            <Link href="/">
              <Button variant="text" className=" text-capitalize flex-column">
                <HomeRoundedIcon />
                Home
              </Button>
            </Link>
            {user?.role_id !== 5 && (
              <>
                {user && user ? (
                  <Link href="/my-ads">
                    <Button
                      variant="text"
                      className=" text-capitalize flex-column"
                    >
                      <DynamicFeedOutlinedIcon />
                      My Ads
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={() => {
                      handleLoginOpen();
                    }}
                    variant="text"
                    className=" text-capitalize flex-column"
                  >
                    <DynamicFeedOutlinedIcon />
                    My Ads
                  </Button>
                )}
              </>
            )}
            {user?.role_id === 5 && (
              <Link href="/my-orders">
                <Button variant="text" className=" text-capitalize flex-column">
                  <DynamicFeedOutlinedIcon />
                  My Inspections
                </Button>
              </Link>
            )}
            {user && user?.role_id !== 5 ? (
              <div className="text-center postBtn">
                <Link href="/ad-category">
                  <Button
                    variant="text"
                    className="  text-capitalize text-center"
                  >
                    <AddRoundedIcon />
                  </Button>
                </Link>
                <p>Post</p>
              </div>
            ) : user?.role_id === 5 ? null : (
              <div className="text-center postBtn">
                <Button
                  onClick={() => {
                    handleLoginOpen();
                  }}
                  variant="text"
                  className=" text-capitalize text-center"
                >
                  <AddRoundedIcon />
                </Button>
                <p>Post</p>
              </div>
            )}
            {user?.role_id !== 5 && (
              <Link href="/bidding">
                <Button variant="text" className=" text-capitalize flex-column">
                  <StreamRoundedIcon />
                  Bidding
                </Button>
              </Link>
            )}
            {user?.role_id === 5 && (
              <Link href="/inspection-orders">
                <Button variant="text" className=" text-capitalize flex-column">
                  <AddRoundedIcon />
                  Inspection Orders
                </Button>
              </Link>
            )}

            <Button
              variant="text"
              className=" text-capitalize flex-column"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasExample"
              aria-controls="offcanvasExample"
            >
              <MenuRoundedIcon />
              More
            </Button>
            <div
              className="offcanvas offcanvas-start pb-5"
              tabIndex="-1"
              id="offcanvasExample"
              aria-labelledby="offcanvasExampleLabel"
            >
              <div className="offcanvas-header">
                <a className="navbar-brand" href="/">
                  <Image
                    className="FW-drawer-logo"
                    src={logo}
                    alt="Fame Wheels"
                  />
                </a>
                <button
                  type="button"
                  className="btn-close text-reset"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                ></button>
              </div>
              <div className="offcanvas-body pb-5">
                <div className="drawerUser mb-3">
                  <div className="d-flex justify-content-start">
                    {user && user ? (
                      <>
                        <div className="bgSecondary w-100 px-3 py-3 rounded">
                          <p className="m-0 fs-6 fw-700 color-white">
                            <i className="fa-solid fa-user pe-2 fs-6"></i>
                            {user?.name}
                          </p>
                        </div>
                      </>
                    ) : null}
                  </div>
                  <div>
                    {user && user ? (
                      <>
                        <div className="userMobileDetails">
                          {user?.is_bidder === 1 ? (
                            <Link href="/become-a-member">
                              <div className="d-flex mt-2 bgFooter px-2 py-1 rounded">
                                <Image
                                  src={CreditIcon}
                                  className="membertick"
                                  alt="credits"
                                  srcSet=""
                                />
                                <p className="m-0 fw-600">
                                  Credits:{" "}
                                  {formatNumbers(userCredit?.totalamount)} PKR
                                </p>
                              </div>
                            </Link>
                          ) : null}
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="fwDrawer pb-3">
                  <ul>
                    {user && user?.role_id !== 5 ? (
                      <div>
                        {user?.role_id === 1 ||
                        (user?.role_id === 2 && user?.is_bidder === 0) ? (
                          <li>
                            <a href="/become-a-member">
                              <i className="fa-solid fa-plus pe-2"></i>Become a
                              member
                            </a>
                          </li>
                        ) : user?.role_id === 6 && dealerProfile !== null ? (
                          <li>
                            <a href={`/dealer/${dealerProfile?.showroom_id}`}>
                              <i className="fa-solid fa-user pe-2"></i>My Dealer
                              Profile
                            </a>
                          </li>
                        ) : (
                          <li>
                            <a href="/become-a-member">
                              <i className="fa-solid fa-plus pe-2"></i>Become a
                              member
                            </a>
                          </li>
                        )}

                        {user && (
                          <li>
                            <a className="w-100 d-block" href="/profile">
                              <i className="fa-solid fa-person pe-2"></i> My
                              Profile
                            </a>
                          </li>
                        )}

                        {user && (
                          <li>
                            <a className="w-100 d-block" href="/my-saved-ads">
                              <i className="fa-solid fa-heart pe-2"></i> Saved
                              Ads
                            </a>
                          </li>
                        )}

                        <li>
                          <a href="/search">
                            <i className="fa-solid fa-car pe-2"></i>Used Cars
                          </a>
                        </li>
                        <li>
                          <a href="/new-cars">
                            <i className="fa-solid fa-car pe-2"></i>New Cars
                          </a>
                        </li>
                        <li>
                          <a href="/car-inspection">
                            <Image
                              src={InspectionIcon}
                              className="membertick m-0 me-2"
                              alt=""
                              srcSet=""
                            />
                            Car Inspection
                          </a>
                        </li>

                        <li>
                          <a href="/search?at=4&">
                            <Image
                              src={DealerIcon}
                              className="membertick m-0 me-2"
                              alt=""
                              srcSet=""
                            />
                            Manage By Fame Wheels
                          </a>
                        </li>

                        <li>
                          <a href="/bidding">
                            <i className="fa-solid fa-arrow-trend-up pe-2"></i>
                            Live Bidding
                          </a>
                        </li>

                        {user && (
                          <li>
                            <a href="/sell-through-live-bidding">
                              <i className="fa-solid fa-chart-line"></i> Sell
                              Through Live Bidding
                            </a>
                          </li>
                        )}

                        <li>
                          <a href="/upcoming-biddings">
                            <i className="fa-brands fa-hive pe-2"></i>Upcoming
                            Bidding
                          </a>
                        </li>
                      </div>
                    ) : user?.role_id === 5 ? (
                      <></>
                    ) : (
                      <div>
                        {user?.role_id === 1 ||
                        (user?.role_id === 2 && user?.is_bidder === 0) ? (
                          <li>
                            <a href="/become-a-member">
                              <i className="fa-solid fa-plus pe-2"></i>Become a
                              member
                            </a>
                          </li>
                        ) : (
                          <li>
                            <a href="/become-a-member">
                              <i className="fa-solid fa-plus pe-2"></i>Become a
                              member
                            </a>
                          </li>
                        )}

                        <li>
                          <a href="/search">
                            <i className="fa-solid fa-car pe-2"></i>Used Cars
                          </a>
                        </li>
                        <li>
                          <a href="/new-cars">
                            <i className="fa-solid fa-car pe-2"></i>New Cars
                          </a>
                        </li>
                        <li>
                          <a href="/car-inspection">
                            <Image
                              src={InspectionIcon}
                              className="membertick m-0 me-2"
                              alt=""
                              srcSet=""
                            />
                            Car Inspection
                          </a>
                        </li>

                        <li>
                          <a href="/bidding">
                            <i className="fa-solid fa-arrow-trend-up pe-2"></i>
                            Live Bidding
                          </a>
                        </li>
                        <li>
                          <a href="/upcoming-biddings">
                            <i className="fa-brands fa-hive pe-2"></i>Upcoming
                            Bidding
                          </a>
                        </li>
                      </div>
                    )}
                    {user && user?.role_id === 1 && (
                      <li>
                        <a href="/inspection-orders">
                          <Image
                            src={InspectionOrders}
                            className="membertick m-0 me-2"
                            alt=""
                            srcSet=""
                          />
                          Inspection Orders
                        </a>
                      </li>
                    )}
                    {user && user?.role_id === 5 && (
                      <>
                        <li>
                          <a href="/inspection-orders">
                            <Image
                              src={InspectionIcon}
                              className="membertick m-0 me-2"
                              alt=""
                              srcSet=""
                            />
                            Inspection Orders
                          </a>
                        </li>
                        <li>
                          <a href="/my-orders">
                            <Image
                              src={InspectionIcon}
                              className="membertick m-0 me-2"
                              alt=""
                              srcSet=""
                            />
                            My Inspections
                          </a>
                        </li>
                        <li>
                          <a href="/car-inspection">
                            <Image
                              src={InspectionIcon}
                              className="membertick m-0 me-2"
                              alt=""
                              srcSet=""
                            />
                            Book Inspections
                          </a>
                        </li>
                      </>
                    )}

                    {user && (
                      <li>
                        <a href="/payment-history">
                          <i className="fa-solid fa-dollar pe-2"></i> Payment
                          History
                        </a>
                      </li>
                    )}

                    <li>
                      <a href="/car-dealers">
                        <Image
                          src={SellThroughBid}
                          className="membertick m-0 me-2"
                          alt=""
                          srcSet=""
                        />
                        Car Dealers
                      </a>
                    </li>

                    <li>
                      <a href="/car-insurance">
                        <i className="fa-solid fa-car pe-2"></i>Car Insurance
                      </a>
                    </li>

                    <li>
                      <a href="/car-import">
                        <i className="fa-solid fa-car pe-2"></i>Car Import
                      </a>
                    </li>

                    <li>
                      <a href="/car-registration">
                        <i className="fa-solid fa-car pe-2"></i>Car Registration
                      </a>
                    </li>

                    <li>
                      <a href="/car-transfer">
                        <i className="fa-solid fa-car pe-2"></i>Car Transfer
                      </a>
                    </li>

                    <li>
                      <a href="/mtmis-online-vehicle-verification">
                        <i className="fa-solid fa-car pe-2"></i>MTMIS UAE
                      </a>
                    </li>

                    <li>
                      <a href="/mtmis-online-vehicle-verification">
                        <i className="fa-solid fa-blog pe-2"></i>Blog
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </BottomNavigation>
        </div>
      </Box>

      <Modal
        open={postOpen}
        onClose={handlePostClose}
        disableAutoFocus={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="postModal_Main Fw-popups"
      >
        <Box className="lg-modal">
          <div className="modalBody_area  px-4 text-center">
            <h3 className="pb-2">Sell car in UAE</h3>
            <h6 className="pb-2">
              Choose How <span>To Sell Your Car</span>
            </h6>
            <div className="row pt-4">
              <div className="col-lg-6 text-center">
                <div className="Modal_postSection p-4">
                  <h6 className="pb-3">
                    Post your Ad on<span> FameWheels </span>
                  </h6>
                  <Image src={PostFW} srcSet={PostFW} alt="Post On Fame Wheels" />
                  <ul className="ps-5 pt-3">
                    <li>
                      <span>
                        <i className="fa-regular fa-circle-check"></i>
                      </span>
                      Post your Ad for Free in 3 Easy Steps
                    </li>
                    <li>
                      <span>
                        <i className="fa-regular fa-circle-check"></i>
                      </span>
                      Get Genuine offers from Verified Buyers
                    </li>
                    <li>
                      <span>
                        <i className="fa-regular fa-circle-check"></i>
                      </span>
                      Sell your car Fast at the Best Price
                    </li>
                    <li className="postNote">
                      * You can post only two free Ads per month
                    </li>
                  </ul>

                  {user && user ? (
                    <Link href="/post-ad?Free-Ads">
                      <button
                        className="btn fw-primary ModalPostBtn"
                        onClick={() => {
                          handlePostClose();
                        }}
                      >
                        Post an Ad
                      </button>
                    </Link>
                  ) : (
                    <button
                      className="btn fw-primary ModalPostBtn"
                      onClick={() => {
                        handleLoginOpen();
                        handlePostClose();
                      }}
                    >
                      Post an Ad
                    </button>
                  )}
                </div>
              </div>
              <div className="col-lg-6 text-center">
                <div className="Modal_postSection p-4">
                  <h6 className="pb-3">
                    Try Sell To<span> FameWheels </span>
                  </h6>
                  <Image
                    src={SellFW}
                    srcSet={SellFW}
                    alt="Sell Through Fame Wheels"
                  />
                  <ul className="ps-5 pt-3">
                    <li>
                      <span>
                        <i className="fa-regular fa-circle-check"></i>
                      </span>
                      Dedicated Sales Expert to Sell your Car
                    </li>
                    <li>
                      <span>
                        <i className="fa-regular fa-circle-check"></i>
                      </span>
                      We Bargain for you and share the Best Offer
                    </li>
                    <li>
                      <span>
                        <i className="fa-regular fa-circle-check"></i>
                      </span>
                      We ensure Safe & Secure Transaction
                    </li>
                    <li className="postNote">
                      * Service available only in Karachi, Lahore, Islamabad and
                      Rawalpindi
                    </li>
                  </ul>
                  {user && user ? (
                    <Link href="/post-ad?Sell-to-fameWheels">
                      <button
                        className="btn fw-primary ModalPostBtn"
                        onClick={() => {
                          handlePostClose();
                        }}
                      >
                        Sell To FameWheels
                      </button>
                    </Link>
                  ) : (
                    <button
                      className="btn fw-primary ModalPostBtn"
                      onClick={() => {
                        handleLoginOpen();
                        handlePostClose();
                      }}
                    >
                      Sell To FameWheels
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="text-center pt-3">
              <p className="privacyText">
                * By continuing, you are agreeing to the
                <a href="/terms">terms of service</a> and
                <a href="/policy">privacy policy</a>
              </p>
            </div>
          </div>
        </Box>
      </Modal>

      <SignUpOtp
        open={otpPopup}
        onClose={OtpClose}
        email={email}
        sendDataToParent={handleDataFromChild}
        password={password}
      />

      <Modal
        open={loginOpen}
        onClose={handleLoginClose}
        disableAutoFocus={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="Fw-popups"
      >
        <Box className="sm-modal px-4 py-4 py-md-5 ">
          <div className="modalBody_area  px-2 ">
            <NumberLogin />
          </div>
        </Box>
      </Modal>

      <Modal
        open={signupOpen}
        onClose={handleSignupClose}
        disableAutoFocus={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="Fw-popups"
      >
        <Box className="sm-modal p-3 p-md-4">
          <div className="modalBody_area  px-2 ">
            <h3 className="pb-2 text-center">Sign Up</h3>

            <div>
              <form onSubmit={handleRegister} className="row px-3">
                <div className="col-md-12 login_inputStyle mb-3">
                  <div className="input-group">
                    <span className="input-group-text" id="basic-addon1">
                      <i className="fa-solid fa-user"></i>
                    </span>
                    <input
                      type="text"
                      id="username"
                      name="userName"
                      className="form-control"
                      placeholder="Full Name"
                      aria-label="Full Name"
                      aria-describedby="uidnote"
                      required
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                    />
                  </div>
                </div>

                <div className="col-md-12 login_inputStyle mb-3">
                  <div className="input-group">
                    <span className="input-group-text" id="basic-addon1">
                      <i className="fa-solid fa-envelope"></i>
                    </span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      placeholder="Email Address"
                      aria-label="email"
                      aria-describedby="uidnote"
                      required
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                    />
                  </div>
                </div>

                <div className="col-md-12 login_inputStyle mb-3">
                  <div className="input-group">
                    <span className="input-group-text" id="basic-addon1">
                      <i className="fa-solid fa-lock"></i>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      className="form-control"
                      placeholder="Password"
                      onChange={(e) => onPasswordChange(e)}
                      value={password}
                      required
                    />
                    <span className="input-group-text" id="basic-addon1">
                      {showPassword === false ? (
                        <i
                          className="fa-solid fa-eye-slash cursorPointer"
                          onClick={() => setShowPassword(!showPassword)}
                        ></i>
                      ) : (
                        <i
                          className="fa-solid fa-eye cursorPointer"
                          onClick={() => setShowPassword(!showPassword)}
                        ></i>
                      )}
                    </span>
                  </div>
                </div>
                {isValid ||
                  (!isValid && password !== null && (
                    <div className="d-flex flex-column mb-2">
                      <span
                        style={{ fontSize: "12px" }}
                        className={`${
                          isValidMinimumChar
                            ? "text-success"
                            : "color-secondary"
                        }`}
                      >
                        {" "}
                        {isValidMinimumChar ? (
                          <TaskAltIcon
                            color="success"
                            sx={{ fontSize: "20px" }}
                          />
                        ) : (
                          <HighlightOffIcon
                            color="error"
                            sx={{ fontSize: "20px" }}
                          />
                        )}{" "}
                        {" Password should be minimum 8 characters"}
                      </span>
                      <span
                        style={{ fontSize: "12px" }}
                        className={`${
                          isValidSymbol ? "text-success" : "color-secondary"
                        }`}
                      >
                        {isValidSymbol ? (
                          <TaskAltIcon
                            color="success"
                            sx={{ fontSize: "20px" }}
                          />
                        ) : (
                          <HighlightOffIcon
                            color="error"
                            sx={{ fontSize: "20px" }}
                          />
                        )}{" "}
                        {
                          " Password Should Contain 1 special character e.g (@,$,!,#,%,&,*,_,=)"
                        }
                      </span>
                      <span
                        style={{ fontSize: "12px" }}
                        className={`${
                          isValidNum ? "text-success" : "color-secondary"
                        }`}
                      >
                        {" "}
                        {isValidNum ? (
                          <TaskAltIcon
                            color="success"
                            sx={{ fontSize: "20px" }}
                          />
                        ) : (
                          <HighlightOffIcon
                            color="error"
                            sx={{ fontSize: "20px" }}
                          />
                        )}{" "}
                        {" Password should conatin one number"}
                      </span>
                      <span
                        style={{ fontSize: "12px" }}
                        className={`${
                          isValidCapitalLetter
                            ? "text-success"
                            : "color-secondary"
                        }`}
                      >
                        {" "}
                        {isValidCapitalLetter ? (
                          <TaskAltIcon
                            color="success"
                            sx={{ fontSize: "20px" }}
                          />
                        ) : (
                          <HighlightOffIcon
                            color="error"
                            sx={{ fontSize: "20px" }}
                          />
                        )}{" "}
                        {" Password Should Contain one capital letter"}
                      </span>
                      <span
                        style={{ fontSize: "12px" }}
                        className={`${
                          isValidSmallLetter
                            ? "text-success"
                            : "color-secondary"
                        }`}
                      >
                        {" "}
                        {isValidSmallLetter ? (
                          <TaskAltIcon
                            color="success"
                            sx={{ fontSize: "20px" }}
                          />
                        ) : (
                          <HighlightOffIcon
                            color="error"
                            sx={{ fontSize: "20px" }}
                          />
                        )}{" "}
                        {" password should contain one small letter"}
                      </span>
                      <span
                        style={{ fontSize: "12px" }}
                        className={`${
                          password !== "" && isValidCommonWord
                            ? "text-success"
                            : "color-secondary"
                        }`}
                      >
                        {" "}
                        {password !== "" && isValidCommonWord ? (
                          <TaskAltIcon
                            color="success"
                            sx={{ fontSize: "20px" }}
                          />
                        ) : (
                          <HighlightOffIcon
                            color="error"
                            sx={{ fontSize: "20px" }}
                          />
                        )}{" "}
                        {
                          " Password should not be a common word e.g (abcd,1234) "
                        }
                      </span>
                    </div>
                  ))}
                <div
                  className={`col-md-12 login_inputStyle ${
                    passwordMatchError ? "mb-0" : "mb-3"
                  } `}
                >
                  <div className="input-group">
                    <span className="input-group-text" id="basic-addon1">
                      <i className="fa-solid fa-lock"></i>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="memberPassword"
                      name=""
                      placeholder="Confirm Password"
                      required
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                    />
                    <span className="input-group-text" id="basic-addon1">
                      {showPassword === false ? (
                        <i
                          className="fa-solid fa-eye-slash cursorPointer"
                          onClick={() => setShowPassword(!showPassword)}
                        ></i>
                      ) : (
                        <i
                          className="fa-solid fa-eye cursorPointer"
                          onClick={() => setShowPassword(!showPassword)}
                        ></i>
                      )}
                    </span>
                  </div>
                </div>
                {passwordMatchError && (
                  <>
                    <p
                      className={"color-secondary mt-2"}
                      style={{ fontSize: "12px" }}
                    >
                      <HighlightOffIcon
                        color="error"
                        sx={{ fontSize: "20px" }}
                      />{" "}
                      {passwordMatchError}{" "}
                    </p>
                  </>
                )}

                <div className="col-md-12 login_inputStyle mb-3">
                  <div className="input-group">
                    <span className="input-group-text" id="basic-addon1">
                      <i className="fa-solid fa-phone"></i>
                    </span>
                    <InputMask
                      mask="03999999999"
                      maskChar={null}
                      type="text"
                      name="phone"
                      className="form-control"
                      id="phone"
                      placeholder="Phone No. (03xxxxxxxxx)"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="p-0">
                  {error && (
                    <p
                      style={{ fontSize: 15 }}
                      className="my-2 text-capitalize text-danger "
                    >
                      <i className="fa-solid fa-circle-exclamation me-2"></i>
                      {error}
                    </p>
                  )}
                </div>

                <div className="col-12 px-0">
                  <button
                    type="submit"
                    className="btn mt-3 fw-btn model_loginBTn w-100"
                    disabled={
                      password !== confirmPassword ||
                      name === "" ||
                      email === "" ||
                      phone === "" ||
                      !isValid
                    }
                  >
                    {isSignSubmitting ? (
                      <CircularProgress size="16px" sx={{ color: "#fff" }} />
                    ) : successSignup ? (
                      <Image
                        className="successAnim"
                        src={SuccessTick}
                        alt="success"
                        srcSet=""
                      />
                    ) : (
                      "Sign Up"
                    )}
                  </button>
                </div>
              </form>
            </div>
            <div className="text-center pt-3">
              <p className="have_account">
                Already have an account?{" "}
                <button
                  onClick={() => {
                    handleLoginOpen();
                    handleSignupClose();
                  }}
                >
                  Login
                </button>
              </p>
            </div>
            <div className="text-center pt-3">
              <p className="privacyText">
                By continuing, you are agreeing to the{" "}
                <a href="/terms">terms of service</a> and{" "}
                <a href="/policy">privacy policy</a>
              </p>
            </div>
          </div>
        </Box>
      </Modal>

      <LoginModal open={isOpen} onClose={LoginClose} />
    </div>
  );
};

export default Header;
