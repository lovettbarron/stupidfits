import React, { useState } from "react";
import { NextSeo } from "next-seo";
import Layout from "../../components/Layout";
import fetch from "isomorphic-unfetch";
import FitBox from "../../components/FitBox";
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
          <header>
            <h1>Stupid Fits</h1>
            <h2>Fit Reviews</h2>
          </header>
          {!session && (
            <>
              <div className="main">
                <div className="col">
                  <a className="auth" onClick={signin}>
                    <img src={`/img/login.png`} />
                  </a>
                </div>
              </div>

              <hr />
            </>
          )}
          {session && (
            <>
              <h3>Hej {props.user.username}</h3>
              {(props.user.username && (
                <p className="center">
                  Your public page is
                  <br />
                  <Link href={`${process.env.HOST}/u/${props.user.username}`}>
                    <a>
                      {extractHostname(process.env.HOST)}
                      /u/{props.user.username}
                    </a>
                  </Link>
                  <br />
                  <br />
                  <Link href="/feed">
                    <a>
                      <Button>Add New Fits</Button>
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

          <h3>
            {(session && session.user && "Your recent fits") ||
              "Recent Featured Fits"}
          </h3>
          <main>
            {props.feed &&
              Array.isArray(props.feed) &&
              props.feed
                .filter((f) =>
                  session && session.user ? true : f.status === "FEATURED"
                )
                .sort((a, b) => {
                  return b.media[0].timestamp - a.media[0].timestamp;
                })
                .map((r) => <ReviewBox key={r.id} {...r} />)}
          </main>
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
