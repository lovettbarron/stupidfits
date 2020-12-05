import React, { useState } from "react";
import { getSession, useSession } from "next-auth/client";
import Head from "next/head";
import fetch from "isomorphic-unfetch";
import { Tabs, Tab, FILL } from "baseui/tabs-motion";
import Layout from "../../components/Layout";
import { NextSeo } from "next-seo";
import RenderReview from "../../components/RenderReview";

const Review = (props) => {
  const seourl =
    (props.review.media.length > 0 &&
      props.review.media[0].cloudinary &&
      `https://res.cloudinary.com/stupidsystems/image/${
        props.review.user.hideface && `e_pixelate_faces:15/`
      }upload/${props.review.media[0].cloudinary}.png`) ||
    "https://stupidfits.com/img/appicon.png";

  const seourlfb =
    (props.review.media.length > 0 &&
      props.review.media[0].cloudinary &&
      `https://res.cloudinary.com/stupidsystems/image/upload/b_rgb:151515,${
        props.review.user.hideface && `e_pixelate_faces:15,`
      }c_lpad,h_630,w_1200/${props.review.media[0].cloudinary}.png`) ||
    "https://stupidfits.com/img/appicon.png";

  let tags = [
    ...props.review.item.map((i) => `${i.brand.name} ${i.model}`),
    ...props.review.tags.map((s) => `${s.name}`),
  ];

  return (
    <>
      <NextSeo
        title={`${props.review.title} by ${props.review.user.username} on Stupid Fits `}
        description={`${props.review.title} by ${props.review.user.username} on Stupid Fits `}
        canonical={`${process.env.HOST}/review/${props.review.id}/${props.review.slug}`}
        openGraph={{
          keywords: tags,
          url: `${process.env.HOST}/review/${props.review.id}/${props.review.slug}`,
          title: `${props.review.title} by ${props.review.user.username} on Stupid Fits`,
          description: `${props.review.title} by ${props.review.user.username} on Stupid Fits `,
          type: "article",
          article: {
            authors: [props.review.user.username],
            tags: tags,
          },
          images: [
            {
              url: seourlfb,
              width: 1200,
              height: 630,
              type: "image/png",
              alt: "Primary image",
            },
            {
              url: seourl,
              width: 1200,
              height: 1200,
              type: "image/png",
              alt: "Og Image",
            },
          ],
        }}
      />
      <Head>
        <title>{`${props.review.title} by ${props.review.user.username} on Stupid Fits`}</title>
        <link
          rel="alternate"
          type="application/json+oembed"
          href={`${process.env.HOST}/api/embed?url=${process.env.HOST}/review/${props.review.id}/${props.review.slug}`}
          title={`${props.review.user.username}'s fit on Stupid Fits`}
          key="oembed"
        />
      </Head>
      <Layout>
        <RenderReview {...props.review} />

        <style jsx>{`
          .page {
            display: flex;
            justify-content: center;
            align-items: center;
          }
        `}</style>
      </Layout>
    </>
  );
};

export const getServerSideProps = async (context) => {
  // Get item

  const session = await getSession(context);
  const id = context.params.slug[0];

  const res = await fetch(`${process.env.HOST}/api/review/${id}`);

  let data;
  try {
    data = await res.json();
  } catch (e) {
    console.log("error:", e.message);
  }

  if (context.params.slug[1] !== data.slug) {
    if (context.res) {
      context.res.writeHead(302, {
        Location: `/review/${data.id}/${data.slug}`,
      });
      context.res.end();
    }
    return {};
  }

  if ((!session || !session.user) && !data.published) {
    if (context.res) {
      context.res.writeHead(302, { Location: `/` });
      context.res.end();
    }
    return {};
  }

  return {
    props: {
      review: data,
    },
  };
};

export default Review;
