"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchMake = (baseUrl) => {
  const [make, setMake] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchMake = async () => {
      try {
        const response = await axios.get(`${baseUrl}/byMake`);
        setMake(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      }
    };

    fetchMake();
  }, [baseUrl]);

  return { make, error };
};

export default useFetchMake;