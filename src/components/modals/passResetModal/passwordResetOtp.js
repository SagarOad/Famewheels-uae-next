import { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import SuccessTick from "@/images/success-tick.gif";

const ResetOtp = ({ open, onClose, email, sendDataToParent }) => {
  const [inputValues, setInputValues] = useState(["", "", "", "", "", ""]); // Initialize with the number of OTP fields you have
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successLogin, setSuccessLogin] = useState(false);

  useEffect(() => {
    document.getElementById("otp-input-0")?.focus();
  }, []);

  const handleInputChange = (index, event) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
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
      const response = await axios.get(`${baseUrl}/passwordcode`, {
        params: {
          email: email,
          token: inputValues.join(""),
        },
      });

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
                    <p>OTP was sent to you via email</p>

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
                      <a href="/forgot-password">Request again</a>
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

export default ResetOtp;
