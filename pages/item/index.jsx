import React, { useState } from "react";
import fetch from "isomorphic-unfetch";
import Layout from "../../components/Layout";
import Router from "next/router";
import Link from "next/link";
import { Select } from "baseui/select";
import { Input } from "baseui/input";
import { FileUploader } from "baseui/file-uploader";
import FitBox from "../../components/FitBox";
import { useUpload } from "use-cloudinary";
import CreateItem, { types } from "../../components/CreateItem";

const colour = [];

const qual = [];

const Item = (props) => {
  return (
    <Layout>
      <CreateItem
        handler={() => {
          Router.push(`/closet`);
        }}
      />
      <style jsx>{`
        .page {
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        form > * {
          margin: 0.5rem 0;
        }

        input[type="text"],
        select,
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
  // Fetch Brands
  const b = await fetch(`${process.env.HOST}/api/brand`);
  let brands;
  try {
    brands = await b.json();
  } catch (e) {
    console.log("error:", e.message);
  }

  return {
    props: {
      brands: brands && brands.map((b) => ({ label: b.name, id: b.id })),
      url: process.env.HOST,
    },
  };
};

export default Item;
