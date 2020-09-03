import React, { useEffect, useState } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";

const Anatomy = (props) => {
  if (!props.components || props.components.length < 1) return null;
  return (
    <div>
      <h4>Outerwear</h4>
      <ul>
        {props.components
          .filter((c) => c.type === "JACKET")
          .map((c) => (
            <li key={c.id}>{`${c.brand.name} ${c.model} ${c.year}`}</li>
          ))}
      </ul>
      <h4>Layers</h4>
      <ul>
        {props.components
          .filter((c) => c.type === "LAYER")
          .map((c) => (
            <li key={c.id}>{`${c.brand.name} ${c.model} ${c.year}`}</li>
          ))}
      </ul>
      <h4>Pants</h4>
      <ul>
        {props.components
          .filter((c) => c.type === "PANT")
          .map((c) => (
            <li key={c.id}>{`${c.brand.name} ${c.model} ${c.year}`}</li>
          ))}
      </ul>
      <h4>Carry</h4>
      <ul>
        {props.components
          .filter((c) => c.type === "BAG")
          .map((c) => (
            <li key={c.id}>{`${c.brand.name} ${c.model} ${c.year}`}</li>
          ))}
      </ul>
      <h4>Shoes</h4>
      <ul>
        {props.components
          .filter((c) => c.type === "SHOE")
          .map((c) => (
            <li key={c.id}>{`${c.brand.name} ${c.model} ${c.year}`}</li>
          ))}
      </ul>
      <h4>Extra</h4>
      <ul>
        {props.components
          .filter((c) => c.type === "EXTRA")
          .map((c) => (
            <li key={c.id}>{`${c.brand.name} ${c.model} ${c.year}`}</li>
          ))}
      </ul>
      {props.desc && (
        <>
          <h4>Comment</h4>
          {props.desc}
        </>
      )}
    </div>
  );
};
export default Anatomy;
