import Layout from "../components/Layout";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect, Fragment } from "react";
// import { API,APP_NAME } from '../config';
import moment from "moment";
import Head from "next/head";
import { EyeFilled } from "@ant-design/icons";
import Footer from "../components/Footer";

const Home = ({ categories }) => {
  // const API = "https://puzzled-gabardine-clam.cyclic.app/api";
  const API = "http://localhost:8000/api";
  const APP_NAME = "Top Dish";
  const head = () => (
    <Head>
      <title>{APP_NAME}</title>
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
  const [allCategories, SetCategories] = useState(categories);
  const [query, setQuery] = useState("");
  const [state, setState] = useState({
    links: [],
  });
  const { links } = state;
  useEffect(() => {
    loadLinks();
  }, []);
  const loadLinks = async () => {
    const response = await axios.get(`${API}/link/popular`);
    console.log("Main---", response.data);
    setState({ ...state, links: response.data });
  };

  const handleCount = async (linkId) => {
    const response = await axios.put(`${API}/click-count`, { linkId });
    loadUpdatedLinks();
  };
  const loadUpdatedLinks = async () => {
    loadLinks();
  };
  const listOfLinks = () => {
    return links.map((l, i) => (
      <div key={i} className="row alert alert-light p-2 primary-link ">
        <div class="ribbon ribbon-top-right">
          <span>Top item</span>
        </div>
        <div className="col-md-8" onClick={(e) => handleCount(l._id)}>
          <a href={l.url} target="_blank">
            <h5 className="pt-2">{l.title}</h5>
            <h6 className="pt-2 text-danger" style={{ fontSize: "12px" }}>
              {l.url.substring(0, 110)}
            </h6>
          </a>
        </div>
        <div className="col-md-4 pt-2">
          <span className="pull-right">
            {moment(l.createdAt).fromNow()} by {l.postedBy.name}
          </span>
          <br />
          {/* <span className="badge text-secondary pull-right">{l.clicks} clicks</span> */}
        </div>
        <div
          className="col-md-8 mt-2"
          style={{ display: "flex", flexDirection: "row" }}
        >
          <span className="badge text-dark">
            {l.price} Rupees / GST {l.gst}
          </span>
          <span className="badge text-success">{l.category.name}</span>
        </div>
        <div className="col-md-4">
          <span
            className="text-secondary pull-left ml-auto"
            style={{ marginRight: "18.6rem", fontSize: "14px" }}
          >
            <div>
              <EyeFilled /> {l.clicks}
            </div>
          </span>
        </div>
      </div>
    ));
  };

  const listCategories = () =>
    allCategories
      .filter((i) => i.name.toUpperCase().includes(query))
      .map((c, i) => (
        <Link key={i} href={`/links/${c.slug}`}>
          <a className="list-categories">
            <img
              src={c.image && c.image.url}
              alt={c.name}
              className="category-image"
            />
            <p className="category-name">{c.name}</p>
          </a>
        </Link>
      ));

  return (
    <Fragment>
      {head()}
      <Layout>
        <div className="container">
          <div className="row">
            <div className="col-md-12 mt-5 mb-2">
              <h1 className="font-weight-bold text-center heading-awesome m-nav text-span5">
                Browse Your <span className="text-span">Favourite</span> Food
              </h1>
              <br />
            </div>
          </div>
        </div>
        <div className="container marg-2">
          <div className="row d-flex justify-content-center">
            <input
              type="text"
              className="form-inp"
              placeholder="Search your favourite food here..."
              onChange={(e) => setQuery(e.target.value.toUpperCase())}
            />
          </div>
        </div>
        <div className="container">
          <div className="row mt-2">{listCategories()}</div>
        </div>
        <div className="container">
          <div className="row low-heading">
            <h1 className="ml-2 heading-awesome-small text-span5">
              Most <span className="text-span">Voted Items</span> in all
              categories
            </h1>
            <div className="col-md-12 mt-2">{listOfLinks()}</div>
          </div>
        </div>
      </Layout>
      <Footer />
    </Fragment>
  );
};

Home.getInitialProps = async () => {
  // const API = "https://puzzled-gabardine-clam.cyclic.app/api";
  const API = "http://localhost:8000/api";

  const APP_NAME = "Top Dish";
  const response = await axios.get(`${API}/categories`);
  return {
    categories: response.data,
  };
};

export default Home;
