import React, { useState } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import fetch from "isomorphic-unfetch";
import Post from "../components/Post";
import FitBox from "../components/FitBox";

import { Tabs, Tab, FILL } from "baseui/tabs-motion";
import { Cap } from "../components/Anatomy";

import { useSession } from "next-auth/client";

const Filter = ({ items, filter }) => {
  if (!filter)
    return (
      <>
        {items.map((i) => (
          <>
            <h3>{i.model}</h3>
            {i.fit && i.fit.map((f) => <FitBox key={f.id} {...f} fit={f.id} />)}
          </>
        ))}
      </>
    );

  const filtered = items.filter((f) => f.type === filter);

  if (filtered.length <= 0) return <div>Nothing yet</div>;

  return (
    <>
      {filtered.map((i) => (
        <>
          <h3>{i.model}</h3>
          {i.fit && i.fit.map((f) => <FitBox key={f.id} {...f} fit={f.id} />)}
        </>
      ))}
    </>
  );
};

const Closet = (props) => {
  const [session, loading] = useSession();
  const [activeKey, setActiveKey] = React.useState("0");

  const editItem = (id) => {};

  const deleteItem = (id) => {};

  return (
    <Layout>
      <div className="page">
        <header>
          <h1>Closet</h1>
        </header>

        <main>
          <Link href="/item">
            <a>
              <button>Add an item</button>
            </a>
          </Link>
          <Tabs
            activeKey={activeKey}
            fill={FILL.fixed}
            onChange={({ activeKey }) => {
              setActiveKey(activeKey);
            }}
            activateOnFocus
          >
            <Tab title="Outerwear">
              <ul>
                {props.items
                  .filter((c) => c.type === "JACKET")
                  .map((c) => (
                    <li key={c.id} onClick={() => editItem(c.id)}>
                      {`${Cap(c.brand.name)} ${c.model} ${
                        c.year > 0 ? c.year : ""
                      }`}
                      <br />
                      <div className="hover">
                        <Link href={`/item/${c.id}`}>
                          <a>Edit</a>
                        </Link>{" "}
                        ·{" "}
                        <Link href="/">
                          <a>Delete</a>
                        </Link>
                      </div>
                    </li>
                  ))}
              </ul>
            </Tab>

            <Tab title="Layers">
              <ul>
                {props.items
                  .filter((c) => c.type === "LAYER")
                  .map((c) => (
                    <li key={c.id}>
                      {`${Cap(c.brand.name)} ${c.model} ${
                        c.year > 0 ? c.year : ""
                      }`}{" "}
                      <br />
                      <div className="hover">
                        <Link href={`/item/${c.id}`}>
                          <a>Edit</a>
                        </Link>{" "}
                        ·{" "}
                        <Link href="/">
                          <a>Delete</a>
                        </Link>
                      </div>
                    </li>
                  ))}
              </ul>
            </Tab>

            <Tab title="Shirts">
              <ul>
                {props.items
                  .filter((c) => c.type === "SHIRT")
                  .map((c) => (
                    <li key={c.id}>
                      {`${Cap(c.brand.name)} ${c.model} ${
                        c.year > 0 ? c.year : ""
                      }`}{" "}
                      <br />
                      <div className="hover">
                        <Link href={`/item/${c.id}`}>
                          <a>Edit</a>
                        </Link>{" "}
                        ·{" "}
                        <Link href="/">
                          <a>Delete</a>
                        </Link>
                      </div>
                    </li>
                  ))}
              </ul>
            </Tab>

            <Tab title="Bottoms">
              <ul>
                {props.items
                  .filter((c) => c.type === "PANT")
                  .map((c) => (
                    <li key={c.id}>
                      {`${Cap(c.brand.name)} ${c.model} ${
                        c.year > 0 ? c.year : ""
                      }`}{" "}
                      <br />
                      <div className="hover">
                        <Link href={`/item/${c.id}`}>
                          <a>Edit</a>
                        </Link>{" "}
                        ·{" "}
                        <Link href="/">
                          <a>Delete</a>
                        </Link>
                      </div>
                    </li>
                  ))}
              </ul>
            </Tab>
            <Tab title="Carry">
              <ul>
                {props.items
                  .filter((c) => c.type === "BAG")
                  .map((c) => (
                    <li key={c.id}>
                      {`${Cap(c.brand.name)} ${c.model} ${
                        c.year > 0 ? c.year : ""
                      }`}{" "}
                      <br />
                      <div className="hover">
                        <Link href={`/item/${c.id}`}>
                          <a>Edit</a>
                        </Link>{" "}
                        ·{" "}
                        <Link href="/">
                          <a>Delete</a>
                        </Link>
                      </div>
                    </li>
                  ))}
              </ul>
            </Tab>
            <Tab title="Shoes">
              <ul>
                {props.items
                  .filter((c) => c.type === "SHOE")
                  .map((c) => (
                    <li key={c.id}>
                      {`${Cap(c.brand.name)} ${c.model} ${
                        c.year > 0 ? c.year : ""
                      }`}{" "}
                      <br />
                      <div className="hover">
                        <Link href={`/item/${c.id}`}>
                          <a>Edit</a>
                        </Link>{" "}
                        ·{" "}
                        <Link href="/">
                          <a>Delete</a>
                        </Link>
                      </div>
                    </li>
                  ))}
              </ul>
            </Tab>
            <Tab title="Extra">
              <ul>
                {props.items
                  .filter((c) => c.type === "EXTRA")
                  .map((c) => (
                    <li key={c.id}>
                      {`${Cap(c.brand.name)} ${c.model} ${
                        c.year > 0 ? c.year : ""
                      }`}{" "}
                      <br />
                      <div className="hover">
                        <Link href={`/item/${c.id}`}>
                          <a>Edit</a>
                        </Link>{" "}
                        ·{" "}
                        <Link href="/">
                          <a>Delete</a>
                        </Link>
                      </div>
                    </li>
                  ))}
              </ul>
            </Tab>
          </Tabs>
        </main>
      </div>
      <style jsx>{`
        .post:hover {
        }

        .post + .post {
          margin-top: 2rem;
        }

        footer {
        }

        ul {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          font-size: 1rem;
        }

        li {
          margin: 1rem;
          list-style: none !important;
        }

        .hover {
          opacity: 0;
          transition: opacity 0.4s;
        }

        li:hover > .hover {
          opacity: 1;
        }
      `}</style>
    </Layout>
  );
};

export const getServerSideProps = async (context) => {
  const res = await fetch(`${process.env.HOST}/api/item`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: context.req.headers.cookie,
    },
  });
  let items;
  try {
    items = await res.json();
  } catch (e) {
    console.log("error:", e.message);
  }
  return {
    props: { items, url: process.env.HOST },
  };
};

export default Closet;
