import React, { Component } from "react";
import { Link } from "react-router-dom";

const ListGroup = ({
  items,
  currentItem,
  onItemSelect,
  textProperty,
  valueProperty,
}) => {
  return (
    <React.Fragment>
      <ul className="list-group">
        {items.map((item) => (
          <li
            onClick={() => onItemSelect(item)}
            key={item}
            className={
              item === currentItem
                ? "list-group-item active"
                : "list-group-item"
            }
          >
            {item}
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
};
ListGroup.defaultProps = {
  textProperty: "name",
  valueProperty: "_id",
};
export default ListGroup;
