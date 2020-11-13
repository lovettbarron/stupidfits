import React, { useEffect, useState } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import Anatomy from "./Anatomy";
import { Button } from "baseui/button";

const Mini = ({ media, handler }) => {
  const [session, loading] = useSession();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {};
  }, [session]);

  return (
    <div className="mini">
      <img src={props.media_url || props.media[0].image} alt="Media Image" />
      {props.media_type === "CAROUSEL_ALBUM" && props.children && (
        <>and {props.children.data.length - 1} others</>
      )}

      <div className={fit && `description`}>
        <div>
          <a href={props.permalink || props.media[0].url}>Select</a>
        </div>
      </div>

      <style jsx>{`
        .mini {
          margin: 2rem 2.5%;
          max-width: 20%;
        }

        button {
          margin: 1rem 0 0 0;
          padding: 1rem;
        }
      `}</style>
    </div>
  );
};

export default Mini;
