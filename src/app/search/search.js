// src/app/search/page.jsx

import SearchResult from "./page";
import axios from "axios";

// Function to fetch data server-side
async function getPostsData(filters, page) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const category = filters.category || 0;
  const search = filters.search || "";
  const make = filters.make || 0;
  const model = filters.model || [];
  const year = filters.year || [];
  const city = filters.city || 0;
  const mileage = filters.mileage || 0;
  const transmition = filters.transmition || "";
  const fuel = filters.fuel || "";
  const adType = filters.adType || "";
  const minPrice = filters.minPrice || 0;
  const maxPrice = filters.maxPrice || 50000000;

  try {
    const response = await axios.get(`${baseUrl}/webfilterpost`, {
      params: {
        page,
        search_name: search,
        city_name: city,
        makeName: make,
        modelName: model,
        year_id: year,
        price_from: minPrice,
        price_to: maxPrice,
        engine_capacity: category,
        mileage: mileage,
        transmition: transmition,
        enginetype: fuel,
        addtype: adType,
        condition: "used",
      },
    });

    return {
      posts: response?.data?.posts?.data || [],
      featuredAds: response?.data?.featured_adds?.data || [],
      totalPages: response?.data?.posts?.last_page || 0,
      freeAdCount: response?.data?.addcount || 0,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      posts: [],
      featuredAds: [],
      totalPages: 0,
      freeAdCount: 0,
    };
  }
}

// Server-side data fetching
export default async function SearchPage() {
  const filters = {}; // you can pass default or dynamic filters here
  const page = 1; // initial page

  const data = await getPostsData(filters, page);

  return (
    <>
      <SearchResult
        initialPosts={data.posts}
        featuredAds={data.featuredAds}
        totalPages={data.totalPages}
        freeAdCount={data.freeAdCount}
        initialFilters={filters}
        initialPage={page}
      />
    </>
  );
}
