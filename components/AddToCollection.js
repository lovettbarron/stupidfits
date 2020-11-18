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
                <li>{c.title}</li>
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
          text-align: center;
          padding: 0;
        }

        .back {
          margin-left: 1rem;
        }
      `}</style>
    </>
  );
};

export default AddToCollection;
