import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useSession, getProviders, getCsrfToken } from "next-auth/client";
import { StatefulPopover } from "baseui/popover";
import { Input } from "baseui/input";

import { Button, KIND, SIZE as BUTTONSIZE } from "baseui/button";
import { Block } from "baseui/block";
import { Check } from "baseui/icon";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE,
  ROLE,
} from "baseui/modal";
import { State } from "instagram-private-api/dist/core/state";

const Notifications = (props) => {
  const router = useRouter();
  const [session, loading] = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const [notif, setNotif] = useState([]);
  const [invites, setInvites] = useState([]);

  const setup = async () => {};

  const fetchNotification = async () => {
    let res;

    res = await fetch(`${process.env.HOST}/api/user/notification`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let feed = [];
    try {
      feed = await res.json();
      setNotif(feed.notifications);
      setInvites(feed.invites);
    } catch (e) {
      console.log("error:", e.message);
    }
  };

  useEffect(() => {
    return () => {};
  }, [session]);

  useEffect(() => {
    setup();
    return () => {};
  }, [session]);

  return (
    <>
      <StatefulPopover
        content={() => {
          fetchNotification();
          return (
            <Block padding={"20px"}>
              <h4>Notifications</h4>

              <Button
                kind={KIND.secondary}
                size={BUTTONSIZE.mini}
                onClick={() => setIsOpen(true)}
              >
                Explain accounts to me?
              </Button>

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
                <ModalHeader>About StupidFits Accounts</ModalHeader>
                <ModalBody>
                  <p>
                    Hi! Having an account all over the internet is kind of
                    annoying.
                  </p>
                </ModalBody>
              </Modal>
            </Block>
          );
        }}
        returnFocus
        autoFocus
      >
        <Check size={64} />
      </StatefulPopover>

      <style jsx>{`
        .save {
          width: 100%;
        }

        img {
          // max-width: 200px;
          margin: 0 2rem 0 0;
        }

        ul {
          list-style: none;
          padding: 0;
          max-height: 200px;
          overflow-x: hidden;
          overflow-y: auto;
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
          cursor: not-allowed;
          text-decoration: line-through;
        }

        li:not(.added):hover {
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

export default Notifications;
