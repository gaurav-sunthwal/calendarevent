//@ts-nocheck

"use client";

import {
  Box,
  Heading,
  HStack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { MdAccountCircle } from "react-icons/md";
import AuthenticationForm from "./AuthenticationForm";

export default function Navbar() {
  const [globalUserName, setGlobalUserName] = useState("");
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  return (
    <div>
      <HStack className="NavBar" p={2} justifyContent={"space-between"}>
        <Box maxW={"50%"}>
          <Heading fontSize={isMobile ? "5vw" : "3vw"}>Make My Today</Heading>
        </Box>
        <Box maxW={"50%"}>
          <HStack>
            {globalUserName === "" ? (
              <>
                <Text>Login!! </Text>
                <AuthenticationForm setGlobalUserName={setGlobalUserName} />
              </>
            ) : (
              <Text textAlign={"center"}>Welcome!! {globalUserName}</Text>
            )}
          </HStack>
        </Box>
      </HStack>
    </div>
  );
}