"use client";
import SeoMeta from "@/components/meta/index.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Box, Modal } from "@mui/material";
import OurLiveBiddings from "@/images/only-car.png";

import Button from "@mui/material/Button";
import InputMask from "react-input-mask";
import { AuthContext } from "@/context/AuthContext";
import Credibility from "@/images/credibility.png";
import EasyReport from "@/images/easy-report.png";
import ExpertTechnician from "@/images/expert-technician.png";
import Relaxation from "@/images/relaxation.png";
import ReportImage from "@/images/sample-inspection-report.png";
import InspectionHeaderImage from "@/images/car-inspection-hero-image.png";
import Car1 from "@/images/car1.png";
import Car2 from "@/images/car2.png";
import Car3 from "@/images/inspection-premium.png";
import JazzCashLogo from "@/images/jazzcash-logo.png";
import PayFastLogo from "@/images/PayFastLogo.png";
import moment from "moment";
import CryptoJS from "crypto-js";
import LoginModal from "@/components/modals/loginModal";
import NumberLogin from "@/components/modals/loginModal/number";
import Milage from "@/images/mileage.png";
import Automatic from "@/images/automatic.png";
import Manual from "@/images/manual.png";
import InspectionAbout from "@/images/inspection-about.png";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DiscountOfferBanner from "@/images/inspection-50-off.jpg";
import { useContext } from "react";

import { useRef } from "react";

import {
  addDays,
  setHours,
  setMinutes,
  isSameDay,
  isBefore,
  getHours,
  getMinutes,
  startOfTomorrow,
  startOfToday,
  format,
} from "date-fns";
import Image from "next/image";

const packageModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
  minHeight: "15%",
  maxHeight: "95%",
  height: "auto",
  overflowY: "scroll",
};
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
export default function VehicleInspection() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const user = useContext(AuthContext);
  const history = useRouter();
  const [loading, setLoading] = useState(false);
  const [gateway, setGateway] = useState("");
  const [vehicleDetail, setVehicleDetails] = useState(null);
  const [phone, setPhone] = useState(user?.phone || "");
  const [fullName, setFullName] = useState(user?.name || "");
  const [city, setCity] = useState(null);
  const [vehicleType, setVehicleType] = useState("");
  const [address, setAddress] = useState("");
  const [inspectionTime, setInspectionTime] = useState(null);
  const [inspectionSlot, setInspectionSlot] = useState(null);
  const [error, setError] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openFaildModal, setOpenFaildModal] = useState(false);
  const [openPackagedModal, setOpenPackagedModal] = useState(false);
  const [successIsOpen, setSuccessIsOpen] = useState(false);
  const [make, setMake] = useState(null);
  const [makeName, setMakeName] = useState(null);
  const [modelName, setModelName] = useState(null);
  const [yearName, setYearName] = useState(null);
  const [makeId, setMakeId] = useState("");
  const [modelId, setModelId] = useState("");
  const [YearId, setYearId] = useState("");
  const [modelYear, setModelYear] = useState(null);
  const [getModel, setGetModel] = useState(null);
  const [inspectionOrder, setInspectionOrder] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [variantList, setVariantList] = useState([]);
  const [variant, setVariant] = useState("");
  const [variantId, setVariantId] = useState("");
  const [category, setCategory] = useState(null);
  const [amount, setAmount] = useState(null);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenResponse, setTokenResponse] = useState("");
  const [paymentResponse, setPaymentResponse] = useState({});
  const [randomNo, setRandomNo] = useState("");
  const [insPackage, setInsPackage] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [paymentFor, setPaymentFor] = useState(false);
  const [premiumPackages, setPremiumPackages] = useState(null);
  const [premiumActivePackages, setPremiumActivePackage] = useState("-");
  const [packagesImgPath, setPackagesImgPath] = useState("");
  const [postToken, setPostToken] = useState(null);

  const sectionRef = useRef(null);

  const scrollToSection = () => {
    sectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const extractPostIdFromUrl = (url) => {
    const parts = url.split("post");
    if (parts.length > 1) {
      return parts[parts.length - 1];
    } else {
      return null; // Or any other default value
    }
  };

  const faqData = [
    {
      question: "What is a car inspection?",
      answer:
        "A car inspection is a thorough evaluation of a vehicle’s condition, including its mechanical systems, safety features, and overall performance. It aims to identify any issues that may affect the car's safety, reliability, and functionality.",
    },
    {
      question: "In which cities is Famewheels Car Inspection available?",
      answer:
        "Famewheels offers comprehensive car inspections in Karachi. Our services are designed to ensure your vehicle adheres to the highest standards of safety and performance.",
    },
    {
      question: "What is checked during a vehicle inspection?",
      answer:
        "A car inspection typically involves a thorough review of the vehicle's various components and systems, including its engine, transmission, brakes, suspension, and electrical systems. The inspection usually takes between 50 minutes to 1 hour, depending on the extent of the check.",
    },
    {
      question: "What are the benefits of a pre-purchase car inspection?",
      answer:
        "A pre-purchase car inspection helps uncover potential issues and verifies the vehicle's condition before finalizing the purchase. This can prevent unexpected repair costs and ensure you are making an informed decision.",
    },
    {
      question: "What should I do if the inspection report reveals problems?",
      answer:
        "If the inspection report identifies issues, you should discuss repair options or negotiate a price adjustment with the seller. Alternatively, you may need to reconsider proceeding with the purchase if the problems are significant.",
    },
    {
      question: "Does the car inspection report have a validity period?",
      answer:
        "Yes, a car inspection report typically has a validity period, which generally ranges from 30 to 90 days. The condition of the vehicle may change over time, so it’s advisable to act within this period.",
    },
  ];

  const fetchData = async (postToken) => {
    try {
      const response = await axios.get(`${baseUrl}/vehicle-details`, {
        params: {
          post_id: postToken,
          user_id: user?.id,
        },
      });

      setVehicleDetails(response?.data);
      setCity(response?.data?.city_name);
      setMakeName(response?.data?.makeName);
      setMakeId(response?.data?.make_id);
      setModelName(response?.data?.modelName);
      setModelId(response?.data?.model_id);
      setYearName(response?.data?.yearName);
      setYearId(response?.data?.year_id);
      setVariant(response?.data?.variant_id);
      setVehicleType(
        `${response?.data?.makeName} ${response?.data?.modelName} ${response?.data?.yearName}`
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    const url = window.location.href;
    const postIdUrl = extractPostIdFromUrl(url);
    setPostToken(postIdUrl);

    postToken && fetchData(postToken);
  }, [postToken]);

  const LoginClose = () => {
    setIsLoginOpen(false);
  };

  useEffect(() => {
    if (premiumActivePackages === "-") {
      setGateway("PayFast");
    } else {
      setGateway("");
    }
  }, [premiumActivePackages]);

  const handleChange = (event, value) => {
    setGateway(value?.props?.value);
  };

  const getInspectionUpdate = async (
    responsMethodPayFast,
    responseAmount,
    responseTransactionId,
    responseBasketId
  ) => {
    try {
      const parts = responseBasketId.split("-")[0];

      const paymentFor =
        parts === "1"
          ? "Premium"
          : parts === "2"
          ? "Premium"
          : parts === "3"
          ? "Premium"
          : "Normal";
      setPaymentFor(paymentFor);
      const response = await axios.get(
        `${baseUrl}/statuswiseinspectionlistupdate`,
        {
          params: {
            payment_for: paymentFor,
            payment_method: "PayFast",
            security_deposit: responseAmount,
            inspection_id: responseBasketId,
            payment_token: responseTransactionId,
            payment_status: 1,
          },
        }
      );

      // setTokenResponse(response?.data);
      // setTokenLoading(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    //JazzCash Parameters
    const responseCodeJazzCash = params.get("responsecode");
    const responseMessageJazzCash = params.get("ResponseMessage");
    const responseMethodJazzCash = "JazzCash";

    //PayFast Parameters
    const responseCode = params.get("err_code");
    const responseMessage = params.get("err_msg");
    const responseAmount = params.get("transaction_amount");
    const responseTransactionId = params.get("transaction_id");
    const responseBasketId = params.get("basket_id");
    const responsMethodPayFast = "PayFast";

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
        setPaymentResponse({
          responseMessage,
          responseAmount,
          responseTransactionId,
          responseBasketId,
        });
        if (
          responseCode &&
          responseAmount &&
          responseTransactionId &&
          responseBasketId &&
          responseMessage
        ) {
          getInspectionUpdate(
            responsMethodPayFast,
            responseAmount,
            responseTransactionId,
            responseBasketId
          );
        }
        if (responseCodeJazzCash && responseMessageJazzCash) {
          setPaymentResponse({
            responseMessage: responseMessageJazzCash,
          });
        }
        setTimeout(() => {
          setSuccessIsOpen(false);
          history.push("/");
        }, 15000);
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
        getInspectionUpdate(
          responseAmount,
          responseTransactionId,
          responseBasketId
        );
        if (responseCodeJazzCash && responseMessageJazzCash) {
          setPaymentResponse({
            responseMessage: responseMessageJazzCash,
          });
        }
        setOpenFaildModal(true);

        setTimeout(() => {
          setOpenFaildModal(false);
          history.push("/car-inspection");
        }, 4000);
      } else {
      }
    }
  }, [history]);

  const getAccessToken = async () => {
    try {
      const response = await axios.get(`${baseUrl}/gettoken`);

      setTokenResponse(response?.data);
      setTokenLoading(true);
    } catch (error) {
      console.error(error);
    }
  };
  const generateRandomNumber = () => {
    const min = 1; // Minimum value
    const max = 100; // Maximum value
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min; // Generate random number within the range
    setRandomNo(randomNum); // Update state with the generated random number
  };
  // const Amount = amount * 100;
  const Amount = insPackage?.inspection_price * 100 || amount * 100;
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
  const ReturnURL = "https://onlinepayment.famewheels.com/responsepayment";
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
    SUCCESSURL.value = "https://www.famewheels.com/car-inspection";
    form.appendChild(SUCCESSURL);

    const FAILUREURL = document.createElement("input");
    FAILUREURL.type = "hidden";
    FAILUREURL.name = "FAILURE_URL";
    FAILUREURL.value = "https://www.famewheels.com/car-inspection";
    form.appendChild(FAILUREURL);

    const CHECKOUTURL = document.createElement("input");
    CHECKOUTURL.type = "hidden";
    CHECKOUTURL.name = "CHECKOUT_URL";
    CHECKOUTURL.value = "https://www.famewheels.com/";
    form.appendChild(CHECKOUTURL);

    const CUSTOMEREMAIL = document.createElement("input");
    CUSTOMEREMAIL.type = "hidden";
    CUSTOMEREMAIL.name = "CUSTOMER_EMAIL_ADDRESS";
    CUSTOMEREMAIL.value = "";
    form.appendChild(CUSTOMEREMAIL);

    const CUSTOMERMOBILENO = document.createElement("input");
    CUSTOMERMOBILENO.type = "hidden";
    CUSTOMERMOBILENO.name = "CUSTOMER_MOBILE_NO";
    CUSTOMERMOBILENO.value = phone;
    form.appendChild(CUSTOMERMOBILENO);

    const TXNAMTInput = document.createElement("input");
    TXNAMTInput.type = "hidden";
    TXNAMTInput.name = "TXNAMT";
    TXNAMTInput.value = insPackage?.inspection_price || amount;
    form.appendChild(TXNAMTInput);

    const BASKETID = document.createElement("input");
    BASKETID.type = "hidden";
    BASKETID.name = "BASKET_ID";
    BASKETID.value = `${
      insPackage?.id || inspectionOrder?.inspection_id
    }-${randomNo}`;
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

  useEffect(() => {
    if (tokenResponse?.ACCESS_TOKEN) {
      handlePayFastFormSubmit();
    }
  }, [tokenResponse]);

  const inspectionSubmitonBLur = async (e) => {
    e.preventDefault();

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

    if (phone !== "" && phone?.length === 11) {
      try {
        // setLoading(true);
        // const inspectionSlotLocal = inspectionTime
        //   ? inspectionTime.toLocaleString()
        //   : "";

        const formData = new FormData();

        if (premiumActivePackages !== "-") {
          formData.append("package_id", premiumActivePackages);
        }
        formData.append("post_id", postToken);
        formData.append("full_name", fullName);
        formData.append("phone", phone);
        formData.append("address", address);
        formData.append("cnic", "-");
        formData.append("inspection_slot", inspectionSlot || formattedDate);
        formData.append("user_id", user?.id || 0);
        formData.append("city_id", 1);
        formData.append("make_id", makeId || 17);
        formData.append("model_id", modelId || 382);
        formData.append("year_id", YearId || 1);

        const response = await axios.post(
          `${baseUrl}/saveinspectionrequest`,
          formData
        );
        setInspectionOrder(response?.data);

        // if (inspectionSlot) {
        //   setLoading(true);
        //   setOpenSuccessModal(true);
        //   // if (gateway === "JazzCash") {
        //   //   handleJazzCashFormSubmit();
        //   // } else
        //   if (gateway === "PayFast") {
        //     generateRandomNumber();
        //     getAccessToken();
        //   } else if (gateway === "Credit") {
        //     setTimeout(() => {
        //       setOpenSuccessModal(false);
        //       history.push("/dashboard");
        //     }, 4000);
        //   }
        // }
      } catch (err) {
        console.error(err.response);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const inspectionSubmit = async (e) => {
    e.preventDefault();

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

    if (
      city !== "" &&
      fullName !== "" &&
      phone !== "" &&
      phone?.length === 11 &&
      address !== "" &&
      makeId !== "" &&
      modelId !== "" &&
      YearId !== "" &&
      vehicleType !== "" &&
      inspectionTime !== null
    ) {
      try {
        setLoading(true);

        const formData = new FormData();
        if (premiumActivePackages !== "-") {
          formData.append("package_id", premiumActivePackages);
        }
        formData.append("post_id", postToken);
        formData.append("full_name", fullName);
        formData.append("phone", phone);
        formData.append("address", address);
        formData.append("cnic", "-");
        formData.append("inspection_slot", inspectionSlot || formattedDate);
        formData.append("user_id", user?.id || 0);
        formData.append("city_id", 1);
        formData.append("make_id", makeId);
        formData.append("model_id", modelId);
        formData.append("year_id", YearId);

        const response = await axios.post(
          `${baseUrl}/saveinspectionrequest`,
          formData
        );
        setInspectionOrder(response?.data);

        if (inspectionSlot) {
          setOpenSuccessModal(true);

          if (gateway === "Cash") {
            setTimeout(() => {
              setOpenSuccessModal(false);
              history.push("/");
            }, 2000);
          } else if (gateway === "PayFast") {
            generateRandomNumber();
            getAccessToken();
          } else if (gateway === "Credit") {
            setTimeout(() => {
              setOpenSuccessModal(false);
              history.push("/dashboard");
            }, 2000);
          }
        }
      } catch (err) {
        console.error(err.response);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    } else {
      handleInputError();
    }
  };

  const handleDateTimeChange = (date) => {
    const currentTime = new Date();
    const selectedTime = date || currentTime;

    let updatedSlot;

    if (
      isSameDay(selectedTime, currentTime) &&
      isBefore(selectedTime, currentTime)
    ) {
      const currentHour = getHours(currentTime);
      const currentMinute = getMinutes(currentTime);
      updatedSlot = setHours(
        setMinutes(currentTime, currentMinute),
        currentHour
      );
    } else {
      updatedSlot = selectedTime;
    }

    // Set minutes to 00 to match the desired format
    updatedSlot = setMinutes(updatedSlot, 0);

    // Format the date to the desired format
    const formattedDate = format(updatedSlot, "yyyy-MM-dd'T'HH:mm");
    setInspectionTime(updatedSlot);
    setInspectionSlot(formattedDate);
  };

  const minDate = startOfToday(); // Get the start of today's date
  const maxDate = addDays(minDate, 5); // Add 5 days to get the maximum date
  const minTime = setHours(setMinutes(new Date(), 0), 10); // Set minimum time to 10 AM
  const maxTime = setHours(setMinutes(new Date(), 0), 17); // Set maximum time to 5 PM
  const timeIntervals = 60; // Set the interval to 60 minutes

  const filterPassedTime = (time) => {
    const currentTime = new Date();
    const currentHour = getHours(currentTime);
    const currentMinute = getMinutes(currentTime);

    if (isSameDay(inspectionTime, currentTime)) {
      return (
        getHours(time) > currentHour ||
        (getHours(time) === currentHour && getMinutes(time) >= currentMinute)
      );
    }

    return true;
  };

  const filterDate = (date) => {
    if (inspectionTime && isSameDay(inspectionTime, date)) {
      return getHours(inspectionTime) <= 17;
    }
    return true;
  };

  const packages = [
    {
      img: Car1,
      title: "Basic package",
      about: "Upto 1000cc",
      price: 2500,
    },
    {
      img: Car2,
      title: "Standard package",
      about: "1001cc - 2000cc",
      price: 4500,
    },
    {
      img: Car3,
      title: "Premium package",
      about: "Suv’s, 4x4, Jeeps and German Cars",
      price: 6500,
    },
  ];

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

  const handleYearChange = (e) => {
    const selectedYear = modelYear.find((item) => item.year === e.target.value);
    if (selectedYear) {
      setYearId(selectedYear.yearId);
    } else {
      setYearId("");
    }
    setYearName(e.target.value);
  };

  const closePackageModal = () => {
    setOpenPackagedModal(false);
    setInsPackage(null);
  };
  const handleSelectedPackage = () => {
    generateRandomNumber();
    getAccessToken();
  };
  const handleAddToCart = (item) => {
    setInsPackage(item);
    setOpenPackagedModal(true);
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

  const fetchPremiumPackages = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/inspectionpremiumpackage`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPremiumPackages(response?.data?.inspection_packages);
      setPackagesImgPath(response?.data?.imagepath);
      setPremiumActivePackage(response?.data?.isactive);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchYear = async () => {
    try {
      const response = await axios.get(`${baseUrl}/getModelYear`);

      setModelYear(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchPremiumPackages();
    fetchYear();
  }, []);

  useEffect(() => {
    if (category <= 1000) {
      setAmount(2500);
    } else if (category >= 1001 && category <= 2000) {
      setAmount(4500);
    } else if (category > 200) {
      setAmount(6500);
    }
  }, [category]);
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await axios.get(`${baseUrl}/getVarient`, {
          params: {
            variant_id: variant,
          },
        });

        setCategory(response.data?.engine_capacity);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (variant) {
      fetchFeatures();
    }
  }, [variant]);

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

    setVehicleType(`${makeName} ${modelName} ${yearName} `);
  };

  const [fullNameError, setFullNameError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [vehicleTypeError, setVehicleTypeError] = useState(false);
  const [inspectionSlotError, setInspectionSlotError] = useState(false);

  const handleInputError = () => {
    if (fullName === "") {
      setFullNameError(true);
    } else {
      setFullNameError(false);
    }

    if (city === "") {
      setCityError(true);
    } else {
      setCityError(false);
    }

    if (phone === "") {
      setPhoneError(true);
    } else if (phone?.length !== 11) {
      setPhoneError(true);
    } else {
      setPhoneError(false);
    }

    if (address === "") {
      setAddressError(true);
    } else {
      setAddressError(false);
    }

    if (vehicleType === "") {
      setVehicleTypeError(true);
    } else if (makeId === "") {
      setVehicleTypeError(true);
    } else if (modelId === "") {
      setVehicleTypeError(true);
    } else if (YearId === "") {
      setVehicleTypeError(true);
    } else {
      setVehicleTypeError(false);
    }

    if (inspectionTime === null) {
      setInspectionSlotError(true);
    } else {
      setInspectionSlotError(false);
    }
  };

  return (
    <>
      <SeoMeta
        title="Car Inspection | FameWheels"
        desc="Keep your car running smoothly and safely with car inspection of Fame Wheels. Our Experienced Staff will Completely examine the vehicle and identify all problem and you will fixed them."
        url="car-inspection"
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
              {yearName && yearName !== "" && (
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
                        onChange={(e) => setVariant(e.target.value)}
                      >
                        <option selected value=" ">
                          Select {modelName && modelName} {yearName && yearName}{" "}
                          Variant
                        </option>
                        {variantList &&
                          variantList.map((item) => (
                            <option
                              key={item.featuresId}
                              value={item.featuresId}
                            >
                              {item.featureName}
                            </option>
                          ))}
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

      <div
        style={{ paddingTop: "11%" }}
        className="container-fluid bgHeroGradient pb-5 "
      >
        <div className="container pb-0 pb-md-4">
          <div className="row align-items-center flex-column-reverse flex-md-row  ">
            <div className="col-lg-7 col-12  text-start ">
              <h2 className="fw-bold color-white fs-2">
                Get FameWheels <br />
                <span className="fw-bold fs-1">Car Inspection</span>
                <p className="fs-6 fw-light mt-4">
                  FameWheels proudly offers premier inspection services in
                  UAE,
                  <br /> Make a booking online for the car inspection service.
                </p>
              </h2>
              <Image
                className="topBanner_img img-fluid "
                width={500}
                src={InspectionHeaderImage}
                alt="Sell through live bidding"
              />
            </div>
            <div className="col-lg-5 col-12 mb-5 mb-md-0 ">
              <div className="inspectionFormbox p-4 ">
                <div>
                  <h4 className="text-white fw-bold text-center pb-3 fs-4">
                    Book Inspection Now!
                  </h4>
                </div>
                <form
                  onBlur={handleInputError}
                  className="row needs-validation"
                  // noValidate
                  onSubmit={inspectionSubmit}
                >
                  {premiumActivePackages !== "-" && (
                    <>
                      <label
                        for="inspectionName"
                        className="form-label text-white "
                      >
                        Choose how to pay
                      </label>
                      <div className=" mb-3">
                        <div className="d-flex justify-content-start flex-wrap">
                          <div className="form-check form-check-inline md-radioStyle p-0">
                            <input
                              className="form-check-input radio-input"
                              type="radio"
                              name="vehicleFuel"
                              id="vehiclePetrol"
                              value="PayFast"
                              checked={gateway === "PayFast"}
                              onChange={(e) => setGateway(e.target.value)}
                            />
                            <label
                              className="form-check-label radio-label-ins"
                              for="vehiclePetrol"
                            >
                              Online Payment
                            </label>
                          </div>
                          <div className="form-check form-check-inline md-radioStyle p-0">
                            <input
                              className="form-check-input radio-input"
                              type="radio"
                              name="vehicleFuel"
                              id="vehicleDiesel"
                              value="Credit"
                              checked={gateway === "Credit"}
                              onChange={(e) => setGateway(e.target.value)}
                            />
                            <label
                              className="form-check-label radio-label-ins"
                              for="vehicleDiesel"
                            >
                              From Package
                            </label>
                          </div>
                        </div>
                        {gateway === "Credit" && (
                          <h6
                            style={{ color: "#7bf131" }}
                            className=" fw-600 pt-2 m-0"
                          >
                            Available inspection credit: {premiumActivePackages}
                          </h6>
                        )}
                        {gateway === "" && (
                          <div className="invalid-feedback inputErrorTip ps-0 ">
                            <i className="fa-solid fa-circle-exclamation me-2"></i>
                            Please select payment mode
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  <div className="col-12 mb-3">
                    <div>
                      {/* <label for="inspectionName" className="form-label">
                        Full Name
                      </label> */}
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
                    {fullNameError && (
                      <div className="invalid-feedback inputErrorTip ">
                        <i className="fa-solid fa-circle-exclamation me-2"></i>
                        Enter full name
                      </div>
                    )}
                  </div>
                  <div className="col-12 mb-3">
                    <div>
                      {/* <label for="inspectionContact" className="form-label">
                        Phone Number
                      </label> */}
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
                        minLength={11}
                        onBlur={inspectionSubmitonBLur}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    {phoneError && (
                      <div className="invalid-feedback inputErrorTip ">
                        <i className="fa-solid fa-circle-exclamation me-2"></i>
                        Enter valid phone number
                      </div>
                    )}
                  </div>
                  <div className="col-12">
                    <div className="mb-3">
                      {/* <label for="inspectionCity" className="form-label">
                        Select City
                      </label> */}

                      <select
                        className="form-select"
                        id="inspectionCity"
                        aria-label="Default select example"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      >
                        <option value="">Select City</option>
                        <option selected value="Karachi">
                          Karachi
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="mb-3">
                      {/* <label for="inspectionAddress" className="form-label">
                        Complete Street Address
                      </label> */}
                      <input
                        type="text"
                        className="form-control"
                        id="inspectionAddress"
                        aria-describedby="inspectionAddressHelp"
                        placeholder="Complete street address"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />

                      {/* <div
                        id="inspectionAddressHelp"
                        className="form-text text-white "
                      >
                        (e.g. House No 123,6Th Street, Cifton Karachi )
                      </div> */}
                      {addressError && (
                        <div className="invalid-feedback inputErrorTip ">
                          <i className="fa-solid fa-circle-exclamation me-2"></i>
                          Enter address
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="mb-3">
                      {/* <label for="inspectionVehicle" className="form-label">
                        Make/Model/Year
                      </label> */}
                      <input
                        type="text"
                        className="form-control"
                        id="inspectionVehicle"
                        aria-describedby="inspectionVehicleHelp"
                        placeholder="Select your car"
                        required
                        value={vehicleType}
                        onClick={() => setIsOpen(true)}
                        readOnly
                      />
                      {/* <div
                        id="inspectionVehicleHelp"
                        className="form-text text-white"
                      >
                        (e.g. Honda Civic RS 2022)
                      </div> */}
                      {vehicleTypeError && (
                        <div className="invalid-feedback inputErrorTip ">
                          <i className="fa-solid fa-circle-exclamation me-2"></i>
                          Select car brand
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="mb-1">
                      {/* <label for="vehicleYear" className="form-label">
                        Inspection Slot
                      </label> */}
                      <DatePicker
                        selected={inspectionTime}
                        onChange={handleDateTimeChange}
                        showTimeSelect
                        timeFormat="h:mm aa"
                        dateFormat="dd-MM-yyyy h:mm aa"
                        placeholderText="Select Inspection Slot"
                        className="form-control"
                        style={{ width: "100%" }}
                        minDate={minDate}
                        maxDate={maxDate}
                        minTime={minTime}
                        maxTime={maxTime}
                        timeIntervals={timeIntervals}
                        filterTime={filterPassedTime}
                        filterDate={filterDate}
                      />
                      {inspectionSlotError && (
                        <div className="invalid-feedback inputErrorTip ">
                          <i className="fa-solid fa-circle-exclamation me-2"></i>
                          Select inspection slot
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    {
                      <>
                        <label
                          for="inspectionName"
                          className="form-label text-white pt-3 "
                        >
                          Select Payment method
                        </label>
                        <div className=" mb-3">
                          <div className="d-flex justify-content-start flex-wrap">
                            <div className="form-check form-check-inline md-radioStyle mb-2 mb-md-0 p-0">
                              <input
                                className="form-check-input radio-input"
                                type="radio"
                                name="vehicleFuel"
                                id="vehiclePetrol"
                                value="PayFast"
                                checked={gateway === "PayFast"}
                                onChange={(e) => setGateway(e.target.value)}
                              />
                              <label
                                className="form-check-label radio-label-ins"
                                for="vehiclePetrol"
                              >
                                Online Payment
                              </label>
                            </div>
                            <div className="form-check form-check-inline md-radioStyle p-0">
                              <input
                                className="form-check-input radio-input"
                                type="radio"
                                name="vehicleFuel"
                                id="vehicleDiesel"
                                value="Cash"
                                checked={gateway === "Cash"}
                                onChange={(e) => setGateway(e.target.value)}
                              />
                              <label
                                className="form-check-label radio-label-ins"
                                for="vehicleDiesel"
                              >
                                Cash on spot
                              </label>
                            </div>
                          </div>
                          {gateway === "Cash" && (
                            <h6
                              style={{ color: "#7bf131", fontSize: 14 }}
                              className=" fw-400 pt-2 m-0"
                            >
                              You may pay in cash to our inspector at the spot.
                            </h6>
                          )}
                          {gateway === "" && (
                            <div className="invalid-feedback inputErrorTip ps-0 ">
                              <i className="fa-solid fa-circle-exclamation me-2"></i>
                              Please select payment mode
                            </div>
                          )}
                        </div>
                      </>
                    }
                  </div>
                  <div
                    style={{
                      cursor:
                        loading === true || phone?.length < 11
                          ? "not-allowed"
                          : "pointer",
                    }}
                    className="text-center pt-3"
                  >
                    <button
                      type="submit"
                      className="btn boxShadow rounded-pill border-0 w-100 inspectionSubmit_btn text-white py-2 "
                      style={{
                        backgroundColor:
                          loading === true ||
                          phone?.length === 11 ||
                          inspectionTime !== null
                            ? "#b80505"
                            : "#b8050550",
                      }}
                      disabled={
                        gateway === "" ||
                        loading === true ||
                        phone?.length < 11 ||
                        inspectionTime === null
                      }
                    >
                      {loading ? "Saving.." : " Continue"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid px-0 ">
        <Image
          style={{ objectFit: "contain" }}
          src={DiscountOfferBanner}
          alt=""
          srcset=""
          className="img-fluid w-100  mb-md-2"
        />
      </div>
      <div className="container mt-0 mt-md-5  mb-5 pb-5 pt-5 pt-md-1 ">
        <div className="row align-items-center  ">
          <div className="col-lg-12 col-12">
            <div className=" inspectionWhyChoose ">
              <h4 className=" color-black text-start  fw-700">
                Why Choose <br />{" "}
                <span className="color-secondary">
                  {" "}
                  FameWheels Car Inspection?
                </span>
              </h4>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="row ">
              <div className="col-lg-3 col-6  d-flex justify-content-center align-items-center ">
                <div className="StepperCount">01</div>
                <div className="OurSteppers">
                  <Image src={EasyReport} alt="Easy Report" srcSet={EasyReport} />
                  <h6 className="text-capitalize ">Easy Report</h6>
                </div>
              </div>

              <div className="col-lg-3 col-6 d-flex justify-content-center align-items-center ">
                <div className="StepperCount">02</div>
                <div className="OurSteppers">
                  <Image
                    src={ExpertTechnician}
                    alt="Expert Technician"
                    srcSet={ExpertTechnician}
                  />
                  <h6 className="text-capitalize ">Expert Technician</h6>
                </div>
              </div>

              <div className="col-lg-3 col-6 d-flex justify-content-center align-items-center ">
                <div className="StepperCount">03</div>
                <div className="OurSteppers">
                  <Image src={Relaxation} alt="Relaxation" srcSet={Relaxation} />
                  <h6 className="text-capitalize ">Relaxation</h6>
                </div>
              </div>

              <div className="col-lg-3 col-6 d-flex justify-content-center align-items-center ">
                <div className="StepperCount">04</div>
                <div className="OurSteppers">
                  <Image
                    src={Credibility}
                    alt="Credibility"
                    srcSet={Credibility}
                  />
                  <h6 className="text-capitalize ">Credibility</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container pb-5 ">
        <h4 className="text-black fw-700 fs-3 pb-4 text-center text-md-start  ">
          What does the Car Inspection Report include?
        </h4>
        <div className="text-center">
          <Image
            src={InspectionAbout}
            className="img-fluid inspection_includeImg "
            alt=""
            srcSet=""
          />
        </div>
        <div className="text-center text-md-end mt-3 mt-md-0">
          <a
            className="btn grad_btn rounded-5 text-capitalize color-white fw-600 text-white py-2 px-4 mt-2"
            href="https://inspectionreport.famewheels.com/inspection-report/f820cf6350d8"
            target="_blank"
          >
            view sample report
            <i className="fa-solid fa-arrow-right-long ms-2 "></i>
          </a>
        </div>
      </div>

      <div className="newColorGrad_bg">
        <div className="container">
          <div className="row  py-5 align-items-center px-5  rounded-3  ">
            <div className="col-lg-6">

              <h2 className=" fw-600 fs-1 color-white">
                <span className="fs-2">Get Our </span> <br /> Premium Car
                Inspection
              </h2>

            </div>
            <div className="col-lg-6 text-end">
              <Image
                src={OurLiveBiddings}
                className="corporate_img"
                alt="Famewheels Live Bidding"
                srcSet=""
              />
            </div>
        
          </div>
        </div>
      </div>  

      <div className="container py-5">
        <h4 className="pb-4 text-capitalize  color-black text-center text-lg-start fs-3 fw-700">
          FameWheels Vehicle Inspection Packages
        </h4>
          <div className="d-flex justify-content-center justify-content-lg-between align-items-center gap-md-5 gap-2 flex-lg-nowrap flex-wrap">
            {packages?.map((item, index) => {
              const dynamicPrices = [4000, 6000, 8000];
              const dynamicPrice = dynamicPrices[index];

              return (
                <div
                  className="card_bg border inspection_cardPkg mb-4 position-relative p-3 shadow-sm"
                  key={item.price}
                  style={{ borderRadius: "10px", maxWidth: "400px" }}
                >
                  <Image
                    src={item.img}
                    width={500}
                    alt="car-inspection"
                    style={{ width: "100%", borderRadius: "8px" }}
                  />

                  <h4 className="mt-3 text-center">{item.title}</h4>
                  <p className="color-secondary fw-semibold text-center">
                    {item.about}
                  </p>

                  <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
                    <p className="fw-bold fs-6 text-decoration-line-through m-0">
                      PKR {dynamicPrice?.toLocaleString()}
                    </p>

                    <p
                      className="color-secondary fw-bold fs-5 m-0"
                      style={{ fontSize: "1.2rem" }}
                    >
                      PKR {item?.price?.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
      </div>

      <div className="container  ">
        <h4 className="pb-4 text-capitalize  color-black text-center text-lg-start fs-3 fw-700">
          Frequently Asked Questions
        </h4>
        <div className="mb-5">
          {faqData.map((faq, index) => (
            <Accordion
              sx={{
                marginBottom: 4,
                boxShadow: "unset",
                border: 0,
                "&::before": {
                  height: 0,
                },
              }}
              key={index}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
                sx={{ backgroundColor: "#eef2f6", borderRadius: 2 }}
              >
                <h6 className="fs-5 mb-0 py-2 ">{faq.question}</h6>
              </AccordionSummary>
              <AccordionDetails>
                <p style={{ fontSize: 17 }} className="mb-0 py-3 ">
                  {faq.answer}
                </p>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>

      <Modal open={openSuccessModal} disableAutoFocus={true}>
        <Box className="text-center successModal" sx={successModal}>
          <div className="text-center py-2">
            <h3 style={{ fontSize: 24, fontWeight: "700", color: "#20409a" }}>
              Inspection Booked Successfully
            </h3>
            <p className="">
              Dear Customer,
              <br />
              Thank you for booking inspection slot with us, our customer
              support executive will contact you shortly. You can also reach us
              by call or whatsapp on 0300-1113263.
            </p>
            <h2>Have a Good Time!</h2>

          </div>
          {gateway !== "Cash" && (
            <>
              <p className="m-0 p-0">Wait, do not close this window.</p>
              <p className="pt-1">Redirecting to payment... </p>
            </>
          )}
        </Box>
      </Modal>

      <Modal
        open={successIsOpen}
        onClose={() => setSuccessIsOpen(false)}
        disableAutoFocus={true}
      >
        <Box className="text-center successModal" sx={successModal}>
          <h3>Success!</h3>
          {paymentFor === "Normal" ? (
            <h5>Inspection Slot Booked.</h5>
          ) : (
            <h5>Inspection Package Puchased.</h5>
          )}

          <p className="m-0 p-0">{paymentResponse?.responseMessage}</p>
          <p className="pt-1">We will contact you soon. Thank You!</p>
        </Box>
      </Modal>
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
      <Modal
        open={openPackagedModal}
        onClose={closePackageModal}
        disableAutoFocus={true}
      >
        <Box className="text-center successModal" sx={packageModal}>
          <div className="text-center py-2 ">
            <h4>Would you like to buy our {insPackage?.inspection_title}?</h4>
          </div>
          <div className="m-auto boxShadow pt-5 inspection_card mb-4">
            <Image
              src={`${packagesImgPath}/${insPackage?.inspection_image}`}
              alt={insPackage?.inspection_title}
            />

            <h4 className="mt-3">{insPackage?.inspection_title}</h4>
            <div style={{ height: "60px" }}>
              <p className="text-secondary text-center">
                {insPackage?.inspection_days}
              </p>
            </div>

            <p className="mt-4 color-secondary fw-bold fs-5">
              PKR {insPackage?.inspection_price}
            </p>
          </div>
          <div className="row py-3">
            <div className="col-12">
              <button
                onClick={handleSelectedPackage}
                className="btn  p-3 bgSecondary text-white"
                style={{ right: -16 }}
              >
                Continue
              </button>
            </div>
          </div>
        </Box>
      </Modal>

      <Modal
        open={isLoginOpen}
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
    </>
  );
}
