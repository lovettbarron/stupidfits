import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import { StatefulPopover } from "baseui/popover";
import { Input } from "baseui/input";

import { Button, KIND, SIZE as BUTTONSIZE } from "baseui/button";
import { Block } from "baseui/block";
import { Alert } from "baseui/icon";
import { Spinner } from "baseui/spinner";

const Notifications = (props) => {
  const router = useRouter();
  const [session, loading] = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [firstload, setFirstload] = useState(false);
  const [notif, setNotif] = useState([]);
  const [invites, setInvites] = useState([]);

  const acceptInvite = async (id) => {
    try {
      const body = { id: id, accept: true };
      const res = await fetch(`${process.env.HOST}/api/user/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data)
        Router.push({
          pathname: data.path,
        });
    } catch (error) {
      console.error(error);
    }
  };

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
      setNotif(feed.notification || []);
      setInvites(feed.invite || []);
      setFirstload(true);
    } catch (e) {
      console.log("error:", e.message);
    }
  };

  useEffect(() => {
    if (!firstload) fetchNotification();
    return () => {};
  }, [session]);

  return (
    <>
      <StatefulPopover
        content={() => {
          return (
            <Block padding={"20px"} minWidth={"250px"}>
              {invites.length > 0 && (
                <>
                  <h4>Invites</h4>
                  <ul>
                    {invites.map((c) => {
                      return (
                        <li
                          key={c.id}
                          className={c.seen && `added`}
                          onClick={() => {
                            acceptInvite(c.id);
                          }}
                        >
                          {c.collection
                            ? `Contribute to ${c.collection.title}`
                            : `Join group ${c.group.name}`}
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
              <h4>Notifications</h4>
              {!firstload && (
                <Spinner
                  size={36}
                  overrides={{ Svg: { borderTopColor: "#fff" } }}
                />
              )}
              {firstload && notif.length < 1 && <div>No notifications</div>}
              <ul>
                {notif.map((c) => {
                  return (
                    <li
                      key={c.id}
                      className={c.seen && `added`}
                      onClick={() => {
                        router.route(c.cta);
                      }}
                    >
                      {c.content}
                    </li>
                  );
                })}
              </ul>
            </Block>
          );
        }}
        returnFocus
        autoFocus
      >
        {notif.filter((n) => !n.seen).length > 0 ||
        invites.filter((n) => !n.done).length > 0 ? (
          <div className="alert active">
            {notif.filter((n) => !n.seen).length +
              invites.filter((n) => !n.done).length}
          </div>
        ) : (
          <div className="alert">0</div>
        )}
      </StatefulPopover>

      <style jsx>{`
        .save {
          width: 100%;
        }

        .alert {
          min-width: 36px;
          height: 36px;
          margin: 0 1rem;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          border-radius: 100%;
          color: #151515;
          background: #fff;
          transition: all 0.4s;
        }
        .alert:hover {
          background: #151515;
          color: #fff;
        }

        .alert.active {
          background: rgba(200, 100, 100);
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
