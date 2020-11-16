import React, { useState } from "react";
import { NextSeo } from "next-seo";
import Layout from "../../components/Layout";
import fetch from "isomorphic-unfetch";
import ReviewBox from "../../components/ReviewBox";
import Link from "next/link";
import { useSession, signin, signout } from "next-auth/client";
import { extractHostname } from "../../components/Clicker";
import { Button } from "baseui/button";

const Reviews = (props) => {
  const [session, loading] = useSession();
  const [instagram, setInstagram] = useState("");

  // console.log("session", props.user);
  return (
    <>
      <Layout>
        <div className="page">
          {session && (
            <>
              <h3>Hej {props.user.username}</h3>
              {(props.user.username && (
                <p className="center">
                  <Link href="/review/create">
                    <a>
                      <Button>Write a Review</Button>
                    </a>
                  </Link>
                </p>
              )) || (
                <p>
                  Create a public page by adding a username
                  <br />
                  <Link href={"/me"}>
                    <a>Go to your Settings page</a>
                  </Link>
                </p>
              )}
            </>
          )}

          <h3>Recent Reviews</h3>
          <div className="reviews">
            {props.feed &&
              Array.isArray(props.feed) &&
              props.feed
                .filter((f) => ["FEATURED", "PUBLIC"].includes(f.status))
                .sort((a, b) => {
                  return b.createdAt - a.createdAt;
                })
                .map((r) => <ReviewBox key={r.id} {...r} />)}
          </div>
          <footer>
            <ul>
              <li>
                <Link href="/wtf">
                  <a>WTF is this?</a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a>Privacy</a>
                </Link>
              </li>
              <li>
                <Link href="/tos">
                  <a>Terms</a>
                </Link>
              </li>
              <li>
                <Link href="/cookie">
                  <a>Cookies</a>
                </Link>
              </li>
            </ul>
          </footer>
        </div>
        <style jsx>{`
          header > h1 {
            margin: 0;
          }

          .reviews {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
          }

          ol {
            padding: 0;
            text-align: left;
          }

          .main {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
          }

          .col {
            width: 50%;
          }

          @media screen and (max-width: 800px) {
            .col {
              width: 100%;
            }
          }

          p.center {
            margin: 0 auto;
          }

          footer ul {
            padding: 0;
          }

          footer li {
            list-style: none;
          }
          .post {
          }
          .auth img {
            max-width: 20rem;
            transition: all 0.4s;
          }
          .auth img:hover {
            -webkit-filter: invert(1);
            filter: invert(1);
            background: black;
          }

          .post:hover {
          }

          .post + .post {
            margin-top: 2rem;
          }

          footer {
          }

          footer ul {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
          }

          footer li {
            margin: 2rem;
          }
        `}</style>
      </Layout>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const userres = await fetch(`${process.env.HOST}/api/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: context.req.headers.cookie,
    },
  });

  let user = null;
  try {
    user = await userres.json();
  } catch (e) {
    console.log("error:", e.message);
  }

  const res = await fetch(`${process.env.HOST}/api/review`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: context.req.headers.cookie,
    },
  });
  let feed = [];
  try {
    feed = await res.json();
  } catch (e) {
    console.log("error:", e.message);
  }
  return {
    props: { feed, user, url: process.env.HOST },
  };
};

export default Reviews;
