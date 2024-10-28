import axios from "axios";
import React, { useState, useEffect } from "react";
import Innerloader from "@/images/innerloader.gif";

const Step2 = ({ selected, setSelected }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [make, setMake] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMake = async () => {
      try {
        const response = await axios.get(`${baseUrl}/byMake`);
        setMake(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMake();
  }, []);
  const limitedMakeFR = make?.slice(0, 10);

  return (
    <>
      <div className="container my-md-5">
        <h4>Which is your trusted brand?</h4>
        {isLoading ? (
          <div style={{ height: "200px" }} className="innerloaderMain">
            <img
              className="loaderGif"
              src={Innerloader}
              alt="loaderGif"
              srcSet={Innerloader}
            />
          </div>
        ) : (
          <div className="row justify-content-center align-items-center column-gap-3 row-gap-3 gap-5 mt-5 mb-3">
            {limitedMakeFR &&
              limitedMakeFR?.map((item) => (
                <div
                  onClick={() => setSelected(item?.makeName)}
                  key={item?.makeId}
                  className={`p-1 ${
                    selected === item?.makeName
                      ? "sug2Selected"
                      : "sug2UnSelected"
                  } col-lg-2 col d-flex gap-2 cursorPointer flex-column align-items-center boxShadow position-relative pt-3 `}
                  style={{ borderRadius: "12px" }}
                >
                  <img
                    src={`https://gallery.famewheels.com/images/makeLogos/${item?.makeImage}`}
                    alt={item?.makeName}
                    style={{
                      height: "50px",
                      width: "150px",
                      objectFit: "contain",
                    }}
                  />
                  <span className="fs-6">{item?.makeName}</span>
                  {selected === item?.makeName && (
                    <div className="sug2SelectCheck">
                      <i className="color-white fa-solid fa-check"></i>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Step2;
