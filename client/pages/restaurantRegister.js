import { useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from "../helpers/alerts";
import Router from "next/router";
import Head from "next/head";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RestaurantRegister = () => {
  const API = "http://localhost:8000/api";
  const APP_NAME = "Top Dish";

  const [state, setState] = useState({
    restaurantName: "",
    email: "",
    password: "",
    location: "",
    picture: null,
    document: null,
    error: "",
    success: "",
    buttonText: "Register",
  });

  const {
    restaurantName,
    email,
    password,
    location,
    picture,
    document,
    error,
    success,
    buttonText,
  } = state;

  const handleChange = (name) => (e) => {
    const value =
      name === "picture" || name === "document"
        ? e.target.files[0]
        : e.target.value;
    setState({
      ...state,
      [name]: value,
      error: "",
      success: "",
      buttonText: "Register",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("restaurantName", restaurantName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("location", location);
    formData.append("picture", picture);
    formData.append("document", document);
    setState({ ...state, buttonText: "Registering" });

    try {
      const response = await axios.post(`${API}/registerRestaurant`, formData);
      toast.success("Registered Successfully");
      setState({
        ...state,
        restaurantName: "",
        email: "",
        password: "",
        location: "",
        picture: null,
        document: null,
        buttonText: "Submitted",
        success: "Registered Successfully",
      });
      setTimeout(() => {
        Router.push("/login");
      }, 1200);
    } catch (error) {
      toast.error(error.response.data.error);
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
        <label className="text-light">Restaurant Name</label>
        <input
          value={restaurantName}
          onChange={handleChange("restaurantName")}
          type="text"
          className="form-control"
          placeholder="Type the name of your restaurant..."
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
        <label className="text-light">Location</label>
        <input
          value={location}
          onChange={handleChange("location")}
          type="text"
          className="form-control"
          placeholder="Type the Google Maps location URL of your restaurant..."
          required
        />
      </div>
      <div className="form-group-1">
        <label className="text-light">Picture</label>
        <input
          onChange={handleChange("picture")}
          type="file"
          accept="image/*"
          className="form-control"
          required
        />
        {picture && (
          <img
            src={URL.createObjectURL(picture)}
            alt="Restaurant Picture"
            className="uploaded-image"
          />
        )}
      </div>
      <div className="form-group-1">
        <label className="text-light">Document</label>
        <input
          onChange={handleChange("document")}
          type="file"
          accept=".doc, .docx, .pdf"
          className="form-control"
          required
        />
        {document && <p className="uploaded-file">{document.name}</p>}
      </div>
      <div className="forget-password-container">
        <Link href="/register">
          <h6 className="forget-password">Register a user</h6>
        </Link>
      </div>
      <div className="form-group text-center">
        <button className="btn btn1">{buttonText}</button>
      </div>
    </form>
  );

  return (
    <>
      <Head>
        <title>
          {"Restaurant Register"} | {APP_NAME}
        </title>
        <link rel="shortcut icon" href="/static/icons/favicon.ico" />
        <meta
          name="description"
          content={`top meal,meal,best meal,meal's ratings,Best meal,top 10 best meal,Best restaurant for meal,best meal in pakistan,best meal in lahore`}
        />
        <meta property="og:title" content={APP_NAME} />
        <meta property="title" content={APP_NAME} />
        <meta
          property="og:description"
          content={`Find the best meal in your area`}
        />
        <link rel="stylesheet" href="/static/styles/style.css" />
      </Head>
      <Layout>
        <div className="container pt-5 pb-5 bg-col">
          <div className="col-md-6 offset-md-3 form-set">
            <h1 className="text-center text-light m-nav2 text-uppercase text-span5">
              <span className="text-span">Register</span> Here
            </h1>
            <ToastContainer />

            {registerForm()}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default RestaurantRegister;
