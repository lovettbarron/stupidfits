import React, { useEffect, useState } from "react";
import Head from "next/head";
import fetch from "isomorphic-unfetch";
import Layout from "../../components/Layout";
import Link from "next/link";
import Router from "next/router";
import { Select } from "baseui/select";
import FitBox from "../../components/FitBox";
import { NextSeo } from "next-seo";

import { getSession, useSession } from "next-auth/client";

const Fit = (props) => {
  const [session, loading] = useSession();
  const [desc, setDesc] = useState(props.desc);
  const [items, setItems] = useState(props.components);

  const brandKeywords = props.components.map((c) => c.brand.name);

  const getBrandKeywords = (count) => {
    let o = {};
    brandKeywords.forEach(function (item) {
      item in o ? (o[item] += 1) : (o[item] = 1);
    });
    const arr = Object.keys(o).sort(function (a, b) {
      return o[a] < o[b];
    });

    return arr.slice(0, count);
  };

  useEffect(() => {
    return () => {};
  }, [session]);

  const seourl =
    (props.media.cloudinary &&
      `https://res.cloudinary.com/stupidsystems/image/upload/${props.media.cloudinary}.png`) ||
    "";

  const seourlfb =
    (props.media.cloudinary &&
      `https://res.cloudinary.com/stupidsystems/image/upload/b_rgb:151515,c_lpad,h_630,w_1200/${props.media.cloudinary}.png`) ||
    "";

  return (
    <>
      <NextSeo
        title={`${props.user.username}'s Fit on Stupid Fits `}
        description={`${props.user.username}'s fit with ${getBrandKeywords(
          5
        ).join(", ")}`}
        canonical={`${process.env.HOST}/f/${props.id}`}
        openGraph={{
          keywords: getBrandKeywords(5),
          url: `${process.env.HOST}/f/${props.id}`,
          title: `${props.user.username}'s Fit on Stupid Fits`,
          description: props.desc
            ? props.desc
            : `Check out ${props.user.username}'s fit with ${getBrandKeywords(
                5
              ).join(", ")}`,
          type: "article",
          article: {
            authors: [props.user.username],
            tags: getBrandKeywords(5),
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
        twitter={{
          image: seourlfb,
          cardType: "summary_large_image",
        }}
      />
      <Head>
        <link
          rel="alternate"
          type="application/json+oembed"
          href={`${process.env.HOST}/api/embed?url=${process.env.HOST}/f/${props.id}`}
          title={`${props.user.username}'s fit on Stupid Fits`}
          key="oembed"
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
    if (context.res) {
      context.res.writeHead(302, { Location: `/` });
      context.res.end();
    }
    return {};
  }

  return {
    props: { ...data, url: process.env.HOST },
  };
};

export default Fit;
