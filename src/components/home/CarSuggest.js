import Link from "next/link";
import CarSuggestionIcon from "@/images/car-suggestion-icon-1.png";
import Image from "next/image";
import { useState, useEffect } from "react";

const CarSuggest = () => {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="pt-5">
        <div className="wantBecomeColor">
          <div
            style={{ backgroundSize: `${(2 * scrollY) / 30}% auto` }}
            className="wantBecome container py-5 "
          >
            <h5 className="fw-700 font-lato text-center ">
              FameWheels Car Suggest
            </h5>
            <div className=" bg_blur px-5 py-5 my-3 d-md-flex text-center text-md-start justify-content-between align-items-center">
              <div>
                <h3 className="font-lato">
                  Not Sure, <br /> <span>Which car to buy?</span>
                </h3>
                <p>Let us help you find the dream car</p>
              </div>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <Image
                  src={CarSuggestionIcon}
                  alt="car suggestion"
                  srcSet={CarSuggestionIcon}
                />
                <Link href="/car-suggest">
                  <button
                    type="button"
                    className="btn bgWhite fw_br px-4 py-2 fw-600 mt-3 mt-md-0 text-capitalize"
                    style={{ fontSize: 15 }}
                  >
                    Show me best car
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CarSuggest;
