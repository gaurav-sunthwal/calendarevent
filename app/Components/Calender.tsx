//@ts-nocheck
"use client";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import React, { useState } from "react";
import {
  Box,
  Button,
  Heading,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useMediaQuery,
} from "@chakra-ui/react";
import { MdKeyboardArrowDown } from "react-icons/md";
import Event from "./Event";
import Task from "./Task";
import AddWork from "./AddWork";

export default function Calender() {
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

  const [selectedDay, setSelectedDay] = useState(day);
  const [selectedMonth, setSelectedMonth] = useState(`${monthNames[month]}`);
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const handleDateChange = (date) => {
    const day = date.getDate();
    const month = date.getMonth();
    setSelectedDay(day);
    setSelectedMonth(monthNames[month]);
    console.log("Selected day:", day + " month:", monthNames[month]);
  };

  return (
    <>
      <HStack
        p={2}
        w={"100%"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
      >
        <Box p={2} maxW={isMobile ? "100%" : "30%"}>
          <Calendar onChange={handleDateChange} />
        </Box>
        <Box maxW={isMobile ? "100%" :  "70%"}>
          <AddWork selectedDay={selectedDay} selectedMonth={selectedMonth} />
        </Box>
        
      </HStack>
    </>
  );
}
