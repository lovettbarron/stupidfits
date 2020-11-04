import React, { useState, useEffect } from "react";
import fetch from "isomorphic-unfetch";
import Layout from "../components/Layout";
import Router from "next/router";
import Link from "next/link";
import { FileUploader } from "baseui/file-uploader";
import { useSession, getSession } from "next-auth/client";
import { Checkbox, LABEL_PLACEMENT, STYLE_TYPE } from "baseui/checkbox";
import { Textarea } from "baseui/textarea";
import { Input } from "baseui/input";
import { Button } from "baseui/button";

const styles = [
  "Goretex Onion Knight",
  "Salvaged Selvedge",
  "Take Don't Bother",
  "Techwear House Cat",
];

const Me = (props) => {
  const [session, loading] = useSession();

  const [instagram, setInstagram] = useState(props.user.instagram);
  const [email, setEmail] = useState(props.user.email);
  const [username, setUsername] = useState(props.user.username);
  const [publicprofile, setPublicprofile] = useState(props.user.public);
  const [profilepage, setProfilepage] = useState(props.user.profilepage);
  const [hideface, setHideface] = useState(props.user.hideface);
  const [instagramData, setInstagramData] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [insta, setInsta] = useState();

  const [url, setUrl] = useState(props.user.url);
  const [urllabel, setUrllabel] = useState(props.user.urllabel);
  const [style, setStyle] = useState(props.user.style);
  const [description, setDescription] = useState(props.user.description);

  const submitData = async (e) => {
    if (e) e.preventDefault();
    try {
      const body = {
        instagram,
        email,
        username,
        profilepage,
        style,
        url,
        urllabel,
        description,
        hideface,
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
      props.user.public !== publicprofile ||
      props.user.hideface !== hideface
    )
      submitData();
  });

  // checkInstagram();
  if (!props.user) return <Layout>No user data found</Layout>;
  return (
    <>
      {(session && session.user && (
        <Layout>
          <div className="page">
            <h1>My Settings</h1>

            <div className="grid">
              <div className="col">
                <h2>{email}</h2>
                <h3>Your Stupidfits Username</h3>
                <input
                  style={{ textAlign: "center" }}
                  onChange={(e) => {
                    const v = e.target.value.replace(" ", "").toLowerCase();
                    setUsername(v);
                  }}
                  placeholder="Username"
                  type="text"
                  value={username}
                />
                <Button
                  disabled={!email || !username}
                  type="submit"
                  value="Update"
                  onClick={submitData}
                >
                  Update
                </Button>
                <p className="small">
                  A username is required for your public profile.
                </p>
                {profilepage && (
                  <>
                    <br />
                    <h3>Your public page is</h3>
                    <p>
                      {process.env.HOST}
                      <br />
                      /u/{username}
                    </p>
                    <br />
                    <br />
                  </>
                )}
              </div>
              <div className="col">
                <h2>Profile Page Info</h2>
                <h3>What's your style?</h3>
                <Input
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  placeholder={
                    styles[Math.floor(Math.random() * styles.length)]
                  }
                  clearOnEscape
                />
                <div className="grid">
                  <div className="col">
                    <h3>URL</h3>
                    <Input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://stupidfits.com"
                      clearOnEscape
                    />
                  </div>
                  <div className="col">
                    <h3>URL label</h3>
                    <Input
                      value={urllabel}
                      onChange={(e) => setUrllabel(e.target.value)}
                      placeholder="Stupid Fits"
                      clearOnEscape
                    />
                  </div>
                </div>
                <h3>What's your story?</h3>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's your story?"
                />
                <Button
                  disabled={!email || !username}
                  type="submit"
                  value="Update"
                  onClick={submitData}
                >
                  Update
                </Button>
              </div>
            </div>

            <div className="grid">
              <div className="col">
                {" "}
                <h2>Privacy & Sharing</h2>
                <Checkbox
                  checked={hideface}
                  checkmarkType={STYLE_TYPE.toggle_round}
                  labelPlacement={LABEL_PLACEMENT.right}
                  onChange={() => setHideface(!hideface)}
                >
                  Please (try) to blur my face on any images I upload.
                </Checkbox>
                <p className="small">
                  Just a note that this feature is experimental and might become
                  paid in the future. It only applies to uploads going further.
                </p>
                <Checkbox
                  checked={publicprofile}
                  checkmarkType={STYLE_TYPE.toggle_round}
                  labelPlacement={LABEL_PLACEMENT.right}
                  onChange={() => setPublicprofile(!publicprofile)}
                >
                  Make my fits visible on the Stupid Fits global feed.
                </Checkbox>
                <p className="small">
                  The{" "}
                  <Link href="/global">
                    <a>global feed</a>
                  </Link>{" "}
                  is where everyone's fits go — if they let them. Will you?
                </p>
                <br />
                <Checkbox
                  checked={profilepage}
                  onChange={() => setProfilepage(!profilepage)}
                  checkmarkType={STYLE_TYPE.toggle_round}
                  labelPlacement={LABEL_PLACEMENT.right}
                >
                  Make my Profile Page visible
                </Checkbox>
                <p className="small">
                  We give you a custom landing page for your fits. Drop this in
                  your instagram, reddit, or similar so folk can make sense of
                  your fit genius.
                </p>
              </div>
              <div className="col">
                <h2>Sync with your Instagram Account</h2>
                <p>Only the images you select will be part of stupidfits,</p>
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
              </div>
            </div>

            {/* <Checkbox
                checked={profilepage}
                onChange={() => setProfilepage(!profilepage)}
                checkmarkType={STYLE_TYPE.toggle_round}
                labelPlacement={LABEL_PLACEMENT.right}
              >
                Try to blur out my face please!
              </Checkbox>
              <p>we'll try to automagically blur out your face.</p> */}

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
          </div>
          <style jsx>{`
            .page {
              padding: 0rem;
            }

            form {
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
  if (!session) {
    context.res.writeHead(302, { Location: `/` });
    context.res.end();
  }

  const res = await fetch(`${process.env.HOST}/api/user`, {
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
