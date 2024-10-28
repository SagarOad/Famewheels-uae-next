import Button from "@mui/material/Button";
import React from "react";

const Step1 = ({ selected, setSelected, setMaxPrice, setMinPrice }) => {
  const onSelect = (id) => {
    setSelected(id);
    if (id === 1) {
      setMinPrice(100000);
      setMaxPrice(500000);
    } else if (id === 2) {
      setMinPrice(500000);
      setMaxPrice(1000000);
    } else if (id === 3) {
      setMinPrice(1000000);
      setMaxPrice(2000000);
    } else if (id === 4) {
      setMinPrice(2000000);
      setMaxPrice(3500000);
    } else if (id === 5) {
      setMinPrice(3500000);
      setMaxPrice(5000000);
    } else if (id === 6) {
      setMinPrice(5000000);
      setMaxPrice(50000000);
    }
  };

  return (
    <>
      <div
        className="container my-md-5 w-100 d-flex justify-content-center align-items-center gap-3"
        style={{ flexDirection: "column" }}
      >
        <h4>My dream car budget</h4>
        <div className="d-flex justify-content-center align-items-center gap-3">
          <Button
            variant="contained"
            className={`${
              selected === 1 ? "SugbtnSelected" : "SugbtnUnselect"
            }`}
            onClick={() => onSelect(1)}
          >
            1 lac - 5 lacs
          </Button>
          <Button
            variant="contained"
            className={`${
              selected === 2 ? "SugbtnSelected" : "SugbtnUnselect"
            }`}
            onClick={() => onSelect(2)}
          >
            5 lacs - 10 lacs
          </Button>
          <Button
            variant="contained"
            className={`${
              selected === 3 ? "SugbtnSelected" : "SugbtnUnselect"
            }`}
            onClick={() => onSelect(3)}
          >
            10 lacs - 20 lacs
          </Button>
        </div>

        <div className="d-flex justify-content-center align-items-center gap-3">
          <Button
            variant="contained"
            className={`${
              selected === 4 ? "SugbtnSelected" : "SugbtnUnselect"
            }`}
            onClick={() => onSelect(4)}
          >
            20 lacs - 35 lacs
          </Button>
          <Button
            variant="contained"
            className={`${
              selected === 5 ? "SugbtnSelected" : "SugbtnUnselect"
            }`}
            onClick={() => onSelect(5)}
          >
            35 lacs - 50 lacs
          </Button>
          <Button
            variant="contained"
            className={`${
              selected === 6 ? "SugbtnSelected" : "SugbtnUnselect"
            }`}
            onClick={() => onSelect(6)}
          >
            Above 50 lacs
          </Button>
        </div>
      </div>
    </>
  );
};

export default Step1;
