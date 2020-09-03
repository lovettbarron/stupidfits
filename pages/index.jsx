import React, { useState } from "react";
import Layout from "../components/Layout";
import fetch from "isomorphic-unfetch";
import Post from "../components/Post";
import FitBox from "../components/FitBox";

import { useSession, signin, signout } from "next-auth/client";

const Blog = (props) => {
  const [session, loading] = useSession();
  const [instagram, setInstagram] = useState("");

  const iglogin = async () => {
    const url = props.url;
    console.log(`${url}/api/insta/user`);
    const res = await fetch(`${url}/api/insta/user?id=${instagram}`);
    const feed = await res.json();
    return {
      props: { feed },
    };
  };

  return (
    <Layout>
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
              <img src={`/img/instagram.png`} />
            </a>
          </>
        )}
        {session && (
          <>
            <h3>Hej {session.username}</h3>
          </>
        )}

        <ol>
          <li>Post Fits on Instagram.</li>
          <li>Link fits with your wardrobe on StupidFits</li>
          <li>Learn from others; rethink your own.</li>
          <li>Repeat but better.</li>
        </ol>
        <main>
          {props.feed.map((fit) => (
            <FitBox {...fit} />
          ))}
        </main>
        <footer>
          <ul>
            <li>WTF is this?</li>
            <li>Privacy</li>
            <li>Terms</li>
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
  const res = await fetch(`${process.env.HOST}/api/feed`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: context.req.headers.cookie,
    },
  });
  let feed;
  try {
    feed = await res.json();
  } catch (e) {
    console.log("error:", e.message);
  }
  return {
    props: { feed, url: process.env.HOST },
  };
};

export default Blog;
