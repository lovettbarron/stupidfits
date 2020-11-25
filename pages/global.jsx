import React, { useState } from "react";
import Layout from "../components/Layout";
import fetch from "isomorphic-unfetch";
import Post from "../components/Post";
import FitMini from "../components/FitMini";
import Link from "next/link";
import { useSession, signin, signout } from "next-auth/client";
import InfiniteScroll from "react-infinite-scroll-component";

const Blog = (props) => {
  const [session, loading] = useSession();
  const [instagram, setInstagram] = useState("");
  const [feed, setFeed] = useState(
    props.feed
      .sort((a, b) => {
        return b.media[0].timestamp - a.media[0].timestamp;
      })
      .filter((f) => ["FEATURED", "PUBLIC"].includes(f.status))
      .filter((f) => f.components.length > 0) || []
  );
  const [visible, setVisible] = useState(feed.slice(0, 1));
  // console.log("session", props.user);

  const fetch = () => {
    const nextMax = () => {
      let t = visible.length + 4;
      return t > feed.length - 1 ? feed.length : t;
    };
    setVisible(feed.slice(0, nextMax()));
    console.log("Fetchin", visible);
  };

  return (
    <Layout>
      <div className="page">
        {!session && (
          <>
            <a className="auth" onClick={signin}>
              <img alt="Login or Create Account" src={`/img/login.png`} />
            </a>
          </>
        )}

        <h2>All the fits</h2>
        <main>
          <div className="flex">
            <InfiniteScroll
              dataLength={visible.length} //This is important field to render the next data
              next={fetch}
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
              hasMore={feed.length > visible.length}
              loader={<h4>Loading...</h4>}
              endMessage={<p style={{ textAlign: "center" }}>All done!</p>}
            >
              {visible.map((fit, i) => (
                <FitMini key={i} {...fit} fit={fit.id} />
              ))}
            </InfiniteScroll>
          </div>
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
        .flex {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
        }
        .post {
        }
        .auth img {
          max-width: 20rem;
          transition: all 0.4s;
          cursor: pointer;
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

  const res = await fetch(`${process.env.HOST}/api/feed`, {
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

export default Blog;
