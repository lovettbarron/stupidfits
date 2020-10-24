import React, { useState, useEffect } from "react";
import fetch from "isomorphic-unfetch";
import Layout from "../../components/Layout";
import Router from "next/router";
import { FileUploader } from "baseui/file-uploader";
import { useSession, getSession } from "next-auth/client";
import { Checkbox, LABEL_PLACEMENT, STYLE_TYPE } from "baseui/checkbox";
import { Button, SIZE } from "baseui/button";

const Admin = (props) => {
  const [session, loading] = useSession();
  const [terminal, setTerminal] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const syncInstaId = async () => {
    setIsLoading(true);
    try {
      const instaid = await fetch(`${process.env.HOST}/api/admin/instaid`);
      const c = await instaid.json();
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
            <div className="page">
              <h1>Admin Panel</h1>
              <div className="console">
                <ul>
                  {terminal &&
                    terminal.map((t) => {
                      return <li key={Math.random()}>{t}</li>;
                    })}
                </ul>
              </div>
              <Button
                className="left"
                onClick={() => syncCloudinary()}
                size={SIZE.mini}
                isLoading={isLoading}
              >
                Sync Cloudinary
              </Button>
              <br />
              <br />
              <br />
              <Button
                className="left"
                onClick={() => syncInstaId()}
                size={SIZE.mini}
                isLoading={isLoading}
              >
                Sync Insta Id
              </Button>
            </div>
            <style jsx>{`
              .page {
                padding: 1rem;

                max-width: 600px;
                justify-content: center;
                align-items: center;
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
  if (session.user.email !== "alb@andrewlb.com") return null;
  else
    return {
      props: { r: true },
    };
}
export default Admin;
