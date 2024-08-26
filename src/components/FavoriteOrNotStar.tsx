"use client";

import { useState, useEffect } from "react";
import { FaRegStar, FaStar } from "react-icons/fa6";
import axios from "axios";
import { useRouter } from "next/navigation";

const FavoriteOrNotStar = ({ symbol, userId }: { symbol: string; userId: string }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetching initial favorite status from the server
    const fetchFavoriteStatus = async () => {
      const response = await axios.get(`/api/favorite-status?symbol=${symbol}&userId=${userId}`);
      setIsFavorite(response.data.isFavorite);
    };
    fetchFavoriteStatus();
  }, [symbol, userId]);

  const handleFavoriteClick = async () => {
    setIsFavorite(!isFavorite);
    await axios.post('/api/toggle-favorite', { symbol, userId });
    router.refresh(); // Refreshing the page to update the favorite status
  };

  return (
    <p onClick={handleFavoriteClick} className="cursor-pointer">
      {isFavorite ? <FaStar className="text-yellow-500" /> : <FaRegStar className="text-yellow-500" />}
    </p>
  );
};

export default FavoriteOrNotStar;
