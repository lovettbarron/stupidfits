import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import Anatomy from "./Anatomy";
import { StatefulPopover } from "baseui/popover";
import { StatefulButtonGroup, MODE } from "baseui/button-group";
import { Input } from "baseui/input";
import { Button, KIND, SIZE as BUTTONSIZE } from "baseui/button";
import Canvas from "./Canvas";
import { Block } from "baseui/block";
import { Checkbox, LABEL_PLACEMENT } from "baseui/checkbox";

import { providers } from "../pages/p/[id]";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  FocusOnce,
  SIZE,
  ROLE,
} from "baseui/modal";

const AddToCollection = ({ media, components, layers, user, fit, handler }) => {
  const router = useRouter();
  const [session, loading] = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [hideface, setHideface] = useState(user.hideface);
  const [value, setValue] = useState("1");
  const [type, setType] = useState(null);

  const [activeKey, setActiveKey] = React.useState("0");

  const fetchFits = async () => {
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
      setFits(feed);
    } catch (e) {
      console.log("error:", e.message);
    }
  };

  useEffect(() => {
    fetchFits();
    return () => {};
  }, [session]);

  useEffect(() => {
    if (type) {
      setIsOpen(true);
      handler(false);
    }
    return () => {};
  }, [media, type, session]);

  return (
    <div className="modal">
      <StatefulPopover
        content={() => <Block padding={"20px"}>Collections</Block>}
        returnFocus
        autoFocus
      >
        <Button kind={KIND.secondary} size={BUTTONSIZE.mini}>
          Add To Collection
        </Button>
      </StatefulPopover>

      <style jsx>{`
        .page {
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
        }

        .save {
          width: 100%;
        }

        .back {
          margin-left: 1rem;
        }
      `}</style>
    </div>
  );
};

export default AddToCollection;
