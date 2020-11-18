import React, { useState } from "react";
import { NextSeo } from "next-seo";
import Head from "next/head";
import Layout from "../../components/Layout";
import fetch from "isomorphic-unfetch";
import CollectionBox from "../../components/CollectionBox";
import Link from "next/link";
import { useSession, signin, signout } from "next-auth/client";
import { extractHostname } from "../../components/Clicker";
import { Button } from "baseui/button";
import CreateCollection from "../../components/CreateCollection";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE,
  ROLE,
} from "baseui/modal";

const Collections = (props) => {
  const [session, loading] = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  let tags = [];
  // props.feed
  //   .map((r) => [
  //     r.item.map((i) => `${i.brand.name} ${i.model}`),
  //     r.tags.map((s) => `${s.name}`),
  //   ])
  //   .flat();

  // console.log("session", props.user);
  return (
    <>
      <NextSeo
        title={`Collections on Stupid Fits `}
        description={`Collections of fits with designer brands, techwear, streetstyle, etc. on Stupid Fits`}
        canonical={`${process.env.HOST}/collection/`}
        openGraph={{
          keywords: tags,
          url: `${process.env.HOST}/collection/`,
          title: `Collections on Stupid Fits`,
          description: `Collections of fits with designer brands, techwear, streetstyle, etc. on Stupid Fits`,
          type: "website",
          images: [
            {
              url: "https://stupidfits.com/img/reviews-wide.png",
              width: 1200,
              height: 630,
              type: "image/png",
              alt: "Primary image",
            },
            {
              url: "https://stupidfits.com/img/review-header.png",
              width: 1200,
              height: 1200,
              type: "image/png",
              alt: "Og Image",
            },
          ],
        }}
        twitter={{
          image: "https://stupidfits.com/img/reviews-wide.png",
          cardType: "summary_large_image",
        }}
      />
      <Head>
        <link
          rel="alternate"
          type="application/json+oembed"
          href={`${process.env.HOST}/api/embed?url=${process.env.HOST}/collection/`}
          title={`CollectionsReviews on Stupid Fits`}
          key="oembed"
        />
      </Head>
      <Layout>
        <div className="page">
          {session && (
            <>
              <h3>Hej {props.user.username}</h3>
              {props.user.username && (
                <p className="center">
                  <Button onClick={() => setIsOpen(true)}>
                    Create a Collection
                  </Button>
                </p>
              )}
            </>
          )}

          <h3>Featured Collections</h3>
          <div className="reviews">
            {props.feed &&
              Array.isArray(props.feed) &&
              props.feed
                .sort((a, b) => {
                  return b.createdAt - a.createdAt;
                })
                .map((r) => <CollectionBox key={r.id} {...r} />)}
          </div>
          <footer>
            <ul>
              <li>
                <Link href="/wtf">
                  <a>WTF is this?</a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a>Privacy</a>
                </Link>
              </li>
              <li>
                <Link href="/tos">
                  <a>Terms</a>
                </Link>
              </li>
              <li>
                <Link href="/cookie">
                  <a>Cookies</a>
                </Link>
              </li>
            </ul>
          </footer>
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
            size={SIZE.default}
            role={ROLE.dialog}
          >
            <ModalHeader>Add To Your Closet</ModalHeader>
            <ModalBody>
              {isOpen && (
                <CreateCollection
                  handler={(data) => {
                    setIsLoading(true);
                    setIsOpen(false);
                  }}
                />
              )}
            </ModalBody>
          </Modal>
        </div>
        <style jsx>{`
          header > h1 {
            margin: 0;
          }

          .reviews {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
          }

          ol {
            padding: 0;
            text-align: left;
          }

          .main {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
          }

          .col {
            width: 50%;
          }

          @media screen and (max-width: 800px) {
            .col {
              width: 100%;
            }
          }

          p.center {
            margin: 0 auto;
          }

          footer ul {
            padding: 0;
          }

          footer li {
            list-style: none;
          }
          .post {
          }
          .auth img {
            max-width: 20rem;
            transition: all 0.4s;
          }
          .auth img:hover {
            -webkit-filter: invert(1);
            filter: invert(1);
            background: black;
          }

          .post:hover {
          }

          .post + .post {
            margin-top: 2rem;
          }

          footer {
          }

          footer ul {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
          }

          footer li {
            margin: 2rem;
          }
        `}</style>
      </Layout>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const userres = await fetch(`${process.env.HOST}/api/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: context.req.headers.cookie,
    },
  });

  let user = null;
  try {
    user = await userres.json();
  } catch (e) {
    console.log("error:", e.message);
  }

  const res = await fetch(`${process.env.HOST}/api/collection`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: context.req.headers.cookie,
    },
  });
  let feed = [];
  try {
    feed = await res.json();
  } catch (e) {
    console.log("error:", e.message);
  }
  return {
    props: {
      feed,
      user,
      url: process.env.HOST,
    },
  };
};

export default Collections;
