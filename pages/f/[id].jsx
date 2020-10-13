import React, { useEffect, useState } from "react";
import fetch from "isomorphic-unfetch";
import Layout from "../../components/Layout";
import Router from "next/router";
import { Select } from "baseui/select";
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
          <h1>{props.user.username}</h1>
          <FitBox
            {...props}
            components={
              items &&
              components &&
              items.filter((i) => components.find((c) => c.id === i.id))
            }
          />
        </div>
        <style jsx>{`
          .page {
            padding: 0rem;
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
  // Get Fit
  const res = await fetch(`${process.env.HOST}/api/fits/${context.params.id}`);
  let data;
  try {
    data = await res.json();
  } catch (e) {
    console.log("error:", e.message);
  }

  // console.log(data.user.email, session.user.email);
  const c = data.user.email !== session.user.email;

  return {
    props: { ...data, c: c, url: process.env.HOST },
  };
};

export default Fit;
