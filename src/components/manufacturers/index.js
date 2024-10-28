import * as React from "react";
import { useRouter } from "next/navigation";

export default function Manufactures(props) {
  const { make } = props;

  console.log(make, "make");

  const history = useRouter();

  const openByMake = (makeName) => {
    history.push(`/search?mk=${makeName}&`);
  };

  const limitedMake = make?.slice(0, 12);

  return (
    <div className="container">
      <div className="row">
        {limitedMake &&
          limitedMake?.map((item) => (
            <div
              className="col-lg-2 col-4 my-2"
              key={item?.makeId}
              onClick={() => openByMake(item?.makeName)}
            >
              <div className="makeBtn text-center">
                <button className="btn w-100 h-100">
                  <img
                    src={`https://gallery.famewheels.com/images/makeLogos/${item?.makeImage}`}
                    alt={item?.makeName}
                    className="makeLogos"
                  />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
