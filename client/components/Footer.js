import React from "react";
import Head from "next/head";

const Footer = () => {
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
  return (
    <>
      {head()}
      <footer className="page-footer font-small marg-f pt-4">
        <div className="footer-copyright text-center lower-f py-3 text-light">
          Made with ❤️ By
          <a
            href="https://www.linkedin.com/in/numananees/"
            target="_blank"
            className="footer-link"
          >
            {" "}
            Numan Anees
          </a>
        </div>
      </footer>
    </>
  );
};

export default Footer;
