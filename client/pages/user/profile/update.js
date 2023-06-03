import { useState, useEffect } from "react";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
// import { API,APP_NAME } from '../../../config';
import { authenticate, isAuth, updateUser } from "../../../helpers/auth";
import Router from "next/router";
import withUser from "../../withUser";
import Layout from "../../../components/Layout";
import Head from "next/head";

const Update = ({ token, user }) => {
  // const API = "https://puzzled-gabardine-clam.cyclic.app/api";
  const API = "http://localhost:8000/api";

  const APP_NAME = "Top Dish";
  const head = () => (
    <Head>
      <title>
        {"Update Profile"} | {APP_NAME}
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
    name: user.name,
    email: user.email,
    password: user.password,
    error: "",
    success: "",
    buttonText: "Update",
  });
  const { name, email, password, error, success, buttonText } = state;
  console.log("my user", user);
  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
      buttonText: "Update",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Updating" });
    try {
      const response = await axios.put(
        `${API}/user`,
        { name, password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      updateUser(response.data, () => {
        setState({
          ...state,
          name: "",
          email: "",
          password: "",
          buttonText: "Updated",
          success: "Update successfull",
        });
      });
    } catch (error) {
      console.log(error);
      setState({
        ...state,
        buttonText: "Update",
        error: "Cannot update profile",
      });
    }
  };

  const UpdateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          value={name}
          onChange={handleChange("name")}
          type="text"
          className="form-control"
          placeholder="Type your name"
          required
        />
      </div>
      <div className="form-group">
        <input
          value={email}
          onChange={handleChange("email")}
          type="email"
          className="form-control"
          placeholder="Type your email"
          required
          disabled
        />
      </div>
      <div className="form-group">
        <input
          value={password}
          onChange={handleChange("password")}
          type="password"
          className="form-control"
          placeholder="Type your password"
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
            <h1 className="text-light m-nav2 text-uppercase text-center text-span5">
              Update <span className="text-span">Profile</span> Info
            </h1>
            <br />
            {success && showSuccessMessage(success)}
            {error && showErrorMessage(error)}
            {UpdateForm()}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default withUser(Update);
