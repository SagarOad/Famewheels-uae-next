import * as React from "react";
import { useState } from "react";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import SuccessTick from "../../images/success-tick.gif";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import InputMask from "react-input-mask";
import Link from "next/link";
import LoginModal from "../loginModal/index";
import ResetOtp from "../modals/passResetModal/passwordResetOtp";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function RegisterModal({ open, onClose }) {
const baseUrl = prcess.env.NEXT_PUBLIC_BASE_URL

  const [otpPopup, setOtpPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [successSignup, setSuccessSignup] = useState(false);
  const [isSignSubmitting, setIsSignSubmitting] = useState(false);
  const [roleName, setRoleName] = useState(" ");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");

  const [dataFromChild, setDataFromChild] = useState("");

  const handleDataFromChild = (data) => {
    setDataFromChild(data);
  };

  const [isOpen, setIsOpen] = useState(false);

  const LoginClose = () => {
    setIsOpen(false);
  };

  const [errOpen, setErrOpen] = useState(false);

  const handleBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setErrOpen(false);
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

  React.useEffect(() => {
    setRoleName("ROLE_USER");
  }, []);

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
        onClose();
        setIsOpen(false);
        setOtpPopup(true);

        try {
          const emailVerify = await axios.get(`${baseUrl}/sendotp`, {
            params: {
              email: email,
            },
          });
        } catch (error) {
        } finally {
          setOtpPopup(false);
        }
      }

      setSuccessSignup(true);
      setIsSignSubmitting(false);
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.error);
      setIsSignSubmitting(false);
      setErrOpen(true);
    }
  };

  const LoginModalOpen = () => {
    onClose();
    setIsOpen(true);
  };

  const OtpClose = () => {
    setOtpPopup(false);
  };

  return (
    <>
      <Snackbar
        open={errOpen}
        autoHideDuration={6000}
        onClose={handleBarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleBarClose} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

      <ResetOtp
        open={otpPopup}
        onClose={OtpClose}
        email={email}
        sendDataToParent={handleDataFromChild}
      />

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
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      required
                    />
                  </div>
                </div>
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
                      type="password"
                      className="form-control"
                      id="memberPassword"
                      name=""
                      placeholder="Confirm Password"
                      required
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                    />
                  </div>
                </div>
                {passwordMatchError && (
                  <p className="error-message p-0">{passwordMatchError}</p>
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
                <div className="login_forgot text-start">
                  <Link to="/forgot-password">Forgot Password?</Link>
                </div>
                <div className="col-12 px-0">
                  <button
                    type="submit"
                    className="btn mt-3 fw-btn model_loginBTn w-100"
                    disabled={
                      password !== confirmPassword ||
                      name === "" ||
                      email === "" ||
                      phone === ""
                    }
                  >
                    {isSignSubmitting ? (
                      <CircularProgress size="16px" sx={{ color: "#fff" }} />
                    ) : successSignup ? (
                      <img
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
                    LoginModalOpen();
                  }}
                >
                  Login
                </button>
                <LoginModal open={isOpen} onClose={LoginClose} />
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
    </>
  );
}
