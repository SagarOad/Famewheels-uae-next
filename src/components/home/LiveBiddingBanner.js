import React from 'react'
import Link from 'next/link'
import { Button } from '@mui/material'
import Image from 'next/image'
import OurLiveBiddings from "@/images/our-live-bidding.png";
import Lottie from "lottie-react";
import LiveAnimation from "@/images/json/live.json";


const LiveBiddingBanner = () => {
  return (
    <>
    <div className="container-fluid">
          <div className="container">
            <div className="row newColorGrad_bg align-items-center px-5 py-4 rounded-3  ">
              <div className="col-lg-6 text-center text-md-start  ">
                <h2 className=" fw-600 fs-1 color-white font-lato fst-italic">
                  <span className="fs-3">Join Cars </span> <br />
                  Live Bidding
                </h2>
                <Link href="/bidding">
                  <Button
                    variant="conatined"
                    className="bgSecondary my-2 color-white text-capitalize fw_br"
                  >
                    <Lottie
                      style={{ height: 30, width: "fit-content" }}
                      animationData={LiveAnimation}
                      loop
                    />{" "}
                    Join Live Biddings
                  </Button>
                </Link>
              </div>
              <div className="col-lg-6 text-end">
                <Image
                  src={OurLiveBiddings}
                  className="ourBid_img  "
                  alt="Famewheels Live Bidding"
                  srcSet=""
                />
              </div>
            </div>
          </div>
        </div>
    </>
  )
}

export default LiveBiddingBanner