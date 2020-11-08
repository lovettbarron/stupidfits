import React, { useState } from "react";
import fetch from "isomorphic-unfetch";
import Layout from "../../components/Layout";
import Router from "next/router";
import { Select } from "baseui/select";
import { Input } from "baseui/input";
import { FileUploader } from "baseui/file-uploader";
import FitBox from "../../components/FitBox";
import { useUpload } from "use-cloudinary";

const Item = (props) => {
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error.message}</p>;

  return (
    <Layout>
      <div className="page"></div>
      <style jsx>{`
        .page {
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </Layout>
  );
};

export const getServerSideProps = async (context) => {
  // Get item
  const res = await fetch(
    `${process.env.HOST}/api/review/${context.params.id}`
  );
  let data;
  try {
    data = await res.json();
  } catch (e) {
    console.log("error:", e.message);
  }

  return {
    props: {
      ...data,
    },
  };
};

export default Item;
