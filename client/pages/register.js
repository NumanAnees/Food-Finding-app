import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from "../helpers/alerts";
// import { API,APP_NAME} from '../config';
import { authenticate, isAuth } from "../helpers/auth";
import Router from "next/router";
import Head from "next/head";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Link from "next/link";

const Register = () => {
  // const API = "https://puzzled-gabardine-clam.cyclic.app/api";
  const API = "http://localhost:8000/api";
  const APP_NAME = "Top Dish";
  const head = () => (
    <Head>
      <title>
        {"Register"} | {APP_NAME}
      </title>
      <link rel="shortcut icon" href="/static/icons/favicon.ico" />
      <meta
        name="description"
        content={`top meal,meal,best meal,meal 's ratings,Best meal,top 10 best meal,Best restaurant for meal,best meal in pakistan,best meal in lahore`}
      />
      <meta property="og:title" content={APP_NAME} />
      <meta property="title" content={APP_NAME} />
      <meta property="og:description" content={`Find best meal in your area`} />
      <link rel="stylesheet" href="/static/styles/style.css" />

      {/* logo here */}
    </Head>
  );
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    picture: null,
    error: "",
    success: "",
    buttonText: "Register",
  });
  const { name, email, password, phone, picture, error, success, buttonText } =
    state;

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
      buttonText: "Register",
    });
  };

  const handleImageChange = (e) => {
    setState({
      ...state,
      picture: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Registering" });

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phone", phone);
      formData.append("picture", picture);

      const response = await axios.post(`${API}/register`, formData);

      setState({
        ...state,
        name: "",
        email: "",
        password: "",
        phone: "",
        picture: null,
        buttonText: "Submitted",
        success: "Registered Successfully",
      });

      setTimeout(() => {
        // Redirect or perform any other action
      }, 1200);
    } catch (error) {
      setState({
        ...state,
        buttonText: "Register",
        error: error.response.data.error,
      });
    }
  };

  const registerForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group-1">
        <label className="text-light">Name</label>
        <input
          value={name}
          onChange={handleChange("name")}
          type="text"
          className="form-control"
          placeholder="Type your name..."
          required
        />
      </div>
      <div className="form-group-1">
        <label className="text-light">Email</label>
        <input
          value={email}
          onChange={handleChange("email")}
          type="email"
          className="form-control"
          placeholder="Type your email..."
          required
        />
      </div>
      <div className="form-group-1">
        <label className="text-light">Password</label>
        <input
          value={password}
          onChange={handleChange("password")}
          type="password"
          className="form-control"
          placeholder="Type your password..."
          required
        />
      </div>
      <div className="form-group-1">
        <label className="text-light">Phone</label>
        <PhoneInput
          inputClass="w-100"
          country={"pk"}
          value={phone}
          onChange={(phone) => setState({ ...state, phone })}
        />
      </div>
      <div className="form-group-1">
        <label className="text-light">Profile Picture</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="form-control"
        />
        {picture && (
          <img
            src={URL.createObjectURL(picture)}
            className="uploaded-image"
            alt="Profile"
          />
        )}
      </div>
      <div className="forget-password-container">
        <Link href="/restaurantRegister">
          <h6 className="forget-password">Register a Restaurant</h6>
        </Link>
      </div>
      <div className="form-group text-center">
        <button className="btn btn1">{buttonText}</button>
      </div>
    </form>
  );

  return (
    <>
      {head()}
      <Layout>
        <div className="container pt-5 pb-5 bg-col">
          <div className="col-md-6 offset-md-3 form-set">
            <h1 className="text-center text-light m-nav2 text-uppercase text-span5">
              <span className="text-span">Register</span> Here
            </h1>
            {success && showSuccessMessage(success)}
            {error && showErrorMessage(error)}
            {registerForm()}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Register;
