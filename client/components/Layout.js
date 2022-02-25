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
        <ul className="nav navb bg-light">
            <li className="nav-item p-1">
                <Link href="/">
                    {/* <a className="nav-link text-light">Home</a> */}
                   <div>
                    <img src="/static/icons/1.png" alt="logo" height="50px" width="50px" className='logo'/> 
                    <label className='logo-label text-center'><span className='text-span3 text-center'>Top Dish</span></label>   
                </div>
                </Link>
            </li>   
            <li className="nav-item p-1">
                <Link href="/user/link/create">
                  <a className="nav-link text-dark font-italic text-center text-top"> <span className='text-span4'><span className='font-weight-bold link-loc'>&lt;</span>Submit a location<span className='font-weight-bold link-loc'>&gt;</span></span></a>
                </Link>
            </li> 

            {!isAuth() && (
                <>
                    <li className="nav-item p-1" style={{marginLeft:"auto "  }}>
                        <Link href="/login">
                            <a className="nav-link text-dark  text-center text-top"><span className='text-span4'>Login</span></a>
                        </Link>
                    </li>
                    <li className="nav-item p-1">
                        <Link href="/register">
                            <a className="nav-link text-dark  text-center text-top"><span className='text-span4'>Register</span></a>
                        </Link>
                    </li>
                </>
            )}

            {isAuth() && isAuth().role === 'admin' && (
                <li className="nav-item p-1" style={{marginLeft:"auto "}}>
                    <Link href="/admin">
                        <a className="nav-link text-dark  text-center text-top"> <span className='text-span4'>{isAuth().name}</span></a>
                    </Link>
                </li>
            )}

            {isAuth() && isAuth().role === 'subscriber' && (
                <li className="nav-item p-1" style={{marginLeft:"auto "  }}>
                    <Link href="/user">
                        <a className="nav-link text-dark  text-center text-top"><span className='text-span4'>{isAuth().name}</span></a>
                    </Link>
                </li>
            )}

            {isAuth() && (
                <li className="nav-item pointer p-1">
                    <a onClick={logout} className="nav-link text-dark  text-center text-top">
                      <span className='text-span4'>Logout</span>
                    </a>
                </li>
            )}
        </ul>
    );

    return (
        <>
            {head()} {nav()} <div className='bg-col'>{children}</div>
        </>
    );
};

export default Layout;
