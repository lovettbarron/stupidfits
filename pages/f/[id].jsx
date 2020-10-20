import React, { useEffect, useState } from "react";
import Head from "next/head";
import fetch from "isomorphic-unfetch";
import Layout from "../../components/Layout";
import Link from "next/link";
import Router from "next/router";
import { Select } from "baseui/select";
import FitBox from "../../components/FitBox";

import { getSession, useSession } from "next-auth/client";

const Fit = (props) => {
  const [session, loading] = useSession();
  const [desc, setDesc] = useState(props.desc);
  const [items, setItems] = useState(props.components);

  useEffect(() => {
    return () => {};
  }, [session]);

  return (
    <>
      <Head>
        <title>{props.user.username}'s Fits on Stupid Fits</title>
        <meta
          property="og:title"
          content={`${props.username}'s Fits on Stupid Fits`}
          key="title"
        />
        <meta
          property="og:url"
          content={`${process.env.HOST}/f/${props.id}`}
          key="url"
        />
        <meta property="og:type" content="article" key="type" />
        <meta property="article:author" content={props.user.username} />

        <meta
          property="og:image"
          content={
            props.media &&
            `https://res.cloudinary.com/stupidsystems/image/upload/${props.media.cloudinary}`
          }
          key="mainimg"
        />
      </Head>
      <Layout>
        <div className="page">
          <Link href={`/u/${props.user.username}`}>
            <a>
              <h1>{props.user.username}</h1>
            </a>
          </Link>
          <FitBox {...props} components={items} />
        </div>
        <style jsx>{`
          .page {
            padding: 0rem;
            margin: 0 auto;
          }
          a.modal {
            border: 1px solid white;
            border-radius: 0.25rem;
            padding: 0.5rem;
            margin: 1rem;
            cursor: pointer;
          }

          input[type="text"],
          textarea {
            width: 100%;
            padding: 0.5rem;
            margin: 0.5rem 0;
            border-radius: 0.25rem;
            border: 0.125rem solid rgba(0, 0, 0, 0.2);
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
    </>
  );
};

export const getServerSideProps = async (context) => {
  // Get Fit
  const res = await fetch(`${process.env.HOST}/api/fits/${context.params.id}`);
  let data;
  try {
    data = await res.json();
  } catch (e) {
    console.log("error:", e.message);
  }

  return {
    props: { ...data, url: process.env.HOST },
  };
};

export default Fit;
