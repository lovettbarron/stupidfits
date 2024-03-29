import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import Anatomy from "./Anatomy";
import ImageMini from "./ImageMini";
import { Button, KIND, SIZE } from "baseui/button";

import { Cap } from "./Anatomy";

const BattleCard = ({ collection, battle }) => {
  const router = useRouter();
  const [session, loading] = useSession();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <div
        className="fitbox"
        onClick={() =>
          Router.push({
            pathname: `/battle/${battle.id}/${collection.slug}`,
          })
        }
      >
        <div className="overlay">
          <h3>Go to Tournament</h3>
        </div>
        <div className="mediawrap">
          {(collection.fits.length > 0 && (
            <ImageMini
              media={
                (battle.winners &&
                  battle.winners.length > 0 &&
                  battle.winners[0].media[0]) ||
                collection.fits[~~(collection.fits.length * Math.random())]
                  .media[0]
              }
              maxwidth={"100px"}
              hideid={true}
            />
          )) || <ImageMini media={null} hideid={true} />}
        </div>
        <div className="info">
          <h3 style={{ marginBttom: ".5rem" }}>{collection.title}</h3>
          {battle.winners && battle.winners.length > 0 && (
            <h4 className="priv">Winner: {battle.winners[0].user.username}</h4>
          )}
          <small>
            {new Date(battle.createdAt).toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </small>
          {battle.archive && <div className="priv">Competition Archived</div>}
          {(battle.winners && battle.winners.length > 0 && (
            <div className="priv">Competition Closed</div>
          )) || <div className="priv">Round {battle.activeRound}</div>}
        </div>
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
          position: relative;
          min-width: 300px;
        }
        .fitbox:hover .overlay {
          opacity: 0.8;
        }

        .info {
          width: 70%;
          padding: 0 1rem;
          text-align: left;
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
          max-width: 100px;
          min-height: 100%;
          padding: 0;
          margin: 0;
          width: 30%;
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

        h2 {
          margin: 0.5rem auto;
        }
        .priv {
          margin: 0.5rem auto;
          background: #151515;
          border-radius: 0.5rem;
          padding: 0.5rem;
          width: auto;
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

export default BattleCard;
