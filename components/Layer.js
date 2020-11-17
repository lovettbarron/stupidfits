import React, { useEffect, useState } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import Anatomy from "./Anatomy";
import Image from "./Image";
import { Button } from "baseui/button";
import { Cap } from "./Anatomy";

const Layer = (props) => {
  useEffect(() => {
    // component is used for both displaying instaMod images that aren't yet in the db, and fits that are currently in the db. It probably shouldn't, but this just prevent weird api request

    return () => {};
  }, []);

  return (
    <div
      className="tag"
      style={{
        top: `${props.y * 100}%`,
        left: `${props.x * 100}%`,
      }}
    >
      <div className="header">{`${Cap(props.item.brand.name)} ${
        props.item.model
      }`}</div>

      <style jsx>{`
        .tag {
          margin: 0;
          padding: 0.2rem;
          pointer-events: none;
          background: #151515;
          opacity: 0.8;
          color: #ffffff;
          max-width: 30%;
          position: absolute;
        }
      `}</style>
    </div>
  );
};

export default Layer;
