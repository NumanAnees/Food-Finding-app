import Layout from '../components/Layout';
import axios from 'axios';
import Link from 'next/link';
import { useState,useEffect, Fragment } from 'react';
import { API,APP_NAME } from '../config';
import moment from 'moment';
import Head from 'next/head';


const Home = ({ categories }) => {
    const head = () => (
        <Head>
            <title>
            {APP_NAME}
            </title>
            <link rel="shortcut icon" href="/static/icons/favicon.ico" />
            <meta name="description" content={`top meal,meal,best meal,meal 's ratings,Best meal,top 10 best meal,Best restaurant for meal,best meal in pakistan,best meal in lahore`} />
            <meta property="og:title" content={APP_NAME} />
            <meta property="title" content={APP_NAME} />
            <meta property="og:description" content={`Find best meal in your area`}/>
            {/* logo here */}
        </Head>
    );

    const [state,setState]= useState({
        links:[]
    })
    const {links}=state;
    useEffect(()=>{
        loadLinks();
    },[])
   const loadLinks = async() =>{
       const response = await axios.get(`${API}/link/popular`);
       console.log("Main---",response.data);
       setState({...state,links:response.data});
   }
   
  const handleCount = async linkId => {
        const response = await axios.put(`${API}/click-count`, { linkId });
        loadUpdatedLinks();
    };
    const loadUpdatedLinks = async () => {
        loadLinks();
    };
    const listOfLinks = () =>{
       return links.map((l, i) => (
            <div key={i} className="row alert alert-primary p-2">
                <div className="col-md-8" onClick={e => handleCount(l._id)}>
                    <a href={l.url} target="_blank">
                        <h5 className="pt-2">{l.title}</h5>
                        <h6 className="pt-2 text-danger"style={{ fontSize: '12px' }}>
                            {l.url.substring(0, 110)}
                        </h6>
                    </a>
                </div>
                <div className="col-md-4 pt-2" >
                    <span className="pull-right">
                        {moment(l.createdAt).fromNow()} by {l.postedBy.name}
                    </span>
                    <br />
                    {/* <span className="badge text-secondary pull-right">{l.clicks} clicks</span> */}
                </div>
                <div className="col-md-12 mt-2" style={{"display":"flex","flexDirection":"row"}}>
                    <span className="badge text-dark">
                        {l.price}Rs / {l.gst}
                    </span>
                    <span className="badge text-success">{l.category.name}</span>
                     <span className="badge text-secondary pull-left ml-auto" style={{"marginRight":"18.6rem"}}>{l.clicks} clicks</span>

                </div>
            </div>
        ))}

    const listCategories = () =>
        categories.map((c, i) => (
            <Link href={`/links/${c.slug}`}>
                <a style={{ border: '1px solid black',margin: "4px 0px" }} className="bg-light p-3 col-md-4">
                    <div>
                        <div className="row">
                            <div className="col-md-4">
                                <img
                                    src={c.image && c.image.url}
                                    alt={c.name}
                                    style={{ width: '100px', height: 'auto' }}
                                    className="pr-3"
                                />
                            </div>
                            <div className="col-md-8">
                                <h3>{c.name}</h3>
                            </div>
                        </div>
                    </div>
                </a>
            </Link>
        ));

    return (
        <Fragment>
            {head()}
        <Layout>
            <div className="row">
                <div className="col-md-12">
                    <h1 className="font-weight-bold">Browse Your Favourite Food</h1>
                    <br />
                </div>
            </div>

            <div className="row">{listCategories()}</div>
            <div className="row mt-4">
                <h1 className='ml-4'>Most Popular</h1>
                <div className='col-md-12'>
                {listOfLinks()}
                </div>
            </div>
        </Layout>
       </Fragment> 
    );
};

Home.getInitialProps = async () => {
    const response = await axios.get(`${API}/categories`);
    return {
        categories: response.data
    };
};

export default Home;
