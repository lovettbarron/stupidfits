import React, { useEffect, useState } from "react";
import fetch from "isomorphic-unfetch";
import Layout from "../../components/Layout";
import Link from "next/link";
import Router from "next/router";
import { Select } from "baseui/select";
import FitBox from "../../components/FitBox";
import CreateItem from "../../components/CreateItem";
import { getSession, useSession } from "next-auth/client";
import { NextSeo } from "next-seo";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE,
  ROLE,
} from "baseui/modal";

const Fit = (props) => {
  const [session, loading] = useSession();
  const [desc, setDesc] = useState(props.desc);
  const [items, setItems] = useState(props.components);

  useEffect(() => {
    return () => {};
  }, [session]);

  return (
    <Layout>
      <NextSeo
        title={`${props.user.username}'s Fit on Stupid Fits`}
        description="Ingredient List for your Fit Pics"
        openGraph={{
          images: [
            {
              url: props.media && props.media.cloudinary,
              width: 800,
              height: 600,
              alt: "Og Image Alt",
            },
          ],
          site_name: "SiteName",
        }}
      />
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
