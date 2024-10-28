import React from 'react'
import NewCarInspectionIcon from "@/images/inspection-new-vector.png";
import Image from 'next/image';
import { Button } from '@mui/material';
import Link from 'next/link';

const CarInspectionBanner = () => {
  return (
    <>
    <div className="homeInspection_bg">
          <div className="container">
            <div className=" mt-5 py-5">
              <div className="row align-items-center">
                <div className="col-lg-6 col-12 text-center text-md-start ">
                  <h2 className="fw-bolder text-white fs-1">
                    <span className="">FameWheels</span> <br />
                    Car Inspection
                  </h2>
                  <p className="mt-4 text-white ">
                    Famewheels gives a proficient and solid car review benefit
                    over UAE. Whether you're in Karachi, Lahore, or
                    Islamabad, our utilized car inspection service is accessible
                    in all major cities
                  </p>
                  <Link href="/car-inspection">
                    <Button
                      variant="conatined"
                      className="bgSecondary mt-4 color-white text-capitalize fw_br border"
                    >
                      <i className="fa-solid fa-calendar-days me-2"></i>
                      Book Your Inspection
                    </Button>
                  </Link>
                </div>
                <div className="col-lg-6 col-12 text-md-end  text-center mt-5 mt-md-0 ">
                  <Image
                    src={NewCarInspectionIcon}
                    className="img-fluid home_InspectionVector "
                    alt="Famewheels car inspection"
                    srcSet=""
                    width={500}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  )
}

export default CarInspectionBanner