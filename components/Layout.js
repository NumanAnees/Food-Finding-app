import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import NProgress from "nprogress";
import "nprogress/nprogress.css";

Router.onRouteChangeStart = url => NProgress.start();
Router.onRouteChangeComplete = url => NProgress.done();
Router.onRouteChangeError = url => NProgress.done();


const Layout = ({ children }) => {
    const head = () => (
       <>
        <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
            integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
            crossorigin="anonymous"
        />
        <link rel="stylesheet" href="/static/styles/style.css" />
        </>
    );

    const nav = () => (
        <ul className="nav nav-tabs bg-dark">
            <Link  href="/">
            <li className="nav-item">
                <a className="nav-link text-light pointer">
                    Home
                </a>
            </li>
            </Link>
            <Link href="/login">
            <li className="nav-item">
                <a className="nav-link text-light pointer" >
                    Login
                </a>
            </li>
            </Link>
            <Link href="/register"> 
            <li className="nav-item">
                <a className="nav-link text-light pointer" >
                    Register
                </a>
            </li>
            </Link>
        </ul>
    );

    return (
        <>
            {head()} {nav()} <div className="container pt-5 pb-5">{children}</div>
        </>
    );
};

export default Layout;
