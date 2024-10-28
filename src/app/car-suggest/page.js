"use client"
import React, { useState } from "react";
import SeoMeta from "@/components/meta";
import { Stepper, Step, StepLabel, Button } from "@mui/material";
import Step1 from "@/components/car-suggest/steps/step1";
import Step2 from "@/components/car-suggest/steps/step2";
import Step3 from "@/components/car-suggest/steps/step3";
import { useRouter } from "next/navigation";

const steps = ["Step 1", "Step 2", "Step 3"];

const page = () => {
  const histtory = useRouter();
  const [selected, setSelected] = useState(null);
  const [selectedMake, setSelectedMake] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const [maxPrice, setMaxPrice] = useState(null);
  const [minPrice, setMinPrice] = useState(null);

  const [activeStep, setActiveStep] = useState(0);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleFinish = () => {
    if (minPrice && maxPrice && selectedCity && selectedMake) {
      histtory.push(
        `/car-recommender?mk=${selectedMake}&ct=${selectedCity}&min=${minPrice}&mxp=${maxPrice}&`
      );
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <Step1
            selected={selected}
            setSelected={setSelected}
            setMaxPrice={setMaxPrice}
            setMinPrice={setMinPrice}
          />
        );
      case 1:
        return <Step2 selected={selectedMake} setSelected={setSelectedMake} />;
      case 2:
        return <Step3 selected={selectedCity} setSelected={setSelectedCity} />;

      default:
        return <div>Unknown stepIndex</div>;
    }
  };

  const selectDisable = () => {
    if (activeStep === 1 && selected === null) {
      return true;
    } else if (activeStep === 2 && selectedMake === null) {
      return true;
    } else if (activeStep === 3 && selectedCity === null) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <>
      <SeoMeta
        title="Car Suggest | FameWheels"
        desc="Thinking of buying a car? At FameWheeels.com, buy new and used cars, search by filter and preferences, compare cars, read latest news and updates!"
      />
      <div className=" suggestBg">
        <div className=" container suggestCarMain">
          <div className="bgWhite text-center suggestbody p-4 ">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                {activeStep !== 0 && (
                  <button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className="sugBackBtn"
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                )}
              </div>
              <h3 className=" fw-600 fs-5">
                <span
                  style={{ color: "#b80505", fontWeight: 800, fontSize: 30 }}
                >
                  FameWheels
                </span>{" "}
                Car Suggest
              </h3>
              <div></div>
            </div>
            <div className="w-50 m-auto">
              <Stepper
                className=" flex-wrap inspectorStepper"
                activeStep={activeStep}
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel></StepLabel>
                  </Step>
                ))}
              </Stepper>
            </div>

            <div className="inspectorForm_root mt-3">
              {activeStep === steps.length ? (
                <div>
                  <p>All steps completed</p>
                </div>
              ) : (
                <div>
                  <div>{getStepContent(activeStep)}</div>
                </div>
              )}
            </div>
            <div className="d-flex justify-content-end align-items-center mt-4">
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: selected === null ? "#eeeeee" : "#b80505",
                    color: selected === null ? "#9f9f9f" : "#ffffff",
                  }}
                  onClick={handleFinish}
                  disabled={selected === null}
                >
                  Finish
                </Button>
              ) : (
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: selected === null ? "#eeeeee" : "#b80505",
                    color: selected === null ? "#9f9f9f" : "#ffffff",
                  }}
                  onClick={handleNext}
                  disabled={selected === null}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
