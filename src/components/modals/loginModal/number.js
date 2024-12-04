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

  const handleSuccess = (response) => {
    handleFacebookLogin(response);
  };

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
      const emailVerify = await axios.get(`${baseUrl}/sendotp`, {
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
      const response = await axios.post(`${baseUrl}/login`, {
        email: userName,
        password,
      });
      if (response?.status === 200) {
        setLoginToken(response?.data?.token);

        if (response?.data?.otp === 0) {
          const otpRes = await axios.get(`${baseUrl}/sendotp`, {
            params: {
              email: userName,
            },
          });
          if (otpRes.status === 200) {
            setIsSubmitting(false);
            setLoginOtpPopup(true);
          }
        } else {
          localStorage.setItem("token", response.data.token);
          setSuccessLogin(true);

          const userResponse = await axios.get(`${baseUrl}/getUser`, {
            headers: {
              Authorization: `Bearer ${response?.data?.token}`,
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
          // setLoading(false);
          setTimeout(() => {
            setLoginOtpPopup(false);
            window.location.reload();
          }, 1000);
        }
      }
    } catch (err) {
      setError(err.response.data?.error);
      setIsSubmitting(false);
      setErrOpen(true);
    }
  };

  const gLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => handleGoogleLogin(tokenResponse.access_token),
  });
  const handleGoogleLogin = React.useCallback(async (accessToken) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const creds = await response.json();

      const formData = new FormData();

      formData.append("user_name", creds?.name);
      formData.append("email", creds?.email);
      formData.append("password", creds?.name + "EWRjsdlk");
      formData.append("phone", "-");
      formData.append("role_id", 2);
      formData.append("auth_type", "social");

      const res = await axios.post(`${baseUrl}/signup`, formData);

      localStorage.setItem("token", res.data.token);
      setSuccessLogin(true);
      setIsSubmitting(false);

      const userResponse = await axios.get(`${baseUrl}/getUser`, {
        headers: {
          Authorization: `Bearer ${res.data.token}`,
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
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.log("ERROR HAPPENED now", err);
      setError("Google Login Failed");
      setIsSignSubmitting(false);
      setErrOpen(true);
    }
  }, []);

  const handleFacebookLogin = React.useCallback(async (response) => {
    try {
      // const response = await fetch(
      //   "https://www.googleapis.com/oauth2/v3/userinfo",
      //   {
      //     headers: {
      //       Authorization: `Bearer ${accessToken}`,
      //     },
      //   }
      // );

      const creds = response;

      const formData = new FormData();

      formData.append("user_name", creds?.name);
      formData.append("email", creds?.email);
      formData.append("password", creds?.name + "EWRjsdlk");
      formData.append("phone", "-");
      formData.append("role_id", 2);
      formData.append("auth_type", "social");

      const res = await axios.post(`${baseUrl}/signup`, formData);

      localStorage.setItem("token", res.data.token);
      setSuccessLogin(true);
      setIsSubmitting(false);

      const userResponse = await axios.get(`${baseUrl}/getUser`, {
        headers: {
          Authorization: `Bearer ${res.data.token}`,
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
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.log("ERROR HAPPENED now", err);
      setError("Facebok Login Failed! Try Again");
      setIsSignSubmitting(false);
      setErrOpen(true);
    }
  }, []);

  const [errOpen, setErrOpen] = React.useState(false);

  const handleBarClose = (event, reason) => {
    setUserName("");
    setPassword("");
    if (reason === "clickaway") {
      return;
    }

    setErrOpen(false);
  };

  useScript(appleAuthHelpers.APPLE_SCRIPT_SRC);

  const handleAppleLogin = async () => {
    // const storedEmail = localStorage.getItem("apple_email");

    // if (!storedEmail) {
    try {
      const response = await appleAuthHelpers.signIn({
        authOptions: {
          clientId: "com.famewheelsweb.app",
          scope: "email name",
          redirectURI: "https://www.famewheels.com",
          state: "state",
          nonce: "nonce",
          usePopup: true,
        },
        onError: (error) =>
          console.error("ERROR IN APPLE LOGIN PROMISE", error),
      });

      if (response) {
        const data = jwtDecode(response?.authorization?.id_token);
        const email = data?.email;

        const formData = new FormData();

        formData.append("user_name", "fame user");
        formData.append("email", email);
        formData.append("password", "EWRjsdlk");
        formData.append("phone", "-");
        formData.append("role_id", 2);
        formData.append("auth_type", "social");

        const res = await axios.post(`${baseUrl}/signup`, formData);

        localStorage.setItem("token", res.data.token);
        setSuccessLogin(true);
        setIsSubmitting(false);

        const userResponse = await axios.get(`${baseUrl}/getUser`, {
          headers: {
            Authorization: `Bearer ${res.data.token}`,
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
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        console.error("Error performing handleAppleLogin.");
      }
    } catch (err) {
      console.error(err);
      setError("Apple Login Failed");
      setIsSignSubmitting(false);
      setErrOpen(true);
    }
    //   } else {
    //     try {
    //       const formData = new FormData();

    //       formData.append("user_name", "fame user");
    //       formData.append("email", email);
    //       formData.append("password", "EWRjsdlk");
    //       formData.append("phone", "-");
    //       formData.append("role_id", 2);
    //       formData.append("auth_type", "social");

    //       const res = await axios.post(`${baseUrl}/signup`, formData);

    //       localStorage.setItem("token", res.data.token);
    //       setSuccessLogin(true);
    //       setIsSubmitting(false);

    //       const userResponse = await axios.get(`${baseUrl}/getUser`, {
    //         headers: {
    //           Authorization: `Bearer ${res.data.token}`,
    //         },
    //       });

    //       const encryptedUserData = xorEncrypt(
    //         JSON.stringify(userResponse.data),
    //         "FameBusiness@214"
    //       );
    //       Cookies.set("%8564C%27", encryptedUserData, {
    //         expires: 7,
    //       });

    //       await dispatch({ type: "LOGIN", payload: userResponse.data });
    //       // setLoading(false);
    //       setTimeout(() => {
    //         window.location.reload();
    //       }, 1000);
    //     } catch (err) {
    //       console.error(err);
    //       setError("Apple Login Failed");
    //       setIsSignSubmitting(false);
    //       setErrOpen(true);
    //     }
    //   }
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
              <div className="col-md-12 login_inputStyle ">
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
                  onClick={handleRegister}
                  type="submit"
                  style={{ fontSize: 15 }}
                  className="btn py-2 mt-3 fw-btn rounded-3 model_loginBTn w-100"
                  disabled={phoneNo.length !== 11}
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
            <div className="col-12 px-1 ">
              <FacebookLogin
                appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                onSuccess={handleResponse}
                onFail={handleError}
                onProfileSuccess={handleSuccess}
                // style={{
                //   backgroundColor: "#4267b2",
                //   color: "#fff",
                //   fontSize: "16px",
                //   padding: "10px 20px",
                //   border: "none",
                //   borderRadius: "4px",
                //   cursor: "pointer",
                // }}
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
                    fill="#3F51B5"
                    d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"
                  ></path>
                  <path
                    fill="#fff"
                    d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"
                  ></path>
                </svg>
                Continue with Facebook
              </FacebookLogin>
            </div>

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

            <div className="col-12 px-1">
              <button
                onClick={handleAppleLogin}
                className="btn  model_loginBTn w-100 border"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="20"
                  height="20"
                  className="me-2 mb-1"
                  viewBox="0 0 50 50"
                >
                  <path d="M 44.527344 34.75 C 43.449219 37.144531 42.929688 38.214844 41.542969 40.328125 C 39.601563 43.28125 36.863281 46.96875 33.480469 46.992188 C 30.46875 47.019531 29.691406 45.027344 25.601563 45.0625 C 21.515625 45.082031 20.664063 47.03125 17.648438 47 C 14.261719 46.96875 11.671875 43.648438 9.730469 40.699219 C 4.300781 32.429688 3.726563 22.734375 7.082031 17.578125 C 9.457031 13.921875 13.210938 11.773438 16.738281 11.773438 C 20.332031 11.773438 22.589844 13.746094 25.558594 13.746094 C 28.441406 13.746094 30.195313 11.769531 34.351563 11.769531 C 37.492188 11.769531 40.8125 13.480469 43.1875 16.433594 C 35.421875 20.691406 36.683594 31.78125 44.527344 34.75 Z M 31.195313 8.46875 C 32.707031 6.527344 33.855469 3.789063 33.4375 1 C 30.972656 1.167969 28.089844 2.742188 26.40625 4.78125 C 24.878906 6.640625 23.613281 9.398438 24.105469 12.066406 C 26.796875 12.152344 29.582031 10.546875 31.195313 8.46875 Z"></path>
                </svg>
                Continue with Apple
              </button>
            </div>
          </div>
        </>
      ) : loginViaEmail === 2 ? (
        <div className="px-2">
          {/* <button
            title="back"
            onClick={() => setLoginViaEmail(1)}
            className="btn  rounded-pill"
            style={{
              backgroundColor: "#ededed",
              fontSize: "10px",
              fontWeight: 500,
            }}
          >
            <i class="fa-solid fa-chevron-left me-2 "></i>
            Login with No.
          </button> */}
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
          {/* <button
            title="back"
            onClick={() => setLoginViaEmail(1)}
            className="btn  rounded-pill"
            style={{
              backgroundColor: "#ededed",
              fontSize: "10px",
              fontWeight: 500,
            }}
          >
            <i class="fa-solid fa-chevron-left me-2 "></i>
            Login with No.
          </button> */}
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
