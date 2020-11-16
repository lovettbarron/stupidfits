import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import Anatomy from "./Anatomy";
import ImageMini from "./ImageMini";
import { Button, KIND, SIZE } from "baseui/button";

import { Cap } from "./Anatomy";

const ReviewBox = (props) => {
  const router = useRouter();
  const [session, loading] = useSession();

  return (
    <>
      <div
        className="fitbox"
        onClick={() =>
          Router.push({
            pathname: `/review/${props.id}/${props.slug}`,
          })
        }
      >
        <div className="mediawrap">
          <div className="overlay">
            <h3>Read the Review by {props.user.username}</h3>
          </div>
          <ImageMini
            media={(props.media.length > 0 && props.media[0]) || props.media}
            hideid={true}
          />
        </div>
        <h2>{props.title}</h2>
        <ul className="style">
          {props.tags.map((t) => (
            <li>{t.name}</li>
          ))}
        </ul>
        <ul className="style">
          {props.item.map((t) => (
            <li>
              {Cap(t.brand.name)} {t.model}
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .fitbox {
          max-width: 400px;
          margin: 2rem 1rem;
          background: #2b2b2b;
          border-radius: 0 0 5px 5px;
          display: flex;
          flex-wrap: wrap;
          cursor: pointer;
        }
        .fitbox:hover .overlay {
          opacity: 0.8;
        }

        ul {
          list-style: none;
          padding: none;
          display: flex;
          flex-wrap: wrap;
        }

        li {
          margin: 0 1rem;
          padding: 0.5rem;
          background: #151515;
          color: #ffffff;
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
          width: 100%;
          position: relative;
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #151515;
          opacity: 0;
          transition: opacity 0.4s;
          z-index: 1;
          font-size: 20pt;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .components {
          width: 50%;
        }

        .links {
          font-size: 1rem;
          text-align: right;
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
      `}</style>
    </>
  );
};

export default ReviewBox;
