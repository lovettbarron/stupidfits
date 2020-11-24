import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import Anatomy from "./Anatomy";
import Image from "./Image";
import { Button, KIND, SIZE } from "baseui/button";
import TriangleRight from "baseui/icon/triangle-right";
import { Skeleton } from "baseui/skeleton";
import { Cap } from "./Anatomy";
import Show from "baseui/icon/show";
import FitBox from "./FitBox";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE as MODALSIZE,
  ROLE,
} from "baseui/modal";

const FitVote = (props) => {
  const router = useRouter();
  const [session, loading] = useSession();
  const [fit, setFit] = useState(props.fit || false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState(props.selected);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    // My votes for this match
    if (session) {
      // Count votes for your session
      // if active session
      const myvotes =
        (props.votes &&
          props.votes.filter((v) => v.user.id === session.user.id)) ||
        [];

      // Did I vote for this fit?
      const vo =
        (myvotes && myvotes.some((v) => v.fit.id === props.fit)) || false;

      setDisabled((myvotes.length > 0 && !vo) || false);
      setSelected((myvotes.length > 0 && vo) || false);
    } else {
      // Incase of no session
      // Count votes from prev only
    }
    return () => {};
  }, [session]);

  return (
    <div>
      <div
        className={`fitbox ${selected && "selected"} ${
          disabled && "notselected"
        }`}
      >
        {!props.empty && (
          <div className="open" onClick={() => setIsOpen(!isOpen)}>
            {/* <Button
              onClick={() => setIsOpen(!isOpen)}
              kind={KIND.minimal}
              size={SIZE.mini}
            > */}
            <Show size={36} />
            {/* </Button> */}
          </div>
        )}
        <div className="mediawrap">
          {props.empty ? (
            <Skeleton height="300px" width="200px" />
          ) : (
            <Image
              fit={props.id}
              components={props.components}
              url={props.imageUrl}
              media={props.media}
              user={props.user}
              edit={false}
              nolayer={true}
              mini={true}
            />
          )}
        </div>
        {props.id && !props.empty && !disabled && props.active && (
          <div className="control">
            <div className="header">
              <Button
                isLoading={isLoading}
                disabled={selected}
                onClick={() => {
                  setIsLoading(true);
                  props.handler(props.fit, (added) => {
                    added ? setSelected(true) : setSelected(false);
                    setIsLoading(false);
                  });
                }}
              >
                {selected ? "Voted!" : "Vote"}
              </Button>
            </div>
          </div>
        )}
      </div>

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
        size={MODALSIZE.auto}
        role={ROLE.dialog}
      >
        {/* <ModalHeader>Create New Collection</ModalHeader> */}
        <ModalBody>{isOpen && <FitBox {...props} fit={props.id} />}</ModalBody>
      </Modal>

      <style jsx>{`
        .fitbox {
          margin: 0;
          background: #2b2b2b;
          border-radius: 0 0 5px 5px;
          display: flex;
          flex-wrap: wrap;
          position: relative;
          max-width: 150px;
          height: 150px;
          overflow: hidden;
          position: relative;
          margin: 0.25rem;
          opacity: 1;
          transition: opacity 0.4s;
        }

        .fitbox.selected {
          opacity: 0.8;
        }

        .fitbox.notselected {
          opacity: 0.2;
        }

        .open {
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 5;
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          background: #151515;
          background-opacity: 0.8;
          transition: opacity 0.4s;
        }

        .fitbox:hover .open {
          opacity: 1;
        }

        .control {
          position: absolute;
          z-index: 10;
          bottom: 0;
          padding-top: 1rem;
          width: 100%;
          left: 0;
          right: 0;
          height: 60px;
          max-height: 60px;
          background: transparent;
        }

        .active {
          position: absolute;
          right: 0;
          top: 0;
          transition: transform 0.4s;
        }

        button {
          padding: 5px;
          margin: 5px;
        }

        .canvasholder {
          margin: 0 auto;
        }

        .mediawrap {
          max-width: 200px;
          height: 150px;
          padding: 0;
          margin: 0;
          width: 100%;
        }

        .header {
          width: 100%;
          margin: 0 auto;
          text-align: center;
        }

        .header h3 {
          margin: 0;
          text-align: center !important
          ;
        }

        .components {
          width: 50%;
          overflow: auto;
        }

        .links {
          font-size: 0.8rem;
          text-align: center;
        }

        .captions {
          text-align: left;
          font-size: 0.8rem;
        }

        .btns {
          display: flex;
          justify-content: center;
        }

        .header h3 {
          text-align: left;
        }
        @media screen and (max-width: 800px) {
          .mediawrap {
            width: 100%;
          }
          .btns {
            justify-content: center;
          }
          .components {
            width: 100%;
          }
        }

        .description {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          padding: 1rem 2rem;
          align-items: center;
        }

        .components {
          font-size: 1rem;
          height: 100%;
        }

        .des {
          padding: 0.5rem;
          font-size: 1.2rem;
          border: 1px solid #151515;
          border-width: 2px 0 0 0;
          text-align: center;
        }

        img {
          width: 100%;
          max-width: 20rem;
        }

        .bold {
          font-weight: bold;
        }

        a {
          text-decoration: none;
          display: inline-block;
          color: #ffffff;
          text-decoration: underline;
        }

        .left a[data-active="true"] {
          color: gray;
        }

        a + a {
          margin-left: 1rem;
        }
      `}</style>
    </div>
  );
};

export default FitVote;
