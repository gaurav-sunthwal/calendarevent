//@ts-nocheck
"use client";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useMediaQuery,
  VStack,
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

  // Safe access to localStorage
  const getLocalStorageUserId = () => {
    try {
      return localStorage.getItem('userId') || null;
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  };

  const [userId, setUserId] = useState(getLocalStorageUserId);
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
        const userId = user.uid;
        setUserId(userId);
        try {
          localStorage.setItem('userId', userId); // Save userId to localStorage
        } catch (error) {
          console.error('Error saving to localStorage:', error);
        }
      } else {
        setUserId(null);
        try {
          localStorage.removeItem('userId'); // Remove userId from localStorage
        } catch (error) {
          console.error('Error removing from localStorage:', error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const [isAuthFormOpen, setAuthFormOpen] = useState(false);

  const handleButtonClick = () => {
    setAuthFormOpen(true);
  };

  const handleCloseAuthForm = () => {
    setAuthFormOpen(false);
  };

  if (!userId) {
    return (
      <VStack h={"60vh"} justifyContent={"center"}>
        <Heading>Please Login to your Account!!</Heading>
        <Button colorScheme="blue" onClick={handleButtonClick}>
          Get Started!!
        </Button>
        <Modal isOpen={isAuthFormOpen} onClose={handleCloseAuthForm}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Authentication</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <AuthenticationForm setGlobalUserName={() => {}} />
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={handleCloseAuthForm}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    );
  }

  return (
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
  );
};

export default Calender;