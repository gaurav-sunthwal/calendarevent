//@ts-nocheck

"use client";

import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { MdAccountCircle } from "react-icons/md";
import AuthenticationForm from "./AuthenticationForm";

export default function Navbar() {
  const [newUser, setNewUser] = useState(false);
  const [globalUserName, setGlobalUserName] = useState("");

  const handalCLick = () => {
    setNewUser(true);
  };
  return (
    <div>
      <HStack className="NavBar" p={2} justifyContent={"space-between"}>
        <Box>
          <Heading>My Calender</Heading>
        </Box>
        <Box>
          <HStack>
            { globalUserName === "" ? <>
              <Text>Login!! </Text>
              <AuthenticationForm setGlobalUserName={setGlobalUserName} />
            </>
                :  <Text>WelCome!! {globalUserName}</Text>
            }
          </HStack>
        </Box>
      </HStack>
    </div>
  );
}
