"use client"; // Mark this file as a Client Component

import { SessionProvider } from "next-auth/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthContextProvider } from "@/context/AuthContext";

export default function Providers({ children }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <AuthContextProvider>
        <SessionProvider>{children}</SessionProvider>
      </AuthContextProvider>
    </GoogleOAuthProvider>
  );
}
