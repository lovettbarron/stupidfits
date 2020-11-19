import React, { useState } from "react";
// import { NextSeo } from "next-seo";
import Layout from "../components/Layout";
import fetch from "isomorphic-unfetch";
import Post from "../components/Post";
import FitMini from "../components/FitMini";
import ReviewBox from "../components/ReviewBox";
import Link from "next/link";
import { useSession, signin, signout } from "next-auth/client";
import { extractHostname } from "../components/Clicker";
import { Button } from "baseui/button";
import { Tabs, Tab, FILL } from "baseui/tabs-motion";

const Main = (props) => {
  const [session, loading] = useSession();
  const [instagram, setInstagram] = useState("");
  const [activeKey, setActiveKey] = React.useState("0");
  // console.log("session", props.user);
  return (
    <>
      <Layout>
        <div className="page">
          {!session && (
            <>
              <div className="main">
                <div className="col">
                  <a className="auth" onClick={signin}>
                    <img alt="Login or Create Account" src={`/img/login.png`} />
                  </a>
                </div>
                <div className="col">
                  <h3 style={{ textAlign: "left" }}>
                    Stupidfits is an outfit diary that exports to other socials,
                    connects reviews to real fits, and more.
                  </h3>
                  <ol>
                    <li>Sync fit pics from Instagram or Upload directly.</li>
                    <li>
                      Quickly link outfits with your wardrobe (and build a
                      digital closet over time)
                    </li>
                    <li>
                      Create a public or private outfit-focused blog,{" "}
                      <Link href="/u/stupidfits">
                        <a>like this one</a>
                      </Link>
                    </li>
                    <li>
                      Easily export and Share outfits as{" "}
                      <a href="/export.png" target="_blank">
                        images
                      </a>
                      ,{" "}
                      <a href="https://stupidfits.com/f/16" target="_blank">
                        posts
                      </a>
                      , lists, etc.
                    </li>
                    <li>Private or public, you decide.</li>
                    <li>Option to Auto-hide faces</li>
                  </ol>
                </div>
              </div>
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

          <main className="main">
            <Tabs
              activeKey={activeKey}
              fill={FILL.fixed}
              onChange={({ activeKey }) => {
                setActiveKey(activeKey);
              }}
              activateOnFocus
            >
              {/* <Tab title="All">
                <div className="main">
                  {props.feed &&
                    Array.isArray(props.feed) &&
                    [...props.feed, ...props.review]
                      .filter((f) =>
                        session && session.user ? true : f.status === "FEATURED"
                      )
                      .sort((a, b) => {
                        return a.createdAt - b.createdAt;
                        // return b.media[0].timestamp - a.media[0].timestamp;
                      })
                      .map((fit) =>
                        fit.title ? (
                          <ReviewBox key={"r" + fit.id} {...fit} />
                        ) : (
                          <FitMini key={"f" + fit.id} {...fit} fit={fit.id} />
                        )
                      )}
                </div>
              </Tab> */}
              <Tab
                title={
                  (session && session.user && "Recent Fits") || "Featured Fits"
                }
              >
                <div className="main">
                  {props.feed &&
                    Array.isArray(props.feed) &&
                    props.feed
                      .filter((f) =>
                        session && session.user ? true : f.status === "FEATURED"
                      )
                      .sort((a, b) => {
                        // return b.createdAt - a.createdAt;
                        return b.media[0].timestamp - a.media[0].timestamp;
                      })
                      .map((fit) => (
                        <FitMini key={"f" + fit.id} {...fit} fit={fit.id} />
                      ))}
                </div>
              </Tab>
              <Tab title="Recent Reviews">
                <div className="main">
                  {props.feed &&
                    Array.isArray(props.feed) &&
                    props.review
                      .filter((f) =>
                        session && session.user ? true : f.status === "FEATURED"
                      )
                      .sort((a, b) => {
                        return b.createdAt - a.createdAt;
                        // return b.media[0].timestamp - a.media[0].timestamp;
                      })
                      .map((fit) => <ReviewBox key={"r" + fit.id} {...fit} />)}
                </div>
              </Tab>
            </Tabs>
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
            justify-content: center;
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

  const res = await fetch(
    `${process.env.HOST}/api/feed/${(user && user.id) || ""}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: context.req.headers.cookie,
      },
    }
  );
  let feed = [];
  try {
    feed = await res.json();
  } catch (e) {
    console.log("error:", e.message);
  }

  const rev = await fetch(`${process.env.HOST}/api/review/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: context.req.headers.cookie,
    },
  });
  let revfeed = [];
  try {
    revfeed = await rev.json();
  } catch (e) {
    console.log("error:", e.message);
  }

  // console.log(revfeed);

  return {
    props: { feed, review: revfeed, user, url: process.env.HOST },
  };
};

export default Main;
