import React, { useState, useEffect } from "react";
import { getSession, useSession } from "next-auth/client";
import Head from "next/head";
import fetch from "isomorphic-unfetch";
import { Tabs, Tab, FILL } from "baseui/tabs-motion";
import Layout from "../../components/Layout";
import { NextSeo } from "next-seo";
import { Button } from "baseui/button";
import FitGallery from "../../components/FitGallery";
import FitMini from "../../components/FitMini";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE,
  ROLE,
} from "baseui/modal";

const Collection = ({ collection }) => {
  const [session, loading] = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [fits, setFits] = useState(collection.fits || []);
  const [coll, setColl] = useState(collection || null);

  const refresh = async () => {
    const res = await fetch(
      `${process.env.HOST}/api/collection/${collection.id}`
    );
    let data;
    try {
      data = await res.json();
      setColl(data);
    } catch (e) {
      console.log("error:", e.message);
    }
  };

  const addFit = async (id) => {
    console.log("Adding fit", id);
    try {
      const body = { id: collection.id, fit: id };
      const res = await fetch(`${process.env.HOST}/api/collection/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      console.log("Added fit!", data);
    } catch (error) {
      console.error(error);
    }
  };

  const seourl =
    (collection.fits.length > 0 &&
      collection.fits[0].media[0].cloudinary &&
      `https://res.cloudinary.com/stupidsystems/image/${
        collection.user.hideface && `e_pixelate_faces:15/`
      }upload/${collection.fits[0].media[0].cloudinary}.png`) ||
    "https://stupidfits.com/img/appicon.png";

  const seourlfb =
    (collection.fits.length > 0 &&
      collection.fits[0].media[0].cloudinary &&
      `https://res.cloudinary.com/stupidsystems/image/upload/b_rgb:151515,${
        collection.user.hideface && `e_pixelate_faces:15,`
      }c_lpad,h_630,w_1200/${collection.fits[0].media[0].cloudinary}.png`) ||
    "https://stupidfits.com/img/appicon.png";

  let tags = [];
  // [
  //   ...collection.item.map((i) => `${i.brand.name} ${i.model}`),
  //   ...props.review.tags.map((s) => `${s.name}`),
  // ];

  useEffect(() => {
    refresh();
    return () => {};
  }, [fits]);

  return (
    <>
      <NextSeo
        title={`${collection.title} by ${collection.user.username} on Stupid Fits `}
        description={`${collection.title} by ${collection.user.username} on Stupid Fits `}
        canonical={`${process.env.HOST}/collection/${collection.id}/${collection.slug}`}
        openGraph={{
          keywords: tags,
          url: `${process.env.HOST}/collection/${collection.id}/${collection.slug}`,
          title: `${collection.title} by ${collection.user.username} on Stupid Fits`,
          description: `${collection.title} by ${collection.user.username} on Stupid Fits `,
          type: "article",
          article: {
            authors: [collection.user.username],
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
        twitter={{
          image: seourlfb,
          cardType: "summary_large_image",
        }}
      />
      <Head>
        <link
          rel="alternate"
          type="application/json+oembed"
          href={`${process.env.HOST}/api/embed?url=${process.env.HOST}/collection/${collection.id}/${collection.slug}`}
          title={`${collection.user.username}'s fit on Stupid Fits`}
          key="oembed"
        />
      </Head>
      <Layout>
        <h1>{collection.title}</h1>
        {session && (
          <>
            {collection.user.username && (
              <p className="center">
                <Button onClick={() => setIsOpen(true)}>Add Fits</Button>
              </p>
            )}
          </>
        )}
        <div className="flex">
          {coll.fits
            .sort((a, b) => {
              return b.media[0].timestamp - a.media[0].timestamp;
            })
            .filter((f) => ["FEATURED", "PUBLIC"].includes(f.status))
            .filter((f) => f.components.length > 0)
            .map((fit) => (
              <FitMini key={fit.id} {...fit} fit={fit.id} />
            ))}
        </div>
        <Modal
          onClose={() => {
            setIsOpen(false);
          }}
          closeable
          autoFocus
          focusLock
          isOpen={isOpen}
          animate
          unstable_ModalBackdropScroll
          size={SIZE.full}
          role={ROLE.dialog}
        >
          <ModalHeader>Add Fit</ModalHeader>
          <ModalBody>
            {isOpen && (
              <FitGallery handler={addFit} select={fits.map((f) => f.id)} />
            )}
          </ModalBody>
        </Modal>
        <style jsx>{`
          .page {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .flex {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
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

  const res = await fetch(`${process.env.HOST}/api/collection/${id}`);
  let data;
  try {
    data = await res.json();
  } catch (e) {
    console.log("error:", e.message);
  }

  if (context.params.slug[1] !== data.slug) {
    if (context.res) {
      context.res.writeHead(302, {
        Location: `/collection/${data.id}/${data.slug}`,
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

  console.log("data", data);

  return {
    props: {
      collection: data,
    },
  };
};

export default Collection;
