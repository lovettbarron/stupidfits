import React, { useState, useEffect } from "react";
import { getSession, useSession } from "next-auth/client";
import Head from "next/head";
import Router from "next/router";
import fetch from "isomorphic-unfetch";
import { Tabs, Tab, FILL } from "baseui/tabs-motion";
import Layout from "../../components/Layout";
import { StatefulTooltip } from "baseui/tooltip";
import { Block } from "baseui/block";
import { NextSeo } from "next-seo";
import { Button } from "baseui/button";
import FitGallery from "../../components/FitGallery";
import FitMini from "../../components/FitMini";
import CreateCollection from "../../components/CreateCollection";
import BattleCard from "../../components/BattleCard";

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
  const [editOpen, setEditOpen] = useState(false);
  const [fits, setFits] = useState(collection.fits || []);
  const [coll, setColl] = useState(collection || null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeKey, setActiveKey] = React.useState("0");

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

  const createBattle = async () => {
    setIsLoading(true);
    const body = {
      collection: collection.id,
    };
    const res = await fetch(`${process.env.HOST}/api/battle/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    let data;
    try {
      data = await res.json();
      if (data) Router.push(`/battle/${data.id}`);
      setIsLoading(false);
      console.log("Create", data);
    } catch (e) {
      setIsLoading(false);
      console.log("error:", e.message);
    }
  };

  const addFit = async (id, cb) => {
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
      setFits(data.fits);
      if (collection.oneperuser) setIsOpen(false);
      cb(true);
    } catch (error) {
      console.error(error);
      cb(false);
    }
  };

  const deleteFit = async (id, cb) => {
    console.log("Deleting fit", id);
    try {
      const body = { id: collection.id, fit: id };
      const res = await fetch(`${process.env.HOST}/api/collection/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      console.log("Deleting fit!", data);
      setFits(data.fits);
      // if (collection.oneperuser) setIsOpen(false);
      cb(true);
    } catch (error) {
      console.error(error);
      cb(false);
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
    // refresh();
    return () => {};
  }, [fits]);

  return (
    <>
      <NextSeo
        title={`${collection.title} by ${collection.user.username} on Stupid Fits `}
        description={
          collection.description ||
          `${collection.title} by ${collection.user.username} on Stupid Fits `
        }
        canonical={`${process.env.HOST}/collection/${collection.id}/${collection.slug}`}
        openGraph={{
          keywords: tags,
          url: `${process.env.HOST}/collection/${collection.id}/${collection.slug}`,
          title: `${collection.title} by ${collection.user.username} on Stupid Fits`,
          description:
            collection.description ||
            `${collection.title} by ${collection.user.username} on Stupid Fits `,
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
      />
      <Head>
        <link
          rel="alternate"
          type="application/json+oembed"
          href={`${process.env.HOST}/api/embed?url=${process.env.HOST}/collection/${collection.id}/${collection.slug}`}
          title={`${collection.title} by ${collection.user.username} on Stupid Fits `}
          key="oembed"
        />
      </Head>
      <Layout>
        <h1>{collection.title}</h1>
        {collection.description && (
          <p className="center">{collection.description}</p>
        )}
        {session && (
          <p className="center">
            {(session.user.id === collection.user.id || collection.public) && (
              <>
                <Button onClick={() => setIsOpen(true)}>
                  {fits && fits.some((f) => f.user.id === session.user.id)
                    ? "Edit"
                    : "Add"}{" "}
                  Fit{!collection.oneperuser && "s"}{" "}
                  {fits && fits.some((f) => f.user.id === session.user.id)
                    ? "in"
                    : "to"}{" "}
                  Collection
                </Button>{" "}
              </>
            )}
            {collection.user.id === session.user.id && (
              <>
                <Button onClick={() => setEditOpen(true)}>
                  Edit Collection
                </Button>{" "}
                <StatefulTooltip
                  content={() => (
                    <Block
                      padding={"20px"}
                      margin={"0"}
                      backgroundColor="#151515"
                      color="#fff"
                      border="none"
                    >
                      <h4>Create a Tournament</h4>
                      <ul>
                        <li>Generate a Tournament from this collection</li>
                        <li>Share with others to vote</li>
                        <li>Have fun. No stress.</li>
                      </ul>

                      {fits.length < 4 && (
                        <p>Add more fits to create a battle</p>
                      )}

                      {fits.length % 2 !== 0 && (
                        <p>
                          An even number of fits is required to make a battle
                        </p>
                      )}
                    </Block>
                  )}
                  returnFocus
                  autoFocus
                >
                  <span>
                    <Button
                      isLoading={isLoading}
                      disabled={
                        fits.length > 3 && fits.length % 2 === 0 ? false : true
                      }
                      onClick={() => createBattle()}
                    >
                      Create Battle
                    </Button>
                  </span>
                </StatefulTooltip>
              </>
            )}
          </p>
        )}
        <Tabs
          activeKey={activeKey}
          fill={FILL.fixed}
          onChange={({ activeKey }) => {
            setActiveKey(activeKey);
          }}
          activateOnFocus
          renderAll
        >
          <Tab title="Fits">
            <div className="flex">
              {fits &&
                fits
                  .sort((a, b) => {
                    return b.media[0].timestamp - a.media[0].timestamp;
                  })
                  .map((fit) => <FitMini key={fit.id} {...fit} fit={fit.id} />)}
            </div>
          </Tab>
          {collection.Battle.length > 0 && (
            <Tab title="Tournaments">
              <div className="flex">
                {collection.Battle &&
                  collection.Battle.filter((b) => !b.archive)
                    .sort((a, b) => {
                      return a.createdAt - b.createdAt;
                    })
                    .map((battle) => (
                      <BattleCard
                        key={battle.id}
                        battle={battle}
                        collection={collection}
                      />
                    ))}
              </div>
            </Tab>
          )}
          {session &&
            collection.user.id === session.user.id &&
            collection.Battle.length > 0 && (
              <Tab title="Archived">
                <div className="flex">
                  {collection.Battle &&
                    collection.Battle.filter((b) => b.archive)
                      .sort((a, b) => {
                        return a.createdAt - b.createdAt;
                      })
                      .map((battle) => (
                        <BattleCard
                          key={battle.id}
                          battle={battle}
                          collection={collection}
                        />
                      ))}
                </div>
              </Tab>
            )}
        </Tabs>
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
              <FitGallery
                handler={addFit}
                deleteHandler={deleteFit}
                collection={collection}
                select={
                  fits &&
                  fits
                    .filter((f) => f.user.id === session.user.id)
                    .map((f) => f.id)
                }
              />
            )}
          </ModalBody>
        </Modal>
        <Modal
          onClose={() => {
            setEditOpen(false);
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

  if ((!session || !session.user) && !data.published && !data.public) {
    if (context.res) {
      context.res.writeHead(302, { Location: `/` });
      context.res.end();
    }
    return {};
  }

  // console.log("data", data);

  return {
    props: {
      collection: data,
    },
  };
};

export default Collection;
