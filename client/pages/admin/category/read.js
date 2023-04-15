import { useState, useEffect } from "react";
import axios from "axios";
// import { API,APP_NAME } from '../../../config';
import Link from "next/link";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import Layout from "../../../components/Layout";
import withAdmin from "../../withAdmin";
import Head from "next/head";
import Footer from "../../../components/Footer";

const Read = ({ user, token }) => {
  // const API = "https://puzzled-gabardine-clam.cyclic.app/api";
  const API = "http://localhost:8000/api";

  const APP_NAME = "Top Dish";
  const head = () => (
    <Head>
      <title>
        {"All Categories"} | {APP_NAME}
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
    error: "",
    success: "",
    categories: [],
  });

  const { error, success, categories } = state;

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    setState({ ...state, categories: response.data });
  };

  const confirmDelete = (e, slug) => {
    e.preventDefault();
    let answer = window.confirm("Are you sure you want to delete?");
    if (answer) {
      handleDelete(slug);
    }
  };

  const handleDelete = async (slug) => {
    try {
      const response = await axios.delete(`${API}/category/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("CATEGORY DELETE SUCCESS ", response);
      loadCategories();
    } catch (error) {
      console.log("CATEGORY DELETE ", error);
    }
  };

  const listCategories = () =>
    categories.map((c, i) => (
      <Link key={i} href={`/links/${c.slug}`}>
        <a className="list-categories mb-auto">
          <div>
            <div className="row">
              <div className="col-md-3">
                <img
                  src={c.image && c.image.url}
                  alt={c.name}
                  className="category-image"
                />
              </div>
              <div className="col-md-6 category-name">
                <h3 style={{ color: "#04e9ae" }}>{c.name}</h3>
              </div>
              <div className="col-md-3 d-flex flex-column ml-auto">
                <Link href={`/admin/category/${c.slug}`}>
                  <button className="btn btn-sm btn-outline-success btn-block mb-1">
                    Update
                  </button>
                </Link>

                <button
                  onClick={(e) => confirmDelete(e, c.slug)}
                  className="btn btn-sm btn-outline-danger btn-block"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </a>
      </Link>
    ));

  return (
    <>
      {head()}
      <Layout>
        <div className="container pt-5 pb-5 bg-col">
          <div className="row">
            <div className="col">
              <h1 className="heading-awesome m-nav3 text-span5">
                List of All <span className="text-span">Categories</span>
              </h1>
              <br />
            </div>
          </div>
          <div className="row">{listCategories()}</div>
        </div>
      </Layout>
      {/* <Footer/> */}
    </>
  );
};

export default withAdmin(Read);
