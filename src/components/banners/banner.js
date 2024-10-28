import React from "react";
import FwBecomeMember from "@/images/famewheels-become-a-member.png";
import Link from "next/link";
import { Button } from "@mui/material";
import Image from "next/image";

export function MemberBanner() {
  return (
    <div className="container">
      <div className="pb-4">
        <div className="row grad-bg align-items-center memberAdvs px-2 px-md-5 py-4 rounded-3  ">
          <div className="col-lg-5 col-md-4 col-6 ">
            <h5 className="text-white">Bid on</h5>
            <h5 className="text-white">Your Favorite Car</h5>
          </div>
          <div className="col-lg-3 col-md-4 col-6 text-end text-md-center  ">
            <Link href="/become-a-member">
              <Button
                variant="conatined"
                className="bg-white color-secondary text-capitalize"
              >
                Become a member
              </Button>
            </Link>
          </div>
          <div className="col-lg-4 col-md-4 d-none d-md-block  text-end">
            <Image
              src={FwBecomeMember}
              className="banner_img"
              alt="Famewheels Become a member"
              srcSet=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CarSuggest() {
  return (
    <div className="container">
      <div className="wantBecome bg-dark my-3 d-md-flex text-center text-md-start justify-content-between align-items-center">
        <div>
          <h5 className="fw-700 fs-5 ">Famewheels Car Suggest</h5>
          <h3 className="fs-4">Not Sure, Which car to buy?</h3>
          <p>Let us help you find the dream car</p>
        </div>
        <div>
          <Link href="/car-suggest">
            <button
              type="button"
              className="btn bgWhite px-4 py-2 fw-600 mt-3 mt-md-0 text-capitalize"
              style={{ fontSize: 15 }}
            >
              Show me best car
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
