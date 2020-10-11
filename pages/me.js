import React, { useState, useEffect } from "react";
import fetch from "isomorphic-unfetch";
import Layout from "../components/Layout";
import Router from "next/router";
import { FileUploader } from "baseui/file-uploader";
import { useSession, getSession } from "next-auth/client";
import { Checkbox, LABEL_PLACEMENT, STYLE_TYPE } from "baseui/checkbox";

const Me = (props) => {
  const [session, loading] = useSession();

  const [instagram, setInstagram] = useState(props.user.instagram);
  const [email, setEmail] = useState(props.user.email);
  const [username, setUsername] = useState(props.user.username);
  const [publicprofile, setPublicprofile] = useState(props.user.public);
  const [profilepage, setProfilepage] = useState(props.user.profilepage);
  const [instagramData, setInstagramData] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [insta, setInsta] = useState();

  const submitData = async (e) => {
    if (e) e.preventDefault();
    try {
      const body = {
        instagram,
        email,
        username,
        profilepage,
        public: publicprofile,
      };
      const res = await fetch(`${props.url}/api/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      // checkInstagram(instagram);
      if (e) await Router.push("/feed");
    } catch (error) {
      console.error(error);
    }
  };

  const uploadCSV = async (acceptedFiles, rejectedFiles) => {
    console.log("Upload", acceptedFiles, rejectedFiles);
    const sendFile = await fetch(`${props.url}/api/import`, {
      method: "POST",
      body: acceptedFiles,
    })
      .then(
        (response) => response.json() // if the response is a JSON object
      )
      .then(
        (success) => console.log(success) // Handle the success response object
      )
      .catch(
        (error) => console.log(error) // Handle the error response object
      );
    try {
      setUploadError(null);
    } catch (error) {
      console.error(error);
      setUploadError(error);
    }
  };

  const checkInstagram = async () => {
    try {
      const userobj = await fetch(`${process.env.HOST}/api/insta/user`);
      const userpayload = await userobj.json();
      console.log("found user", userpayload);
      setInsta(userpayload);
    } catch (error) {
      console.error(error);
    }
  };

  const DisconnectInstagram = async () => {
    try {
      const userobj = await fetch(`${process.env.HOST}/api/insta/disconnect`);
      const userpayload = await userobj.json();
      console.log("found user", userpayload);
      setInsta(null);
    } catch (error) {
      console.error(error);
    }
  };

  const AuthWithInstagram = async () => {
    const appid = `${process.env.INSTAGRAM_CLIENT_ID || "325074402038126"}`;
    const uri = `${process.env.HOST}/api/auth/insta`;
    const scope = `user_profile,user_media`;

    const url = `https://api.instagram.com/oauth/authorize?client_id=${appid}&redirect_uri=${uri}&scope=${scope}&response_type=code`;

    window.open(url);
  };

  useEffect(() => {
    if (!insta) checkInstagram();
    if (
      props.user.profilepage !== profilepage ||
      props.user.public !== publicprofile
    )
      submitData();
  });

  // checkInstagram();
  return (
    <>
      {(session && (
        <Layout>
          <div className="page">
            <form onSubmit={submitData}>
              <h1>My Settings</h1>
              <h3>{email}</h3>

              <h3>Your Stupidfits Username</h3>
              <input
                style={{ textAlign: "center" }}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                type="text"
                value={username}
              />

              <h2>Sync with your Instagram Account</h2>
              <p>
                We use the instagram api to pull in your fits. Only the images
                you select will be part of stupidfits, and the ones you select
                can be annotated on Stupid Fits.
              </p>
              {(insta && (
                <>
                  <p>Synced with {insta.username}</p>
                  <a className="auth" onClick={DisconnectInstagram}>
                    <img src={`/img/instagram-disconnect.png`} />
                  </a>
                </>
              )) || (
                <a className="auth" onClick={AuthWithInstagram}>
                  <img src={`/img/instagram.png`} />
                </a>
              )}
              <h2>Sharing Your Fits</h2>
              <Checkbox
                checked={publicprofile}
                checkmarkType={STYLE_TYPE.toggle_round}
                labelPlacement={LABEL_PLACEMENT.right}
                onChange={() => setPublicprofile(!publicprofile)}
              >
                Make my fits visible on the Stupid Fits global feed.
              </Checkbox>
              <br />
              <p>
                We give you a custom landing page for your fits. Drop this in
                your instagram URL, or on Imgur, or Reddit, or wherever so folk
                can wrap their minds around your revolutionary genius fit
                combinitronics.
              </p>

              <Checkbox
                checked={profilepage}
                onChange={() => setProfilepage(!profilepage)}
                checkmarkType={STYLE_TYPE.toggle_round}
                labelPlacement={LABEL_PLACEMENT.right}
              >
                Make my Profile Page visible
              </Checkbox>

              {profilepage && (
                <>
                  <h4>Your public page is</h4>
                  <p>
                    <br /> {process.env.HOST}
                    <br />
                    /u/{username}
                  </p>
                  <br />
                  <br />
                </>
              )}

              <input
                disabled={!email || !username}
                type="submit"
                value="Update"
              />
              <hr style={{ marginTop: "100px" }} />
              <hr />
              <h1>The following features are coming, but don't work yet</h1>

              <hr />
              <h3>Import Closet CSV</h3>
              <p>
                This project started with my{" "}
                <a
                  href="https://andrewlb.com/writing/intentional-wardrobe/"
                  target="_blank"
                >
                  More Intentional Wardrobe
                </a>{" "}
                prototype on Notion. Building this app, I wanted an easy way to
                import the work I'd already done. So, you can too.
              </p>
              <p>
                Basically, if you have a CSV file with the following columns:{" "}
                <p>
                  brand (brand name, will be lowercased)
                  <br />
                  name (name of the piece) <br />
                  type (BAG, SHOE, JACKET, PANT, SHIRT, LAYER, EXTRA)
                  <br />
                  year (A number) <br />
                  size (a string) <br />
                  sale (URL to grailed or whatever)
                </p>
                <FileUploader errorMessage={uploadError} onDrop={uploadCSV} />
              </p>
            </form>
          </div>
          <style jsx>{`
            .page {
              padding: 1rem;
              display: flex;
              max-width: 600px;
              justify-content: center;
              align-items: center;
            }

            form {
              width: 100%;
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

            h2 {
              margin-top: 8rem;
            }

            label {
              width: 50%;
              margin: 0 auto;
            }

            input[type="text"],
            textarea {
              width: 50%;
              padding: 0.5rem;
              margin: 0.5rem 0;
              border: 0 solid #ffffff;
              background: transparent;
              color: #ffffff;
              border-width: 0 0 0.2rem 0;
            }

            input[type="submit"] {
              background: #ececec;
              border: 0;
              padding: 1rem 2rem;
            }

            .back {
              margin-left: 1rem;
            }
          `}</style>
        </Layout>
      )) || (
        <Layout>
          <div className="page">
            <h1>User Settings Page</h1>
            <h2>You're not signed in</h2>
          </div>
        </Layout>
      )}
    </>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const res = await fetch(`${process.env.HOST}/api/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: context.req.headers.cookie,
    },
  });

  const b = await fetch(`${process.env.HOST}/api/item`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: context.req.headers.cookie,
    },
  });

  let user = null;
  // console.log("Res", res);
  try {
    user = await res.json();
  } catch (e) {
    console.log("error:", e.message);
  }

  return {
    props: { user },
  };
}
export default Me;
