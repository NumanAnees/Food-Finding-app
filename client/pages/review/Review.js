import React from 'react'
import CardComp from './CardComp'
import { Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import Typography from '@mui/material/Typography';

const Review = () => {

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
        0.5: 'Useless',
        1: 'Useless+',
        1.5: 'Poor',
        2: 'Poor+',
        2.5: 'Ok',
        3: 'Ok+',
        3.5: 'Good',
        4: 'Good+',
        4.5: 'Excellent',
        5: 'Excellent+',
      };
      
      function getLabelText(value) {
        return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
      }

    const [hover, setHover] = useState(-1);
    const [reviews, setReviews] = useState([]);
    const [commentVal, setComment] = useState('');
    const [ratingVal , setRating] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newItem = { comment: commentVal, ratings: ratingVal };
        setReviews([...reviews, newItem]);
        setComment('');
        setRating(1);
      };



  return (
    <>
        {head()}
        <Layout>
            <div style={{paddingTop : '60px'}}>
                <Grid container spacing={2} mt={3}>
                    <Grid item xs={12} sx={{display:'flex', justifyContent:'center'}}>
                        <form onSubmit={handleSubmit} style={{ minWidth:'40%',
                            background: 'white',
                            borderRadius: '3%',
                            boxShadow: '3px 3px #5e6a8b',
                            padding: '10px',
                            textAlign:'center'}}>
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
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom:'5px'
                                }}>
                                <Typography variant="body1" mr={2}>Rating:</Typography>
                                <Rating
                                    name="hover-feedback"
                                    value={ratingVal}
                                    precision={0.5}
                                    getLabelText={getLabelText}
                                    onChange={(e) => setRating(e.target.value)}
                                    onChangeActive={(event, newHover) => {
                                    setHover(newHover);
                                    }}
                                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                />
                                {ratingVal !== null && (
                                    <Box sx={{ ml: 1 }}>{labels[hover !== -1 ? hover : ratingVal]}</Box>
                                )}

                            </Box>
                            
                            
                            <Button type="submit" variant="contained" color="primary">
                            Submit
                            </Button>
                        </form>
                    </Grid>

                    
                    </Grid>

                    
                    
                    <Grid container spacing={1} mt={3} >
                    {reviews.map((reviewData,index)=>{
                                    return <Grid item xs={4} key={index} mt={3} mb={3} sx={{display:'flex', justifyContent:'center'}}>
                                        <CardComp text={reviewData.comment} key={index} rating={reviewData.ratings}/>
                            
                                    </Grid> })}
                    </Grid>
                                
                
                    
                    

                
            </div>
        </Layout>
    </>
  )
}

export default Review
