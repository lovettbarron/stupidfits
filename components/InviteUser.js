import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import { StatefulPopover } from "baseui/popover";
import CreateCollection from "./CreateCollection";
import { Button, KIND, SIZE as BUTTONSIZE } from "baseui/button";
import { Block } from "baseui/block";
import { Spinner } from "baseui/spinner";
import { Input, SIZE as INSIZE } from "baseui/input";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE,
  ROLE,
} from "baseui/modal";

const InviteUser = (props) => {
  const router = useRouter();
  const [session, loading] = useSession();
  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState(props.group.member);
  const [invites, setInvites] = useState(props.group.Invite || []);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const addMember = async (id) => {
    try {
      const body = { user: id, group: props.group.id };
      const res = await fetch(`${process.env.HOST}/api/group/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.members) setMembers(data.member);
      if (data.Invite) setInvites(data.Invite);
      console.log("Invited user!", data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    let res;

    res = await fetch(`${process.env.HOST}/api/user/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let feed = [];
    try {
      feed = await res.json();
      setUsers(feed);
    } catch (e) {
      console.log("error:", e.message);
    }
  };

  useEffect(() => {
    return () => {};
  }, [session]);

  return (
    <>
      <StatefulPopover
        content={() => {
          fetchUsers();
          return (
            <Block padding={"20px"} minWidth={"250px"}>
              <h4>Invite</h4>
              {(users.length === 0 && (
                <Spinner
                  size={36}
                  overrides={{ Svg: { borderTopColor: "#fff" } }}
                />
              )) || (
                <Input
                  value={search}
                  size={INSIZE.mini}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for User"
                  clearOnEscape
                />
              )}
              <ul>
                {users
                  .filter(
                    (u) =>
                      !members.some((m) => m.id === u.id) &&
                      props.group.user.id !== u.id
                  )
                  .filter((u) =>
                    search.length > 0 ? u.username.includes(search) : true
                  )
                  .map((c) => {
                    let ex = false;
                    ex = members.some((g) => g.id === c.id);
                    ex = ex ? ex : invites.some((g) => g.user.id === c.id);
                    // }

                    return (
                      <li
                        key={c.id}
                        className={ex && `added`}
                        onClick={() => {
                          if (!ex) addMember(c.id);
                        }}
                      >
                        {c.username}
                      </li>
                    );
                  })}
              </ul>

              <br />
              <Button
                kind={KIND.secondary}
                size={BUTTONSIZE.mini}
                onClick={() => setIsOpen(true)}
              >
                Invite by Email
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
                <ModalHeader>Invite via Email</ModalHeader>
                <ModalBody>
                  {isOpen && <>Email Invite Component goes here</>}
                </ModalBody>
              </Modal>
            </Block>
          );
        }}
        returnFocus
        autoFocus
      >
        <Button>Invite To Group</Button>
      </StatefulPopover>

      <style jsx>{`
        .save {
          width: 100%;
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

export default InviteUser;
