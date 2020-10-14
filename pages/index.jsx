import React, { useState } from "react";
import Layout from "../components/Layout";
import fetch from "isomorphic-unfetch";
import Post from "../components/Post";
import FitBox from "../components/FitBox";
import Link from "next/link";
import { useSession, signin, signout } from "next-auth/client";
import { NextSeo } from "next-seo";

const Blog = (props) => {
  const [session, loading] = useSession();
  const [instagram, setInstagram] = useState("");

  // console.log("session", props.user);
  return (
    <Layout>
      <NextSeo
        title="Stupid Fits"
        description="Ingredient List for your Fit Pics"
        openGraph={{
          images: [
            {
              url: "https://www.example.ie/og-image-01.jpg",
              width: 800,
              height: 600,
              alt: "Og Image Alt",
            },
          ],
          site_name: "Stupid Fits",
        }}
      />
      <div className="page">
        <header>
          <h1>Stupid Fits</h1>
          <h2>
            Ingredients for
            <br /> your Fitpics
          </h2>
        </header>
        {!session && (
          <>
            <a className="auth" onClick={signin}>
              <img src={`/img/login.png`} />
            </a>
          </>
        )}
        {session && (
          <>
            <h3>Hej {props.user.username}</h3>
            {(props.user.username && (
              <p>
                Your public page is
                <br />
                <Link href={`${process.env.HOST}/u/${props.user.username}`}>
                  <a>
                    {process.env.HOST}
                    <br />
                    /u/{props.user.username}
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

        <ol>
          <li>Post Fits on Instagram.</li>
          <li>Link fits with your wardrobe on StupidFits</li>
          <li>Learn from others; rethink your own.</li>
          <li>Repeat but better.</li>
        </ol>
        <hr />
        <h3>Get started with your recent fits</h3>
        <main>
          {props.feed
            .sort((a, b) => {
              return b.media.timestamp - a.media.timestamp;
            })
            .map((fit) => (
              <FitBox {...fit} fit={fit.id} />
            ))}
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
  return {
    props: { feed, user, url: process.env.HOST },
  };
};

export default Blog;
