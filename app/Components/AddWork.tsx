//@ts-nocheck
"use client";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { MdKeyboardArrowDown } from "react-icons/md";

export default function AddWork({ selectedDay, selectedMonth }) {
  const [task, setTask] = useState([]);
  const [event, setEvent] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [eventInput, setEventInput] = useState("");
  function CreateEvent({}) {
    setEvent([...event, eventInput]);
  }
  function CreateTask({}) {
    setTasks([...task, taskInput]);
  }
  return (
    <Box w={"100%"}>
      <Box w={"100%"} display={"flex"} justifyContent={"center"}>
        <Box>
          <Heading m={3}>
            {selectedDay} {selectedMonth}
          </Heading>
        </Box>
        <Box>
          <Box>
            <Menu>
              <MenuButton m={2} colorScheme="red" as={Button} rightIcon={<MdKeyboardArrowDown />}>
                Create
              </MenuButton>
              <MenuList>
                <Manu
                  manuTitle={"Event"}
                  handalBtn={CreateEvent}
                  work={eventInput}
                  setWork={setEventInput}
                />
                <Manu
                  manuTitle={"Task"}
                  handalBtn={CreateTask}
                  work={taskInput}
                  setWork={setTaskInput}
                />
              </MenuList>
            </Menu>
          </Box>
        </Box>
      </Box>
      <Box h={"50vh"} p={3} w={"100%"}>
        <HStack justifyContent={"space-between"} w={"70%"}>
            <Box h={"50%"}>
                <Heading>Event</Heading>
            </Box>
            <Box h={"50%"} >
                <Heading>Task</Heading>
            </Box>
        </HStack>
      </Box>
    </Box>
  );
}

function Manu({ manuTitle, handalBtn, work, setWork }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <MenuItem onClick={onOpen}>{manuTitle}</MenuItem>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{manuTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>{manuTitle}</FormLabel>
              <Input value={work} onChange={(e) => setWork(e.target.value)} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button onClick={handalBtn} colorScheme="blue">
              Add {manuTitle}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

/*


      <Box w={"100%"}>
        {
          <HStack justifyContent={"center"} w={"100%"}>
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
      


*/
