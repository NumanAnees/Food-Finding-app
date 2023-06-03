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
    address: "",
    error: "",
    success: "",
    buttonText: "Register",
  });
  const { name, email, password, phone, address, error, success, buttonText } =
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e);
    setState({ ...state, buttonText: "Registering" });
    try {
      const response = await axios.post(`${API}/register`, {
        name,
        email,
        password,
        phone,
        address,
      });
      console.log(response);
      setState({
        ...state,
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        buttonText: "Submitted",
        success: "Registered Successfully",
      });
      setTimeout(() => {
        Router.push("/login");
      }, 1200);
    } catch (error) {
      console.log(error);
      setState({
        ...state,
        buttonText: "Register",
        error: error.response.data.error,
      });
    }
  };

  const registerForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
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
      <div className="form-group">
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
      <div className="form-group">
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
      <div className="form-group">
        <label className="text-light">Phone</label>
        <PhoneInput 
        inputClass='w-100'
          country={"pk"}
          value={phone}
          onChange={(phone) => setState({ ...state, phone })}
        />
      </div>
      <div className="form-group">
        <label className="text-light">Address</label>
        <input
          value={address}
          onChange={handleChange("address")}
          type="text"
          className="form-control"
          placeholder="Type your Address..."
          required
        />
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
