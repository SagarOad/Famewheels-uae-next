import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import SuccessTick from "@/images/success-tick.gif";
import { useAuthContext } from "@/hooks/useAuthContext.js";
import Cookies from "js-cookie";
import { Alert, Modal, Snackbar } from "@mui/material";
import InputMask from "react-input-mask";
import { AuthContext } from "@/context/AuthContext";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useGoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
// import FacebookLogin from "@greatsumini/react-facebook-login";

import { useSession, signIn, signOut } from "next-auth/react";

const xorEncrypt = (data, key) => {
  const encryptedData = data.split("").map((char, i) => {
    const keyChar = key.charCodeAt(i % key.length);
    const encryptedChar = char.charCodeAt(0) ^ keyChar;
    return String.fromCharCode(encryptedChar);
  });
  return encryptedData.join("");
};

export default function NumberLogin() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const { dispatch } = useAuthContext();
  const [phone, setPhone] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState(null);
  const [userName, setUserName] = useState("");
  const [successLogin, setSuccessLogin] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpPopup, setOtpPopup] = useState(false);
  const [loginOtpPopup, setLoginOtpPopup] = useState(false);
  const [loginViaEmail, setLoginViaEmail] = useState(1);
  const [loginToken, setLoginToken] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isValid, setisValid] = useState(true);
  const [isValidNum, setisValidNum] = useState(true);
  const [isValidSymbol, setisValidSymbol] = useState(true);
  const [isValidSmallLetter, setisValidSmallLetter] = useState(true);
  const [isValidCapitalLetter, setisValidCapitalLetter] = useState(true);
  const [isValidCommonWord, setisValidCommonWord] = useState(true);
  const [isValidMinimumChar, setisValidMinimumChar] = useState(true);
  const [passwordMatchError, setPasswordMatchError] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [isSignSubmitting, setIsSignSubmitting] = useState(false);
  const [successSignup, setSuccessSignup] = useState(false);

  // for facebook

  const [FBaccessToken, setFBaccessToken] = useState("");

  const handleResponse = (response) => {
    setFBaccessToken(response);
  };

  // const handleSuccess = (response) => {
  //   handleFacebookLogin(response);
  // };

  const handleError = (error) => {
    // console.log(error?.status, " facebook error  ");
    setError(error?.status);
    setErrOpen(true);
  };

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
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (password !== value) {
      setPasswordMatchError("Passwords did not match");
    } else {
      setPasswordMatchError("");
    }
  };

  const OtpClose = () => {
    setOtpPopup(false);
  };

  const loginOtpClose = () => {
    setLoginOtpPopup(false);
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("user_name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phone", phone);

      console.log("Form Data:", { name, email, password, phone });

      const response = await axios.post(`${baseUrl}/signup`, formData);

      if (response?.status === 200) {
        handleLogin(); // Trigger login if signup is successful
      } else {
        setError("Failed to register.");
      }
    } catch (err) {
      console.error("Signup Error:", err.response?.data);
      setError(
        err.response?.data?.error || "An error occurred during registration."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterViaEmail = async (e) => {
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
    try {
      setIsSubmitting(true);
      const response = await signIn("credentials", {
        redirect: false,
        email: userName,
        password,
      });

      if (response.ok) {
        setSuccessLogin(true);

        // Fetch the user session to get the token
        const session = await axios.get("/api/auth/session");
        const userResponse = await axios.get(`${baseUrl}/getUser`, {
          headers: {
            Authorization: `Bearer ${session.data.token}`, // Ensure token is from session
          },
        });

        const encryptedUserData = xorEncrypt(
          JSON.stringify(userResponse.data),
          "FameBusiness@214"
        );
        Cookies.set("%8564C%27", encryptedUserData, { expires: 7 });

        await dispatch({ type: "LOGIN", payload: userResponse.data });
        window.location.reload();
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError("Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const gLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => handleGoogleLogin(tokenResponse.access_token),
  });
  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  const [errOpen, setErrOpen] = useState(false);

  const sendOTP = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`${baseUrl}/sendotp`, {
        params: {
          login_type: "phone",
          phone: phoneNo,
        },
      });
      setOtpPopup(true);
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      console.error(error);
    }
  };

  return (
    <>
      <Snackbar
        open={errOpen}
        autoHideDuration={5000}
        onClose={() => setErrOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Alert
          onClose={() => setErrOpen(false)}
          severity="error"
          sx={{ width: "100%", backgroundColor: "#7eec1b" }}
        >
          {error}
        </Alert>
      </Snackbar>

      {loginViaEmail === 1 ? (
        <>
          <div className="">
            <h3
              style={{ textTransform: "unset" }}
              className="mb-0 text-black text-start fw-600 "
            >
              Welcome Back!
            </h3>
            <p
              style={{ fontSize: 14 }}
              className="pb-3 mb-0  text-dark text-start"
            >
              Login or Register to continue
            </p>

            <form className="row px-2">
              <div className="col-md-12 login_inputStyle">
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
                    placeholder="Mobile No. (03xx xxxxxxx)"
                    required
                    value={phoneNo}
                    minLength={11}
                    onChange={(e) => setPhoneNo(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12 p-0">
                <button
                  type="button"
                  style={{ fontSize: 15 }}
                  className="btn py-2 mt-3 fw-btn rounded-3 model_loginBTn w-100"
                  disabled={phoneNo.length !== 11 && !email}
                  onClick={sendOTP}
                  onChange={(e) => setPhoneNo(e.target.value)}
                >
                  {isSubmitting ? (
                    <CircularProgress size="16px" sx={{ color: "#fff" }} />
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </div>
            </form>
          </div>

          <div>
            <h4
              style={{ fontSize: 16, color: "#5d5353" }}
              className="text-center mt-3"
            >
              OR
            </h4>
            {/* <h4 className="fs-6 text-center fw-500">Continue with</h4> */}
          </div>

          <div className="row row-gap-3 py-2 px-2">
            <div className="col-12 px-1">
              <button
                onClick={() => setLoginViaEmail(2)}
                type="submit"
                className="btn  model_loginBTn w-100 border"
              >
                <i
                  style={{ color: "#20409a" }}
                  className="fa-solid fa-envelope me-1 "
                ></i>{" "}
                Continue with Email
              </button>
            </div>
            <div className="col-12 px-1 "></div>

            <div className="col-12 px-1">
              <button
                onClick={() => gLogin()}
                type="submit"
                className="btn  model_loginBTn w-100 border"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="20"
                  height="20"
                  className="me-2 mb-1"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  ></path>
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  ></path>
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                </svg>
                Continue with Google
              </button>
            </div>

            <div className="col-12 px-1"></div>
          </div>
        </>
      ) : loginViaEmail === 2 ? (
        <div className="px-2">
          <h3
            style={{ textTransform: "unset" }}
            className="mb-0 text-black text-start fw-600 "
          >
            Welcome Back!
          </h3>
          <p
            style={{ fontSize: 14 }}
            className="pb-3 mb-0  text-dark text-start"
          >
            Login to continue
          </p>

          <div>
            <form className="row px-3">
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
              <div className="col-md-12 login_inputStyle mb-1">
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
              <div className="login_forgot text-end px-0 ">
                <a href="/forgot-password">Forgot Password?</a>
              </div>
              <div className="col-12 p-0">
                <button
                  onClick={handleLogin}
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

          <h4
            style={{ fontSize: 16, color: "#5d5353" }}
            className="text-center mt-3"
          >
            OR
          </h4>
          <div className="row row-gap-3 pt-2 px-2">
            <div className="col-12 px-1">
              <button
                onClick={() => setLoginViaEmail(1)}
                type="submit"
                className="btn  model_loginBTn w-100 border"
              >
                <i
                  style={{ color: "#20409a" }}
                  className="fa-solid fa-phone me-2 "
                ></i>{" "}
                Continue with Mobile
              </button>
            </div>
          </div>
          <div className="text-center pt-2">
            <p className="have_account">
              Don’t have an account?{" "}
              <button onClick={() => setLoginViaEmail(3)}>Signup</button>
            </p>
            {/* <RegisterModal open={isOpen} onClose={SignUpClose} /> */}
          </div>
          <div className="text-center pt-3">
            <p className="privacyText">
              By continuing, you are agreeing to the{" "}
              <a href="/terms">terms of service</a> and{" "}
              <a href="/policy">privacy policy</a>
            </p>
          </div>
        </div>
      ) : (
        <div className="  px-2 ">
          <h3
            style={{ textTransform: "unset" }}
            className="mb-0 text-black text-start fw-600 "
          >
            Register
          </h3>
          <p
            style={{ fontSize: 14 }}
            className="pb-3 mb-0  text-dark text-start"
          >
            to continue using our services
          </p>

          <div>
            <form className="row px-3">
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
                        isValidMinimumChar ? "text-success" : "color-secondary"
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
                        isValidSmallLetter ? "text-success" : "color-secondary"
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
                      {" Password should not be a common word e.g (abcd,1234) "}
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
                  {/* <p className="error-message p-0">{passwordMatchError}</p> */}

                  <p
                    className={"color-secondary mt-2"}
                    style={{ fontSize: "12px" }}
                  >
                    <HighlightOffIcon color="error" sx={{ fontSize: "20px" }} />{" "}
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
                    minLength={11}
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
                  onClick={handleRegisterViaEmail}
                  type="submit"
                  className="btn mt-3 fw-btn model_loginBTn w-100"
                  disabled={
                    password !== confirmPassword ||
                    name === "" ||
                    email === "" ||
                    phone?.length !== 11 ||
                    !isValid
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
              <button onClick={() => setLoginViaEmail(2)}>Login</button>
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
      )}

      <VerifyOtp
        open={otpPopup}
        onClose={OtpClose}
        phone={email || phoneNo}
        password={password}
      />

      <VerifyEmailLoginOtp
        open={loginOtpPopup}
        onClose={loginOtpClose}
        email={userName}
        password={password}
        token={loginToken}
      />
    </>
  );
}

const VerifyOtp = ({ open, onClose, phone, password }) => {
  const [inputValues, setInputValues] = useState(["", "", "", "", "", ""]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successLogin, setSuccessLogin] = useState(false);
  const [error, setError] = useState("");
  const [otpViaEmail, setOTPViaEmail] = useState(false);

  const { dispatch } = useAuthContext();
  const { user } = React.useContext(AuthContext);

  useEffect(() => {
    document.getElementById("otp-input-0")?.focus();
  }, []);

  const handleInputChange = (index, event) => {
    const { value } = event.target;
    const newInputValues = [...inputValues];
    newInputValues[index] = value;

    setInputValues(newInputValues);

    if (index < inputValues.length - 1 && value !== "") {
      document.getElementById(`otp-input-${index + 1}`).focus();
    } else if (index > 0 && value === "") {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }

    const isButtonDisabled =
      newInputValues.some((input) => input === "") ||
      newInputValues.length < inputValues.length;
    setButtonDisabled(isButtonDisabled);
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedValue = (event.clipboardData || window.clipboardData).getData(
      "text"
    );
    const otpLength = inputValues.length;

    const newInputValues = [];

    for (let i = 0; i < otpLength; i++) {
      if (i < pastedValue.length) {
        newInputValues.push(pastedValue[i]);
      } else {
        newInputValues.push("");
      }
    }

    setInputValues(newInputValues);
  };

  const handleOtp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${baseUrl}/login`, {
        email: phone,
        password: password || inputValues.join(""),
      });

      localStorage.setItem("token", response.data.token);
      setSuccessLogin(true);
      setIsSubmitting(false);

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
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error);
      console.log(err.response?.data?.error);
      setIsSubmitting(false);
    }

    onClose();
  };

  const resendOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${baseUrl}/sendotp`, {
        params: {
          login_type: "phone",
          phone: phone,
        },
      });
    } catch (error) {
      console.error("Error on otp", error);
    }
  };

  const emailOtpClose = () => {
    setOTPViaEmail(false);
  };
  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        disableAutoFocus={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="Fw-popups"
      >
        <Box className="md-modal position-relative p-3 p-md-4">
          <div className="modalBody_area successBox  px-2 text-center ">
            <div className="row justify-content-center">
              <div className="col-12 col-md-6 col-lg-6" s>
                <div className="card bg-white mb-5 mt-5 border-0">
                  <div className="card-body  text-center">
                    <h4>Verify</h4>
                    <p>OTP was sent to you</p>

                    <form onSubmit={handleOtp}>
                      <div className="otp-field mb-4">
                        {inputValues.map((value, index) => (
                          <input
                            key={index}
                            type="number"
                            id={`otp-input-${index}`}
                            className="otp-field"
                            value={value}
                            onChange={(e) => handleInputChange(index, e)}
                            onPaste={handlePaste}
                            maxLength="1"
                          />
                        ))}
                      </div>
                      <div>
                        <button
                          style={{ width: "130px" }}
                          className={`${
                            buttonDisabled ? "" : "active"
                          } btn bgSecondary color-white mb-3`}
                          disabled={buttonDisabled}
                        >
                          {isSubmitting ? (
                            <>
                              <CircularProgress
                                size="16px"
                                sx={{ color: "#fff" }}
                              />
                            </>
                          ) : successLogin ? (
                            <img
                              className="successAnim"
                              src={SuccessTick}
                              alt="success"
                              srcSet=""
                            />
                          ) : (
                            <>Verify</>
                          )}
                        </button>
                      </div>
                    </form>

                    <p className="resend text-muted mb-0">
                      Didn't receive code?{" "}
                      <p
                        role="button"
                        onClick={resendOTP}
                        className="text-primary"
                      >
                        Request again
                      </p>
                      <p
                        role="button"
                        onClick={() => setOTPViaEmail(true)}
                        className="text-primary"
                      >
                        Request again via Email
                      </p>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="btn bgSecondary color-white popCloseBtn"
            >
              X
            </button>
          </div>
        </Box>
      </Modal>

      <ResendOTPViaEmail
        open={otpViaEmail}
        onClose={emailOtpClose}
        password={password}
        phone={phone}
      />
    </>
  );
};

const VerifyEmailLoginOtp = ({ open, onClose, email, token }) => {
  const [inputValues, setInputValues] = useState(["", "", "", "", "", ""]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successLogin, setSuccessLogin] = useState(false);
  const [error, setError] = useState("");

  const { dispatch } = useAuthContext();
  const { user } = React.useContext(AuthContext);

  useEffect(() => {
    document.getElementById("otp-input-0")?.focus();
  }, []);

  const handleInputChange = (index, event) => {
    const { value } = event.target;
    const newInputValues = [...inputValues];
    newInputValues[index] = value;

    setInputValues(newInputValues);

    if (index < inputValues.length - 1 && value !== "") {
      document.getElementById(`otp-input-${index + 1}`).focus();
    } else if (index > 0 && value === "") {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }

    const isButtonDisabled =
      newInputValues.some((input) => input === "") ||
      newInputValues.length < inputValues.length;
    setButtonDisabled(isButtonDisabled);
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedValue = (event.clipboardData || window.clipboardData).getData(
      "text"
    );
    const otpLength = inputValues.length;

    const newInputValues = [];

    for (let i = 0; i < otpLength; i++) {
      if (i < pastedValue.length) {
        newInputValues.push(pastedValue[i]);
      } else {
        newInputValues.push("");
      }
    }

    setInputValues(newInputValues);
  };

  const handleOtp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.get(`${baseUrl}/verifyOtp`, {
        params: {
          email: email,
          otp: inputValues.join(""),
        },
      });

      if (
        response.status === 200 &&
        response.data.message === "OTP verified successfully"
      ) {
        localStorage.setItem("token", token);
        setSuccessLogin(true);
        setIsSubmitting(false);

        const userResponse = await axios.get(`${baseUrl}/getUser`, {
          headers: {
            Authorization: `Bearer ${token}`,
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
        window.location.reload();
      }
    } catch (err) {
      setError(err.response?.data?.error);
      console.log(err.response?.data?.error);
      setIsSubmitting(false);
    }

    onClose();
  };

  const resendOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${baseUrl}/sendotp`, {
        params: {
          email: email,
        },
      });
    } catch (error) {
      console.error("Error on otp", error);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        disableAutoFocus={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="Fw-popups"
      >
        <Box className="md-modal position-relative p-3 p-md-4">
          <div className="modalBody_area successBox  px-2 text-center ">
            <div className="row justify-content-center">
              <div className="col-12 col-md-6 col-lg-6" s>
                <div className="card bg-white mb-5 mt-5 border-0">
                  <div className="card-body  text-center">
                    <h4>Verify</h4>
                    <p>OTP was sent to you</p>

                    <form onSubmit={handleOtp}>
                      <div className="otp-field mb-4">
                        {inputValues.map((value, index) => (
                          <input
                            key={index}
                            type="number"
                            id={`otp-input-${index}`}
                            className="otp-field"
                            value={value}
                            onChange={(e) => handleInputChange(index, e)}
                            onPaste={handlePaste}
                            maxLength="1"
                          />
                        ))}
                      </div>
                      <div>
                        <button
                          style={{ width: "130px" }}
                          className={`${
                            buttonDisabled ? "" : "active"
                          } btn bgSecondary color-white mb-3`}
                          disabled={buttonDisabled}
                        >
                          {isSubmitting ? (
                            <>
                              <CircularProgress
                                size="16px"
                                sx={{ color: "#fff" }}
                              />
                            </>
                          ) : successLogin ? (
                            <img
                              className="successAnim"
                              src={SuccessTick}
                              alt="success"
                              srcSet=""
                            />
                          ) : (
                            <>Verify</>
                          )}
                        </button>
                      </div>
                    </form>

                    <p className="resend text-muted mb-0">
                      Didn't receive code?{" "}
                      <p
                        role="button"
                        onClick={resendOTP}
                        className="text-primary"
                      >
                        Request again
                      </p>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="btn bgSecondary color-white popCloseBtn"
            >
              X
            </button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

const ResendOTPViaEmail = ({ open, onClose, phone }) => {
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successLogin, setSuccessLogin] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.getElementById("otp-input-0")?.focus();
  }, []);

  const handleOtp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.get(`${baseUrl}/sendOtpOnEmail`, {
        params: {
          phone: phone,
          email: inputValue,
        },
      });
      setSuccessLogin(true);
    } catch (err) {
      setError(err.response?.data?.error);
      console.log(err.response?.data?.error);
      setIsSubmitting(false);
    }

    onClose();
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        disableAutoFocus={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="Fw-popups"
      >
        <Box className="md-modal position-relative p-3 p-md-4">
          <div className="modalBody_area successBox  px-2 text-center ">
            <div className="row justify-content-center">
              <div className="col-12 col-md-6 col-lg-6" s>
                <div className="card bg-white mb-5 mt-5 border-0">
                  <div className="card-body  text-center">
                    <p>Enter your Email</p>

                    <form onSubmit={handleOtp}>
                      <div className=" mb-4">
                        <input
                          type="email"
                          id={`email`}
                          className="form-control"
                          onChange={(e) => setInputValue(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <button
                          style={{ width: "130px" }}
                          className={`${
                            isSubmitting ? "" : "active"
                          } btn bgSecondary color-white mb-3`}
                          disabled={isSubmitting}
                        >
                          <>Verify</>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="btn bgSecondary color-white popCloseBtn"
            >
              X
            </button>
          </div>
        </Box>
      </Modal>
    </>
  );
};
