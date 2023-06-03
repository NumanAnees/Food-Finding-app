// imports
import { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import Footer from "../../../components/Footer";
import axios from "axios";
import { getCookie, isAuth } from "../../../helpers/auth";
// import { API,APP_NAME } from '../../../config';
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import Head from "next/head";
import React from 'react'

const Create = ({ token }) => {
  // const API = "https://puzzled-gabardine-clam.cyclic.app/api";
  const API = "http://localhost:8000/api";

  const APP_NAME = "Top Dish";
  const head = () => (
    <Head>
      <title>
        {"New Location"} | {APP_NAME}
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
  // state
  const [state, setState] = useState({
    title: "",
    url: "",
    category: "",
    price: "",
    loadedCategories: [],
    success: "",
    error: "",
    gst: "",
  });

  const { title, url, category, loadedCategories, success, error, price, gst } =
    state;

  // load categories when component mounts using useEffect
  useEffect(() => {
    loadCategories();
  }, [success]);

  const loadCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    setState({ ...state, loadedCategories: response.data });
  };

  const handleTitleChange = (e) => {
    setState({ ...state, title: e.target.value, error: "", success: "" });
  };

  const handleURLChange = (e) => {
    setState({ ...state, url: e.target.value, error: "", success: "" });
  };
  const handlePriceChange = (e) => {
    setState({ ...state, price: e.target.value, error: "", success: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.table({ title, url, categories, type, medium });
    try {
      const response = await axios.post(
        `${API}/link`,
        { title, url, category, price, gst },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setState({
        ...state,
        title: "",
        url: "",
        success: "Link is created",
        error: "",
        loadedCategories: [],
        category: "",
        price: "",
        gst: "",
      });
    } catch (error) {
      console.log("LINK SUBMIT ERROR", error);
      setState({ ...state, error: error.response.data.error });
    }
  };

  const handleGstClick = (e) => {
    setState({ ...state, gst: e.target.value, success: "", error: "" });
  };

  const showGst = () => {
    return (
      <>
        <div className="form-check ml-3">
          <label className="form-check-label text-info p-1 text-light">
            <input
              type="radio"
              onClick={handleGstClick}
              checked={gst === "Applicable"}
              value="Applicable"
              className="from-check-input mr-2"
              name="gst"
            />{" "}
            Applicable
          </label>
        </div>
        <div className="form-check ml-3">
          <label className="form-check-label text-info p-1 text-light">
            <input
              type="radio"
              onClick={handleGstClick}
              checked={gst === "Not Applicable"}
              value="Not Applicable"
              className="from-check-input mr-2"
              name="gst"
            />{" "}
            Not Applicable
          </label>
        </div>
      </>
    );
  };

  const handleCategory = (e) => {
    setState({ ...state, category: e.target.value, success: "", error: "" });
  };

  // show categories > checkbox
  const showCategories = () => {
    return (
      loadedCategories &&
      loadedCategories.map((c, i) => (
        <li className="list-unstyled p-1" key={c._id}>
          <input
            type="radio"
            onClick={handleCategory}
            value={c._id}
            checked={category === c._id}
            className="mr-2"
            name="category"
          />
          <label className="form-check-label text-light">{c.name}</label>
        </li>
      ))
    );
  };

  // link create form
  const submitLinkForm = () => (
    <form onSubmit={handleSubmit} className="form-set w-75 p-4 mr-5">
      <div className="form-group">
        <label className="text-light">Name</label>
        <input
          type="text"
          className="form-control"
          onChange={handleTitleChange}
          value={title}
          placeholder="Enter the name..."
        />
      </div>
      <div className="form-group">
        <label className="text-light">Map Location</label>
        <input
          type="url"
          className="form-control"
          onChange={handleURLChange}
          value={url}
          placeholder="Enter the location 's URL..."
        />
      </div>
      <div className="form-group">
        <label className="text-light">Price</label>
        <input
          type="number"
          className="form-control"
          onChange={handlePriceChange}
          value={price}
          placeholder="Enter the price..."
        />
      </div>
      <div className="text-center">
        <button disabled={!token} className="btn btn1" type="submit">
          {isAuth() || token ? "Submit" : "Login to submit"}
        </button>
      </div>
    </form>
  );

  return (
    <>
      {head()}
      <Layout>
        <div className="container pt-5 pb-5 bg-col">
          <div className="row">
            <div className="col-md-12">
              <h1 className="text-light text-uppercase m-nav2 text-span5">
                Submit a <span className="text-span">Location</span>
              </h1>
              <br />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label className="ml-4 text-light">• Category</label>
                <ul style={{ maxHeight: "180px", overflowY: "scroll" }}>
                  {showCategories()}
                </ul>
              </div>
              <div className="form-group">
                <label className=" ml-4 text-light">• GST</label>
                {showGst()}
              </div>
            </div>
            <div className="col-md-8">
              {success && showSuccessMessage(success)}
              {error && showErrorMessage(error)}
              {submitLinkForm()}
            </div>
          </div>
        </div>
      </Layout>
      {/* <Footer/> */}
    </>
  );
};

Create.getInitialProps = ({ req }) => {
  const token = getCookie("token", req);
  return { token };
};

export default Create;
