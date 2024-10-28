"use client"
import React, { useState } from "react";
import freeAd from "@/images/sell-to-fw.png";
import biddingImg from "@/images/formVector.png";
import DoneIcon from "@mui/icons-material/Done";
import { Box, Button, Modal } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import SeoMeta from "@/components/meta";
import NumberLogin from "@/components/modals/loginModal/number";
import Image from "next/image";

const AdCategories = () => {
  const { user } = React.useContext(AuthContext);

  const history = useRouter();

  const navigateToBidding = () => {
    history.push("/sell-through-live-bidding");
  };

  const [isOpen, setIsOpen] = useState(false);

  const LoginOpen = () => {
    setIsOpen(true);
  };
  const LoginClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <SeoMeta
        title="Sell my car online | Famewheels"
        desc="Famewheels, a trusted platform in UAE, offers post-car ads. Sell your car online from anywhere with ease, and it connects you with potential buyers quickly."
        url="ad-category"
      />

      <div className=" colorBg_new d-none d-lg-block"></div>
      <div className="bg_post_category py-5">
        <h2 className="color-secondary fs-3 fw-600 text-center">
          Sell Your Car Online in UAE Instantly!
        </h2>
        <h4 className=" text-black fw-normal text-center mt-5">
          Choose How To Sell Your Car
        </h4>

        <div className="container mb-3 mt-2">
          <div className="row">
            <div className="col-md-4 p-2 ">
              <div className="bg-white  boxShadow rounded-3 p-3 rounded adCards">
                <p className="fs-4 text-center fw-600 text-black">
                  Post Ad on Famewheels
                </p>

                <div className="d-flex justify-content-center align-items-center flex-column mt-3">
                  <Image
                    src={freeAd}
                    alt="post-free-ad"
                    className="img-fluid object-fit-contain w-50 rounded"
                  />

                  <ul className="mt-3 saleSteps p-0">
                    <li className="gap-2">
                      <DoneIcon color="error" /> Post your Ad for Free in 3 Easy
                      Steps
                    </li>
                    <li className="gap-2">
                      <DoneIcon color="error" /> Get Genuine offers from
                      Verified Buyers
                    </li>
                    <li className="gap-2">
                      <DoneIcon color="error" /> Sell your car Fast at the Best
                      Price
                    </li>
                  </ul>

                  <div className="w-75 mt-2">
                    {user ? (
                      <Link href="/post-ad?Free-Ads">
                        <Button
                          variant="contained"
                          fullWidth
                          className="bgSecondary text-white px-4 mt-4 fw-normal text-capitalize fw-600"
                        >
                          Post Ad
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        variant="conatined"
                        onClick={LoginOpen}
                        fullWidth
                        className="bgSecondary text-white px-4 mt-4 fw-normal text-capitalize fw-600"
                      >
                        Post Your Ad
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4 p-2">
              <div className="bg-white  boxShadow rounded-3 p-3 rounded adCards">
                <p className="fs-4 text-center fw-600 text-black">
                  Sell Through Famewheels
                </p>

                <div className="d-flex justify-content-center align-items-center flex-column mt-3">
                  <Image
                    src={freeAd}
                    alt="post-free-ad"
                    className="img-fluid object-fit-contain w-50 rounded"
                  />

                  <ul className="mt-3 saleSteps p-0">
                    <li className="gap-2">
                      <DoneIcon color="error" /> Dedicated Sales Expert to Sell
                      your Car
                    </li>
                    <li className="gap-2">
                      <DoneIcon color="error" /> We Bargain for you and share
                      the Best Offer
                    </li>
                    <li className="gap-2">
                      <DoneIcon color="error" /> We ensure Safe & Secure
                      Transaction
                    </li>
                  </ul>

                  <small className="smallText mb-2">
                    * Service available only in Karachi
                  </small>

                  <div className="w-75 mt-2">
                    {user ? (
                      <Link href="/sell-through-famewheels">
                        <Button
                          variant="contained"
                          fullWidth
                          className="bgSecondary text-white px-4 py-2 fw-normal text-capitalize fw-600"
                        >
                          Sell For You
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        variant="conatined"
                        onClick={LoginOpen}
                        fullWidth
                        className="bgSecondary text-white px-4 py-2 fw-normal text-capitalize fw-600"
                      >
                        Post Your Ad
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4 p-2">
              <div className="bg-white  boxShadow rounded-3 p-3 rounded adCards">
                <p className="fs-4 text-center fw-600 text-black">
                  Sell Through Live Bidding
                </p>

                <div className="d-flex justify-content-center align-items-center flex-column mt-3">
                  <Image
                    src={biddingImg}
                    alt="bid-ad"
                    className="img-fluid object-fit-contain w-50 rounded"
                  />

                  <ul className="mt-3 saleSteps p-0">
                    <li className="gap-2">
                      <DoneIcon color="error" /> Dedicated Sales Expert to Sell
                      your Car
                    </li>
                    <li className="gap-2">
                      <DoneIcon color="error" /> We Bargain for you and share
                      the Best Offer
                    </li>
                    <li className="gap-2">
                      <DoneIcon color="error" /> We ensure Safe & Secure
                      Transaction
                    </li>
                  </ul>

                  <div className="w-75 mt-2">
                    {user ? (
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={navigateToBidding}
                        className="bgSecondary text-white px-4 py-2 fw-normal text-capitalize fw-600"
                      >
                        Sell By Bidding
                      </Button>
                    ) : (
                      <Button
                        variant="conatined"
                        onClick={LoginOpen}
                        fullWidth
                        className="bgSecondary text-white px-4 py-2 fw-normal text-capitalize fw-600"
                      >
                        Post Your Ad
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={isOpen}
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
      {/* <LoginModal open={isOpen} onClose={LoginClose} /> */}
    </>
  );
};

export default AdCategories;
