import React, { useState } from "react";
import fetch from "isomorphic-unfetch";
import Layout from "../components/Layout";
import Gram from "../components/Gram";
import InfiniteScroll from "react-infinite-scroll-component";

import { useSession, getSession } from "next-auth/client";

const Feed = (props) => {
  const [posts, usePosts] = useState(props.insta.posts);
  const fetchData = () => {};
  return (
    <Layout>
      <div className="page">
        <h1>All The Fits</h1>
        <p>Pick your fits from your instagram, share the details.</p>
        {props.error && <p>There was an Error: {props.error} </p>}
        <main>
          <InfiniteScroll
            dataLength={props.insta.postsCount} //This is important field to render the next data
            next={fetchData}
            hasMore={true}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
            // // below props only if you need pull down functionality
            // refreshFunction={this.refresh}
            // pullDownToRefresh
            // pullDownToRefreshThreshold={20}
            // pullDownToRefreshContent={
            //   <h3 style={{ textAlign: "center" }}>
            //     &#8595; Pull down to refresh
            //   </h3>
            // }
            // releaseToRefreshContent={
            //   <h3 style={{ textAlign: "center" }}>
            //     &#8593; Release to refresh
            //   </h3>
            // }
          >
            {posts.map((fit) => (
              <Gram
                {...fit}
                fit={
                  (props.fits &&
                    props.fits.length > 0 &&
                    props.fits.find(
                      (t) => fit.shortCode === t.media.shortcode
                    )) ||
                  null
                }
                username={props.insta.username}
              />
            ))}
          </InfiniteScroll>
        </main>
      </div>
      <style jsx>{`
        main {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        }
        .post {
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  let error = null;
  let insta;
  try {
    // Get user and instagram username
    const res = await fetch(`${process.env.HOST}/api/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: context.req.headers.cookie,
      },
    });
    const user = await res.json();

    // Fetch Instagram Feed
    if (user && user.instagram) {
      const res = await fetch(
        `${process.env.HOST}/api/insta/user?id=${user.instagram}`
      );
      insta = await res.json();
    }
  } catch (e) {
    error = e;
  }

  // Fetch fits for this user and check against existing instagram
  const fitres = await fetch(`${process.env.HOST}/api/feed`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: context.req.headers.cookie,
    },
  });
  let fits = null;
  try {
    fits = await fitres.json();
  } catch (e) {
    console.log("error:", e.message);
  }

  return {
    props: { insta: insta, fits: fits, error: error },
  };
};

export default Feed;
