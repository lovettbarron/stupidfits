import React, { useEffect, useState } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { Tabs, Tab, FILL } from "baseui/tabs-motion";
import CommentBox from "./CommentBox";
import Clicker from "./Clicker";
import { types } from "./CreateItem";

export const Cap = (brand) => {
  const words = brand.split(" ");

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }

  return words.join(" ");
};

const WithComments = (props) => {
  const [activeKey, setActiveKey] = React.useState("0");

  // if (props.disable) return <>{props.children}</>;
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

const Filter = ({ items, filter }) => {
  const header = types.find((i) => i.id === filter).label;
  let list = null;

  const filtered = items.filter((f) => f.type === filter);
  if (filtered.length <= 0) return null;

  if (!filter) {
    list = (
      <ul className="anatomy">
        {items.map((i) => (
          <li key={i.id}>
            <Link href={`/brand/${i.brand.name}`}>
              <a>{`${Cap(i.brand.name)}`}</a>
            </Link>{" "}
            {`${i.model} ${i.year > 0 ? i.year : ""}`}
          </li>
        ))}
      </ul>
    );
  } else {
    list = (
      <>
        <h4>{header}</h4>
        <ul className="anatomy">
          {filtered.map((i) => (
            <li key={i.id}>
              <Link href={`/brand/${i.brand.name}`}>
                <a>{`${Cap(i.brand.name)}`}</a>
              </Link>{" "}
              {`${i.model} ${i.year > 0 ? i.year : ""}`}
            </li>
          ))}
        </ul>
      </>
    );
  }

  return <>{list}</>;
};

const Anatomy = (props) => {
  if (!props.components || props.components.length < 1) return null;
  return (
    <WithComments id={props.id} disable={props.nocomment}>
      <div>
        <Filter items={props.components} filter={"JACKET"} />
        <Filter items={props.components} filter={"LAYER"} />
        <Filter items={props.components} filter={"SHIRT"} />
        <Filter items={props.components} filter={"PANT"} />
        <Filter items={props.components} filter={"BAG"} />
        <Filter items={props.components} filter={"SHOE"} />
        <Filter items={props.components} filter={"EXTRA"} />

        {props.desc && (
          <>
            <h4>Comment</h4>
            {props.desc}
          </>
        )}
      </div>
    </WithComments>
  );
};

export default Anatomy;
