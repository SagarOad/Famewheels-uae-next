import React from "react";
import loader from "@/images/loader.gif";
import logo from "@/images/fame-wheels-logo.png";

const PreLoader = () => {
  return (
    <div>
      <div className="preloaderMain">
        <img className="loaderGif" src={loader} alt="loaderGif" srcSet={loader} />
        <img className="loaderLogo" src={logo} alt="logo" srcSet={logo} />
      </div>
    </div>
  );
};

export default PreLoader;
