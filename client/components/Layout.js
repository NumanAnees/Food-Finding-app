import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import { isAuth, logout } from '../helpers/auth';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

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
                crossOrigin="anonymous"
            />
            <link rel="stylesheet" href="/static/styles/style.css" />
        </>
    );

    const nav = () => (
        <ul className="nav nav-tabs bg-dark">
            <li className="nav-item p-1">
                <Link href="/">
                    <a className="nav-link text-light">Home</a>
                </Link>
            </li>   
            <li className="nav-item p-1">
                <Link href="/user/link/create">
                  <a className="nav-link text-light font-italic"> <span className='font-weight-bold link-loc'>&lt;</span>Submit a location<span className='font-weight-bold link-loc'>&gt;</span></a>
                </Link>
            </li> 

            {!isAuth() && (
                <>
                    <li className="nav-item p-1" style={{marginLeft:"auto "  }}>
                        <Link href="/login">
                            <a className="nav-link text-light">Login</a>
                        </Link>
                    </li>
                    <li className="nav-item p-1">
                        <Link href="/register">
                            <a className="nav-link text-light">Register</a>
                        </Link>
                    </li>
                </>
            )}

            {isAuth() && isAuth().role === 'admin' && (
                <li className="nav-item p-1" style={{marginLeft:"auto "}}>
                    <Link href="/admin">
                        <a className="nav-link text-light">{isAuth().name}</a>
                    </Link>
                </li>
            )}

            {isAuth() && isAuth().role === 'subscriber' && (
                <li className="nav-item p-1" style={{marginLeft:"auto "  }}>
                    <Link href="/user">
                        <a className="nav-link text-light">{isAuth().name}</a>
                    </Link>
                </li>
            )}

            {isAuth() && (
                <li className="nav-item pointer p-1">
                    <a onClick={logout} className="nav-link text-light ">
                        Logout
                    </a>
                </li>
            )}
        </ul>
    );

    return (
        <>
            {head()} {nav()} <div className="container pt-5 pb-5">{children}</div>
        </>
    );
};

export default Layout;
