import React, { useState, useEffect } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "./firebase";
import "./styles/login.css";
import { useNavigate } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";

export const useGoogleLogin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = (user) => {
    setUser(user);
    sessionStorage.setItem("user", JSON.stringify(user));
    navigate("/card");
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await setDoc(doc(db, "users", user.uid), {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        dateOfBirth: user.dateOfBirth,
        weeklyEmails: user.weeklyEmails,
        // Add any other user data you want to save
      });

      handleLogin(auth.currentUser);
    } catch (error) {
      console.error("Error during Google sign in: ", error);
    }
  };

  return { handleGoogleLogin, user }; // Return the function to be used
};

export default useGoogleLogin;