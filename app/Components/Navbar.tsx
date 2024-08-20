//@ts-nocheck
"use client";

import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Text,
  useColorMode,
  useColorModeValue,
  Stack,
  Menu,
  MenuButton,
  Avatar,
  Center,
  MenuItem,
  MenuDivider,
  MenuList,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Firebase_AUTH } from "../FirebaseConfig";
import { signOut } from "firebase/auth";

export default function Navbar() {
  const [globalUserName, setGlobalUserName] = useState("Guest");
  const [isMobile] = useMediaQuery("(max-width: 850px)");
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      const storedUserName = localStorage.getItem("userName");
      if (storedUserName) {
        setGlobalUserName(storedUserName);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(Firebase_AUTH);
      setGlobalUserName("Guest"); // Reset username to "Guest"
      localStorage.removeItem("userId"); // Clear user ID from localStorage
      localStorage.removeItem("userName"); // Clear userName from localStorage
      router.push("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box>
            <Text fontWeight={"700"} fontSize={"25px"}>
             Set My Day
            </Text>
          </Box>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>

              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar
                    size={"sm"}
                    name={globalUserName}
                  />
                </MenuButton>
                <MenuList alignItems={"center"}>
                  <br />
                  <Center>
                    <Avatar
                      size={"2xl"}
                      name={globalUserName}
                    />
                  </Center>
                  <br />
                  <Center>
                    <Text>
                      {globalUserName === "Guest"
                        ? "Guest"
                        : `Welcome!! ${globalUserName}`}
                    </Text>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem>{globalUserName}</MenuItem>
                  <MenuItem>Account Settings</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}