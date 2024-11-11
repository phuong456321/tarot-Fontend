import React, { useState } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { auth } from "./firebase";
import "./styles/login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const handleLogin = (user) => {
    setUser(user);
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      handleLogin(user);
      sessionStorage.setItem("user", JSON.stringify(user));
      navigate("/card");
    } catch (error) {
      console.error("Error during Google sign in: ", error);
    }
  };

  const handleGithubLogin = async () => {
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      handleLogin(user);
      sessionStorage.setItem("user", JSON.stringify(user));
      navigate("/card");
    } catch (error) {
      console.error("Error during Github sign in: ", error);
    }
  };

  return (
    <div className="login-container">
      <br />
      <br />
      <br />
      <button className="google-sign-in" onClick={handleGoogleLogin}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/640px-Google_%22G%22_logo.svg.png"
          alt="Google logo"
        />
        Sign in with Google
      </button>
      <span>OR</span>
      <button className="github-sign-in" onClick={handleGithubLogin}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Github_logo_svg.svg/640px-Github_logo_svg.svg.png"
          alt="Github logo"
        />
        Sign in with Github
      </button>
    </div>
  );
};

export default Login;
