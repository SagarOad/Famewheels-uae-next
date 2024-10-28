import React from "react";
import Innerloader from "@/images/innerloader.gif";

const InnerLoader = () => {
  return (
    <div className="h-100">
      <div className="innerloaderMain">
        <img className="loaderGif" src={Innerloader} alt="loaderGif" srcSet={Innerloader} />
      </div>
    </div>
  );
};

export default InnerLoader;
