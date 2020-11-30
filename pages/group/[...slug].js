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
import BattleCard from "../../components/BattleCard";
import CreateCollection from "../../components/CreateCollection";
import CreateGroup from "../../components/CreateGroup";
import InviteUser from "../../components/InviteUser";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE,
  ROLE,
} from "baseui/modal";

const Group = ({ group, collections, members, fits }) => {
  const [session, loading] = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [coll, setColl] = useState(group || null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeKey, setActiveKey] = React.useState("0");

  const addFit = async (id, cb) => {
    console.log("Adding fit", id);
    try {
      const body = { id: group.id, fit: id };
      const res = await fetch(`${process.env.HOST}/api/group/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      console.log("Added fit!", data);
      setFits(data.fits);
      if (group.oneperuser) setIsOpen(false);
      cb(true);
    } catch (error) {
      console.error(error);
      cb(false);
    }
  };

  const deleteFit = async (id, cb) => {
    console.log("Deleting fit", id);
    try {
      const body = { id: group.id, fit: id };
      const res = await fetch(`${process.env.HOST}/api/group/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      console.log("Deleting fit!", data);
      setFits(data.fits);
      // if (group.oneperuser) setIsOpen(false);
      cb(true);
    } catch (error) {
      console.error(error);
      cb(false);
    }
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
            {(session.user.id === group.user.id || group.public) && (
              <>
                <Button onClick={() => setIsOpen(true)}>Modal Open</Button>{" "}
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
              {fits &&
                fits
                  .sort((a, b) => {
                    return b.media[0].timestamp - a.media[0].timestamp;
                  })
                  .map((fit) => <FitMini key={fit.id} {...fit} fit={fit.id} />)}
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
      fits: [data.user, ...data.member]
        .map((m) => m.fit && m.fit.map((f) => f))
        .flat(),
    },
  };
};

export default Group;
