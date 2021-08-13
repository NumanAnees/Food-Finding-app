import { React, useState } from "react";
import Card from "./Card";
import a from "../images/a.jpg";
import b from "../images/b.jpg";
import c from "../images/c.png";
import d from "../images/d.png";
import e from "../images/e.png";

const Recipies = ["Burger", "Shuwarma", " Biryani", "Pizza", "Cake", "Bottle"];
const Items = () => {
  const [state, setstate] = useState("");
  function findRecipie(e) {
    setstate(e.target.value);
  }

  return (
    <div>
      <h1>{state}</h1>
      <div className="item-page-main">
        <form action="" className="form">
          <input
            type="text"
            placeholder="Search for any item...."
            className="inp-field"
            onChange={(e) => {
              console.log(e.target.value);
            }}
          />
          <button className="btn-green">Find</button>
        </form>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <Card img={a} name={Recipies[0]} />
          </div>
          <div className="col-md-4">
            <Card img={b} name={Recipies[1]} />
          </div>
          <div className="col-md-4">
            <Card img={c} name={Recipies[2]} />
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <Card img={d} name={Recipies[3]} />
          </div>
          <div className="col-md-4">
            <Card img={e} name={Recipies[4]} />
          </div>
          <div className="col-md-4">
            <Card img={e} name={Recipies[5]} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Items;
