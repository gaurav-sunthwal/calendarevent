//@ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
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
  VStack,
  Text,
  Divider,
  useDisclosure,
  useMediaQuery,
  Textarea,
} from "@chakra-ui/react";
import { MdKeyboardArrowDown } from "react-icons/md";
import {
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { Firebase_DB } from "../FirebaseConfig";

export default function AddWork({ selectedDay, selectedMonth, userId }) {
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [eventInput, setEventInput] = useState("");
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [editingEventIndex, setEditingEventIndex] = useState(null);
  const [isMobile] = useMediaQuery("(max-width: 850px)");
  const {
    isOpen: isTaskModalOpen,
    onOpen: onTaskModalOpen,
    onClose: onTaskModalClose,
  } = useDisclosure();

  const {
    isOpen: isEventModalOpen,
    onOpen: onEventModalOpen,
    onClose: onEventModalClose,
  } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return; // Early return if userId is not available

      const docRef = doc(Firebase_DB, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTasks(data.tasks?.[`${selectedDay}-${selectedMonth}`] || []);
        setEvents(data.events?.[`${selectedDay}-${selectedMonth}`] || []);
      } else {
        setTasks([]);
        setEvents([]);
      }
    };

    fetchData();
  }, [userId, selectedDay, selectedMonth]); // Added userId to the dependency array

  const createEvent = async () => {
    if (eventInput.trim()) {
      const newEvents = [...events, eventInput];
      setEvents(newEvents);
      await updateDoc(doc(Firebase_DB, "users", userId), {
        [`events.${selectedDay}-${selectedMonth}`]: arrayUnion(eventInput),
      });
      setEventInput("");
    }
  };

  const createTask = async () => {
    if (taskInput.trim()) {
      const newTasks = [...tasks, taskInput];
      setTasks(newTasks);
      await updateDoc(doc(Firebase_DB, "users", userId), {
        [`tasks.${selectedDay}-${selectedMonth}`]: arrayUnion(taskInput),
      });
      setTaskInput("");
    }
  };

  const editTask = (index) => {
    if (tasks.length > 0 && index !== null) {
      const taskToEdit = tasks[index];
      setTaskInput(taskToEdit);
      setEditingTaskIndex(index);
      onTaskModalOpen();
    }
  };

  const saveEditedTask = async () => {
    if (taskInput.trim() && editingTaskIndex !== null && tasks.length > 0) {
      const updatedTasks = [...tasks];
      updatedTasks[editingTaskIndex] = taskInput;

      setTasks(updatedTasks);
      await updateDoc(doc(Firebase_DB, "users", userId), {
        [`tasks.${selectedDay}-${selectedMonth}`]: updatedTasks,
      });

      setEditingTaskIndex(null);
      setTaskInput("");
      onTaskModalClose();
    }
  };

  const deleteTask = async (index) => {
    if (tasks.length > 0 && index !== null) {
      const taskToDelete = tasks[index];

      if (taskToDelete) {
        const newTasks = tasks.filter((_, i) => i !== index);
        setTasks(newTasks);
        await updateDoc(doc(Firebase_DB, "users", userId), {
          [`tasks.${selectedDay}-${selectedMonth}`]: newTasks,
        });
      }
    }
  };

  const editEvent = (index) => {
    if (events.length > 0 && index !== null) {
      const eventToEdit = events[index];
      setEventInput(eventToEdit);
      setEditingEventIndex(index);
      onEventModalOpen();
    }
  };

  const saveEditedEvent = async () => {
    if (eventInput.trim() && editingEventIndex !== null && events.length > 0) {
      const updatedEvents = [...events];
      updatedEvents[editingEventIndex] = eventInput;

      setEvents(updatedEvents);
      await updateDoc(doc(Firebase_DB, "users", userId), {
        [`events.${selectedDay}-${selectedMonth}`]: updatedEvents,
      });

      setEditingEventIndex(null);
      setEventInput("");
      onEventModalClose();
    }
  };

  const deleteEvent = async (index) => {
    if (events.length > 0 && index !== null) {
      const eventToDelete = events[index];

      if (eventToDelete) {
        const newEvents = events.filter((_, i) => i !== index);
        setEvents(newEvents);
        await updateDoc(doc(Firebase_DB, "users", userId), {
          [`events.${selectedDay}-${selectedMonth}`]: newEvents,
        });
      }
    }
  };

  return (
    <Box w={"100%"} p={4}>
      <HStack w={"100%"} justifyContent={"space-between"}>
        <Heading m={3}>
          {selectedDay} {selectedMonth}
        </Heading>
        <Menu>
          <MenuButton
            m={2}
            colorScheme="red"
            as={Button}
            rightIcon={<MdKeyboardArrowDown />}
          >
            Create
          </MenuButton>
          <MenuList>
            <MenuItemWithModal
              title={"Task"}
              onAdd={createTask}
              value={taskInput}
              setValue={setTaskInput}
            />
            <MenuItemWithModal
              title={"Event"}
              onAdd={createEvent}
              value={eventInput}
              setValue={setEventInput}
            />
          </MenuList>
        </Menu>
      </HStack>

      <Divider my={4} w={"70%"} />

      <HStack spacing={6} w={"100%"} alignItems={"start"} flexWrap={"wrap"}>
        <Box
          w={isMobile ? "100%" : "33%"}
          position={isMobile ? "normal" : "absolute"}
          h={"50vh"}
          p={4}
          borderWidth={1}
          borderRadius={"md"}
        >
          <Heading size="md" mb={4}>
            Events
          </Heading>
          {events.length > 0 ? (
            events.map((item, index) => (
              <HStack key={index} justifyContent="space-between" p={2}>
                <Box>
                  <Text fontSize="lg">{item}</Text>
                </Box>
                <HStack>
                  <Button size="sm" onClick={() => editEvent(index)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => deleteEvent(index)}
                  >
                    Delete
                  </Button>
                </HStack>
              </HStack>
            ))
          ) : (
            <Text>No events added for this day.</Text>
          )}
        </Box>
        <Box
          w={isMobile ? "100%" : "33%"}
          h={"50vh"}
          position={isMobile ? "normal" : "absolute"}
          right={10}
          p={4}
          borderWidth={1}
          borderRadius={"md"}
        >
          <Heading size="md" mb={4}>
            Tasks
          </Heading>
          {tasks.length > 0 ? (
            tasks.map((item, index) => (
              <HStack key={index} justifyContent="space-between" p={2}>
                <Box>
                  <Text fontSize="lg">{item}</Text>
                </Box>
                <HStack>
                  <Button size="sm" onClick={() => editTask(index)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => deleteTask(index)}
                  >
                    Delete
                  </Button>
                </HStack>
              </HStack>
            ))
          ) : (
            <Text>No tasks added for this day.</Text>
          )}
        </Box>
      </HStack>

      {isTaskModalOpen && (
        <Modal isOpen={isTaskModalOpen} onClose={onTaskModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Task</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Task</FormLabel>
                <Textarea
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  placeholder="Enter task"
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onTaskModalClose}>
                Close
              </Button>
              <Button onClick={saveEditedTask} colorScheme="blue">
                Save Changes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {isEventModalOpen && (
        <Modal isOpen={isEventModalOpen} onClose={onEventModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Event</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Event</FormLabel>
                <Input
                  value={eventInput}
                  onChange={(e) => setEventInput(e.target.value)}
                  placeholder="Enter event"
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onEventModalClose}>
                Close
              </Button>
              <Button onClick={saveEditedEvent} colorScheme="blue">
                Save Changes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
}

function MenuItemWithModal({ title, onAdd, value, setValue }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleAdd = () => {
    onAdd();
    onClose();
  };

  return (
    <>
      <MenuItem onClick={onOpen}>{title}</MenuItem>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>{title}</FormLabel>
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`Enter ${title.toLowerCase()}`}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleAdd} colorScheme="blue">
              Add {title}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
