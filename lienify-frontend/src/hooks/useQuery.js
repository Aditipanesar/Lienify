//import { useQuery } from "react-query"


import { useQuery } from "@tanstack/react-query";
import api from "../api/api";

export const useFetchMyShortUrls = (token, onError) => {
  return useQuery({
    queryKey: ["my-shortenurls",token],
    enabled: !!token,
    queryFn: async () => {
      const res = await api.get("/api/urls/myurls", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      });

      return res.data;
    },

    select: (data) => {
      const sortedData = data.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
      return sortedData;
    },

    onError,
    staleTime: 5000,
  });
};


export const useFetchTotalClicks = (token, onError) => {
  return useQuery({
    queryKey: ["url-totalclick",token],
    enabled: !!token,
    queryFn: async () => {
      const res = await api.get(
        // "/api/urls/totalClicks?startDate=2024-01-01&endDate=2025-12-31",
         "api/urls/totalClicks?startDate=2026-02-16&endDate=2027-02-25",
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      return res.data;
    },

    select: (data) => {
      const convertToArray = Object.keys(data).map((key) => ({
        clickDate: key,
        count: data[key],
      }));

      return convertToArray;
    },

    onError,
    staleTime: 5000,
  });
};