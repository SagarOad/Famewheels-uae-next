import * as React from "react";
import { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import SuccessTick from "@/images/success-tick.gif";
import setAuthToken from "../../auth/auth.js";
import Cookies from "js-cookie";
import { useAuthContext } from "../../hooks/useAuthContext.js";

const xorEncrypt = (data, key) => {
  const encryptedData = data.split("").map((char, i) => {
    const keyChar = key.charCodeAt(i % key.length);
    const encryptedChar = char.charCodeAt(0) ^ keyChar;
    return String.fromCharCode(encryptedChar);
  });
  return encryptedData.join("");
};

const SignUpOtp = ({ open, onClose, email, sendDataToParent, password }) => {
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const [inputValues, setInputValues] = useState(["", "", "", "", "", ""]); // Initialize with the number of OTP fields you have
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successLogin, setSuccessLogin] = useState(false);
  const [error, setError] = useState("");

  const { dispatch } = useAuthContext();

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

      if (response?.status === 200) {
        try {
          const response = await axios.post(`${baseUrl}/login`, {
            email: email,
            password,
          });

          localStorage.setItem("token", response.data.token);
          setAuthToken(response.data.token);
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
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } catch (err) {
          setError(err.response?.data?.error);
          console.log(err.response?.data?.error);
          setIsSubmitting(false);
        }
      }

      setIsSubmitting(false);
      setSuccessLogin(true);
      const data = response?.data?.success;

      sendDataToParent(data);

      setTimeout(() => {
        setSuccessLogin(false);
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error on otp", error);
      setIsSubmitting(false);
    }
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
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        className='Fw-popups'
      >
        <Box className='md-modal position-relative p-3 p-md-4'>
          <div className='modalBody_area successBox  px-2 text-center '>
            <div className='row justify-content-center'>
              <div className='col-12 col-md-6 col-lg-6' s>
                <div className='card bg-white mb-5 mt-5 border-0'>
                  <div className='card-body  text-center'>
                    <h4>Verify</h4>
                    <p>OTP was sent to you via email</p>

                    <form onSubmit={handleOtp}>
                      <div className='otp-field mb-4'>
                        {inputValues.map((value, index) => (
                          <input
                            key={index}
                            type='number'
                            id={`otp-input-${index}`}
                            className='otp-field'
                            value={value}
                            onChange={(e) => handleInputChange(index, e)}
                            onPaste={handlePaste}
                            maxLength='1'
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
                                size='16px'
                                sx={{ color: "#fff" }}
                              />
                            </>
                          ) : successLogin ? (
                            <img
                              className='successAnim'
                              src={SuccessTick}
                              alt='success'
                              srcSet=''
                            />
                          ) : (
                            <>Verify</>
                          )}
                        </button>
                      </div>
                    </form>

                    <p className='resend text-muted mb-0'>
                      Didn't receive code?{" "}
                      <p
                        role='button'
                        onClick={resendOTP}
                        className='text-primary'
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
              className='btn bgSecondary color-white popCloseBtn'
            >
              X
            </button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default SignUpOtp;
