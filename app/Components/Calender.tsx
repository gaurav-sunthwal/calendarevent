//@ts-nocheck
"use client";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

import React, { useState } from "react";
import { Box, HStack, VStack } from "@chakra-ui/react";

export default function Calender() {
  const [selectedDay, setSelectedDay] = useState(null);

  const handleDateChange = (date) => {
    const day = date.getDate(); // Get the day value from the selected date
    setSelectedDay(day);
    console.log("Selected day:", day); // Log the selected day to the console
  };

  return (
    <HStack>
      <Box>
        <Calendar onChange={handleDateChange} />
      </Box>
      <Box>{selectedDay && <p>Selected Day: {selectedDay}</p>}</Box>
    </HStack>
  );
}
