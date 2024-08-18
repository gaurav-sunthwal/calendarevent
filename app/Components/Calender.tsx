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
} from "@chakra-ui/react";
import { MdKeyboardArrowDown } from "react-icons/md";
import Event from "./Event";
import Task from "./Task";

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

  const handleDateChange = (date) => {
    const day = date.getDate();
    const month = date.getMonth();
    setSelectedDay(day);
    setSelectedMonth(monthNames[month]);
    console.log("Selected day:", day + " month:", monthNames[month]);
  };
  function CreateEvent({}) {}
  function CreateTask({}) {}
  return (
    <>
      <HStack p={2}>
        <Box p={2}>
          <Calendar onChange={handleDateChange} />
        </Box>
      </HStack>
      <Box>
      <Box>
          {
            <HStack justifyContent={"center"}>
              <Heading>
                {selectedDay} {selectedMonth}
              </Heading>
              <Box>
                <Menu>
                  <MenuButton as={Button} rightIcon={<MdKeyboardArrowDown />}>
                    Create
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={CreateEvent}>New Event</MenuItem>
                    <MenuItem onClick={CreateEvent}>Task</MenuItem>
                  </MenuList>
                </Menu>
              </Box>
            </HStack>
          }
        </Box>
      </Box>
    </>
  );
}
