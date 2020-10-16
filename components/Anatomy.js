import React, { useEffect, useState } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { Tabs, Tab, FILL } from "baseui/tabs-motion";
import CommentBox from "./CommentBox";
import Clicker from "./Clicker";

export const Cap = (brand) => {
  const words = brand.split(" ");

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }

  return words.join(" ");
};

const WithComments = (props) => {
  const [activeKey, setActiveKey] = React.useState("0");

  if (props.disable) return <>{props.children}</>;
  return (
    <Tabs
      activeKey={activeKey}
      fill={FILL.fixed}
      onChange={({ activeKey }) => {
        setActiveKey(activeKey);
      }}
      activateOnFocus
    >
      <Tab title="Anatomy">{props.children}</Tab>
      <Tab title="Comments">
        <CommentBox id={props.id} />
      </Tab>
    </Tabs>
  );
};

const Anatomy = (props) => {
  if (!props.components || props.components.length < 1) return null;
  return (
    <WithComments id={props.id} disable={props.nocomment}>
      <div>
        {props.components.find((c) => c.type === "JACKET") && (
          <>
            <h4>Outerwear</h4>
            <ul>
              {props.components
                .filter((c) => c.type === "JACKET")
                .map((c) => (
                  <li key={c.id}>{`${Cap(c.brand.name)} ${c.model} ${
                    c.year > 0 ? c.year : ""
                  }`}</li>
                ))}
            </ul>
          </>
        )}
        {props.components.find((c) => c.type === "LAYER") && (
          <>
            <h4>Layers</h4>
            <ul>
              {props.components
                .filter((c) => c.type === "LAYER")
                .map((c) => (
                  <li key={c.id}>
                    <Clicker {...c}>
                      {`${Cap(c.brand.name)} ${c.model} ${
                        c.year > 0 ? c.year : ""
                      }`}
                    </Clicker>
                  </li>
                ))}
            </ul>
          </>
        )}
        {props.components.find((c) => c.type === "PANT") && (
          <>
            <h4>Bottoms</h4>
            <ul>
              {props.components
                .filter((c) => c.type === "PANT")
                .map((c) => (
                  <li key={c.id}>
                    <Clicker {...c}>
                      {`${Cap(c.brand.name)} ${c.model} ${
                        c.year > 0 ? c.year : ""
                      }`}
                    </Clicker>
                  </li>
                ))}
            </ul>
          </>
        )}
        {props.components.find((c) => c.type === "BAG") && (
          <>
            <h4>Carry</h4>
            <ul>
              {props.components
                .filter((c) => c.type === "BAG")
                .map((c) => (
                  <Clicker {...c}>
                    <li key={c.id}>{`${Cap(c.brand.name)} ${c.model} ${
                      c.year > 0 ? c.year : ""
                    }`}</li>
                  </Clicker>
                ))}
            </ul>
          </>
        )}
        {props.components.find((c) => c.type === "SHOE") && (
          <>
            <h4>Shoes</h4>
            <ul>
              {props.components
                .filter((c) => c.type === "SHOE")
                .map((c) => (
                  <Clicker {...c}>
                    <li key={c.id}>{`${Cap(c.brand.name)} ${c.model} ${
                      c.year > 0 ? c.year : ""
                    }`}</li>
                  </Clicker>
                ))}
            </ul>
          </>
        )}
        {props.components.find((c) => c.type === "EXTRA") && (
          <>
            <h4>Extra</h4>
            <ul>
              {props.components
                .filter((c) => c.type === "EXTRA")
                .map((c) => (
                  <Clicker {...c}>
                    <li key={c.id}>{`${Cap(c.brand.name)} ${c.model} ${
                      c.year > 0 ? c.year : ""
                    }`}</li>
                  </Clicker>
                ))}
            </ul>
          </>
        )}
        {props.desc && (
          <>
            <h4>Comment</h4>
            {props.desc}
          </>
        )}
      </div>
      <style jsx>
        {`
          ul {
            display: flex;
            flex-wrap: wrap;
            list-style: none !important;
            list-style-type: none !important;
            text-align: center;
            justify-contents: center;
          }

          li {
            justify-self: center;
            width: 100%;
            text-align: center;
            padding: 0;
            margin: 0 1rem;
            list-style: none !important;
            list-style-type: none !important;
          }
        `}
      </style>
    </WithComments>
  );
};
export default Anatomy;
