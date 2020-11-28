import React, { useState } from "react";
import { NextSeo } from "next-seo";
import Head from "next/head";
import Layout from "../../components/Layout";
import fetch from "isomorphic-unfetch";
import CollectionBox from "../../components/CollectionBox";
import Link from "next/link";
import { useSession, signin, signout } from "next-auth/client";
import { Button } from "baseui/button";
import CreateGroup from "../../components/CreateGroup";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE,
  ROLE,
} from "baseui/modal";

const Group = (props) => {
  const [session, loading] = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  let tags = [];

  return (
    <>
      <NextSeo
        title={`Groups on Stupid Fits `}
        description={`Groups for styles, tournaments, communities, and similar — mostly to support existing communities`}
        canonical={`${process.env.HOST}/collection/`}
        openGraph={{
          keywords: tags,
          url: `${process.env.HOST}/group/`,
          title: `Groups on Stupid Fits`,
          description: `Groups for styles, tournaments, communities, and similar — mostly to support existing communities`,
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
      />
      <Head>
        <link
          rel="alternate"
          type="application/json+oembed"
          href={`${process.env.HOST}/api/embed?url=${process.env.HOST}/group/`}
          title={`Groups on Stupid Fits`}
          key="oembed"
        />
      </Head>
      <Layout>
        <div className="page">
          {session && (
            <>
              {session && (
                <p className="center">
                  <Button onClick={() => setIsOpen(true)}>
                    Create a Group
                  </Button>
                </p>
              )}
            </>
          )}

          <h3>Featured Groups</h3>
          <div className="reviews">
            {props.feed &&
              Array.isArray(props.feed) &&
              props.feed
                .sort((a, b) => {
                  return b.createdAt - a.createdAt;
                })
                .map((r) => <CollectionBox key={r.id} {...r} />)}
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
            size={SIZE.default}
            role={ROLE.dialog}
          >
            <ModalHeader>Create New Group</ModalHeader>
            <ModalBody>
              {isOpen && (
                <CreateGroup
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
  const res = await fetch(`${process.env.HOST}/api/group`, {
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
    },
  };
};

export default Group;
