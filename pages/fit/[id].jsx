import React, { useState } from "react";
import fetch from "isomorphic-unfetch";
import Layout from "../../components/Layout";
import Router from "next/router";
import { Select } from "baseui/select";
import FitBox from "../../components/FitBox";
import CreateItem from "../../components/CreateItem";
import { useSession } from "next-auth/client";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE,
  ROLE,
} from "baseui/modal";

const Fit = (props) => {
  const [session, loading] = useSession();
  const [desc, setDesc] = useState("");
  const [items, setItems] = useState(props.items);
  const [components, setComponents] = React.useState(
    (props.components &&
      props.components.map((c) => ({
        label: `${c.brand} ${c.model} ${c.year}`,
        id: c.id,
      }))) ||
      []
  );

  const [isOpen, setIsOpen] = React.useState(false);

  const submitData = async (e) => {
    e.preventDefault();
    try {
      const body = { title, content, authorEmail };
      const res = await fetch(`${process.env.HOST}/api/fit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      await Router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const fetchItems = async (e) => {
    // Get Items
    console.log("session", session);
    const b = await fetch(`${process.env.HOST}/api/item`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let it;
    try {
      it = await b.json();
      const diff = it.filter((i) => items.find((t) => t.id === i.id));
      setItems(it);
      setComponents(components.push(diff));
    } catch (e) {
      console.log("error:", e.message);
    }
  };

  return (
    <Layout>
      <div className="page">
        <form onSubmit={submitData}>
          <h1>Describe your fit</h1>
          <FitBox {...props} />
          <Select
            options={items.map((i) => ({
              label: `${i.brand.name} ${i.model} ${i.year}`,
              id: i.id,
            }))}
            value={components}
            isLoading
            multi
            placeholder="Fit Anatomy"
            onChange={(params) => setComponents(params.value)}
          />
          <br />
          Don't see your stuff?{" "}
          <a className="modal" onClick={setIsOpen}>
            Add an item
          </a>
          <br />
          <br />
          <textarea
            cols={50}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Fit Description"
            rows={8}
            value={desc}
          />
          <button disabled={!components} type="submit">
            Update Fit
          </button>
          <a className="back" href="#" onClick={() => Router.push("/")}>
            or Cancel
          </a>
        </form>

        <Modal
          onClose={() => {
            setIsOpen(false);
            fetchItems();
          }}
          closeable
          isOpen={isOpen}
          animate
          autoFocus
          size={SIZE.default}
          role={ROLE.dialog}
        >
          <ModalHeader>Add To Your Closet</ModalHeader>
          <ModalBody>{isOpen && <CreateItem />}</ModalBody>
          <ModalFooter>
            <ModalButton onClick={setIsOpen}>Finished</ModalButton>
          </ModalFooter>
        </Modal>
      </div>
      <style jsx>{`
        .page {
          padding: 3rem;
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
  // Get Fit
  const res = await fetch(`${process.env.HOST}/api/fits/${context.params.id}`);
  let data;
  try {
    data = await res.json();
  } catch (e) {
    console.log("error:", e.message);
  }

  // Get Items
  const b = await fetch(`${process.env.HOST}/api/item`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: context.req.headers.cookie,
    },
  });
  let items;
  try {
    items = await b.json();
  } catch (e) {
    console.log("error:", e.message);
  }

  return {
    props: { ...data, items: items, url: process.env.HOST },
  };
};

export default Fit;
