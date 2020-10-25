import React, { useState, useEffect } from "react";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import Layout from "../components/Layout";
import Gram from "../components/Gram";
import { Button, SIZE } from "baseui/button";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSession, getSession } from "next-auth/client";
import { FileUploader } from "baseui/file-uploader";

// import Feed from "./api/feed";
// import User from "./api/user";

const Feed = (props) => {
  const [posts, setPosts] = useState(null);
  const [insta, setInsta] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [photo, setPhoto] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const fetchData = () => {};

  const fetchInitial = async () => {
    if (props.user && props.user.instagram) {
      const posts = await fetch(`${process.env.HOST}/api/insta/posts`);
      const payload = await posts.json();
      setPosts(payload.data);

      const userobj = await fetch(`${process.env.HOST}/api/insta/user`);
      const userpayload = await userobj.json();
      console.log("Blarg", userpayload);
      setInsta(userpayload);
    }
  };

  const addNewFit = async () => {};

  useEffect(() => {
    if (!posts) fetchInitial();
  });

  return (
    <Layout>
      <div className="page">
        <h1>All The Fits</h1>
        <p>Upload or pick your fits from your instagram.</p>
        {/* {
        <FileUploader
          errorMessage={errorMessage}
          size={SIZE.mini}
          disabled
          onChange={() => {
            upload({
              file,
              uploadOptions,
            });
          }}
        />
        {photo && <img src={data.url} />}
        <br />
        <br />
        <Button
          className="left"
          onClick={() => addNewFit()}
          size={SIZE.mini}
          isLoading={isLoading}
          disabled={true}
        >
          Upload Fit Manually
        </Button>
        <br />
        <br />
        <h3>Or}  */}
        <h3>add from Instagram</h3>

        {!props.user.instagramlong && (
          <div className="alert">
            <p>
              To make the best use of Stupidfits, we suggest connecting your
              instagram. It'll let you pull in posts easily and sync them with
              your closet. There are additional privacy settings as well to
              control your public profile and how your posts show up on our
              feed.
            </p>
            <p>
              Visit your{" "}
              <Link href="/me">
                <a>Settings Page</a>
              </Link>{" "}
              to sync your instagram
            </p>
          </div>
        )}

        {props.error && <p>There was an Error: {props.error} </p>}
        {posts && Array.isArray(posts) && (
          <main>
            <InfiniteScroll
              dataLength={insta.postsCount || 0} //This is important field to render the next data
              next={fetchData}
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
              hasMore={true}
              loader={<h4>Loading...</h4>}
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }
              // below props only if you need pull down functionality
              refreshFunction={fetchInitial}
              pullDownToRefresh
              pullDownToRefreshThreshold={20}
              pullDownToRefreshContent={
                <h3 style={{ textAlign: "center" }}>
                  &#8595; Pull down to refresh
                </h3>
              }
              releaseToRefreshContent={
                <h3 style={{ textAlign: "center" }}>
                  &#8593; Release to refresh
                </h3>
              }
            >
              {posts.map((fit) => (
                <Gram
                  key={fit.id}
                  {...fit}
                  fit={
                    (props.fits &&
                      props.fits.length > 0 &&
                      props.fits.find(
                        (t) => fit.permalink === t.media[0].url
                      )) ||
                    null
                  }
                  username={insta.username}
                />
              ))}
            </InfiniteScroll>
          </main>
        )}
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

  let user;
  try {
    // Get user and instagram username
    const res = await fetch(`${process.env.HOST}/api/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: context.req.headers.cookie,
      },
    });
    user = await res.json();
  } catch (e) {
    error = e;
  }
  // Fetch fits for this user and check against existing instagram
  const fitres = await fetch(
    `${process.env.HOST}/api/feed/${(user && user.id) || null}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: context.req.headers.cookie,
      },
    }
  );

  // const fitres = await Feed();

  let fits = null;
  try {
    fits = await fitres.json();
  } catch (e) {
    console.log("error:", e.message);
  }

  return {
    props: { user: user, fits: fits, error: error },
  };
};

export default Feed;
