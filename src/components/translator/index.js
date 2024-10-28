import { useEffect } from "react";

const googleTranslateElementInit = () => {
  new window.google.translate.TranslateElement(
    {
      pageLanguage: "en",
      includedLanguages: "ur,en",
      layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false,
    },
    "google_translate_element"
  );
};

const useGoogleTranslate = () => {
  useEffect(() => {
    const addScript = document.createElement("script");

    addScript.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    addScript.async = true;

    document.body.appendChild(addScript);

    window.googleTranslateElementInit = googleTranslateElementInit;

    return () => {
      document.body.removeChild(addScript);
    };
  }, []);
};

export default useGoogleTranslate;
