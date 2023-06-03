import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import { useState, useEffect } from "react";
import axios from "axios";
// import { API,APP_NAME} from '../../../config';
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import Layout from "../../../components/Layout";
import withAdmin from "../../withAdmin";
import "react-quill/dist/quill.snow.css";
import Head from "next/head";
// import Footer from "../../../components/Footer"

const Create = ({ user, token }) => {
  // const API = "https://puzzled-gabardine-clam.cyclic.app/api";
  const API = "http://localhost:8000/api";

  const APP_NAME = "Top Dish";
  const head = () => (
    <Head>
      <title>
        {"Create Category"} | {APP_NAME}
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
    url: "",
    error: "",
    success: "",
    buttonText: "Create",
  });
  const [content, setContent] = useState("");
  const { name, url, success, error, buttonText } = state;

  const handleChange = (name) => (e) => {
    setState({ ...state, [name]: e.target.value, error: "", success: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Creating" });
    try {
      const response = await axios.post(
        `${API}/category`,
        { name, content, url },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("CATEGORY CREATE RESPONSE", response);
      setState({
        ...state,
        name: "",
        url: "",
        buttonText: "Created",
        success: `${response.data.name} is created`,
      });
      setContent("");
    } catch (error) {
      console.log("CATEGORY CREATE ERROR", error);
      setState({
        ...state,
        name: "",
        buttonText: "Create",
        error: error.response.data.error,
      });
    }
  };

  const handleContent = (e) => {
    setContent(e);
    setState({ ...state, success: "", error: "" });
  };

  const createCategoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-light">Name</label>
        <input
          onChange={handleChange("name")}
          value={name}
          type="text"
          className="form-control"
          placeholder="Enter name..."
          required
        />
      </div>
      <div className="form-group">
        <label className="text-light">Content</label>
        <ReactQuill
          value={content}
          onChange={handleContent}
          theme="snow"
          className="pb-5 mb-3 text-dark bg-light "
          placeholder="Enter description here..."
          style={{ border: "1px solid #666" }}
        />{" "}
      </div>
      <div className="form-group">
        <label className="text-light">Image Url</label>
        <input
          onChange={handleChange("url")}
          value={url}
          className="form-control"
          placeholder="Enter image url..."
          required
        />
      </div>
      <div className="text-center">
        <button className="btn btn1">{buttonText}</button>
      </div>
    </form>
  );

  return (
    <>
      {head()}
      <Layout>
        <div className="container pt-5 pb-5 bg-col">
          <div className="row">
            <div className="col-md-6 offset-md-3 form-set">
              <h1 className="text-light m-nav3 text-center text-span5">
                Create <span className="text-span">New</span> Category
              </h1>
              {success && showSuccessMessage(success)}
              {error && showErrorMessage(error)}
              {createCategoryForm()}
            </div>
          </div>
        </div>
      </Layout>
      {/* <Footer/> */}
    </>
  );
};

export default withAdmin(Create);
