import React, { useEffect, useState } from "react";
import fetch from "isomorphic-unfetch";
import Layout from "../../components/Layout";
import Router from "next/router";
import Link from "next/link";
import { Select, TYPE } from "baseui/select";
import FitBox from "../../components/FitBox";
import CreateItem from "../../components/CreateItem";
import { getSession, useSession } from "next-auth/client";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE,
  ROLE,
} from "baseui/modal";

const itemToOptions = (items) => {
  return (
    items.map((c) => ({
      label: `${c.brand.name} ${c.model} ${c.year > 0 ? c.year : ""}`,
      id: c.id,
    })) || []
  );
};

const Fit = (props) => {
  const [session, loading] = useSession();
  const [desc, setDesc] = useState(props.desc);
  const [items, setItems] = useState(null);
  const [components, setComponents] = React.useState(
    props.components && itemToOptions(props.components)
  );

  const [isOpen, setIsOpen] = useState(false);
  const [newItemLoad, setNewItemLoad] = useState(false);

  const submitData = async (e) => {
    e.preventDefault();
    console.log("Submitting data");
    try {
      const body = { desc, components };
      const res = await fetch(`${process.env.HOST}/api/fits/${props.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      try {
        const data = await res.json();
      } catch (e) {
        console.log("error:", e.message);
      }
      await Router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const fetchItems = async (first) => {
    // Get Items
    // console.log("session", session);
    const b = await fetch(`${process.env.HOST}/api/item`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let it;
    if (first) {
      it = await b.json();
      setItems(it);
    }
    try {
      it = await b.json();
      const diff = it.filter((i) => !items.find((t) => t.id === i.id));
      setItems(it);
      setComponents(components.concat(itemToOptions(diff)));
      console.log("Components after refresh!", components);
      setNewItemLoad(false);
    } catch (e) {
      console.log("error:", e.message);
    }
  };

  useEffect(() => {
    fetchItems(true);
    return () => {};
  }, [session]);

  if (props.c)
    return (
      <Layout>
        <h1>You don't have access to this page</h1>
      </Layout>
    );
  else
    return (
      <Layout>
        <div className="page">
          <form onSubmit={submitData}>
            <h1>Describe your fit</h1>
            <FitBox
              {...props}
              nocomment={true}
              components={
                items &&
                components &&
                items.filter((i) => components.find((c) => c.id === i.id))
              }
            />
            <Select
              options={
                items &&
                items.map((i) => ({
                  label: `${i.brand.name} ${i.model} ${
                    i.year > 0 ? i.year : ""
                  }`,
                  id: i.id,
                }))
              }
              value={components}
              isLoading={!items}
              multi
              type={TYPE.search}
              closeOnSelect
              clearable={false}
              placeholder="Fit Anatomy"
              onChange={(params) => {
                setComponents(params.value);
              }}
              noResultsMsg={
                <>
                  Don't see your stuff? <br />
                  <a
                    className="modal"
                    style={{ wordWrap: "none", display: "inline-block" }}
                    onClick={setIsOpen}
                  >
                    Add an item
                  </a>
                </>
              } //"Don't see your stuff? Use the button below"
            />
            <br />
            Don't see your stuff?{" "}
            <a
              className="modal"
              style={{ wordWrap: "none", display: "inline-block" }}
              onClick={setIsOpen}
            >
              Add an item
            </a>
            <br />
            <br />
            <textarea
              cols={50}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Fit Description"
              rows={8}
              value={desc}
            />
            <button
              disabled={!components || components.length < 1}
              type="submit"
              onClick={submitData}
            >
              Update Fit
            </button>
            <Link href="/feed">
              <a>or Cancel</a>
            </Link>
          </form>

          <Modal
            onClose={() => {
              setIsOpen(false);
              fetchItems();
            }}
            closeable
            focusLock
            isOpen={isOpen}
            animate
            autoFocus
            size={SIZE.default}
            role={ROLE.dialog}
          >
            <ModalHeader>Add To Your Closet</ModalHeader>
            <ModalBody>
              {isOpen && (
                <CreateItem
                  handler={() => {
                    setNewItemLoad(true);
                    setIsOpen();
                    fetchItems();
                  }}
                />
              )}
            </ModalBody>
          </Modal>
        </div>
        <style jsx>{`
          .page {
            display: flex;
            justify-content: center;
            align-items: center;
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
    );
};

export const getServerSideProps = async (context) => {
  const session = await getSession(context);

  const id = parseInt(context.params.id);

  if (!session || !session.user) {
    if (context.res) {
      context.res.writeHead(302, { Location: `/f/${id}` });
      context.res.end();
    }
    return {};
  }

  // Get Fit
  const res = await fetch(`${process.env.HOST}/api/fits/${id}`);
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

  // console.log(data.user.email, session.user.email);
  const c = data.user.email !== session.user.email;

  return {
    props: { ...data, c: c, url: process.env.HOST },
  };
};

export default Fit;
