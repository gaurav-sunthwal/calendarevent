//@ts-nocheck
"use client"

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  HStack,
  useMediaQuery,
} from "@chakra-ui/react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AuthenticationForm from "./AuthenticationForm";
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

  const handleDateChange = (date) => {
    const day = date.getDate();
    const month = date.getMonth();
    setSelectedDay(day);
    setSelectedMonth(monthNames[month]);
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!userId) {
    return <AuthenticationForm setGlobalUserName={() => {}} />;
  }

  return (
    <>
      <HStack p={2} w={"100%"} flexWrap={"wrap"}>
        <Box p={2} maxW={isMobile ? "100%" : "30%"}>
          <Calendar onChange={handleDateChange} />
        </Box>
        <Box maxW={isMobile ? "100%" : "100%"}>
          <AddWork
            selectedDay={selectedDay}
            selectedMonth={selectedMonth}
            userId={userId}
          />
        </Box>
      </HStack>
    </>
  );
};

export default Calender;