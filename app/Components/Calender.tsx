//@ts-nocheck
"use client";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  HStack,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import dynamic from "next/dynamic";

// Dynamically import AuthenticationForm with SSR disabled
const AuthenticationForm = dynamic(() => import("./AuthenticationForm"), {
  ssr: false,
});
import AddWork from "./AddWork";

const Calender = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const day = String(currentDate.getDate()).padStart(2, "0");

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [userId, setUserId] = useState(null);
  const [selectedDay, setSelectedDay] = useState(day);
  const [selectedMonth, setSelectedMonth] = useState(`${monthNames[month]}`);
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [isAuthFormOpen, setAuthFormOpen] = useState(false);

  const handleDateChange = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.getMonth();
    setSelectedDay(day);
    setSelectedMonth(monthNames[month]);
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      console.warn("localStorage is not available");
      return;
    }

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        setUserId(userId);
        try {
          localStorage.setItem("userId", userId);
        } catch (error) {
          console.error("Error saving to localStorage:", error);
        }
      } else {
        setUserId(null);
        try {
          localStorage.removeItem("userId");
        } catch (error) {
          console.error("Error removing from localStorage:", error);
        }
      }
    });

    // Initialize userId from localStorage
    try {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }

    return () => unsubscribe();
  }, []);

  const handleButtonClick = () => {
    setAuthFormOpen(true); // Set state to show AuthenticationForm
  };

  const handleCloseAuthForm = () => {
    setAuthFormOpen(false); // Set state to hide AuthenticationForm
  };

  if (!userId) {
    return (
      <VStack h={"60vh"} justifyContent={"center"}>
        <Heading>Please Login to your Account!!</Heading>

        <AuthenticationForm setGlobalUserName={() => {}} />
      </VStack>
    );
  }

  return (
    <HStack p={2} w={"100%"} flexWrap={"wrap"}>
      <VStack p={2} maxW={isMobile ? "100%" : "30%"}>
        <Calendar onChange={handleDateChange} />
      </VStack>
      <Box maxW={isMobile ? "100%" : "100%"}>
        <AddWork
          selectedDay={selectedDay}
          selectedMonth={selectedMonth}
          userId={userId}
        />
      </Box>
    </HStack>
  );
};

export default Calender;