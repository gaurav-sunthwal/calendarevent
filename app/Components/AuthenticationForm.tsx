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
import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  getAuth,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { Firebase_AUTH, Firebase_DB, provider } from "../FirebaseConfig";
import { MdAccountCircle } from "react-icons/md";

export default function AuthenticationForm({ setGlobalUserName }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setNewUser] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // Ensure we're in the browser environment
    if (typeof window !== "undefined") {
      const auth = getAuth();
      const storedUserId = localStorage.getItem("userId");

      if (storedUserId) {
        // Fetch user data from Firestore
        const fetchUserData = async () => {
          try {
            const userDoc = await getDoc(doc(Firebase_DB, "users", storedUserId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              const userName = userData.name;
              setUserName(userName);
              setGlobalUserName(userName); // Set username
              setIsLoggedIn(true);
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        };

        fetchUserData();
      }
    }
  }, [setGlobalUserName]);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Error!! Please enter both email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        Firebase_AUTH,
        email,
        password
      );
      const user = userCredential.user;
      const userId = user.uid;

      const userDoc = await getDoc(doc(Firebase_DB, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userName = userData.name;
        setUserName(userName);
        setGlobalUserName(userName); // Set username
        if (typeof window !== "undefined") {
          localStorage.setItem("userId", userId);
        }
        toast.success(`Success! Welcome back, ${userName}!`);
        setIsLoggedIn(true);
        onClose();
      } else {
        toast.error("User data not found.");
      }
    } catch (error) {
      toast.error(`Login Error: ${error.message}`);
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !name) {
      toast.error("Error! Please fill in all fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        Firebase_AUTH,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(Firebase_DB, "users", user.uid), {
        name: name,
        email: email,
        createdAt: new Date(),
      });
      setUserName(name);
      setGlobalUserName(name); // Set username
      if (typeof window !== "undefined") {
        localStorage.setItem("userId", user.uid);
      }
      toast.success("Success! Account created successfully!");
      setIsLoggedIn(true);
      onClose();
    } catch (error) {
      toast.error(`Registration Error: ${error.message}`);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(Firebase_AUTH, provider);
      const user = result.user;
      const userId = user.uid;
      const userName = user.displayName || "Unknown User"; // Default if no display name

      const userDoc = await getDoc(doc(Firebase_DB, "users", userId));
      if (!userDoc.exists()) {
        // Create new user if not exists
        await setDoc(doc(Firebase_DB, "users", userId), {
          name: userName,
          email: user.email,
          createdAt: new Date(),
        });
      }

      setUserName(userName);
      setGlobalUserName(userName); // Set username
      if (typeof window !== "undefined") {
        localStorage.setItem("userId", userId);
      }
      toast.success(`Success! Welcome back, ${userName}!`);
      setIsLoggedIn(true);
      onClose();
    } catch (error) {
      toast.error(`Google Sign-In Error: ${error.message}`);
    }
  };

  return (
    <div>
      <Toaster />
      {isLoggedIn ? (
        <Heading>
          <MdAccountCircle />
          {userName}
        </Heading>
      ) : (
        <>
          <Button colorScheme="blue" onClick={onOpen}>
            Get Started!!
          </Button>
          <Box p={0}>
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
                          type="text"
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
                          className="text-blue-700"
                        >
                          Log In
                        </Text>
                      </HStack>
                    ) : (
                      <HStack>
                        <Text>Don't have an account?</Text>
                        <Text
                          onClick={() => setNewUser(true)}
                          className="text-blue-700"
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
                  <Button colorScheme="red" ml={3} onClick={handleGoogleSignIn}>
                    Sign in with Google
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
        </>
      )}
    </div>
  );
}