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
import { Select } from "baseui/select";
import { Tabs, Tab, FILL } from "baseui/tabs-motion";

const styles = [
  "Goretex Onion Knight",
  "Salvaged Selvedge",
  "Take Don't Bother",
  "Techwear House Cat",
];

export const sizes = [
  { id: 32, us: "XXXS" },
  { id: 34, us: "XXS" },
  { id: 36, us: "XS" },
  { id: 38, us: "S" },
  { id: 40, us: "M" },
  { id: 42, us: "L" },
  { id: 44, us: "XL" },
  { id: 46, us: "XXL" },
  { id: 48, us: "XXXL" },
  { id: 50, us: "XXXXL" },
  { id: 52, us: "XXXXXL" },
];

export const genders = [
  { label: "Male", id: "MALE" },
  { label: "Female", id: "FEMALE" },
  { label: "Intersex", id: "INTER" },
  { label: "Queer", id: "QUEER" },
  { label: "Androgyne", id: "ANDRO" },
  { label: "Other", id: "OTHER" },
];

const getSizes = (trans) => {
  const t = trans || "eu";
  return sizes.map((s) => ({ id: s.id, label: s.id }));
};

const Me = (props) => {
  const [session, loading] = useSession();
  const [activeKey, setActiveKey] = React.useState("0");

  const [instagram, setInstagram] = useState(props.user.instagram);
  const [email, setEmail] = useState(props.user.email);
  const [username, setUsername] = useState(props.user.username);
  const [publicprofile, setPublicprofile] = useState(props.user.public);
  const [profilepage, setProfilepage] = useState(props.user.profilepage);
  const [nosize, setNosize] = useState(props.user.nosize);
  const [hideface, setHideface] = useState(props.user.hideface);
  const [hidecloset, setHidecloset] = useState(props.user.hidecloset);
  const [instagramData, setInstagramData] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [insta, setInsta] = useState();
  const [gender, setGender] = useState(
    genders.filter((g) => {
      return props.user.gender.includes(g.id);
    })
  );
  const [tags, setTags] = useState(
    props.user.tags.map((t) => ({
      id: t.id,
      label: t.name,
    }))
  );
  const [topsize, setTopsize] = useState(
    sizes.filter((g) => {
      return props.user.top.includes(g.id);
    })
  );
  const [bottomsize, setBottomsize] = useState(
    sizes.filter((g) => {
      return props.user.bottom.includes(g.id);
    })
  );

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
        hidecloset,
        gender: gender,
        tags: tags,
        top: topsize,
        bottom: bottomsize,
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
      props.user.hideface !== hideface ||
      props.user.hidecloset !== hidecloset
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
            <Tabs
              activeKey={activeKey}
              fill={FILL.fixed}
              onChange={({ activeKey }) => {
                setActiveKey(activeKey);
              }}
              activateOnFocus
              renderAll
            >
              <Tab title="Profile">
                <div className="grid">
                  <div className="col">
                    <h2>{email}</h2>
                    <h3>Your Stupidfits Username</h3>
                    <input
                      style={{ textAlign: "center" }}
                      onChange={(e) => {
                        const v = e.target.value.replace(" ", "").toLowerCase();
                        const safe = v.replace(/[^\w\s]/gi, "");
                        setUsername(safe);
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
                    <br />
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
              </Tab>

              <Tab title="Style and Identity">
                <div className="grid">
                  <div className="col">
                    <h2>Self Described</h2>
                    <h3>Gender(s)</h3>

                    <Select
                      options={[
                        { label: "Male", id: "male" },
                        { label: "Female", id: "female" },
                        { label: "Intersex", id: "inter" },
                        { label: "Queer", id: "queer" },
                        { label: "Androgyne", id: "andro" },
                        { label: "Other", id: "other" },
                      ]}
                      value={gender}
                      multi
                      placeholder="Choose your genders"
                      onChange={(params) => setGender(params.value)}
                    />
                    <small>
                      If you don't see yourself here, send a note to{" "}
                      <a href="mailto:alb@stupidfits.com">alb@stupidfits.com</a>{" "}
                      and we'll fix that.
                    </small>
                    <h3>What Styles Interest You?</h3>
                    <Select
                      options={props.style.map((s) => ({
                        id: s.id,
                        label: s.name,
                      }))}
                      value={tags}
                      multi
                      placeholder="Pick a few"
                      onChange={(params) => setTags(params.value)}
                    />
                    <br />
                    <Button
                      disabled={!email || !username}
                      type="submit"
                      value="Update"
                      onClick={submitData}
                    >
                      Update
                    </Button>
                  </div>
                  <div className="col">
                    <h2>I Fit Into...</h2>
                    <h3>Sizes for Jackets, shirts, jumpsuits</h3>
                    <Select
                      options={getSizes()}
                      value={topsize}
                      multi
                      placeholder="Select your top's sizes"
                      onChange={(params) => setTopsize(params.value)}
                    />
                    <h3>Sizes for Pants, skirt, etc</h3>
                    <Select
                      options={getSizes()}
                      value={bottomsize}
                      multi
                      placeholder="Select your bottom size"
                      onChange={(params) => setBottomsize(params.value)}
                    />
                    <br />
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
              </Tab>

              <Tab title="Privacy">
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
                      Please (try to) blur my face on any images I upload.
                    </Checkbox>
                    <p className="small">
                      Just a note that this feature is experimental and might
                      become paid in the future. It only applies to uploads
                      going further.
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
                      We give you a custom landing page for your fits. Drop this
                      in your instagram, reddit, or similar so folk can make
                      sense of your fit genius.
                    </p>
                    <Checkbox
                      checked={nosize}
                      checkmarkType={STYLE_TYPE.toggle_round}
                      labelPlacement={LABEL_PLACEMENT.right}
                      onChange={() => setNosize(!nosize)}
                    >
                      Hide my size and gender identity on my profile
                    </Checkbox>
                    <p className="small">
                      Sizes and Gender are mostly for searching. Adding that
                      info helps others, but don't feel like you need to
                      broadcast it.
                    </p>
                  </div>
                  <div className="col">
                    <h2>Privacy & Sharing</h2>
                    <Checkbox
                      checked={hidecloset}
                      checkmarkType={STYLE_TYPE.toggle_round}
                      labelPlacement={LABEL_PLACEMENT.right}
                      onChange={() => setHidecloset(!hidecloset)}
                    >
                      Hide my closet on my profile page
                    </Checkbox>
                    <p className="small">
                      Just incase you don't want to share all your garms. You
                      can always access it privately via the nav bar.
                    </p>
                  </div>
                </div>
              </Tab>

              <Tab title="Instagram Sync">
                <div className="grid">
                  <div className="col">
                    <h2>Sync with your Instagram Account</h2>
                    <p>
                      Only the images you select will be part of stupidfits,
                    </p>
                    {(insta && (
                      <>
                        <p>Synced with {insta.username}</p>
                        <a className="auth" onClick={DisconnectInstagram}>
                          <img
                            alt="Disconnect your instagram"
                            src={`/img/instagram-disconnect.png`}
                          />
                        </a>
                      </>
                    )) || (
                      <a className="auth" onClick={AuthWithInstagram}>
                        <img
                          alt="Sync your instagram"
                          src={`/img/instagram.png`}
                        />
                      </a>
                    )}
                  </div>
                </div>
              </Tab>
              <Tab title="Experimental">
                <div className="grid">
                  <div className="col">
                    <h1>
                      The following features are coming, but don't work yet
                    </h1>

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
                      prototype on Notion. Building this app, I wanted an easy
                      way to import the work I'd already done. So, you can too.
                    </p>
                    <p>
                      Basically, if you have a CSV file with the following
                      columns:{" "}
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
                      <FileUploader
                        errorMessage={uploadError}
                        onDrop={uploadCSV}
                      />
                    </p>
                  </div>
                </div>
              </Tab>
            </Tabs>
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

  const sres = await fetch(`${process.env.HOST}/api/style`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: context.req.headers.cookie,
    },
  });

  let style = null;
  // console.log("Res", res);
  try {
    style = await sres.json();
  } catch (e) {
    console.log("error:", e.message);
  }

  console.log(user);

  return {
    props: { user, style: style || [] },
  };
}
export default Me;
