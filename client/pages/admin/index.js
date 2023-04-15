import Layout from "../../components/Layout";
import withAdmin from "../withAdmin";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
// import { API,APP_NAME } from '../../config';
import moment from "moment";
import Router from "next/router";
import { showSuccessMessage, showErrorMessage } from "../../helpers/alerts";
import Head from "next/head";
import { EyeFilled } from "@ant-design/icons";
import Footer from "../../components/Footer";

const Admin = ({ token }) => {
  // const API = "https://puzzled-gabardine-clam.cyclic.app/api";
  const API = "http://localhost:8000/api";

  const APP_NAME = "Top Dish";
  const head = () => (
    <Head>
      <title>
        {"Admin Dashboard"} | {APP_NAME}
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
    loadedCategories: [],
    success: "",
    error: "",
    category: "",
    loadedLinks: [],
  });
  const { loadedCategories, success, error, category, loadedLinks } = state;
  // load categories when component mounts using useEffect
  useEffect(() => {
    loadCategories();
  }, [success]);
  const loadCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    setState({ ...state, loadedCategories: response.data });
  };
  const loadLinks = async () => {
    try {
      const response = await axios.post(
        `${API}/links/${category}`,
        { limit: 1000, skip: 0 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("ALL links", response.data);
      setState({ ...state, loadedLinks: response.data });
      if (response.data.length < 1) {
        setState({
          ...state,
          loadedLinks: response.data,
          error: "No Links found",
        });
      }
    } catch (error) {
      console.log("CATEGORY CREATE ERROR", error);
      setState({ ...state, error: error.response.data.error });
    }
  };
  const handleCategory = (e) => {
    setState({ ...state, category: e.target.value, success: "", error: "" });
  };
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
          <label className="form-check-label text-light ">{c.name}</label>
        </li>
      ))
    );
  };
  const confirmDelete = (e, id) => {
    e.preventDefault();
    // console.log('delete > ', slug);
    let answer = window.confirm("Are you sure you want to delete?");
    if (answer) {
      handleDelete(id);
    }
  };

  const handleDelete = async (id) => {
    console.log("delete link > ", id);
    try {
      const response = await axios.delete(`${API}/link/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("LINK DELETE SUCCESS ", response);
      setState({ ...state, success: "Deleted Successfully!", loadedLinks: [] });
      Router.replace("/admin");
    } catch (error) {
      console.log("LINK DELETE ", error);
      setState({ ...state, error: "Fail to delete", loadedLinks: [] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loadLinks();
  };
  const listOfLinks = () =>
    loadedLinks.map((l, i) => (
      <div key={i} className="row alert alert-primary p-2 primary-link">
        <div className="col-md-8">
          <a href={l.url} target="_blank">
            <h5 className="pt-2">{l.title}</h5>
            <h6 className=" text-danger" style={{ fontSize: "12px" }}>
              {l.url.substring(0, 42)}
            </h6>
          </a>
        </div>
        <div className="col-md-4 pt-2">
          <span className="pull-right">
            {moment(l.createdAt).fromNow()} by {l.postedBy.name}
          </span>
        </div>

        <div
          className="col-md-12 mt-1"
          style={{ display: "flex", flexDirection: "row" }}
        >
          <div className="text-center">
            <span className="badge text-dark">
              {l.price} Rupees / GST {l.gst}
            </span>
            <span className="badge text-success">{l.category.name}</span>
          </div>
          <Link href={`/user/link/${l._id}`}>
            <button
              style={{ fontSize: "13px" }}
              className="btn btn-success text-light ml-4 mr-2 pl-2 pr-2 pull-right"
            >
              <span>Update</span>
            </button>
          </Link>
          <button
            onClick={(e) => confirmDelete(e, l._id)}
            className="btn btn-danger text-light mr-2 p-1 text-danger pull-right"
          >
            <span>Delete</span>
          </button>
          <span
            className="text-secondary pull-left ml-auto"
            style={{ marginRight: "10.7rem", fontSize: "13px" }}
          >
            <EyeFilled /> {l.clicks}
          </span>
        </div>
      </div>
    ));

  return (
    <>
      {head()}
      <Layout>
        <div className="container pt-5 pb-5 bg-col">
          <h1 className="text-light m-nav3 text-span5">
            Admin <span className="text-span">Dashboard</span>
          </h1>
          <br />
          <div className="row">
            <div className="col-md-4 marg-b-pages">
              <ul className="nav flex-column">
                <li className="nav-item">
                  <Link href="/admin/category/create">
                    <a className="nav link text-light">• Create New Category</a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/admin/category/read">
                    <a className="nav link text-light">• All Categories</a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/user/profile/update">
                    <a className="nav link text-light">• Profile Update</a>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-md-8">
              <form className="form-group" onSubmit={handleSubmit}>
                <h2 className="text-light text-span5 text-uppercase display-6">
                  Update <span className="text-span">Locations</span> based on
                  Category
                </h2>
                <br />
                {success && showSuccessMessage(success)}
                {error && showErrorMessage(error)}
                <label className="text-light ml-4">‣ Category</label>
                <ul style={{ maxHeight: "180px", overflowY: "scroll" }}>
                  {showCategories()}
                </ul>
                <div className="text-center">
                  <button className="btn btn1" type="submit">
                    Choose
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4"></div>
            <div className="col-md-8">{loadedLinks && listOfLinks()}</div>
          </div>
        </div>
      </Layout>
      {/* <Footer/> */}
    </>
  );
};

export default withAdmin(Admin);
