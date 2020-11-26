import React, { useState, useEffect } from "react";
import fetch from "isomorphic-unfetch";
import Layout from "../../components/Layout";
import Link from "next/link";
import Router from "next/router";
import Head from "next/head";
import { FileUploader } from "baseui/file-uploader";
import { useSession, getSession } from "next-auth/client";
import { Checkbox, LABEL_PLACEMENT, STYLE_TYPE } from "baseui/checkbox";
import { Button, SIZE } from "baseui/button";
import Mod from "../../components/Mod";
import { Tabs, Tab, FILL } from "baseui/tabs-motion";

const Admin = (props) => {
  const [session, loading] = useSession();
  const [terminal, setTerminal] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeKey, setActiveKey] = React.useState("0");

  const syncCloudinary = async () => {
    setIsLoading(true);
    try {
      const cloudinary = await fetch(
        `${process.env.HOST}/api/admin/cloudinary`
      );
      const c = await cloudinary.json();
      setTerminal((con) => [...con, c]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  // checkInstagram();
  if (!props.r) return <Layout>401 Err</Layout>;
  return (
    <>
      {(session &&
        session.user &&
        session.user.email === "alb@andrewlb.com" && (
          <Layout>
            <Head>
              <title>StupidFits Admin</title>
            </Head>
            <div className="page">
              <h1>Moderate Feed</h1>
              <Link href="/admin/migrate">
                <a>Go to Migrations</a>
              </Link>
              <Tabs
                activeKey={activeKey}
                fill={FILL.fixed}
                onChange={({ activeKey }) => {
                  setActiveKey(activeKey);
                }}
                activateOnFocus
              >
                <Tab title="Pending">
                  <>
                    {props.reported && props.reported.length > 0 && (
                      <>
                        <h2>Reported</h2>
                        <div className="items">
                          {(props.reported &&
                            props.reported.map((f) => (
                              <Mod key={f.id} {...f} />
                            ))) || <p>Alllll doneeee!</p>}
                        </div>
                        <hr />
                      </>
                    )}
                    <h2>Pending</h2>
                    <div className="items">
                      {(props.pending &&
                        props.pending.map((f) => (
                          <Mod key={f.id} {...f} />
                        ))) || <p>Alllll doneeee!</p>}
                    </div>
                  </>
                </Tab>
                <Tab title="Active">
                  <h2>Featured</h2>
                  <div className="items">
                    {(props.featured &&
                      props.featured.map((f) => <Mod key={f.id} {...f} />)) || (
                      <p>Alllll doneeee!</p>
                    )}
                  </div>
                  <h2>Public</h2>
                  <div className="items">
                    {(props.public &&
                      props.public.map((f) => <Mod key={f.id} {...f} />)) || (
                      <p>Alllll doneeee!</p>
                    )}
                  </div>
                </Tab>
              </Tabs>
            </div>
            <style jsx>{`
              .page {
                padding: 1rem;

                justify-content: center;
                align-items: center;
              }

              .items {
                display: flex;
                flex-wrap: wrap;
              }

              .console ul {
                display: block;
              }

              .console li {
                display: block;
                text-align: left;
                margin-bottom: 1rem;
              }
              .console {
                border-radius: 5px;
                border: 1px solid white;
                width: 100%;
                min-height: 300px;
                max-height: 600px;
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
  let fits = null;
  if (session.user.email !== "alb@andrewlb.com") return null;
  else {
    const fitres = await fetch(`${process.env.HOST}/api/admin/feed`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: context.req.headers.cookie,
      },
    });
    try {
      fits = await fitres.json();
    } catch (e) {
      console.log("error:", e.message);
    }
  }
  return {
    props: {
      r: true,
      pending: fits.pending,
      reported: fits.reported,
      public: fits.public,
      featured: fits.featured,
    },
  };
}
export default Admin;
