import React, { useState, useEffect } from "react";
import { getSession, useSession } from "next-auth/client";
import Head from "next/head";
import fetch from "isomorphic-unfetch";
import { Tabs, Tab, FILL } from "baseui/tabs-motion";
import Layout from "../../components/Layout";
import { NextSeo } from "next-seo";
import { Button } from "baseui/button";
import Battle from "../../components/Battle";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE,
  ROLE,
} from "baseui/modal";

const Collection = ({ battle }) => {
  const [session, loading] = useSession();
  const [isOpen, setIsOpen] = useState(false);

  // const seourl =
  //   (collection.fits.length > 0 &&
  //     collection.fits[0].media[0].cloudinary &&
  //     `https://res.cloudinary.com/stupidsystems/image/${
  //       collection.user.hideface && `e_pixelate_faces:15/`
  //     }upload/${collection.fits[0].media[0].cloudinary}.png`) ||
  //   "https://stupidfits.com/img/appicon.png";

  // const seourlfb =
  //   (collection.fits.length > 0 &&
  //     collection.fits[0].media[0].cloudinary &&
  //     `https://res.cloudinary.com/stupidsystems/image/upload/b_rgb:151515,${
  //       collection.user.hideface && `e_pixelate_faces:15,`
  //     }c_lpad,h_630,w_1200/${collection.fits[0].media[0].cloudinary}.png`) ||
  //   "https://stupidfits.com/img/appicon.png";

  // let tags = [];
  // // [
  // //   ...collection.item.map((i) => `${i.brand.name} ${i.model}`),
  // //   ...props.review.tags.map((s) => `${s.name}`),
  // // ];

  useEffect(() => {
    // refresh();
    return () => {};
  }, []);

  return (
    <>
      {/* <NextSeo
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
      </Head> */}
      <Layout>
        {/* <h1>{battle.title}</h1> */}
        {/* {collection.description && (
          <p className="center">{collection.description}</p>
        )} */}
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
  const id = context.params.slug;

  console.log("Fetching battle", id);

  const res = await fetch(`${process.env.HOST}/api/battle/${id}`);
  let data;
  try {
    data = await res.json();
  } catch (e) {
    console.log("error:", e.message);
  }

  // if (context.params.slug[1] !== data.slug) {
  //   if (context.res) {
  //     context.res.writeHead(302, {
  //       Location: `/collection/${data.id}/${data.collection.slug}`,
  //     });
  //     context.res.end();
  //   }
  //   return {};
  // }

  // if ((!session || !session.user) && !data.published) {
  //   if (context.res) {
  //     context.res.writeHead(302, { Location: `/` });
  //     context.res.end();
  //   }
  //   return {};
  // }

  console.log("data", data);

  return {
    props: {
      battle: data,
    },
  };
};

export default Collection;
