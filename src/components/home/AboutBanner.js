import Link from "next/link"
import { Button } from "@mui/material"

const AboutBanner = () => {
    return (
        <>
        <div className=" mt-5 py-4">
          <div className=" about_bg ">
            <div className="container  py-5">
              <div className="col-lg-7 py-5 px-md-0 px-5">
                <h2 className="fw-bolder text-white fs-1">
                  About <br />
                  <span className="">FameWheels</span>
                </h2>
                <p className="mt-4 fs-6 text-white ">
                  FameWheels is a one-stop-shop for all your automobile related
                  needs. Since its inception, FameWheels has enabled UAE’s
                  automobile consumers to find reliable and trustworthy cars to
                  buy. Whether you need to buy a car, car inspection services,
                  or car insurance solutions, we are here to help you out with
                  the best choice in your budget. What makes us stand apart
                  among the competitors is our commitment to customer
                  satisfaction. Our crew members provide proper guidance to the
                  customers in finding the right vehicle.
                </p>
                <Link href="/about_us">
                  <Button
                    variant="conatined"
                    className="bgSecondary mt-4 color-white text-capitalize fw_br border"
                  >
                    view more
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        </>
    )
}

export default AboutBanner