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
import AppFooter from "../../components/Footer";
import Button from "@mui/material/Button";
import UpdateIcon from "@mui/icons-material/Update";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import FlakyIcon from "@mui/icons-material/Flaky";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Grid from "@mui/material/Grid";
import { Paper } from "@mui/material";
import Typography from "@mui/material/Typography";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CategoryIcon from "@mui/icons-material/Category";
import LinkIcon from "@mui/icons-material/Link";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

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
  const [stats, setStats] = useState({});
  const { loadedCategories, success, error, category, loadedLinks } = state;
  const getStats = async () => {
    try {
      const response = await axios.get(`${API}/user/stats`);
      console.log("STATS", response);
      setStats(response.data);
    } catch (error) {
      console.log("ERROR GETTING STATS", error);
    }
  };

  // load categories when component mounts using useEffect
  useEffect(() => {
    loadCategories();
    getStats();
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
        toast.error("No Links found");
        setState({
          ...state,
          loadedLinks: response.data,
          error: "No Links found",
        });
      }
    } catch (error) {
      toast.error(error.response.data.error);
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
      toast.success("Deleted Successfully!");
      setState({ ...state, success: "Deleted Successfully!", loadedLinks: [] });
      Router.replace("/admin");
    } catch (error) {
      toast.error("Fail to delete");
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
            <div
              className="col-md-4 marg-b-pages"
              style={{ borderRight: "2px solid grey" }}
            >
              <ul className="nav flex-column">
                <li className="nav-item">
                  <Button
                    href="/admin/category/create"
                    endIcon={<NoteAddIcon />}
                    variant="contained"
                    color="info"
                    sx={{ width: "60%", ":hover": { color: "white" } }}
                  >
                    New Category
                  </Button>
                </li>
                <li className="nav-item">
                  <Button
                    href="/admin/category/read"
                    endIcon={<VisibilityIcon />}
                    variant="contained"
                    color="info"
                    sx={{ width: "60%", ":hover": { color: "white" } }}
                  >
                    All Categories
                  </Button>
                </li>
                <li className="nav-item">
                  <Button
                    href="/admin/requests"
                    endIcon={<FlakyIcon />}
                    variant="contained"
                    color="info"
                    sx={{ width: "60%", ":hover": { color: "white" } }}
                  >
                    See Requests
                  </Button>
                </li>
                <li className="nav-item">
                  <Button
                    href="/user/profile/update"
                    endIcon={<UpdateIcon />}
                    variant="contained"
                    color="error"
                    sx={{ width: "60%", ":hover": { color: "white" } }}
                  >
                    Profile Update
                  </Button>
                </li>
              </ul>
            </div>
            <div className="col-md-8">
              <Grid container spacing={1} mb={2}>
                <Grid
                  item
                  xs={3}
                  p={2}
                  sx={{ textAlign: "center", color: "white" }}
                >
                  <Paper
                    elevation={20}
                    sx={{ padding: "36px" }}
                    style={{
                      color: "white",
                      backgroundColor: "#04e9ae",
                    }}
                  >
                    <Typography
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.3rem",
                      }}
                    >
                      <PeopleAltIcon
                        sx={{ marginRight: "2px", fontSize: "1.5rem" }}
                      />{" "}
                      Users
                    </Typography>
                    <Typography
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bolder",
                        fontSize: "1.5rem",
                      }}
                    >
                      {stats.userCount}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid
                  item
                  xs={3}
                  p={2}
                  sx={{ textAlign: "center", color: "white" }}
                >
                  <Paper
                    elevation={20}
                    sx={{ padding: "36px" }}
                    style={{
                      color: "white",
                      backgroundColor: "#04e9ae",
                    }}
                  >
                    <Typography
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.3rem",
                      }}
                    >
                      <CategoryIcon
                        sx={{ marginRight: "2px", fontSize: "1.5rem" }}
                      />{" "}
                      Categories
                    </Typography>
                    <Typography
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bolder",
                        fontSize: "1.5rem",
                      }}
                    >
                      {stats.CategoryCount}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid
                  item
                  xs={3}
                  p={2}
                  sx={{ textAlign: "center", color: "white" }}
                >
                  <Paper
                    elevation={20}
                    sx={{ padding: "36px" }}
                    style={{
                      color: "white",
                      backgroundColor: "#04e9ae",
                    }}
                  >
                    <Typography
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.3rem",
                      }}
                    >
                      <LinkIcon
                        sx={{ marginRight: "2px", fontSize: "1.5rem" }}
                      />{" "}
                      Links
                    </Typography>
                    <Typography
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bolder",
                        fontSize: "1.5rem",
                      }}
                    >
                      {stats.LinkCount}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid
                  item
                  xs={3}
                  p={2}
                  sx={{ textAlign: "center", color: "white" }}
                >
                  <Paper
                    elevation={20}
                    sx={{ padding: "36px" }}
                    style={{
                      color: "white",
                      backgroundColor: "#04e9ae",
                    }}
                  >
                    <Typography
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.3rem",
                      }}
                    >
                      <AttachMoneyIcon
                        sx={{ marginRight: "2px", fontSize: "1.5rem" }}
                      />{" "}
                      Earnings
                    </Typography>
                    <Typography
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bolder",
                        fontSize: "1.5rem",
                      }}
                    >
                      255
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
              <form className="form-group" onSubmit={handleSubmit}>
                <h2 className="text-light text-span5 text-uppercase display-6">
                  Update <span className="text-span">Locations</span> based on
                  Category
                </h2>
                <br />
                <ToastContainer />

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
      <AppFooter />
    </>
  );
};

export default withAdmin(Admin);
