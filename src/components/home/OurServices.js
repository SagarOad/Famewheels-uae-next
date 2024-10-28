import BuyBidding from "@/images/services-icon/buy-bidding.png";
import CarsBidding from "@/images/cars-live-bidding.webp";
import FwInspection from "@/images/services-icon/famewheels-inspection.png";
import SellFamewheels from "@/images/services-icon/sell-famewheels.png";
import InsuranceIcon from "@/images/services-icon/car-insurance-icon.png";
import FinanceIcon from "@/images/services-icon/car-finance-icon.png";

import Image from "next/image";
import Link from "next/link";
import Button from "@mui/material/Button";

const OurServices = () => {
  return (
    <>
      <div className="container">
        <div className="row my-5 d-none d-lg-flex ">
          <div className="col-lg-6 col-md-12 col-12 m-0 pe-2 ">
            <div className=" services_bg1 m-2 p-4 ">
              <div className=" d-flex flex-column justify-content- align-items-end px-3 ">
                <h2 className="text-end pb-2 color-white font-lato ">
                  <span>Sell Through</span>
                  <br />
                  Live Bidding
                </h2>
                <Link href="/sell-through-live-bidding">
                  <Button
                    variant="contained"
                    className=" bg-white color-secondary fs-6 fw-600 text-capitalize fw_br"
                  >
                    Sell Now
                  </Button>
                </Link>
              </div>
              <div>
                <Image
                  className="img-fluid "
                  src={CarsBidding}
                  alt="cars live bidding"
                />
              </div>
            </div>
            <div className=" services_bg4 m-2 p-4 boxShadow ">
              <div className="justify-content-between align-items-center px-3 mb-auto ">
                <h2 className="text-start pb-2 color-black font-lato ">
                  <span>Buy Through</span>
                  <br />
                  Live Bidding
                </h2>
                <Link href="/bidding">
                  <Button
                    variant="contained"
                    className=" bgSecondary color-white fs-6 fw-600 text-capitalize fw_br"
                  >
                    Buy Now
                  </Button>
                </Link>
              </div>
              <div className="text-end">
                <Image
                  className="img-fluid "
                  src={BuyBidding}
                  alt="cars live bidding"
                />
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-6 m-0 pe-2 d-flex flex-column justify-content-between ">
            <div className=" services_bg2 m-2 p-3 ">
              <div className=" text-center justify-content-between align-items-center px-3 ">
                <h2 className="text-center pb-1 color-black font-lato ">
                  <span>Car</span>
                  <br />
                  Inspection
                </h2>
                <Link href="/car-inspection">
                  <Button
                    variant="contained"
                    className="bgSecondary color-white fs-6 fw-bold text-capitalize fw_br"
                  >
                    Book Now
                  </Button>
                </Link>
              </div>
              <div className="text-center">
                <Image
                  className="img-fluid "
                  src={FwInspection}
                  alt="cars live bidding"
                />
              </div>
            </div>
            <div className=" services_bg5 m-2 p-3 ">
              <div className=" text-center justify-content-between align-items-center px-3 ">
                <h2 className="text-center pb-1 color-white font-lato ">
                  <span>Sell Through</span>
                  <br />
                  Famewheels
                </h2>
                <Link href="/ad-category">
                  <Button
                    variant="contained"
                    className="bg-white color-secondary fs-6 fw-bold text-capitalize fw_br"
                  >
                    Sell Now
                  </Button>
                </Link>
              </div>
              <div className="text-center">
                <Image
                  className="img-fluid "
                  src={SellFamewheels}
                  alt="cars live bidding"
                />
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-6 m-0 pe-2 d-flex flex-column justify-content-between ">
            <div className=" services_bg3 m-2 p-3 ">
              <div className=" text-center justify-content-between align-items-center px-3 ">
                <h2 className="text-center pb-1 color-black font-lato ">
                  <span>Car</span>
                  <br />
                  Insurance
                </h2>
                <Link href="/car-insurance">
                  <Button
                    variant="contained"
                    className="bgSecondary color-white fs-6 fw-bold text-capitalize fw_br"
                  >
                    Book Now
                  </Button>
                </Link>
              </div>
              <div className="text-center">
                <Image
                  className="img-fluid "
                  src={InsuranceIcon}
                  alt="cars live bidding"
                />
              </div>
            </div>
            <div className=" services_bg6 m-2 p-3 ">
              <div className=" text-center justify-content-between align-items-center px-3 ">
                <h2 className="text-center pb-1 color-white font-lato ">
                  <span>Car</span>
                  <br />
                  Finance
                </h2>
                <Link href="/car-finance">
                  <Button
                    variant="contained"
                    className="bg-white color-secondary fs-6 fw-bold text-capitalize fw_br"
                  >
                    Sell Now
                  </Button>
                </Link>
              </div>
              <div>
                <Image
                  className="img-fluid "
                  src={FinanceIcon}
                  alt="cars live bidding"
                  layout="responsive"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OurServices;
