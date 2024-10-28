"use client";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import TimerLoader from "@/images/timer.gif";
import { Modal, Box, Button } from "@mui/material";
import axios from "axios";
import SellerBidding from "@/images/sell-biding.png";
import SubmitIcon from "@/images/submit-details.png";
import InTouch from "@/images/will-be-in-touch.png";
import Certified from "@/images/certified.png";
import GoBidding from "@/images/go-for-bidding.png";
import SeoMeta from "@/components/meta";
import BiddingPostAd from "@/components/post-ad-body/bidding";
import { AuthContext } from "@/context/AuthContext";
import Lottie from "lottie-react";
import LockAnimation from "@/animations/login-continue.json";
import NumberLogin from "@/components/modals/loginModal/number";
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

export default function SellerAppointment() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const { user } = useContext(AuthContext);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [make, setMake] = useState(null);
  const [makeName, setMakeName] = useState(" ");
  const [modelName, setModelName] = useState("");
  const [yearName, setYearName] = useState("");
  const [makeId, setMakeId] = useState("");
  const [modelYear, setModelYear] = useState(null);
  const [getModel, setGetModel] = useState(null);
  const [price, setPrice] = useState(" ");
  const [open, setOpen] = useState(false);

  const history = useRouter();

  const SubscriberSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("subscriber_name", fullName);
      formData.append("subscriber_phone", phone);
      formData.append("subscriber_email", email);
      // formData.append("vehicleCondition", vehicleCondition);

      const response = await axios.post(
        `https://onlinepayment.famewheels.com/savesubscriber`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setIsSubmitting(false);

      history.push(`/`);
      console.log(response.data, "inspection response");
    } catch (err) {
      console.error(err.response);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchMake = async () => {
      try {
        const response = await axios.get(`${baseUrl}/byMake`);

        // console.log("All Make", response.data);
        setMake(response.data);
        // setOptions(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMake();
  }, []);

  const handleMakeChange = (e) => {
    const selectedMake = make.find((item) => item.makeName === e.target.value);
    if (selectedMake) {
      setMakeId(selectedMake.makeId);
    } else {
      setMakeId("");
    }
    setMakeName(e.target.value);
  };

  // all models api

  useEffect(() => {
    const fetchModel = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/model-by-make?make_id=${makeId}`
        );

        console.log("Model Details", response.data);
        setGetModel(response.data);
        // setOptions(response.data);
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

        console.log("Model Year", response.data);
        setModelYear(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchYear();
  }, []);

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

  const onClose = () => {
    setOpen(false);
  };

  const handleLogin = () => {
    // history.push("/login");
    setOpen(true);
  };

  return (
    <>
      <SeoMeta
        title="Sell Through Biddings | FameWheels"
        desc="Explore the new and used cars at the the car auction in UAE. Famewheels has provided a platform for live car bidding in which you can bid on your favorite car and also check Famewheels Auction cars in Karachi for reliable and affordable cars."
        url="upcomming"
      />
      {/* submitting modal */}

      <Modal
        open={isSubmitting}
        onClose={() => setIsSubmitting(false)}
        disableAutoFocus={true}
        className="timerModal"
      >
        <Box className="text-center successModal " sx={successModal}>
          <Image
            width={50}
            height={50}
            className="modalLoaderImg"
            src={TimerLoader}
            alt="Loading..."
            srcSet=""
          />
        </Box>
      </Modal>

      {/*End submitting modal */}

      <div className="container-fluid grad-bg90 py-4 ">
        <div className="container">
          <div className="row align-items-center ">
            <div className="col-lg-7 col-12">
              <h2 className=" color-white text-start fs-2">
                Sell Your Car Through <br />
                <span className="fw-bold fs-1">Famewheels Live Bidding</span>
              </h2>
            </div>
            <div className="col-lg-5 col-md-12 col-12 text-end p-0">
              <Image
                width={500}
                height={500}
                className="topBanner_img img-fluid "
                src={SellerBidding}
                alt="Sell through live bidding"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="memberFormHead">
          <h4 className="pb-4 color-black text-start fs-3 text-capitalize fw-700">
            sell through famewheels live bidding
          </h4>
        </div>
        <div className="row pb-5">
          <div className="col-lg-3 col-6  d-flex justify-content-center align-items-center ">
            <div className="StepperCount">01</div>
            <div className="OurSteppers">
              <Image
                width={50}
                height={50}
                src={SubmitIcon}
                alt=""
                srcSet=""
              />
              <h6 className="text-capitalize ">
                submit vehicle <br /> detail
              </h6>
            </div>
          </div>
          <div className="col-lg-3 col-6 d-flex justify-content-center align-items-center ">
            <div className="StepperCount">02</div>
            <div className="OurSteppers">
              <Image width={50} height={50} src={InTouch} alt="" srcSet="" />
              <h6 className="text-capitalize ">
                We'll be in touch <br /> shortly
              </h6>
            </div>
          </div>
          <div className="col-lg-3 col-6 d-flex justify-content-center align-items-center ">
            <div className="StepperCount">03</div>
            <div className="OurSteppers">
              <Image
                width={50}
                height={50}
                src={Certified}
                alt=""
                srcSet=""
              />
              <h6 className="text-capitalize ">
                car certified from <br /> famewheels
              </h6>
            </div>
          </div>
          <div className="col-lg-3 col-6 d-flex justify-content-center align-items-center ">
            <div className="StepperCount">04</div>
            <div className="OurSteppers">
              <Image
                width={50}
                height={50}
                src={GoBidding}
                alt=""
                srcSet=""
              />
              <h6 className="text-capitalize ">
                ready to live for <br /> bidding
              </h6>
            </div>
          </div>
        </div>
        {user ? (
          <BiddingPostAd />
        ) : (
          <>
            <div className="d-flex justify-content-center flex-column align-items-center gap-1 boxShadow py-5 rounded">
              <Lottie
                animationData={LockAnimation}
                autoPlay
                loop
                style={{ width: "75px" }}
                className="loginContinue"
              />

              <p className="fs-5 fw-500 pt-3 m-0">
                Please Login To Submit Bidding Request
              </p>

              <Button
                variant="contained"
                className="bgSecondary"
                onClick={handleLogin}
              >
                Login
              </Button>
            </div>

            <Modal
              open={open}
              onClose={onClose}
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
            {/* <LoginModal open={open} onClose={onClose} /> */}
          </>
        )}
      </div>
    </>
  );
}
