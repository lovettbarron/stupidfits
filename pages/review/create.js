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
import CreateReview from "../../components/CreateReview";
import RenderReview from "../../components/RenderReview";

const Item = (props) => {
  const [review, setReview] = useState(props.review);

  return (
    <Layout>
      <div className="flex">
        <div className="set">
          <CreateReview
            review={props.review}
            handler={(data) => {
              setReview(data);
            }}
          />
        </div>
        <div className="set">
          <RenderReview {...review} />
        </div>
      </div>

      <style jsx>{`
        .page {
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .flex {
          display: flex;
          flex: 1 1 0;
        }

        .set {
          width: 50%;
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
      review: {},
    },
  };
};

export default Item;
