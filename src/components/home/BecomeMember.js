import React from "react";
import Link from "next/link";
import { Button } from "@mui/material";
import FwBecomeMember from "@/images/famewheels-become-a-member.png";
import { useState, useEffect } from "react";
import Image from "next/image";

const BecomeMember = () => {
  const [bidAmount, setBidAmount] = useState("");
  useEffect(() => {
    const fetchBidAmount = async () => {
      try {
        const response = await axios.get(`${baseUrl}/getBidAmount`);

        setBidAmount(response?.data);
      } catch (error) {
        console.error("Error fetching bid amount:", error);
      }
    };

    fetchBidAmount();
  }, []);

  return (
    <>
      <div className="newColorGrad_bg">
        <div className="container mt-5 py-4">
          <div className="row align-items-center  py-4 rounded-3  ">
            <div className=" text-center text-md-start">
              <div className="text-center">
                <h5 className="m-0 text-white font-lato fs-4 fst-italic ">
                  Become a Member
                </h5>
                <h2 className=" fw-600 fs-2 color-white font-lato fst-italic pt-2 ">
                  <span className="">To Bid on </span> Your Favorite Car
                </h2>
              </div>
              <div className="row  my-5 align-items-center  ">
                <div className="col-lg-6 col-12 ">
                  <div className="row px-md-0 px-5">
                    <div className="col-lg-6 col-md-6 col-12 memberPricingCard p-4 text-white text-start ">
                      <h3>Normal User</h3>
                      <h5>Free</h5>
                      <p>
                        For those who want to look at auctions, but don't want
                        to bid.
                      </p>
                      <div className="text-start">
                        <ul>
                          <li>
                            <i class="fa-solid fa-check"></i>
                            <p>Just View Live Biddings</p>
                          </li>
                          <li>
                            <i class="fa-solid fa-xmark"></i>
                            <p>Bid on cars</p>
                          </li>
                          <li>
                            <i class="fa-solid fa-check"></i>
                            <p>Can avail other services accept Live Bidding</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-12 memberPricingCard p-4 text-white text-start ">
                      <h3>Verified Member</h3>
                      <h5>
                        Rs. {bidAmount?.bid_amount}
                        {/* <span>/ Single car </span> */}
                      </h5>
                      <p>For those who want to participate in auctions.</p>
                      <div className="text-start">
                        <ul>
                          <li>
                            <i className="fa-solid fa-check"></i>
                            <p>Join and bid in Live Biddings</p>
                          </li>
                          <li>
                            <i className="fa-solid fa-check"></i>
                            <p>Bid on Multiple Cars</p>
                          </li>
                          <li>
                            <i className="fa-solid fa-check"></i>
                            <p>Can avail other services accept Live Bidding</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-12 text-end">
                  <Image
                    src={FwBecomeMember}
                    className="ourBid_img2 mt-5 mt-md-0  "
                    alt="Famewheels Become a member"
                    srcSet=""
                  />
                </div>
              </div>
              <Link href="/become-a-member">
                <Button
                  variant="conatined"
                  className="bgSecondary my-2 color-white text-capitalize fw_br border "
                >
                  Become a Member
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BecomeMember;
