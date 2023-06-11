import React from 'react'

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import Box from '@mui/material/Box';


const CardComp = (props) => {

    console.log(props);
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


  return (
    <>
        <Card sx={{ width: '29rem' }}>
            <CardHeader
                avatar={
                    <Avatar alt="Remy Sharp"  src="https://toppng.com/uploads/preview/donna-picarro-dummy-avatar-115633298255iautrofxa.png"/>
                }
                title="Shrimp and Chorizo Paella"
                subheader="September 14, 2016"
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {props.text}
                </Typography>
                <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom:'5px'
                                }}>
                                <Typography variant="body1" mr={2}>Rating:</Typography>
                                <Rating
                                    name="hover-feedback"
                                    value={props.rating}
                                    precision={0.5}
                                    getLabelText={getLabelText}
                                    readOnly
                                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                                   
                                }
                                />
                                

                            </Box>
            </CardContent>
        </Card>
    </>
  )
}

export default CardComp
