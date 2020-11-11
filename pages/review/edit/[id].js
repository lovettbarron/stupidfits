import React, { useState } from "react";
import fetch from "isomorphic-unfetch";
import Layout from "../../../components/Layout";
import Router from "next/router";
import Link from "next/link";
import { getSession, session } from "next-auth/client";
import { Select } from "baseui/select";
import { Input } from "baseui/input";
import { FileUploader } from "baseui/file-uploader";
import FitBox from "../../../components/FitBox";
import { useUpload } from "use-cloudinary";
import CreateReview from "../../../components/CreateReview";
import RenderReview from "../../../components/RenderReview";

const Item = (props) => {
  const [review, setReview] = useState(props.review);

  return (
    <Layout>
      <div className="flex">
        <div className="set">
          <CreateReview
            review={props.review}
            styles={props.styles}
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
  const session = await getSession(context);

  const id = parseInt(context.params.id);

  if (!session || !session.user) {
    if (context.res) {
      context.res.writeHead(302, { Location: `/review/${id}` });
      context.res.end();
    }
    return {};
  }

  const r = await fetch(`${process.env.HOST}/api/review/${id}`);
  let review;
  try {
    review = await r.json();
  } catch (e) {
    console.log("error:", e.message);
  }

  if (!session || !session.user) {
    if (context.res) {
      context.res.writeHead(302, {
        Location: `/review/${review.id}-${review.slug}`,
      });
      context.res.end();
    }
    return {};
  }

  const sres = await fetch(`${process.env.HOST}/api/style`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: context.req.headers.cookie,
    },
  });

  let styles = null;
  // console.log("Res", res);
  try {
    styles = await sres.json();
  } catch (e) {
    console.log("error:", e.message);
  }

  return {
    props: {
      review: review,
      styles: styles,
    },
  };
};

export default Item;
