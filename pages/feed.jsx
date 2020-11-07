import React, { useState, useEffect } from "react";
import Router from "next/router";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import Layout from "../components/Layout";
import Gram from "../components/Gram";
import { Button, SIZE } from "baseui/button";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSession, getSession } from "next-auth/client";
import { FileUploader } from "baseui/file-uploader";
import FormData from "form-data";

const CheckGramAlreadyExists = (ig, fits) => {
  if (fits && fits.length > 0) {
    const found = fits.find((t) =>
      t.media.find((m) => {
        if (ig.children) {
          return ig.children.data.find((c) => c.permalink === m.url);
        } else {
          return ig.permalink === m.url;
        }
      })
    );
    return found;
  } else {
    return null;
  }
};

const Feed = (props) => {
  const [posts, setPosts] = useState(null);
  const [insta, setInsta] = useState([]);
  const [files, setFiles] = useState([]);
  const [cloud, setCloud] = useState([]);

  const [isUploading, setIsUploading] = React.useState(false);

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

  const AuthWithInstagram = async () => {
    const appid = `${process.env.INSTAGRAM_CLIENT_ID || "325074402038126"}`;
    const uri = `${process.env.HOST}/api/auth/insta`;
    const scope = `user_profile,user_media`;

    const url = `https://api.instagram.com/oauth/authorize?client_id=${appid}&redirect_uri=${uri}&scope=${scope}&response_type=code`;

    window.open(url);
  };

  const uploadFiles = async (files) => {
    setIsUploading(true);
    const url = "https://api.cloudinary.com/v1_1/stupidsystems/image/upload";

    const formData = new FormData();
    await setFiles(files);

    const requests = [];

    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      formData.append("file", file);
      formData.append("upload_preset", "stupidfits");

      requests[i] = fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          return response.json();
        })
        .then(async (data) => {
          console.log("Returned", data);
          await setCloud((c) => [...c, data.public_id]);
          return data.public_id;
        })
        .catch((e) => {
          setErrorMessage("Error", e);
          setIsUploading(false);
        });
    }
    Promise.all(requests).then((reqs) => {
      console.log("All reqs completed", reqs);
      addNewFromUpload(reqs);
    });
  };

  const addNewFromUpload = async (reqs) => {
    try {
      const body = {
        id: props.id,
        imgs: reqs,
      };

      console.log("Adding fit", `${process.env.HOST}/api/fits/create`, body);

      const res = await fetch(`${process.env.HOST}/api/fits/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      console.log("Added fit!", data);
      if (data) Router.push(`/fit/${data.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!posts) fetchInitial();
    return () => {};
  }, []);

  return (
    <Layout>
      <div className="page">
        <h1>All The Fits</h1>
        <p>Upload or pick your fits from your instagram.</p>

        <FileUploader
          errorMessage={errorMessage}
          size={SIZE.mini}
          multiple
          accept="image/*"
          onDrop={(acceptedFiles, rejectedFiles) => {
            console.log(acceptedFiles);
            // setFiles((f) => [...f, ...acceptedFiles]);
            uploadFiles(acceptedFiles);
            // startProgress();
          }}
          progressMessage={isUploading ? `Uploading... hang tight.` : ""}
          onChange={() => {
            upload({
              file,
              uploadOptions,
            });
          }}
        />
        <small>Jpg, Png, HEIC files only.</small>
        <br />
        <small>
          Multiple files are allowed, and will be added to a single fit.
        </small>

        <br />
        <br />
        <h4>Or</h4>
        <h3>add from Instagram</h3>

        {!props.user.instagramlong && (
          <div className="alert">
            <p className="small">
              <a className="auth" onClick={AuthWithInstagram}>
                <img src={`/img/instagram.png`} />
              </a>
            </p>
            <p>
              To make the best use of Stupidfits, we suggest connecting your
              instagram. It'll let you pull in posts easily and sync them with
              your closet.
            </p>
            <p>
              There are additional privacy settings to control your public
              profile and how your posts show up on our feed.
            </p>

            <p>
              Visit your{" "}
              <Link href="/me">
                <a>Settings Page</a>
              </Link>{" "}
              to access those controls.
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
                  fit={CheckGramAlreadyExists(fit, props.fits)}
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

        p {
          margin: 1rem auto;
        }

        p.small {
          max-width: 600px;
        }

        .auth img {
          max-width: 20rem;
          width: 100%;
          transition: all 0.4s;
        }
        .auth img:hover {
          -webkit-filter: invert(1);
          filter: invert(1);
          background: black;
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

  if (!session || !session.user) {
    if (context.res) {
      context.res.writeHead(302, { Location: `/` });
      context.res.end();
    }
    return {};
  }

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
