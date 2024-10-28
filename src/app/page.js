"use client";
import { useEffect, useState } from "react";
import TopSlider from "@/components/home/TopSlider";
import OurServices from "@/components/home/OurServices";
import CarCategory from "@/components/home/CarCategory";
import CarSuggest from "@/components/home/CarSuggest";
import FeaturedAds from "@/components/home/FeaturedAds";
import LiveBiddingBanner from "@/components/home/LiveBiddingBanner";
import ManagedByUsBanner from "@/components/home/ManagedByUsBanner";
import BecomeMember from "@/components/home/BecomeMember";
import PopularNewCars from "@/components/home/PopularNewCars";
import CarInspectionBanner from "@/components/home/CarInspectionBanner";
import NewLaunchedCars from "@/components/home/NewLaunchedCars";
import OurVideos from "@/components/home/OurVideos";
import AboutBanner from "@/components/home/AboutBanner";
import PaymentPartners from "@/components/home/PaymentPartners";
import GetAppBanner from "@/components/home/GetAppBanner";
// import useFetchMake from "@/customHooks/useFetchMake";
// import useFetchCities from "@/customHooks/useFetchCities";

export default function Home() {
 const ClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
//  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
 console.log(ClientId, "ClientId")
  return (
    <>
      <TopSlider />
      <OurServices />
      <CarCategory />
      <CarSuggest />
      <FeaturedAds />
      <LiveBiddingBanner />
      <ManagedByUsBanner />
      <BecomeMember />
      <PopularNewCars />
      <CarInspectionBanner />
      <NewLaunchedCars />
      <OurVideos />
      <AboutBanner />
      <PaymentPartners />
      <GetAppBanner />
    </>
  );
}
