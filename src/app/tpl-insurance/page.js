"use client";

import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import CarInsuranceHero from "@/images/car-insurance-hero-image.png";
import Step1 from "@/images/insurance-step1.png";
import Step2 from "@/images/insurance-step2.png";
import Step3 from "@/images/insurance-step3.png";
import Image from "next/image";
import FWMobile from "@/images/mobile-mockup.png";
import GooglePlay from "@/images/google-play-badge.png";
import AppleStore from "@/images/app-store.jpg";

export default function TplInsurance() {

  return (
    <>
      <div
        style={{ paddingTop: "11%" }}
        className="container-fluid bgHeroGradient pb-5 "
      >
        <div className="container pb-0 pb-md-4 ">
          <div className="row align-items-center flex-column-reverse flex-md-row ">
            <div className="col-lg-7 col-12  text-start ">
              <h2 className="fw-bold color-white fs-2">
                <span className="fw-bold fs-1">TPL Insurance</span>
              </h2>
              <Image
                width={500}
                height={500}
                className="topBanner_img img-fluid "
                src={CarInsuranceHero}
                alt="Car Insurance"
              />
            </div>
            <div className="col-lg-5 col-12 mb-5 mb-md-0 ">
              <div className="inspectionFormbox px-4 py-5 ">
                <div>
                  <h4 className="text-white fw-bold text-center pb-3 fs-4">
                    Get a Quote
                  </h4>
                </div>
                <form className=" postAdForm  ">
                  <div className="row mb-3">
                    <div className="col-12 col-4">
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="inspectionVehicle"
                          aria-describedby="inspectionVehicleHelp"
                          placeholder="Your Name"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12 col-4">
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="inspectionVehicle"
                          aria-describedby="inspectionVehicleHelp"
                          placeholder="Your Phone"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12 col-4">
                      <div className="mb-3">
                        <input
                          type="email"
                          className="form-control"
                          id="inspectionVehicle"
                          aria-describedby="inspectionVehicleHelp"
                          placeholder="You Email"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12 col-4">
                      <div className="mb-3">
                        <select
                          className="form-control"
                          id="inspectionVehicle"
                          aria-describedby="inspectionVehicleHelp"
                          required
                        >
                          <option value="" disabled selected>
                            Health Insurance
                          </option>
                          <option value="option1">Option 1</option>
                          <option value="option2">Option 2</option>
                          <option value="option3">Option 3</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-12 col-4">
                      <div className="mb-3">
                        <textarea
                          rows={4}
                          type="text"
                          className="form-control"
                          id="inspectionVehicle"
                          aria-describedby="inspectionVehicleHelp"
                          placeholder="You Email"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>



      <div className="container py-5">
        <h2 className="fw-bold color-black fs-2 text-center ">
          Pakistan's Leading Insurech{" "}
        </h2>
        <p className=" text-center">
          We protect your assets by capitalizing on cutting-edge technology,
          backed by
        </p>
        <div className="row justify-content-center">
          <div className="col-lg-4 col-md-4 col-12 d-flex flex-column px-5 px-md-3 mt-4   ">
            <div className=" d-flex justify-content-center">
              <Image
                width={80}
                height={80}
                src={Step1}
                alt="step 1"
                srcSet={Step1}
              />
            </div>
            <div className="ms-3 mt-2 text-center text-black">
              <h5>Health</h5>
              <p>Guarding your well being, always reassured and supported </p>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 col-12 p-2 d-flex flex-column px-5 px-md-3 mt-4  ">
            <div className=" d-flex justify-content-center">
              <Image
                width={80}
                height={80}
                src={Step2}
                alt="step 2"
                srcSet={Step2}
              />
            </div>
            <div className="ms-3 mt-2 text-center text-black">
              <h5>Home</h5>
              <p>
                Explore the peace of mind offered by TPL Home Insurance, where
                we recognize your home as more than a physical space
              </p>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 col-12 p-2 d-flex flex-column px-5 px-md-3 mt-4   ">
            <div className=" d-flex justify-content-center">
              <Image
                width={80}
                height={80}
                src={Step3}
                alt="step 3"
                srcSet={Step3}
              />
            </div>
            <div className="ms-3 mt-2 text-center text-black">
              <h5>Auto</h5>
              <p>
                {" "}
                Embarking on the journey of purchasing a car is more than just
                acquiring a vehicle
              </p>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 col-12 p-2 d-flex flex-column px-5 px-md-3 mt-4   ">
            <div className=" d-flex justify-content-center">
              <Image
                width={80}
                height={80}
                src={Step3}
                alt="step 3"
                srcSet={Step3}
              />
            </div>
            <div className="ms-3 mt-2 text-center text-black">
              <h5>Travel</h5>
              <p>
                {" "}
                Embark on worry-free travel adventures with TPL Insurance’s
                meticulously designed Travel Insurance
              </p>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 col-12 p-2 d-flex flex-column px-5 px-md-3 mt-4   ">
            <div className=" d-flex justify-content-center">
              <Image
                width={80}
                height={80}
                src={Step3}
                alt="step 3"
                srcSet={Step3}
              />
            </div>
            <div className="ms-3 mt-2 text-center text-black">
              <h5>Bike</h5>
              <p> Embark on worry-free rides with our Bike Insurance</p>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 col-12 p-2 d-flex flex-column px-5 px-md-3 mt-4   ">
            <div className=" d-flex justify-content-center">
              <Image
                width={80}
                height={80}
                src={Step3}
                alt="step 3"
                srcSet={Step3}
              />
            </div>
            <div className="ms-3 mt-2 text-center text-black">
              <h5>Cyber Security</h5>
              <p>
                {" "}
                As technology advances, so do the complexities of cyber threats
              </p>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 col-12 p-2 d-flex flex-column px-5 px-md-3 mt-4   ">
            <div className=" d-flex justify-content-center">
              <Image
                width={80}
                height={80}
                src={Step3}
                alt="step 3"
                srcSet={Step3}
              />
            </div>
            <div className="ms-3 mt-2 text-center text-black">
              <h5>Mobile</h5>
              <p>
                {" "}
                Experience the convenience and security of TPL Mobile Insurance
              </p>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 col-12 p-2 d-flex flex-column px-5 px-md-3 mt-4   ">
            <div className=" d-flex justify-content-center">
              <Image
                width={80}
                height={80}
                src={Step3}
                alt="step 3"
                srcSet={Step3}
              />
            </div>
            <div className="ms-3 mt-2 text-center text-black">
              <h5>Paw</h5>
              <p>
                {" "}
                Experience a groundbreaking leap forward in pet care with
                Pawsurance
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row pb-5 justify-content-center">
          <div className="col-lg-3 col-6  d-flex justify-content-center align-items-center ">
            <div className="StepperCount">400K+</div>
            <div className="OurSteppers">
              <h6 className="text-capitalize ">Customer Served</h6>
            </div>
          </div>

          <div className="col-lg-3 col-6 d-flex justify-content-center align-items-center ">
            <div className="StepperCount">AA</div>
            <div className="OurSteppers">
              <h6 className="text-capitalize ">PACRA Rating</h6>
            </div>
          </div>

          <div className="col-lg-3 col-6 d-flex justify-content-center align-items-center ">
            <div className="StepperCount">300+</div>
            <div className="OurSteppers">
              <h6 className="text-capitalize ">Employee Nationwide</h6>
            </div>
          </div>
        </div>
      </div>

      <div className="new-grad-bg">
        <div className="container mt-5">
          <div className="row align-items-center py-5 ">
            <div className="col-lg-7 col-12 text-center text-md-start  ">
              <h2 className="fw-bolder pb-2">
                Why TPL Insurance{" "}
                <span className="color-secondary"> Mobile App?</span>
              </h2>
              <p>
                Earn reward points by paying premium timely and redeem them on
                TPL Insurance Market Place with exciting discounts.
              </p>

              <div className=" mt-5">
                <h2 className="fw-bolder pb-2">Want To Earn </h2>
                <p>
                  Invite friends and family through TPL Insurance Mobile App and
                  earn reward points to get amazing discounts on renewal.
                </p>
              </div>
              <div className="d-flex justify-content-center justify-content-md-start  ">
                <a href="#">
                  <Image
                    style={{ height: 40, objectFit: "contain" }}
                    className="img-fluid"
                    src={GooglePlay}
                    alt="Famewheels Mobile App"
                    srcSet=""
                  />
                </a>
                <a href="#">
                  <Image
                    style={{ height: 40, objectFit: "contain" }}
                    className="img-fluid mx-2"
                    src={AppleStore}
                    alt="Famewheels Apple App"
                    srcSet=""
                  />
                </a>
              </div>
            </div>

            <div className="col-lg-5 text-center text-md-end mt-5 mt-md-0 ">
              <Image
                src={FWMobile}
                className="img-fluid w-75"
                style={{ height: 320, objectFit: "contain" }}
                alt="Famewheels Live Bidding"
                srcSet=""
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
