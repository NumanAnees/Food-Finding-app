import React from "react";
import CardComp from "../../../components/CardComp";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import Layout from "../../../components/Layout";
import Head from "next/head";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { getCookie } from "../../../helpers/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";

const Review = ({ Linkreviews, query, Usertoken }) => {
  // console.log("lnkreveiw", Linkreviews);
  const API = "http://localhost:8000/api";

  const APP_NAME = "Top Dish";
  const head = () => (
    <Head>
      <title>
        {"Review"} | {APP_NAME}
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
  const labels = {
    0.5: "Useless",
    1: "Useless+",
    1.5: "Poor",
    2: "Poor+",
    2.5: "Ok",
    3: "Ok+",
    3.5: "Good",
    4: "Good+",
    4.5: "Excellent",
    5: "Excellent+",
  };

  function getLabelText(value) {
    return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
  }

  const [hover, setHover] = useState(-1);
  const [reviews, setReviews] = useState(Linkreviews);
  const [commentVal, setComment] = useState("");
  const [ratingVal, setRating] = useState(1);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addReview();
    setComment("");
    setRating(1);
  };
  //add review
  const addReview = async () => {
    try {
      const response = await axios.put(
        `${API}/link/review/${query.id}`,
        {
          text: commentVal,
          rating: ratingVal,
        },
        {
          headers: {
            authorization: `Bearer ${Usertoken}`,
            contentType: "application/json",
          },
        }
      );
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success("Review Added Successfully");
        setSuccess("Review Added Successfully");
      }
      loadNewReview();
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };

  const loadNewReview = async () => {
    const response = await axios.get(`${API}/link/review/${query.id}`, {
      headers: {
        authorization: `Bearer ${Usertoken}`,
        contentType: "application/json",
      },
    });
    setReviews(response.data);
  };

  return (
    <>
      {head()}
      <Layout>
        <ToastContainer />
        <div style={{ paddingTop: "60px" }}>
          <Grid container spacing={2} mt={3}>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <form
                onSubmit={handleSubmit}
                style={{
                  minWidth: "40%",
                  background: "white",
                  borderRadius: "3%",
                  boxShadow: "3px 3px #5e6a8b",
                  padding: "10px",
                  textAlign: "center",
                }}
              >
                <TextField
                  label="Your Feedback here"
                  variant="outlined"
                  value={commentVal}
                  onChange={(e) => setComment(e.target.value)}
                  fullWidth
                  multiline
                  maxRows={3}
                  margin="normal"
                />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}
                >
                  <Typography variant="body1" mr={2}>
                    Rating:
                  </Typography>
                  <Rating
                    name="hover-feedback"
                    value={ratingVal}
                    precision={0.5}
                    getLabelText={getLabelText}
                    onChange={(e) => setRating(e.target.value)}
                    onChangeActive={(event, newHover) => {
                      setHover(newHover);
                    }}
                    emptyIcon={
                      <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                    }
                  />
                  {ratingVal !== null && (
                    <Box sx={{ ml: 1 }}>
                      {labels[hover !== -1 ? hover : ratingVal]}
                    </Box>
                  )}
                </Box>

                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </form>
            </Grid>
          </Grid>

          <Grid container spacing={1} mt={3}>
            {reviews.map((reviewData, index) => {
              return (
                <Grid
                  item
                  xs={4}
                  key={index}
                  mt={3}
                  mb={3}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <CardComp
                    text={reviewData.text}
                    key={index}
                    rating={reviewData.rating}
                    name={reviewData.createdBy.name}
                    imageUrl={reviewData.createdBy.picture}
                    time={reviewData.date}
                  />
                </Grid>
              );
            })}
          </Grid>
        </div>
      </Layout>
    </>
  );
};
Review.getInitialProps = async ({ req, query }) => {
  // const API = "https://puzzled-gabardine-clam.cyclic.app/api";
  const API = "http://localhost:8000/api";

  const Usertoken = getCookie("token", req);

  const response = await axios.get(`${API}/link/review/${query.id}`, {
    headers: {
      authorization: `Bearer ${Usertoken}`,
      contentType: "application/json",
    },
  });

  return {
    query,
    Linkreviews: response.data,
    Usertoken,
  };
};

export default Review;
