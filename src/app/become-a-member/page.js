"use client";

import React, { useContext, useEffect, useState } from "react";
import InputMask from "react-input-mask";
import axios from "axios";
import PaymentSuccess from "@/components/modals/paymentModal/payment-success.js";
import PaymentRejected from "@/components/modals/paymentModal/payment-rejected.js";
import { useRouter } from "next/navigation";
import CryptoJS from "crypto-js";
import moment from "moment";
import { AuthContext } from "@/context/AuthContext.js";
import BecomeMember from "@/images/become-member.png";
import DocVerify from "@/images/doc-verify.png";
import Purchase from "@/images/bid.png";
import GoBidding from "@/images/go-for-bidding.png";
import { Box, Modal } from "@mui/material";
import NumberLogin from "@/components/modals/loginModal/number.js";
import Lottie from "lottie-react";
import CoinsFalling from "@/images/coin-falling.json";
import SeoMeta from "@/components/meta";
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

function hash_hmac_sha256(data, key) {
  return CryptoJS.HmacSHA256(data, key).toString();
}

const MemberComponentPayFast = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const { user } = useContext(AuthContext);

  const token = localStorage.getItem("token");

  const [gateway, setGateway] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [cnic, setCnic] = useState(null);
  const [address, setAddress] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [data, setData] = useState();
  const [Apiuser, setApiUser] = useState(null);
  // const [shouldHide, setShouldHide] = useState(true);
  const [value, setValue] = useState("");

  const [successIsOpen, setSuccessIsOpen] = useState(false);
  const [rejectedOpen, setRejectedOpen] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenResponse, setTokenResponse] = useState("");
  const [randomNo, setRandomNo] = useState("");
  const [paymentResponse, setPaymentResponse] = useState({});
  const [openFaildModal, setOpenFaildModal] = useState(false);
  const [otherAmount, setOtherAmount] = useState(false);

  const getInspectionUpdate = async (
    responseAmount,
    responseTransactionId,
    responseBasketId,
    method
  ) => {
    try {
      const response = await axios.get(`${baseUrl}/becometobidder`, {
        params: {
          payment_method: method,
          security_deposit: responseAmount,
          order_id: responseBasketId,
          payment_token: responseTransactionId,
          payment_status: 1,
          user_id: user?.id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // setTokenResponse(response?.data);
      // setTokenLoading(true);
    } catch (error) {
      console.error(error);
    }
  };

  const successClose = () => {
    setSuccessIsOpen(false);
  };

  const rejectedClose = () => {
    setRejectedOpen(false);
  };

  const history = useRouter();

  const goToVerify = () => {
    history.push(`/profile?${token}`);
  };

  useEffect(() => {
    setGateway("PayFast");
  }, []);

  const fetchUserPosts = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${baseUrl}/getUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPhone(response?.data?.phone);
      setCnic(response?.data?.cnic);
      setEmail(response?.data?.email);
      setFullName(response?.data?.name);
      setAddress(response?.data?.address);
      setApiUser(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserPosts();
    }
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    //JazzCash Parameters
    const responseCodeJazzCash = params.get("responsecode");
    const responseMessageJazzCash = params.get("ResponseMessage");

    //PayFast Parameters
    const responseCode = params.get("err_code");
    const responseMessage = params.get("err_msg");
    const responseAmount = params.get("transaction_amount");
    const responseTransactionId = params.get("transaction_id");
    const responseBasketId = params.get("basket_id");

    if (params?.size > 0) {
      if (
        responseCode === "000" ||
        responseCode === "200" ||
        responseCode === "121" ||
        responseCodeJazzCash === "000" ||
        responseCodeJazzCash === "121" ||
        responseCodeJazzCash === "200"
      ) {
        setSuccessIsOpen(true);

        if (
          responseCode &&
          responseAmount &&
          responseTransactionId &&
          responseBasketId &&
          responseMessage
        ) {
          const method = "PayFast";
          getInspectionUpdate(
            responseAmount,
            responseTransactionId,
            responseBasketId,
            method
          );
          setPaymentResponse({
            responseMessage,
            responseAmount,
            responseTransactionId,
            responseBasketId,
          });
        } else if (responseCodeJazzCash && responseMessageJazzCash) {
          const method = "JazzCash";
          getInspectionUpdate(
            responseAmount,
            responseTransactionId,
            responseBasketId,
            method
          );
          setPaymentResponse({
            responseMessage: responseMessageJazzCash,
          });
        } else {
        }
        setTimeout(() => {
          setSuccessIsOpen(false);
          history.push("/become-a-member");
        }, 4000);
      } else if (
        responseCode === "002" ||
        responseCode === "001" ||
        responseCode === "97" ||
        responseCode === "106" ||
        responseCode === "3" ||
        responseCode === "14" ||
        responseCode === "54" ||
        responseCode === "13" ||
        responseCode === "126" ||
        responseCode === "75" ||
        responseCode === "14" ||
        responseCode === "15" ||
        responseCode === "42" ||
        responseCode === "423" ||
        responseCode === "41" ||
        responseCode === "801" ||
        responseCode === "802" ||
        responseCode === "803" ||
        responseCode === "804" ||
        responseCode === "805" ||
        responseCode === "806" ||
        responseCode === "807" ||
        responseCode === "808" ||
        responseCode === "809" ||
        responseCode === "810" ||
        responseCode === "811" ||
        responseCode === "812" ||
        responseCode === "813" ||
        responseCode === "850" ||
        responseCode === "851" ||
        responseCode === "79" ||
        responseCode === "901" ||
        responseCode === "9000" ||
        responseCodeJazzCash === "134" ||
        responseCodeJazzCash === "124" ||
        responseCodeJazzCash === "210" ||
        responseCodeJazzCash === "157" ||
        responseCodeJazzCash === "210" ||
        responseCodeJazzCash === "500" ||
        responseCodeJazzCash === "400" ||
        responseCodeJazzCash === "404" ||
        responseCodeJazzCash === "403" ||
        responseCodeJazzCash === "401" ||
        responseCodeJazzCash === "302"
      ) {
        if (responseCodeJazzCash && responseMessageJazzCash) {
          setPaymentResponse({
            responseMessage: responseMessageJazzCash,
          });
        }
        setOpenFaildModal(true);

        setTimeout(() => {
          setOpenFaildModal(false);
          history.push("/become-a-member");
        }, 4000);
      } else {
      }
    }
  }, [history]);

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${baseUrl}/gettoken`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTokenResponse(response?.data);
        setTokenLoading(true);
      } catch (error) {
        console.error(error);
      }
    };
    if (user && gateway === "PayFast") {
      getAccessToken();
      const generateRandomNumber = () => {
        const min = 1; // Minimum value
        const max = 100; // Maximum value
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min; // Generate random number within the range
        setRandomNo(randomNum); // Update state with the generated random number
      };
      generateRandomNumber();
    }
  }, [gateway]);

  const increaseValue = () => {
    setValue((prevValue) => prevValue + 5);
  };

  const decreaseValue = () => {
    setValue((prevValue) => prevValue - 5);
  };

  const [userCredit, setUserCredit] = useState("");

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
        if (response.status === 200) {
          setUserCredit(response?.data);
          console.log(response?.data, " credits response ");
        } else {
          console.error(response?.data, "CREDITS NOT FETCHED");
        }
      } catch (error) {
        console.error(
          "Error CREDITS NOT FETCHED:",
          error?.response?.data || error?.response || error
        );
      }
    };
    // if (user?.is_verified === 3) {
    fetchCredits();
    // }
  }, []);

  const currentDate = new Date();
  const date = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${currentDate
    .getDate()
    .toString()
    .padStart(2, "0")} ${currentDate
    .getHours()
    .toString()
    .padStart(2, "0")}:${currentDate
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${currentDate.getSeconds().toString().padStart(2, "0")}`;

  const Amount = value * 100;
  const BankID = 2023;
  const pp_CustomerId = 123;
  const BillReference = "billRef";
  const Description = "Fame Wheels Bidding Membership";
  const IsRegisteredCustomer = "Yes";
  const Language = "EN";
  const MerchantID = "87876565"; // for live
  // const MerchantID = "MC56944"; // for local
  const Password = "ssszc65y15"; // for live
  // const Password = "0b4ydtea9t"; // for local
  const ProductID = 2023;
  const ReturnURL = `https://onlinepayment.famewheels.com/responsepayment`;
  const TxnCurrency = "PKR";
  const TxnDateTime = moment().format("YYYYMMDDHHmmss");
  const TxnExpiryDateTime = moment().add(1, "days").format("YYYYMMDDHHmmss");
  let transID = "T" + Math.floor(Math.random() * 1000000000000);
  const TxnRefNumber = transID;
  const TxnType = "MPAY";
  const Version = "2.0";

  const HashKey = "ue19u14273"; // for live

  const handleJazzCashFormSubmit = () => {
    const SortedArray = `${HashKey}&${Amount}&${BillReference}&${Description}&${IsRegisteredCustomer}&${Language}&${MerchantID}&${Password}&${ReturnURL}&${TxnCurrency}&${TxnDateTime}&${TxnExpiryDateTime}&${TxnRefNumber}&${Version}&${fullName}&${phone}`;
    const result = hash_hmac_sha256(SortedArray, HashKey);

    // Once the form data is available, construct the form dynamically
    const form = document.createElement("form");
    form.method = "POST";
    form.action =
      "https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform"; // URL for live
    // "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/"; // URL for local

    const CustomerIdInput = document.createElement("input");
    CustomerIdInput.type = "hidden";
    CustomerIdInput.name = "pp_CustomerId";
    CustomerIdInput.value = "";
    form.appendChild(CustomerIdInput);

    const returnInput = document.createElement("input");
    returnInput.type = "hidden";
    returnInput.name = "pp_ReturnURL";
    returnInput.value = ReturnURL;
    form.appendChild(returnInput);

    const expiryInput = document.createElement("input");
    expiryInput.type = "hidden";
    expiryInput.name = "pp_txnExpiryDateTime";
    expiryInput.value = TxnExpiryDateTime;
    form.appendChild(expiryInput);

    const dateInput = document.createElement("input");
    dateInput.type = "hidden";
    dateInput.name = "pp_txnDateTime";
    dateInput.value = TxnDateTime;
    form.appendChild(dateInput);

    const refInput = document.createElement("input");
    refInput.type = "hidden";
    refInput.name = "pp_TxnRefNo";
    refInput.value = TxnRefNumber;
    form.appendChild(refInput);

    const typeInput = document.createElement("input");
    typeInput.type = "hidden";
    typeInput.name = "pp_TxnType";
    typeInput.value = "";
    form.appendChild(typeInput);

    const versionInput = document.createElement("input");
    versionInput.type = "hidden";
    versionInput.name = "pp_Version";
    versionInput.value = Version;
    form.appendChild(versionInput);

    const amountInput = document.createElement("input");
    amountInput.type = "hidden";
    amountInput.name = "pp_Amount";
    amountInput.value = Amount;
    form.appendChild(amountInput);

    const registeredInput = document.createElement("input");
    registeredInput.type = "hidden";
    registeredInput.name = "pp_IsRegisteredCustomer";
    registeredInput.value = "Yes";
    form.appendChild(registeredInput);

    const descriptionInput = document.createElement("input");
    descriptionInput.type = "hidden";
    descriptionInput.name = "pp_Description";
    descriptionInput.value = Description;
    form.appendChild(descriptionInput);

    const billRefInput = document.createElement("input");
    billRefInput.type = "hidden";
    billRefInput.name = "pp_BillReference";
    billRefInput.value = BillReference;
    form.appendChild(billRefInput);

    const currencyInput = document.createElement("input");
    currencyInput.type = "hidden";
    currencyInput.name = "pp_TxnCurrency";
    currencyInput.value = TxnCurrency;
    form.appendChild(currencyInput);

    const languageInput = document.createElement("input");
    languageInput.type = "hidden";
    languageInput.name = "pp_Language";
    languageInput.value = Language;
    form.appendChild(languageInput);

    const passwordInput = document.createElement("input");
    passwordInput.type = "hidden";
    passwordInput.name = "pp_Password";
    passwordInput.value = Password;
    form.appendChild(passwordInput);

    const merchantIDInput = document.createElement("input");
    merchantIDInput.type = "hidden";
    merchantIDInput.name = "pp_MerchantID";
    merchantIDInput.value = MerchantID;
    form.appendChild(merchantIDInput);

    const nameInput = document.createElement("input");
    nameInput.type = "hidden";
    nameInput.name = "ppmpf_1";
    nameInput.value = fullName;
    form.appendChild(nameInput);

    const emailInput = document.createElement("input");
    emailInput.type = "hidden";
    emailInput.name = "ppmpf_2";
    emailInput.value = "";
    form.appendChild(emailInput);

    const customerEmailInput = document.createElement("input");
    customerEmailInput.type = "hidden";
    customerEmailInput.name = "pp_CustomerEmail";
    customerEmailInput.value = "";
    form.appendChild(customerEmailInput);

    const phoneInput = document.createElement("input");
    phoneInput.type = "hidden";
    phoneInput.name = "ppmpf_3";
    phoneInput.value = phone;
    form.appendChild(phoneInput);

    const customerPhoneInput = document.createElement("input");
    customerPhoneInput.type = "hidden";
    customerPhoneInput.name = "pp_CustomerMobile";
    customerPhoneInput.value = "";
    form.appendChild(customerPhoneInput);

    const addressInput = document.createElement("input");
    addressInput.type = "hidden";
    addressInput.name = "ppmpf_5";
    addressInput.value = "";
    form.appendChild(addressInput);

    const cnicInput = document.createElement("input");
    cnicInput.type = "hidden";
    cnicInput.name = "ppmpf_4";
    cnicInput.value = "";
    form.appendChild(cnicInput);

    const hashInput = document.createElement("input");
    hashInput.type = "hidden";
    hashInput.name = "pp_SecureHash";
    hashInput.value = result;
    form.appendChild(hashInput);

    document.body.appendChild(form);
    form.submit();
  };

  const handlePayFastFormSubmit = () => {
    // Once the form data is available, construct the form dynamically
    const form = document.createElement("form");
    form.method = "POST";
    form.id = "PayFast_payment_form";
    form.name = "PayFast-payment-form";
    form.action =
      "https://ipg1.apps.net.pk/Ecommerce/api/Transaction/PostTransaction";

    // Add the name field from the state to the form
    const SUCCESSURL = document.createElement("input");
    SUCCESSURL.type = "hidden";
    SUCCESSURL.name = "SUCCESS_URL";
    SUCCESSURL.value = "https://www.famewheels.com/become-a-member";
    form.appendChild(SUCCESSURL);

    const FAILUREURL = document.createElement("input");
    FAILUREURL.type = "hidden";
    FAILUREURL.name = "FAILURE_URL";
    FAILUREURL.value = "https://www.famewheels.com/become-a-member";
    form.appendChild(FAILUREURL);

    const CHECKOUTURL = document.createElement("input");
    CHECKOUTURL.type = "hidden";
    CHECKOUTURL.name = "CHECKOUT_URL";
    CHECKOUTURL.value = "https://www.famewheels.com/";
    form.appendChild(CHECKOUTURL);

    const CUSTOMEREMAIL = document.createElement("input");
    CUSTOMEREMAIL.type = "hidden";
    CUSTOMEREMAIL.name = "CUSTOMER_EMAIL_ADDRESS";
    CUSTOMEREMAIL.value = email;
    form.appendChild(CUSTOMEREMAIL);

    const CUSTOMERMOBILENO = document.createElement("input");
    CUSTOMERMOBILENO.type = "hidden";
    CUSTOMERMOBILENO.name = "CUSTOMER_MOBILE_NO";
    CUSTOMERMOBILENO.value = phone;
    form.appendChild(CUSTOMERMOBILENO);

    const TXNAMTInput = document.createElement("input");
    TXNAMTInput.type = "hidden";
    TXNAMTInput.name = "TXNAMT";
    TXNAMTInput.value = value;
    form.appendChild(TXNAMTInput);

    const BASKETID = document.createElement("input");
    BASKETID.type = "hidden";
    BASKETID.name = "BASKET_ID";
    BASKETID.value = randomNo;
    form.appendChild(BASKETID);

    const ORDERDATE = document.createElement("input");
    ORDERDATE.type = "hidden";
    ORDERDATE.name = "ORDER_DATE";
    ORDERDATE.value = tokenResponse?.GENERATED_DATE_TIME;
    form.appendChild(ORDERDATE);

    const SOMERANDOMSTRING = document.createElement("input");
    SOMERANDOMSTRING.type = "hidden";
    SOMERANDOMSTRING.name = "SIGNATURE";
    SOMERANDOMSTRING.value = "SOMERANDOM-STRING";
    form.appendChild(SOMERANDOMSTRING);

    const MERCHANTCART = document.createElement("input");
    MERCHANTCART.type = "hidden";
    MERCHANTCART.name = "VERSION";
    MERCHANTCART.value = "MERCHANT-CART0.1";
    form.appendChild(MERCHANTCART);

    // Add the name field from the state to the form
    const TXNDESCInput = document.createElement("input");
    TXNDESCInput.type = "hidden";
    TXNDESCInput.name = "TXNDESC";
    TXNDESCInput.value = "Item Purchased from Cart";
    form.appendChild(TXNDESCInput);

    // Add the name field from the state to the form
    const PROCCODEInput = document.createElement("input");
    PROCCODEInput.type = "hidden";
    PROCCODEInput.name = "PROCCODE";
    PROCCODEInput.value = "00";
    form.appendChild(PROCCODEInput);

    // Add the name field from the state to the form
    const ECOMMPURCHASE = document.createElement("input");
    ECOMMPURCHASE.type = "hidden";
    ECOMMPURCHASE.name = "TRAN_TYPE";
    ECOMMPURCHASE.value = "ECOMM_PURCHASE";
    form.appendChild(ECOMMPURCHASE);

    // Add the name field from the state to the form
    const STOREID = document.createElement("input");
    STOREID.type = "hidden";
    STOREID.name = "STORE_ID";
    STOREID.value = "";
    form.appendChild(STOREID);

    // Add the name field from the state to the form
    const RECURRINGTXN = document.createElement("input");
    RECURRINGTXN.type = "hidden";
    RECURRINGTXN.name = "RECURRING_TXN";
    RECURRINGTXN.value = "true";
    form.appendChild(RECURRINGTXN);

    // Add the name field from the state to the form
    const CURRENCYCODE = document.createElement("input");
    CURRENCYCODE.type = "hidden";
    CURRENCYCODE.name = "CURRENCY_CODE";
    CURRENCYCODE.value = "PKR";
    form.appendChild(CURRENCYCODE);

    const MERCHANTID = document.createElement("input");
    MERCHANTID.type = "hidden";
    MERCHANTID.name = "MERCHANT_ID";
    MERCHANTID.value = 20579;
    form.appendChild(MERCHANTID);

    const ACCESSTOKEN = document.createElement("input");
    ACCESSTOKEN.type = "hidden";
    ACCESSTOKEN.name = "TOKEN";
    ACCESSTOKEN.value = tokenResponse?.ACCESS_TOKEN;
    form.appendChild(ACCESSTOKEN);

    // Append the form to the document body and submit it programmatically
    document.body.appendChild(form);
    form.submit();
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
      return price.toLocaleString("en-US", { maximumFractionDigits: 2 });
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const LoginOpen = () => {
    setIsOpen(true);
  };
  const LoginClose = () => {
    setIsOpen(false);
  };

  const handleChange = (event, value) => {
    setGateway(value?.props?.value);
  };

  const addAmount = [
    userCredit?.bid_amount,
    userCredit?.bid_amount * 2,
    userCredit?.bid_amount * 3,
    userCredit?.bid_amount * 4,
    userCredit?.bid_amount * 5,
    userCredit?.bid_amount * 6,
    userCredit?.bid_amount * 7,
    userCredit?.bid_amount * 8,
    userCredit?.bid_amount * 9,
    userCredit?.bid_amount * 10,
  ];

  const handleAmountPress = (amount) => {
    setValue(amount);
  };

  const bidInfo = value / userCredit?.bid_amount;

  return (
    <>
      <SeoMeta
        title="Become a member | FameWheels"
        desc="Become a member to bid on your dream car, Find the car of your dreams at a fraction of the price with car live bidding. From stylish sedans to tough off-roaders. Don't miss out, Bid now and save big."
        url="become-a-member"
      />

      <PaymentSuccess
        open={successIsOpen}
        onClose={successClose}
        response={paymentResponse}
      />
      <PaymentRejected open={rejectedOpen} onClose={rejectedClose} />
      <div className=" colorBg_new d-none d-lg-block "></div>
      <div className="container-fluid newColorGrad_bg py-4 ">
        <div className="container">
          <div className="row align-items-center ">
            {Apiuser?.is_bidder === 1 ? (
              <div className="coin_lottie_main position-relative  col-lg-12 col-12 d-flex justify-content-center align-items-center  ">
                <Lottie
                  className="coin_lottie"
                  animationData={CoinsFalling}
                  loop={false}
                />
                <h2 className=" color-white text-center fw-bold">
                  FameWheels Wallet
                </h2>
              </div>
            ) : (
              <div className="col-lg-7 col-12">
                <h2 className=" color-white text-start fs-2">
                  Become a Member <br />
                  <span className="fw-bold fs-1">
                    To Bid on Your Favorite Car
                  </span>
                </h2>
              </div>
            )}
            {Apiuser?.is_bidder === 0 && (
              <div className="col-lg-5 col-md-12 col-12 text-end p-0">
                <Image
                  className="topBanner_img img-fluid "
                  src={BecomeMember}
                  alt="Sell through live bidding"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="container py-3 py-md-5">
          <div className="memberFormHead">
            {Apiuser?.is_bidder === 1 ? (
              <h4
                style={{ color: "#994100" }}
                className="pb-2 pb-md-4 text-start availCredit_head  fw-700"
              >
                Available Credit: PKR{" "}
                {userCredit?.totalamount?.toLocaleString()}{" "}
                {/* <span className=" fw-500">
                  ={" "}
                  {userCredit?.totalamount === 0
                    ? 0
                    : userCredit?.totalamount / userCredit?.bid_amount}{" "}
                  Bids
                </span> */}
              </h4>
            ) : (
              <h4 className="pb-4 color-black text-start fs-3  fw-700">
                Step To Become a Member
              </h4>
            )}
          </div>
          {Apiuser?.is_bidder !== 1 && (
            <div className="row pb-5">
              <div className="col-lg-4 col-6  d-flex justify-content-center align-items-center ">
                <div className="StepperCount">01</div>
                <div className="OurSteppers">
                  <Image width={50} src={DocVerify} alt="" srcSet="" />
                  <h6 className="text-capitalize ">Identity Verification</h6>
                </div>
              </div>
              <div className="col-lg-4 col-6 d-flex justify-content-center align-items-center ">
                <div className="StepperCount">02</div>
                <div className="OurSteppers">
                  <Image width={50} src={Purchase} alt="" srcSet="" />
                  <h6 className="text-capitalize ">Security Deposit</h6>
                </div>
              </div>
              <div className="col-lg-4 col-12 d-flex justify-content-center align-items-center ">
                <div className="StepperCount">03</div>
                <div className="OurSteppers">
                  <Image width={50} src={GoBidding} alt="" srcSet="" />
                  <h6 className="text-capitalize ">Participate in Bidding</h6>
                </div>
              </div>
            </div>
          )}
          <div className="row pb-5">
            <div className="col-lg-12 ">
              <div className="boxShadow rounded px-5 py-4">
                {Apiuser && Apiuser?.is_bidder === 0 ? (
                  <>
                    {Apiuser?.is_verified === 0 ? (
                      <div>
                        <h4 className="text-start  fw-700 pb-4 fs-3">
                          Verify{" "}
                          <span className=" color-secondary">
                            {" "}
                            your identity{" "}
                          </span>
                        </h4>
                        <div className="BecomeAlertMsg">
                          <h5 className="fw-600 fs-6 pb-2">
                            You have to verify your identity before becoming a
                            member.
                          </h5>
                          <div className="ps-2">
                            <h6>ID Check</h6>
                            <p>
                              Please submit your identity documents to become a
                              member on the FameWheels Platform.
                            </p>
                            <button
                              onClick={goToVerify}
                              type="button"
                              className="btn  fw-primary model_loginBTn px-3 py-1 fw-500 fs-6"
                            >
                              Verify
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : Apiuser?.is_verified === 4 ? (
                      <div>
                        <p className="text-center color-secondary">
                          <i className="fa-solid fa-circle-exclamation"></i>{" "}
                          Your request has been rejected, please verify again.
                        </p>
                        <h4 className="text-start  fw-700 pb-4 fs-3">
                          Verify{" "}
                          <span className=" color-secondary">
                            your identity
                          </span>
                        </h4>
                        <div className="BecomeAlertMsg">
                          <h5 className="fw-600 fs-6 pb-2">
                            You have to verify your identity before becoming a
                            member.
                          </h5>
                          <div className="ps-2">
                            <h6>ID Check</h6>
                            <p>
                              Please submit your identity documents to become a
                              member on the FameWheels Platform.
                            </p>
                            <button
                              onClick={goToVerify}
                              type="button"
                              className="btn  fw-primary model_loginBTn px-3 py-1 fw-500 fs-6"
                            >
                              Verify
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : Apiuser?.is_verified === 2 ? (
                      <div>
                        <h4 className="text-start  fw-700 pb-1 fs-3">
                          Identity{" "}
                          <span className=" color-secondary">
                            {" "}
                            Verification Inprocess...{" "}
                          </span>
                        </h4>
                        <div className="BecomeAlertMsg">
                          <div>
                            <p>We will shortly respond to your application.</p>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </>
                ) : Apiuser?.is_bidder === 1 ? (
                  <div className="row mb-3">
                    <div className="col-md-6 col-12 mb-3 d-none ">
                      <div className="mb-md-3">
                        <label for="memberName" className="form-label">
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="ppmpf_1"
                          id="memberName"
                          placeholder="Enter Your Full Name"
                          disabled
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3 d-none ">
                      <div className="mb-md-3">
                        <label for="memberEmail" className="form-label">
                          Email Address
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          name="ppmpf_2"
                          id="memberEmail"
                          placeholder="Enter Your Email Address"
                          disabled
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3 d-none ">
                      <div className="mb-md-3">
                        <label for="memberContact" className="form-label">
                          Phone Number
                        </label>
                        <InputMask
                          mask="03999999999"
                          maskChar={null}
                          type="text"
                          name="ppmpf_3"
                          className="form-control"
                          id="memberContact"
                          placeholder="03xxxxxxxxx"
                          disabled
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3 d-none ">
                      <div className="mb-md-3">
                        <label for="memberCnic" className="form-label">
                          CNIC
                        </label>
                        <InputMask
                          mask="99999-9999999-9"
                          maskChar={null}
                          type="text"
                          name="ppmpf_4"
                          className="form-control"
                          id="cnic"
                          placeholder="Enter Your Cnic"
                          required
                          disabled
                          value={cnic}
                          onChange={(e) => setCnic(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <h4 className="color-secondary fw-600 fs-5 ">
                        Add Amount
                      </h4>
                      <h5 className="fs-2 fw-bolder pb-3">
                        Rs. {value === "" ? 0 : value}{" "}
                        {/* {value !== "" && (
                          <span className="fs-5 fw-500">{` = ${bidInfo} Bid${
                            bidInfo > 1 ? "s" : ""
                          }`}</span>
                        )} */}
                      </h5>
                    </div>
                    {/* <h4 className="color-black fw-500 fs-6 pb-1">
                      Select Amount
                    </h4> */}
                    {/* <div className="col-12">
                      {addAmount?.map((item, index) => (
                        <button
                          key={index}
                          className="btn cursorPointer text-black card_bg rounded-pill px-3 py-1 fs-6 me-3 mb-2"
                          onClick={() => handleAmountPress(item)}
                        >
                          + {item?.toLocaleString()}
                        </button>
                      ))}
                      <button
                        className="btn cursorPointer text-black card_bg rounded-pill px-3 py-1 fs-6 me-3 mb-2"
                        onClick={() => setOtherAmount(true)}
                      >
                        Other
                      </button>
                    </div> */}
                    {/* {otherAmount && ( */}
                    <div className="col-4 mb-3">
                      <div class="form-floating ">
                        <input
                          type="number"
                          class="form-control"
                          id="floatingInput"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          onBlur={(e) => {
                            let val = e.target.value;
                            if (val % userCredit?.bid_amount !== 0) {
                              val =
                                Math.round(val / userCredit?.bid_amount) *
                                userCredit?.bid_amount;
                              alert(
                                `Please enter a value that is a multiple of ${userCredit?.bid_amount} `
                              );
                              setValue(val);
                            }
                          }}
                          min="0"
                          onFocus={(e) => e.target.select()}
                          step={userCredit?.bid_amount}
                          placeholder={`Enter amount in multiple of ${userCredit?.bid_amount} `}
                        />
                        <label for="floatingInput">Enter amount</label>
                      </div>
                      <div id="CityHelp" className="form-text fw-500 ms-1">
                        Enter amount in multiples of {userCredit?.bid_amount}
                      </div>
                    </div>
                    {/* // )} */}
                    <p className="color-secondary">
                      * PKR {userCredit?.bid_amount?.toLocaleString()} security
                      deposite required to participate in live bidding.
                    </p>
                    {/* <div className="bidPriceInc d-flex justify-content-between align-items-center px-2 py-1">
                      <button onClick={decreaseValue} disabled={value <= 5}>
                        -
                      </button>
                      <span>PKR {formatPrice(value)}</span>
                      <button onClick={increaseValue}>+</button>
                    </div> */}
                    {/* <div className="col-6 p-0 text-center">
                      <div className="d-flex justify-content-center ">
                        <Box sx={{ width: 500 }}>
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">
                              Payment Gateway
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={gateway}
                              label="Payment Gateway"
                              onChange={handleChange}
                            >
                              <MenuItem value={"JazzCash"} sx={{ width: 500 }}>
                                <div className="w-100 d-flex justify-content-center gap-3">
                                  {" "}
                                  <Image

height={500}
                                    src={JazzCashLogo}
                                    className="logoIcons img-fluid"
                                    alt=""
                                  />{" "}
                                </div>
                              </MenuItem>
                              <MenuItem value={"PayFast"} sx={{ width: 500 }}>
                                <div className="w-100 d-flex justify-content-center gap-3">
                                  <Image

height={500}
                                    src={PayFastLogo}
                                    className="logoIcons img-fluid"
                                    alt=""
                                  />{" "}
                                </div>
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                      </div>
                    </div> */}
                    <div className="d-flex justify-content-center mt-3">
                      {gateway && gateway === "JazzCash" ? (
                        <button
                          onClick={handleJazzCashFormSubmit}
                          type="submit"
                          style={{ width: "fit-content" }}
                          className="btn mt-3 fw-primary model_loginBTn px-4 py-1 fw-500 fs-5 "
                        >
                          Proceed to payment
                        </button>
                      ) : gateway === "PayFast" ? (
                        <button
                          onClick={handlePayFastFormSubmit}
                          type="submit"
                          style={{ width: "fit-content" }}
                          className="btn mt-3 fw-primary model_loginBTn px-5 py-2 fw-500 fs-6 "
                          disabled={
                            tokenLoading !== true || value === "" || value === 0
                          }
                        >
                          Proceed to payment
                        </button>
                      ) : null}
                    </div>
                    {Apiuser?.role_id !== 3 && (
                      <>
                        <hr className="mt-5" />
                        <div className="row mt-5">
                          <div className="col-md-6 col-12 mb-3">
                            <div className="mb-md-3">
                              <h4 className="color-secondary">
                                Terms & Conditions:
                              </h4>

                              <ul>
                                <li>
                                  0.5% of a cars selling price will be charged.
                                </li>
                                <li>
                                  Famewheels will provide document, CPLC
                                  verification & tax checkup
                                </li>
                                <li>
                                  Famewheels will be responsible for the
                                  aggreement
                                </li>
                                <li>
                                  Vehicle will be transfered within 7 days.
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="col-md-6 col-12 mb-3">
                            <h4 className="color-secondary">
                              Bidding Security Deposit:
                            </h4>
                            <ul>
                              <li>
                                Vehicles priced from{" "}
                                <span className="color-secondary">
                                  1 to 10 lakhs
                                </span>
                                : Security deposit of{" "}
                                <span className="color-secondary">
                                  {" "}
                                  10,000 pkr
                                </span>
                                .
                              </li>
                              <li>
                                Vehicles priced from{" "}
                                <span className="color-secondary">
                                  {" "}
                                  10 to 25 lakhs{" "}
                                </span>
                                : Security deposit of
                                <span className="color-secondary">
                                  {" "}
                                  20,000 pkr
                                </span>
                                .
                              </li>
                              <li>
                                Vehicles priced from{" "}
                                <span className="color-secondary">
                                  {" "}
                                  25 to 50 lakhs
                                </span>
                                : Security deposit of{" "}
                                <span className="color-secondary">
                                  {" "}
                                  30,000 pkr
                                </span>
                                .
                              </li>
                              <li>
                                Vehicles priced from{" "}
                                <span className="color-secondary">
                                  {" "}
                                  50 to 75 lakhs
                                </span>
                                : Security deposit of{" "}
                                <span className="color-secondary">
                                  {" "}
                                  40,000 pkr
                                </span>
                                .
                              </li>
                              <li>
                                Vehicles priced from{" "}
                                <span className="color-secondary">
                                  {" "}
                                  75 lakhs to 1 crore
                                </span>
                                : Security deposit of{" "}
                                <span className="color-secondary">
                                  {" "}
                                  50,000 pkr
                                </span>
                                .
                              </li>
                              <li>
                                Vehicles priced over{" "}
                                <span className="color-secondary">
                                  {" "}
                                  1 crore
                                </span>
                                : Security deposit of
                                <span className="color-secondary">
                                  {" "}
                                  100,000 pkr
                                </span>
                                .
                              </li>
                            </ul>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : user ? (
                  <div>
                    <h4 className="text-start  fw-700 pb-4 fs-3">
                      Verify{" "}
                      <span className=" color-secondary"> your identity </span>
                    </h4>
                    <div className="BecomeAlertMsg">
                      <h5 className="fw-600 fs-6 pb-2">
                        You have to verify your identity before becoming a
                        member.
                      </h5>
                      <div className="ps-2">
                        <h6>ID Check</h6>
                        <p>
                          Please submit your identity documents to become a
                          member on the FameWheels Platform.
                        </p>
                        <button
                          onClick={goToVerify}
                          type="button"
                          className="btn  fw-primary model_loginBTn px-3 py-1 fw-500 fs-6"
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
                {!user && (
                  <div className="row mb-3">
                    <div className="col-md-6 col-12 mb-3">
                      <div className="mb-md-3">
                        <h4 className="color-secondary">Terms & Conditions:</h4>

                        <ul>
                          <li>0.5% of a cars selling price will be charged.</li>
                          <li>
                            Famewheels will provide document, CPLC verification
                            & tax checkup
                          </li>
                          <li>
                            Famewheels will be responsible for the aggreement
                          </li>
                          <li>Vehicle will be transfered within 7 days.</li>
                        </ul>
                        <h4 className="color-secondary">
                          Bidding Security Deposit:
                        </h4>
                        <ul>
                          <li>
                            Vehicles priced from{" "}
                            <span className="color-secondary">
                              1 to 10 lakhs
                            </span>
                            : Security deposit of{" "}
                            <span className="color-secondary"> 10,000 pkr</span>
                            .
                          </li>
                          <li>
                            Vehicles priced from{" "}
                            <span className="color-secondary">
                              {" "}
                              10 to 25 lakhs{" "}
                            </span>
                            : Security deposit of
                            <span className="color-secondary"> 20,000 pkr</span>
                            .
                          </li>
                          <li>
                            Vehicles priced from{" "}
                            <span className="color-secondary">
                              {" "}
                              25 to 50 lakhs
                            </span>
                            : Security deposit of{" "}
                            <span className="color-secondary"> 30,000 pkr</span>
                            .
                          </li>
                          <li>
                            Vehicles priced from{" "}
                            <span className="color-secondary">
                              {" "}
                              50 to 75 lakhs
                            </span>
                            : Security deposit of{" "}
                            <span className="color-secondary"> 40,000 pkr</span>
                            .
                          </li>
                          <li>
                            Vehicles priced from{" "}
                            <span className="color-secondary">
                              {" "}
                              75 lakhs to 1 crore
                            </span>
                            : Security deposit of{" "}
                            <span className="color-secondary"> 50,000 pkr</span>
                            .
                          </li>
                          <li>
                            Vehicles priced over{" "}
                            <span className="color-secondary"> 1 crore</span>:
                            Security deposit of
                            <span className="color-secondary">
                              {" "}
                              100,000 pkr
                            </span>
                            .
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                      <div className="mb-md-3">
                        <p className="color-secondary">
                          <i className="fa-solid fa-circle-exclamation"></i> You
                          have to Login in first to become a member.
                        </p>
                        <button
                          onClick={LoginOpen}
                          className="btn mt-3 fw-primary model_loginBTn px-4 py-1 fw-500 fs-5 "
                        >
                          Login
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
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
      </Modal>
      {/* <LoginModal open={isOpen} onClose={LoginClose} /> */}
      <Modal
        open={openFaildModal}
        onClose={() => setOpenFaildModal(false)}
        disableAutoFocus={true}
      >
        <Box className="text-center successModal" sx={successModal}>
          <div className="text-center py-2">
            <h2 className="color-secondary">Payment Canceled</h2>
          </div>
          <p className="m-0 p-0">{paymentResponse?.responseMessage}</p>
          <p className="pt-1">We will contact you soon. Thank You!</p>
        </Box>
      </Modal>
    </>
  );
};

export default MemberComponentPayFast;
