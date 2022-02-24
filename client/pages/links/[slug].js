import { useState,useEffect,Fragment } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';
import axios from 'axios';
import renderHTML from 'react-render-html';
import moment from 'moment';
import { API,APP_NAME } from '../../config';
import InfiniteScroll from 'react-infinite-scroller';
import Head from 'next/head';
import {CaretUpFilled} from "@ant-design/icons";
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { Button } from 'antd';
import  Router  from 'next/router';


const Links = ({ query, category, links, totalLinks, linksLimit, linkSkip }) => {
    const [allLinks, setAllLinks] = useState(links);
    const [limit, setLimit] = useState(linksLimit);
    const [skip, setSkip] = useState(0);
    const [size, setSize] = useState(totalLinks);
    const [popular, setPopular] = useState([]);
    const [uid, setUid] = useState("");

    const stripHTML = data => data.replace(/<\/?[^>]+(>|$)/g, '');
    const head = () => (
        <Head>
            <title>
                {category.name} | {APP_NAME}
            </title>
            <link rel="shortcut icon" href="/static/icons/favicon.ico" />
            <meta name="description" content={stripHTML(`top ${category.name},${category.name},best ${category.name},${category.name} 's ratings,Best ${category.name},top 10 best ${category.name},Best restaurant for ${category.name},best ${category.name} in pakistan,best ${category.name} in lahore`)} />
            <meta property="og:title" content={category.name} />
            <meta property="og:description" content={stripHTML(category.content.substring(0, 160))} />
            <meta property="og:image" content={category.image.url} />
            <meta property="og:image:secure_url" content={category.image.url} />
        </Head>
    );

      useEffect(() => {
        loadPopular();
        const user = JSON.parse(localStorage.getItem('user'));
        if(user){
        setUid(user._id);
        }
    }, []);
     const loadPopular = async () => {
        const response = await axios.get(`${API}/link/popular/${category.slug}`);
        // console.log(response);
        setPopular(response.data);
    };
  const handleCount = async linkId => {
        const response = await axios.put(`${API}/click-count`, { linkId });
        loadUpdatedLinks();
        loadPopular();
    };
    const loadUpdatedLinks = async () => {
        const response = await axios.post(`${API}/category/${query.slug}`);
        setAllLinks(response.data.links);
    };
    const listOfPopularLinks = () =>
        popular.map((l, i) => (
            <div key={i} className="row alert alert-secondary p-2">
                <div className="col-md-8" onClick={() => handleCount(l._id)}>
                    <a href={l.url} target="_blank">
                        <h5 className="pt-2">{l.title}</h5>
                        <h6 className="pt-2 text-danger" style={{ fontSize: '12px' }}>
                            {l.url.substring(0, 30)}
                        </h6>
                    </a>
                </div>

                <div className="col-md-4 pt-2">
                    <span className="pull-right">
                        {moment(l.createdAt).fromNow()}
                    </span>
                </div>

                <div className="col-md-12">
                    <span className="badge text-dark">
                        {l.price}Rs / {l.gst}
                    </span>
                    <span className="badge text-secondary pull-right">{l.clicks} clicks</span>
                </div>
            </div>
        ));
    const handleUpvote= async(linkId,upvArray)=>{
       const user = JSON.parse(localStorage.getItem('user'));
       if(user){
        const userId = user._id;
        if(!(upvArray.includes(userId))){
        const response = await axios.put(`${API}/upvote`, { linkId,userId });
        loadUpdatedLinks();
        }else{
        const response = await axios.put(`${API}/downvote`, { linkId,userId });
        loadUpdatedLinks();
        }
        }
        else{
            Router.push("/login")
        }
    }
    const listOfLinks = () =>{
       return allLinks.map((l, i) => {
         return <div key={i} className="row alert alert-primary p-2">
                <div className="col-md-8 d-flex">
                    <div className="col-md-2 mt-auto">
                        {l.upvoteIDs.includes(uid) ?
                        <Button style={{"height": "4.7rem","width": "4.5rem", "margin-left": "-2rem", "backgroundColor":"#4daf4e","marginBottom":"0.3rem","borderRadius":"5px"}} onClick={e => handleUpvote(l._id,l.upvoteIDs)} >
                         <CaretUpFilled  style={{"fontSize":"34px","color":"white",}}/> 
                         <h6 style={{"color":"white"}}>{l.upvotes}</h6>       
                        </Button>
                        :
                        <Button style={{"height": "4.7rem","width": "4.5rem", "margin-left": "-2rem", "backgroundColor":"#f5f5f5","marginBottom":"0.3rem","borderRadius":"5px"}} onClick={e => handleUpvote(l._id,l.upvoteIDs)} >
                         <CaretUpFilled  style={{"fontSize":"27px","color":"gray",}}/> 
                         <h6>{l.upvotes}</h6>       
                        </Button>
                        }
                    </div>
                    <div>
                        <div>
                        <a href={l.url} target="_blank" onClick={e => handleCount(l._id)}>
                            <h5 className="">{l.title}</h5>
                            <h6 className=" text-danger" style={{ fontSize: '12px' }}>
                                {l.url.substring(0, 50)}
                            </h6>
                        </a>
                        </div>    
                        <div className="mt-2" style={{"display":"flex","flexDirection":"row"}}>
                            <span className="badge text-info">
                                 {l.price} Rupees / GST {l.gst}
                            </span>
                            <span className="badge text-success">{l.category.name}</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 d-flex flex-column" >
                    <span className="pull-right text-center">
                        {moment(l.createdAt).fromNow()} by {l.postedBy.name}
                    </span>
                    <span className="badge text-secondary text-center" style={{"marginTop":"auto"}}>{l.clicks} clicks</span>
                </div>
            </div>
            })}
    const loadMore = async () => {
        let newSkip = skip + limit ;
        const response = await axios.post(`${API}/category/${query.slug}`, { skip: newSkip, limit });
        console.log("----",response);
        if(response){    
        setAllLinks([...allLinks, ...response.data.links]);
        }
        setSize(response.data.links.length);
        setSkip(newSkip);
        return;
    };

    return (
        <Fragment>
        {head()}
        <Layout>
            <div className="container pt-5 pb-5">
            <div className="row">
                <div className="col-md-8">
                    <h1 className="display-4 font-weight-bold">{category.name} - URL/Links</h1>
                    <div className="lead alert alert-secondary pt-4">{renderHTML(category.content || '')}</div>
                </div>
                <div className="col-md-4 mt-4 d-flex">
                    <img src={category.image.url}alt={category.name} style={{ width: 'auto', maxHeight: '280px' }} />
                </div>
            </div>
            <br />
            <InfiniteScroll
                pageStart={0}
                loadMore={loadMore}
                hasMore={size > 0 && size >= limit}
                loader={<img key={0} src="/static/images/loading.gif" alt="loading" />}
            >
               <div className="row">
                    <div className="col-md-8">{listOfLinks()}</div>
                    <div className="col-md-4">
                        <h2 className="lead">Trending in {category.name}</h2>
                        <div className="p-3">{listOfPopularLinks()}</div>
                    </div>
                </div>

            </InfiniteScroll>
            </div>
            </Layout>
        </Fragment>
    );
};

Links.getInitialProps = async ({ query, req }) => {
    let skip = 0;
    let limit = 10;

    const response = await axios.post(`${API}/category/${query.slug}`, { skip, limit });
    return {
        query,
        category: response.data.category,
        links: response.data.links,
        totalLinks: response.data.links.length,
        linksLimit: limit,
        linkSkip: skip,
    };
};

export default Links;
