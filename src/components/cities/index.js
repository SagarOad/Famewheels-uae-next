import * as React from "react";
import { useRouter } from "next/navigation";

export default function Cities(props) {
  const { cities } = props;

  const history = useRouter();

  const openByCity = (cityName) => {
    history.push(`/search?ct=${cityName}&`);
  };

  return (
    <div className="container">
      <div className="row">
        {cities &&
          cities.map((item) => (
            <div
              className="col-lg-2 col-4 my-2"
              key={item?.cityID}
              onClick={() => openByCity(item?.cityName)}
            >
              <div className="makeBtn text-center">
                <button className="btn w-100 h-100">
                  <img
                    src={`https://gallery.famewheels.com/images/cityIcon/${item?.cityimage}`}
                    alt={item?.cityName}
                  />
                </button>
                <div>
                  <h6 className="pb-1 mt-1">{item?.cityName}</h6>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
