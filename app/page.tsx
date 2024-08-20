//@ts-nocheck
"use client";

import Image from "next/image";
import Calender from "./Components/Calender";
import { Box, useMediaQuery } from "@chakra-ui/react";

export default function Home() {
  const [isMobile] = useMediaQuery("(max-width: 850px)");
  return (
    <>
      <Box h={isMobile ? "auto" : "80vh"}>
        <Calender />
      </Box>
      
    </>
  );
}
