import React, { useState } from "react";
import fetch from "isomorphic-unfetch";
import Layout from "../../components/Layout";
import FitBox from "../../components/FitBox";
import RenderReview from "../../components/RenderReview";

const Review = (props) => {
  return (
    <Layout>
      <div className="page">
        <RenderReview {...props.review} />
      </div>
      <style jsx>{`
        .page {
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
      review: data,
    },
  };
};

export default Review;
