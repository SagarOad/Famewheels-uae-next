"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchCities = (baseUrl) => {
  const [cities, setCities] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${baseUrl}/cities`);
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      }
    };

    fetchCities();
  }, [baseUrl]);

  return { cities, error };
};

export default useFetchCities;
