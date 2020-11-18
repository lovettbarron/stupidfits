import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useSession } from "next-auth/client";

import { StatefulPopover } from "baseui/popover";

import { Button, KIND, SIZE as BUTTONSIZE } from "baseui/button";

import { Block } from "baseui/block";

import { Spinner } from "baseui/spinner";

const AddToCollection = (props) => {
  const router = useRouter();
  const [session, loading] = useSession();
  const [collections, setCollections] = useState([]);

  const addFit = async (id) => {
    console.log("Adding fit", id, props.id);
    try {
      const body = { id: id, fit: props.id };
      const res = await fetch(`${process.env.HOST}/api/collection/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      Router.push({
        pathname: `/collection/${id}`,
      });
      console.log("Added fit!", data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCollection = async () => {
    let res;
    if (global) {
      res = await fetch(`${process.env.HOST}/api/collection`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      res = await fetch(`${process.env.HOST}/api/feed/${session.user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    let feed = [];
    try {
      feed = await res.json();
      setCollections(feed);
    } catch (e) {
      console.log("error:", e.message);
    }
  };

  useEffect(() => {
    fetchCollection();
    return () => {};
  }, [session]);

  return (
    <>
      <StatefulPopover
        content={() => (
          <Block padding={"20px"}>
            {collections.length === 0 && (
              <Spinner
                size={36}
                overrides={{ Svg: { borderTopColor: "#fff" } }}
              />
            )}
            <ul>
              {collections.map((c) => (
                <li onClick={() => addFit(c.id)}>{c.title}</li>
              ))}
            </ul>
          </Block>
        )}
        returnFocus
        autoFocus
      >
        <Button kind={KIND.secondary} size={BUTTONSIZE.mini}>
          +Collection
        </Button>
      </StatefulPopover>

      <style jsx>{`
        .save {
          width: 100%;
        }

        ul {
          list-style: none;
          padding: 0;
        }

        li {
          list-style: none;
          text-align: left;
          padding: 0.5rem 0;
          position: relative;
          transition: all 0.4s;
          background: transparent;
          cursor: pointer;
        }

        li.added {
          text-decoration: line-through;
        }

        li:hover {
          padding-left: 0.5rem;
          background: #151515;
          color: white;
        }

        .back {
          margin-left: 1rem;
        }
      `}</style>
    </>
  );
};

export default AddToCollection;
