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
import InfiniteScroll from "react-infinite-scroll-component";
import { Button } from "baseui/button";
import FitGallery from "../../components/FitGallery";
import FitMini from "../../components/FitMini";
import BattleCard from "../../components/BattleCard";
import CollectionBox from "../../components/CollectionBox";
import CreateCollection from "../../components/CreateCollection";
import CreateGroup from "../../components/CreateGroup";
import InviteUser from "../../components/InviteUser";
import UserBox from "../../components/UserBox";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE,
  ROLE,
} from "baseui/modal";

const Group = ({ group, collections, invites, members, fits }) => {
  const [session, loading] = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [coll, setColl] = useState(group || null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeKey, setActiveKey] = React.useState("0");
  const [visible, setVisible] = useState(fits.slice(0, 10));

  const fetch = () => {
    const nextMax = () => {
      let t = visible.length + 4;
      return t > fits.length - 1 ? fits.length : t;
    };
    setVisible(fits.slice(0, nextMax()));
  };

  const seourl =
    // (group.fits.length > 0 &&
    //   group.fits[0].media[0].cloudinary &&
    //   `https://res.cloudinary.com/stupidsystems/image/${
    //     group.user.hideface && `e_pixelate_faces:15/`
    //   }upload/${group.fits[0].media[0].cloudinary}.png`) ||
    "https://stupidfits.com/img/appicon.png";

  const seourlfb =
    // (group.fits.length > 0 &&
    //   group.fits[0].media[0].cloudinary &&
    //   `https://res.cloudinary.com/stupidsystems/image/upload/b_rgb:151515,${
    //     group.user.hideface && `e_pixelate_faces:15,`
    //   }c_lpad,h_630,w_1200/${group.fits[0].media[0].cloudinary}.png`) ||
    "https://stupidfits.com/img/appicon.png";

  let tags = [];
  // [
  //   ...group.item.map((i) => `${i.brand.name} ${i.model}`),
  //   ...props.review.tags.map((s) => `${s.name}`),
  // ];

  useEffect(() => {
    // refresh();
    return () => {};
  }, [fits]);

  return (
    <>
      <NextSeo
        title={`${group.name} on Stupid Fits `}
        description={group.description || `${group.name} on Stupid Fits `}
        canonical={`${process.env.HOST}/group/${group.id}/${group.slug}`}
        openGraph={{
          keywords: tags,
          url: `${process.env.HOST}/group/${group.id}/${group.slug}`,
          title: `${group.name} on Stupid Fits`,
          description: group.description || `${group.name} on Stupid Fits `,
          type: "profile",
          article: {
            authors: [group.user.username],
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
          href={`${process.env.HOST}/api/embed?url=${process.env.HOST}/group/${group.id}/${group.slug}`}
          title={`${group.name} on Stupid Fits `}
          key="oembed"
        />
      </Head>
      <Layout>
        <h1>{group.name}</h1>
        {group.description && <p className="center">{group.description}</p>}
        {session && (
          <p className="center">
            {(session.user.id === group.user.id || group.inviteonly) && (
              <>
                <Button onClick={() => setIsOpen(true)}>New Collection</Button>{" "}
                <InviteUser group={group} />{" "}
              </>
            )}
            {group.user.id === session.user.id && (
              <>
                <Button onClick={() => setEditOpen(true)}>Edit Group</Button>{" "}
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
              <InfiniteScroll
                dataLength={visible.length} //This is important field to render the next data
                next={fetch}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
                hasMore={fits.length > visible.length}
                loader={<h4>Loading...</h4>}
              >
                {visible.map((fit, i) => (
                  <FitMini key={i} {...fit} fit={fit.id} />
                ))}
              </InfiniteScroll>

              {/* {fits &&
                fits
                .sort((a, b) => {
                  return b.media[0].timestamp - a.media[0].timestamp;
                })
                  .map((fit) => <FitMini key={fit.id} {...fit} fit={fit.id} />)} */}
            </div>
          </Tab>
          <Tab title="Members">
            <div className="flex">
              {members &&
                [group.user, ...members].map((m) => (
                  <UserBox key={m.id} {...m} />
                ))}
            </div>
          </Tab>
          <Tab title="Collections">
            <div className="flex">
              {collections &&
                Array.isArray(collections) &&
                collections
                  .sort((a, b) => {
                    return b.createdAt - a.createdAt;
                  })
                  .map((c) => <CollectionBox key={c.id} {...c} />)}
            </div>
          </Tab>
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
          <ModalHeader>Create Collection</ModalHeader>
          <ModalBody>
            This collection will be part of {group.name}.
            {isOpen && (
              <CreateCollection
                group={group}
                handler={(data) => {
                  setIsLoading(true);
                  setIsOpen(false);
                }}
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
          <ModalHeader>Update Group</ModalHeader>
          <ModalBody>
            {editOpen && (
              <CreateGroup
                group={group}
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

  const res = await fetch(`${process.env.HOST}/api/group/${id}`);
  let data;
  try {
    data = await res.json();
  } catch (e) {
    console.log("error:", e.message);
  }

  if (context.params.slug[1] !== data.slug) {
    if (context.res) {
      context.res.writeHead(302, {
        Location: `/group/${data.id}/${data.slug}`,
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
      group: data,
      collections: data.collection,
      members: data.member,
      invites: data.Invite,
      fits: [data.user, ...data.member]
        .map((m) => m.fit && m.fit.map((f) => f))
        .flat()
        .sort((a, b) => {
          return b.media[0].timestamp - a.media[0].timestamp;
        }),
    },
  };
};

export default Group;
