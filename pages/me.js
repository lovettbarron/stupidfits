import React, { useState } from "react";
import fetch from "isomorphic-unfetch";
import Layout from "../components/Layout";
import Router from "next/router";
import { useSession, getSession } from "next-auth/client";

const Me = (props) => {
  const [session, loading] = useSession();

  const [instagram, setInstagram] = useState(props.user.instagram);
  const [email, setEmail] = useState(props.user.email);
  const [username, setUsername] = useState(props.user.username);
  const [instagramData, setInstagramData] = useState("");

  const submitData = async (e) => {
    e.preventDefault();
    try {
      const body = { instagram, email, username };
      const res = await fetch(`${props.url}/api/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      // checkInstagram(instagram);
      await Router.push("/feed");
    } catch (error) {
      console.error(error);
    }
  };

  const checkInstagram = async (id) => {
    try {
      const body = { instagram, email, username };
      const res = await fetch(`${props.url}/api/insta/user?id=${id}`);
      const data = await res.json();
      // console.log("Instagram check", data);
      setInstagramData(data);
    } catch (error) {
      console.error(error);
    }
  };

  // checkInstagram(instagram);
  return (
    <>
      {(session && (
        <Layout>
          <div className="page">
            <form onSubmit={submitData}>
              <h1>My Settings</h1>
              <h3>{email}</h3>
              <h2>Your Instagram Handle</h2>
              <p>
                We need your instagram handle to pull in your fits. You can then
                select which ones you want to annotate on Stupid Fits.
              </p>

              <input
                autoFocus
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="Instagram ID"
                type="text"
                value={instagram}
              />
              {instagramData && <>verified</>}
              <br />
              <h2>Your Stupidfits Username</h2>
              <p>
                We give you a custom landing page for your fits. Drop this in
                your instagram URL, or on Imgur, or Reddit, or wherever so folk
                can wrap their minds around your revolutionary genius fit
                combinitronics.
              </p>
              <h4>Your StupidFits Username</h4>
              <input
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                type="text"
                value={username}
              />
              <p>
                <small>Your public page is</small>
                <br /> {process.env.HOST}
                <br />
                /u/{username}
              </p>

              <input
                disabled={!instagram || !email || !username}
                type="submit"
                value="Update"
              />
              <a className="back" href="#" onClick={() => Router.push("/")}>
                or Cancel
              </a>
            </form>
          </div>
          <style jsx>{`
            .page {
              padding: 3rem;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            input[type="text"],
            textarea {
              width: 100%;
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
  console.log("Res", res);
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