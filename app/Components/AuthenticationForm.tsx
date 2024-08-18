//@ts-nocheck
"use client";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
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
import React, { useEffect, useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { Firebase_AUTH, Firebase_DB } from "../FirebaseConfig.js";
import { MdAccountCircle } from "react-icons/md";
import { doc, getDoc, setDoc } from "firebase/firestore";
import SIgnInOps from "../components/SIgnInOps";
import toast, { Toaster } from "react-hot-toast";

export default function AuthenticationForm({ setGlobalUserName }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setNewUser] = useState(false);
  const [isDone, setItDone] = useState(true);
  const [userName, setUserName] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Error!! Please enter both email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(Firebase_AUTH, email, password);
      const user = userCredential.user;
      const userId = Firebase_AUTH.currentUser;

      if (userId) {
        const userDoc = await getDoc(doc(Firebase_DB, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userName = userData.name;
          setUserName(userName);
          setGlobalUserName(userName); // Set global username
          toast.success(`Success! Welcome back, ${userName}!`);
          setItDone(true);
          onClose(); // Close the modal
        } else {
          toast.error("User data not found.");
        }
      } else {
        setItDone(false);
        toast.error("Error retrieving user ID.");
      }
    } catch (error) {
      toast.error(`Login Error: ${error.message}`);
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !name) {
      toast.error("Error Please fill in all fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(Firebase_AUTH, email, password);
      const user = userCredential.user;
      await setDoc(doc(Firebase_DB, "users", user.uid), {
        name: name,
        email: email,
        createdAt: new Date(),
      });
      setGlobalUserName(name); // Set global username
      toast.success("Success Account created successfully!");
      setItDone(true);
      onClose(); // Close the modal
    } catch (error) {
      toast.error(`Registration Error, ${error.message} `);
    }
  };

  return (
    <div>
      <Toaster />
      <Heading onClick={onOpen}>
        <MdAccountCircle />
      </Heading>
      <Box>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{isNewUser ? "Register" : "Login"}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form>
                {isNewUser && (
                  <FormControl p={2}>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </FormControl>
                )}
                <FormControl p={2}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl p={2}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>
                {isNewUser ? (
                  <HStack>
                    <Text>Already have an account?</Text>
                    <Text
                      onClick={() => setNewUser(false)}
                      className=" text-blue-700"
                    >
                      Log In
                    </Text>
                  </HStack>
                ) : (
                  <HStack>
                    <Text>{`Don't have an account?`}</Text>
                    <Text
                      onClick={() => setNewUser(true)}
                      className=" text-blue-700"
                    >
                      Create One
                    </Text>
                  </HStack>
                )}
              </form>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Close
              </Button>
              {isNewUser ? (
                <Button colorScheme="blue" onClick={handleRegister}>
                  Register
                </Button>
              ) : (
                <Button colorScheme="blue" onClick={handleLogin}>
                  Login
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </div>
  );
}