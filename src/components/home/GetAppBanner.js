import Image from "next/image";
import FWMobile from "@/images/mobile-mockup.png";
import GooglePlay from "@/images/google-play-badge.png";
import AppleStore from "@/images/app-store.jpg";
const GetAppBanner = () => {
  return (
    <>
      <div className="new-grad-bg">
        <div className="container mt-5">
          <div className="row align-items-center py-5 ">
            <div className="col-lg-7 col-12 text-center text-md-start  ">
              <h2 className="fw-bolder fs-1 pb-4">
                Get the FameWheels <br />{" "}
                <span className="color-secondary"> Mobile App</span>
              </h2>
              <div className="d-flex justify-content-center justify-content-md-start  ">
                <a
                  href="https://play.google.com/store/apps/details?id=com.famewheels"
                  target="_blank"
                >
                  <Image
                    style={{ height: 40, objectFit: "contain" }}
                    className="img-fluid"
                    src={GooglePlay}
                    alt="Famewheels Mobile App"
                    srcSet=""
                  />
                </a>
                <a
                  href="https://apps.apple.com/pk/app/famewheels-car-live-bidding/id6475592948"
                  target="_blank"
                >
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
};

export default GetAppBanner;
