import { useState } from "react";
import axios from "axios";
import setAuthToken from "@/auth/auth.js";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import SuccessTick from "@/images/success-tick.gif";
import RegisterModal from "../registerModal/index.js";
import { useAuthContext } from "../../hooks/useAuthContext.js";
import Cookies from "js-cookie";
import { Alert, Snackbar } from "@mui/material";
import Link from "next/link";


const xorEncrypt = (data, key) => {
  const encryptedData = data.split("").map((char, i) => {
    const keyChar = key.charCodeAt(i % key.length);
    const encryptedChar = char.charCodeAt(0) ^ keyChar;
    return String.fromCharCode(encryptedChar);
  });
  return encryptedData.join("");
};

export default function LoginModal({ open, onClose }) {
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const { dispatch } = useAuthContext();
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [successLogin, setSuccessLogin] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const SignUpModalOpen = () => {
    onClose();
    setIsOpen(true);
  };

  const SignUpClose = () => {
    setIsOpen(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${baseUrl}/login`, {
        email: userName,
        password,
      });

      localStorage.setItem("token", response.data.token);
      setAuthToken(response.data.token);
      setSuccessLogin(true);
      setIsSubmitting(false);

      let resp = response.data.token;
      let base64Url = resp.split(".")[1];
      let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      let jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      const data = JSON.parse(jsonPayload);
      localStorage.setItem("data", JSON.stringify(data));

      const userResponse = await axios.get(`${baseUrl}/getUser`, {
        headers: {
          Authorization: `Bearer ${response.data.token}`,
        },
      });

      const encryptedUserData = xorEncrypt(
        JSON.stringify(userResponse.data),
        "noman"
      );
      Cookies.set("%2515M%25", encryptedUserData, {
        expires: 7,
      });

      await dispatch({ type: "LOGIN", payload: userResponse.data });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError(err.response.data?.error);
      setIsSubmitting(false);
      setErrOpen(true);
    }
  };

  const [errOpen, setErrOpen] = useState(false);

  const handleBarClose = (event, reason) => {
    setUserName("");
    setPassword("");
    if (reason === "clickaway") {
      return;
    }

    setErrOpen(false);
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
      <Modal
        open={open}
        onClose={onClose}
        disableAutoFocus={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="Fw-popups"
      >
        <Box className="sm-modal p-3 p-md-4 ">
          <div className="modalBody_area  px-2 ">
            <h3 className="pb-2 text-center">Login</h3>

            <div>
              <form onSubmit={handleLogin} className="row px-3">
                <div className="col-md-12 login_inputStyle mb-3">
                  <div className="input-group">
                    <span className="input-group-text" id="basic-addon1">
                      <i className="fa-solid fa-envelope"></i>
                    </span>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      placeholder="Type your Email Address"
                      aria-label="email"
                      aria-describedby="basic-addon1"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
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
                      className="form-control"
                      placeholder="Type your password"
                      aria-label="password"
                      aria-describedby="basic-addon1"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="login_forgot text-start">
                  <Link onClick={onClose} to="/forgot-password">
                    Forgot Password?
                  </Link>
                </div>
                <div className="col-12 p-0">
                  <button
                    type="submit"
                    className="btn mt-3 fw-btn model_loginBTn w-100"
                  >
                    {isSubmitting ? (
                      <>
                        <CircularProgress size="16px" sx={{ color: "#fff" }} />
                      </>
                    ) : successLogin ? (
                      <img
                        className="successAnim"
                        src={SuccessTick}
                        alt="success"
                        srcSet=""
                      />
                    ) : (
                      "Login"
                    )}
                  </button>
                </div>
              </form>
            </div>
            <div className="text-center pt-3">
              <p className="have_account">
                Don’t have an account?{" "}
                <button onClick={SignUpModalOpen}>Signup</button>
              </p>
              <RegisterModal open={isOpen} onClose={SignUpClose} />
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
