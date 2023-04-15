import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import { useState, useEffect } from "react";
import axios from "axios";
// import { API,APP_NAME } from '../../../config';
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import Layout from "../../../components/Layout";
import withAdmin from "../../withAdmin";
import "react-quill/dist/quill.snow.css";
import Head from "next/head";
// import Footer from "../../../components/Footer"

const Update = ({ oldCategory, token }) => {
  // const API = "https://puzzled-gabardine-clam.cyclic.app/api";
  const API = "http://localhost:8000/api";

  const APP_NAME = "Top Dish";
  const head = () => (
    <Head>
      <title>
        {"Update Category"} | {APP_NAME}
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
  // console.log("----BOOOOOOyyyyyyy----",oldCategory);
  const [state, setState] = useState({
    name: oldCategory.name,
    url: oldCategory.image.url,
    error: "",
    success: "",
    buttonText: "Update",
  });
  const [content, setContent] = useState(oldCategory.content);
  const { name, url, success, error, buttonText } = state;

  const handleChange = (name) => (e) => {
    setState({ ...state, [name]: e.target.value, error: "", success: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Creating" });
    try {
      const response = await axios.put(
        `${API}/category/${oldCategory.slug}`,
        { name, content, url },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("CATEGORY Update RESPONSE", response);
      setState({
        ...state,
        name: "",
        url: "",
        buttonText: "Updated",
        success: "Record is Updated",
      });
      setContent("");
    } catch (error) {
      console.log("CATEGORY Update ERROR", error);
      setState({
        ...state,
        name: "",
        buttonText: "Update",
        error: "Sorry,can't update now",
      });
    }
  };

  const handleContent = (e) => {
    setContent(e);
    setState({ ...state, success: "", error: "" });
  };

  const UpdateCategoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-light">Name</label>
        <input
          onChange={handleChange("name")}
          value={name}
          type="text"
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label className="text-light">Content</label>
        <ReactQuill
          value={content}
          onChange={handleContent}
          placeholder="Write something..."
          theme="snow"
          className="pb-5 mb-3 text-dark bg-light"
          style={{ border: "1px solid #666" }}
        />{" "}
      </div>
      <div className="form-group">
        <label className="text-light">Image Url</label>
        <input
          onChange={handleChange("url")}
          value={url}
          className="form-control"
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
            <div className="col-md-6 offset-md-3">
              <h1 className="text-uppercase text-light text-center m-nav3 text-span5">
                Update <span className="text-span">Category</span>
              </h1>
              {success && showSuccessMessage(success)}
              {error && showErrorMessage(error)}
              {UpdateCategoryForm()}
            </div>
          </div>
        </div>
      </Layout>
      {/* <Footer/> */}
    </>
  );
};
Update.getInitialProps = async ({ req, query, token }) => {
  // const API = "https://puzzled-gabardine-clam.cyclic.app/api";
  const API = "http://localhost:8000/api";

  const APP_NAME = "Top Dish";
  const response = await axios.post(`${API}/category/${query.slug}`);
  return { oldCategory: response.data.category, token };
};
export default withAdmin(Update);
