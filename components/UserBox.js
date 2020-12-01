import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import Anatomy from "./Anatomy";
import Image from "./Image";
import { Button, KIND, SIZE } from "baseui/button";
import TriangleRight from "baseui/icon/triangle-right";
import Show from "baseui/icon/show";
import FitBox from "./FitBox";
import { Cap } from "./Anatomy";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE as MODALSIZE,
  ROLE,
} from "baseui/modal";

const UserBox = (props) => {
  const router = useRouter();
  const [session, loading] = useSession();
  const [fit, setFit] = useState(props.fit[0] || false);
  const [isOpen, setIsOpen] = useState(false);
  const [fullOpen, setFullOpen] = useState(false);

  useEffect(() => {
    // component is used for both displaying instagram images that aren't yet in the db, and fits that are currently in the db. It probably shouldn't, but this just prevent weird api request
    return () => {};
  }, []);

  return (
    <div className={`flip-card ${isOpen && "flipper"}`}>
      <div className="fitbox flip-card-inner">
        <div className="mediawrap flip-card-front">
          <Image
            fit={fit.id}
            components={fit.components}
            url={fit.imageUrl}
            media={fit.media}
            user={props}
            edit={false}
          />
        </div>
        <div className="components flip-card-back">User Details</div>
      </div>
      <div className="control">
        <div className="header">
          <h3>
            {(props.username && (
              <Link href={`/u/${props.username}`}>
                <a>{props.username}</a>
              </Link>
            )) || <>{props.username}</>}
          </h3>
          <div className="links">
            {props.instagram && (
              <a href={`https://instagram.com/${props.instagram}`}>
                IG: @{props.instagram}
              </a>
            )}
          </div>
        </div>

        <div className="active">
          <Button
            onClick={() => setIsOpen(!isOpen)}
            kind={KIND.minimal}
            size={SIZE.mini}
          >
            <TriangleRight size={36} />
          </Button>
        </div>
      </div>

      <style jsx>{`
        .fitbox {
          margin: 0;
          background: #2b2b2b;
          border-radius: 0 0 5px 5px;
          display: flex;
          flex-wrap: wrap;
          position: relative;
        }

        .control {
          position: absolute;
          bottom: 0;
          padding-top: 1rem;
          width: 100%;
          left: 0;
          right: 0;
          height: 60px;
          max-height: 60px;
          background: #2b2b2b;
        }

        .active {
          position: absolute;
          right: 0;
          top: 0;
          transition: transform 0.4s;
        }

        .open {
          position: absolute;
          left: 0;
          top: 15%;
          transition: transform 0.4s;
        }

        .flip-card.flipper .active {
          transform: rotateY(-180deg);
        }

        button {
          padding: 5px;
          margin: 5px;
        }

        .canvasholder {
          margin: 0 auto;
        }

        .mediawrap {
          max-width: 600px;
          padding: 0;
          margin: 0;
          width: 50%;
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
          max-width: 40rem;
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

        .flip-card {
          background-color: #2b2b2b;
          margin: 1rem 1rem;
          width: 300px;
          height: 450px;
          padding-bottom: 60px;
          border: 1px solid #2b2b2b;
          border-radius: 5px;
          perspective: 1000px;
          overflow: hidden;
        }

        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.8s;
          transform-style: preserve-3d;
        }

        .flip-card.flipper .flip-card-inner {
          transform: translateX(-100%);
        }

        .flip-card-front,
        .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .flip-card-front {
          background-color: #2b2b2b;
          color: white;
        }

        .flip-card-back {
          background-color: #151515;
          color: white;
          left: 300px;
        }
      `}</style>
    </div>
  );
};

export default UserBox;
