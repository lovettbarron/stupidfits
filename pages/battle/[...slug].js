import React, { useState, useEffect } from "react";
import { getSession, useSession } from "next-auth/client";
import Head from "next/head";
import fetch from "isomorphic-unfetch";
import { Tabs, Tab, FILL } from "baseui/tabs-motion";
import Layout from "../../components/Layout";
import { NextSeo } from "next-seo";
import { Button } from "baseui/button";
import Battle from "../../components/Battle";
import Link from "next/link";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE,
  ROLE,
} from "baseui/modal";

const generateVSImage = (fit1, fit2, square) => {
  //https://res.cloudinary.com/stupidsystems/image/upload/b_rgb:151515,h_630,w_630,c_fit/l_jjgxbgrmqyvck3nltlvt,h_1.0,fl_relative,x_600/l_stupidfits:vsimage,x_0/h_630,w_1200,c_fill/kqz94moxwrmfvxvpdx53.jpg

  //res.cloudinary.com/stupidsystems/image/upload/b_rgb:151515,h_630,w_630/l_jjgxbgrmqyvck3nltlvt,h_1.0,fl_relative,x_630/l_stupidfits:vsimage,x_0/h_630,w_1200,c_fit/kqz94moxwrmfvxvpdx53.jpg

  return `https://res.cloudinary.com/stupidsystems/image/upload/b_rgb:151515,c_fit,h_630,w_${
    square ? "630" : "630"
  }/l_${fit1.media[0].cloudinary.replace("/", ":")},h_1.0,fl_relative,x_${
    square ? "315" : "600"
  }/l_stupidfits:vsimage,x_0/h_630,w_${square ? "630" : "1200"},c_fit/${
    fit2.media[0].cloudinary
  }.png`;
};

const Collection = ({ battle }) => {
  const [session, loading] = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [collection, setCollection] = useState(battle.collection);
  const seourl =
    (collection.fits.length > 0 &&
      collection.fits[0].media[0].cloudinary &&
      generateVSImage(collection.fits[0], collection.fits[1]),
    true) || "https://stupidfits.com/img/appicon.png";

  const seourlfb =
    (collection.fits.length > 0 &&
      collection.fits[0].media[0].cloudinary &&
      generateVSImage(collection.fits[0], collection.fits[1], false)) ||
    "https://stupidfits.com/img/appicon.png";

  let tags = [
    "outfit",
    "tournament",
    "techwear",
    "whatsapp",
    "discord",
    "compete",
  ];
  // [
  //   ...collection.item.map((i) => `${i.brand.name} ${i.model}`),
  //   ...props.review.tags.map((s) => `${s.name}`),
  // ];

  useEffect(() => {
    // refresh();
    return () => {};
  }, []);

  return (
    <>
      <NextSeo
        title={`${collection.title} by ${battle.user.username} on Stupid Fits `}
        description={`${collection.title} by ${battle.user.username} on Stupid Fits `}
        canonical={`${process.env.HOST}/battle/${battle.id}/${collection.slug}`}
        openGraph={{
          keywords: tags,
          url: `${process.env.HOST}/battle/${battle.id}/${collection.slug}`,
          title: `${collection.title} Tournament by ${battle.user.username} on Stupid Fits`,
          description: `${collection.title} Tournamentby ${battle.user.username} on Stupid Fits`,
          type: "article",
          article: {
            authors: [battle.user.username],
            tags: tags,
          },
          images: [
            {
              url: seourlfb,
              width: 1200,
              height: 630,
              type: "image/png",
              alt: `${collection.title} Tournamentby ${battle.user.username} on Stupid Fits`,
            },
            {
              url: seourl,
              width: 1200,
              height: 1200,
              type: "image/png",
              alt: `${collection.title} Tournamentby ${battle.user.username} on Stupid Fits`,
            },
          ],
        }}
      />
      <Head>
        <link
          rel="alternate"
          type="application/json+oembed"
          href={`${process.env.HOST}/api/embed?url=${process.env.HOST}/battle/${battle.id}/${collection.slug}`}
          title={`${collection.title} Tournament on Stupid Fits`}
          key="oembed"
        />
      </Head>
      <Layout>
        <h1>{collection.title} Tournament</h1>
        {battle.archive && <h3>This tournament is archived</h3>}
        <Link href={`/collection/${collection.id}/${collection.slug}`}>
          <a>Return to Collection</a>
        </Link>
        <br />
        {collection.description && (
          <p className="center">{collection.description}</p>
        )}
        <br />
        {/* {session && (
          <p className="center">
            <Button onClick={() => setIsOpen(true)}>Add Fits</Button>{" "}
            {collection.user.id === session.user.id && (
              <Button onClick={() => setEditOpen(true)}>Edit Collection</Button>
            )}{" "}
            <Button onClick={() => createBattle()}>Create Battle</Button>
          </p>
        )} */}
        <div className="flex">
          <Battle {...battle} />
        </div>
        {/* <Modal
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
        <Modal
          onClose={() => {
            setIsOpen(false);
          }}
          closeable
          autoFocus
          focusLock
          isOpen={editOpen}
          animate
          unstable_ModalBackdropScroll
          size={SIZE.default}
          role={ROLE.dialog}
        >
          <ModalHeader>Update Collection</ModalHeader>
          <ModalBody>
            {editOpen && (
              <CreateCollection
                collection={collection}
                handler={(data) => {
                  setIsLoading(true);
                  setIsOpen(false);
                }}
              />
            )}
          </ModalBody>
        </Modal> */}
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
  console.log("Battle Slug", context.params.slug);
  const id = context.params.slug[0];

  console.log("Fetching battle", id);

  const res = await fetch(`${process.env.HOST}/api/battle/${id}`);
  let data;
  try {
    data = await res.json();
  } catch (e) {
    console.log("error:", e.message);
  }

  if (context.params.slug[1] !== data.collection.slug) {
    if (context.res) {
      context.res.writeHead(302, {
        Location: `/battle/${data.id}/${data.collection.slug}`,
      });
      context.res.end();
    }
    return {};
  }

  return {
    props: {
      battle: data,
    },
  };
};

export default Collection;
