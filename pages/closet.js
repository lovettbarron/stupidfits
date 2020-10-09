import React, { useState } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import fetch from "isomorphic-unfetch";
import Post from "../components/Post";
import FitBox from "../components/FitBox";

import { useSession } from "next-auth/client";

const Blog = (props) => {
  const [session, loading] = useSession();

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
          <h2>Outerwear</h2>
          <ul>
            {props.items
              .filter((c) => c.type === "JACKET")
              .map((c) => (
                <li onClick={() => editItem(c.id)}>
                  {`${c.brand.name} ${c.model} ${c.year > 0 ? c.year : ""}`}
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
          <h2>Layers</h2>
          <ul>
            {props.items
              .filter((c) => c.type === "LAYER")
              .map((c) => (
                <li>
                  {`${c.brand.name} ${c.model} ${c.year > 0 ? c.year : ""}`}{" "}
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
          <h2>Pants</h2>
          <ul>
            {props.items
              .filter((c) => c.type === "PANT")
              .map((c) => (
                <li>
                  {`${c.brand.name} ${c.model} ${c.year > 0 ? c.year : ""}`}{" "}
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
          <h2>Carry</h2>
          <ul>
            {props.items
              .filter((c) => c.type === "BAG")
              .map((c) => (
                <li>
                  {`${c.brand.name} ${c.model} ${c.year > 0 ? c.year : ""}`}{" "}
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
          <h2>Shoes</h2>
          <ul>
            {props.items
              .filter((c) => c.type === "SHOE")
              .map((c) => (
                <li>
                  {`${c.brand.name} ${c.model} ${c.year > 0 ? c.year : ""}`}{" "}
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
          <h2>Extra</h2>
          <ul>
            {props.items
              .filter((c) => c.type === "EXTRA")
              .map((c) => (
                <li>
                  {`${c.brand.name} ${c.model} ${c.year > 0 ? c.year : ""}`}{" "}
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

export default Blog;
