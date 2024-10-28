import axios from "axios";
import Cookies from "js-cookie";
// import cookie from "cookie"; // For server-side cookie parsing

// Set token in cookies for client-side usage
const setAuthToken = (token) => {
  if (token) {
    // Store token in cookies (client-side)
    Cookies.set("token", token, { expires: 7 });

    // Set token in axios headers for all future requests
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    // Remove token from cookies and axios headers if no token is passed
    Cookies.remove("token");
    delete axios.defaults.headers.common["Authorization"];
  }
};

// Utility function to get token from cookies in SSR/Server Side
export const getTokenFromServerCookies = (req) => {
  if (!req || !req.headers || !req.headers.cookie) {
    return null;
  }

  const cookies = cookie.parse(req.headers.cookie || "");
  return cookies.token || null;
};

export default setAuthToken;



// How to Use auth.js and getTokenFromServerCookies in Next.js


// import { getTokenFromServerCookies } from "../auth/auth";

// export const getServerSideProps = async (context) => {
//   const token = getTokenFromServerCookies(context.req);

//   if (!token) {
//     return {
//       redirect: {
//         destination: "/login",
//         permanent: false,
//       },
//     };
//   }

//   // Fetch data for the authenticated user
//   const userData = await fetchUserData(token);

//   return {
//     props: {
//       userData,
//     },
//   };
// };
