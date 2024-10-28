import axios from "axios";
import React, { useState } from "react";
import Innerloader from "@/images/innerloader.gif";

const Step3 = ({ selected, setSelected }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [isLoading, setLoading] = useState(true);

  const [cities, setCities] = React.useState("");

  React.useEffect(() => {
    const fetchCity = async () => {
      try {
        const response = await axios.get(`${baseUrl}/cities`);

        setCities(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCity();
  }, []);

  const onSelect = (id) => {
    setSelected(id);
  };

  const limitedCityFR = cities?.slice(0, 10);

  return (
    <>
      <div className="container my-md-5">
        <h4>Select City</h4>
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
            {limitedCityFR &&
              limitedCityFR?.map((item) => (
                <div
                  onClick={() => setSelected(item?.cityName)}
                  key={item?.cityID}
                  className={`p-1 ${
                    selected === item?.cityName
                      ? "sug2Selected"
                      : "sug2UnSelected"
                  } col-lg-2 col d-flex gap-2 cursorPointer flex-column align-items-center boxShadow position-relative pt-3 `}
                  style={{ borderRadius: "12px" }}
                >
                  <img
                    src={`https://gallery.famewheels.com/images/cityIcon/${item?.cityimage}`}
                    alt={item?.cityName}
                    style={{
                      height: "50px",
                      width: "150px",
                      objectFit: "contain",
                    }}
                  />
                  <span className="fs-6">{item?.cityName}</span>
                  {selected === item?.cityName && (
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

export default Step3;
