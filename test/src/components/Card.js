import React from "react";
const Card = ({ img, name }) => {
  return (
    <div>
      <div className="full-card">
        <div className="image">
          <img src={img} alt="" />
        </div>
        <div className="Recipie-Name">{name}</div>
      </div>
    </div>
  );
};

export default Card;
