import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// import css
import "./Login.css";
import { userSignInMutation } from "../../reactQuery/queries";
import {  passwordEmail,googleAuth, signInAccount } from "../../appwrite/api";

function Login() {
  const { mutateAsync: loginUser, isPending: loggingIn } = userSignInMutation();
  const [formData, setformData] = useState({});

  const navigate = useNavigate();
  const switchToSignup = () => {
    navigate("/signup");
  };

  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const user = await loginUser(
      formData
    );
    if (!user) {
      console.log("something went wrong");
    }
    console.log(user);
    navigate("/");
  };

  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    const user = await googleAuth()
    console.log(user);
  };

  const handleForgetPaasword = async(e) => {
    e.preventDefault();
    const forget = await passwordEmail(formData.email);
    console.log(forget);
  }

  return (
    <div className="login-wrapper">
      <div>
        <form className="form" onChange={handleChange}>
          <div className="login-heading">
            <h1>Login</h1>
          </div>
          <div className="flex-column">
            <label>Email </label>
          </div>

          <div className="inputForm">
            <input
              type="text"
              className="input"
              id="email"
              placeholder="Enter your Email"
            />
          </div>

          <div className="flex-column">
            <label>Password </label>
          </div>

          <div className="inputForm">
            <input
              type="password"
              className="input"
              id="password"
              placeholder="Enter your Password"
            />
          </div>

          <div className="flex-row">
            <span onClick={handleForgetPaasword} className="span">
              Forgot password?
            </span>
          </div>

          <button className="button-submit" onClick={handleLogin} type="submit">
            Sign In
          </button>

          <p className="p">
            Don't have an account?
            <span className="span" onClick={switchToSignup}>
              Signup
            </span>
          </p>

          <p className="p line">Or With</p>

          <div className="flex-row">
            <button className="btn google" onClick={handleGoogleAuth}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="2443"
                height="2500"
                preserveAspectRatio="xMidYMid"
                viewBox="0 0 256 262"
                id="google"
              >
                <path
                  fill="#4285F4"
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                ></path>
                <path
                  fill="#34A853"
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                ></path>
                <path
                  fill="#EB4335"
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                ></path>
              </svg>
              Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
