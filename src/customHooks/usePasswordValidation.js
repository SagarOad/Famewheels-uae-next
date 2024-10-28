import { useState, useEffect } from "react";

const usePasswordValidation = (password) => {
  const [isValid, setisValid] = useState(true);
  const [isValidNum, setisValidNum] = useState(true);
  const [isValidSymbol, setisValidSymbol] = useState(true);
  const [isValidSmallLetter, setisValidSmallLetter] = useState(true);
  const [isValidCapitalLetter, setisValidCapitalLetter] = useState(true);
  const [isValidCommonWord, setisValidCommonWord] = useState(true);
  const [isValidMinimumChar, setisValidMinimumChar] = useState(true);

  useEffect(() => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?!.*(?:1234|abcd)).{8,}$/;
    const passwordNumRegex = /.*\d.*/;
    const passwordSymbolRegex = /.*[!@#$%&*_=].*/;
    const passwordCapitalLetterRegex = /.*[A-Z].*/;
    const passwordSmallLetterRegex = /.*[a-z].*/;
    const passwordCommonRegex = /^(?:(?!abcd|1234|123).)*$/;
    const passwordMinimunCharRegex = /^.{8,}$/;

    setisValid(passwordRegex.test(password));
    setisValidCommonWord(passwordCommonRegex.test(password));
    setisValidNum(passwordNumRegex.test(password));
    setisValidSymbol(passwordSymbolRegex.test(password));
    setisValidCapitalLetter(passwordCapitalLetterRegex.test(password));
    setisValidSmallLetter(passwordSmallLetterRegex.test(password));
    setisValidMinimumChar(passwordMinimunCharRegex.test(password));
  }, [password]);
  return {
    isValid,
    isValidNum,
    isValidSymbol,
    isValidSmallLetter,
    isValidCapitalLetter,
    isValidCommonWord,
    isValidMinimumChar,
  };
};

export default usePasswordValidation;
