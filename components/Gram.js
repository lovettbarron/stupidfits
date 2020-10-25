import React, { useEffect, useState } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import Anatomy from "./Anatomy";

const Gram = (props) => {
  const router = useRouter();
  const [session, loading] = useSession();
  const [fit, setFit] = useState(props.fit);

  // console.log("Fit?", props.fit);
  const addFit = async (e) => {
    e.preventDefault();
    console.log("Adding fit", `${process.env.HOST}/api/insta/${props.id}`);
    try {
      const body = {
        id: props.id,
        username: props.username,
        timestamp: props.timestamp,
        media_url: props.media_url,
        permalink: props.permalink,
        caption: props.caption,
        children: props.children ? props.children.data : null,
      };
      console.log(body);
      const res = await fetch(`${process.env.HOST}/api/insta/${props.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      console.log("Added fit!", data);
      if (data) Router.push(`/fit/${data.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const editFit = async (e) => {
    Router.push(`/fit/${props.fit.id}`);
  };

  useEffect(() => {
    // component is used for both displaying instagram images that aren't yet in the db, and fits that are currently in the db. It probably shouldn't, but this just prevent weird api request

    return () => {};
  }, [session]);

  if (props.media_type === "CAROUSEL_ALBUM")
    console.log("Returning carousel", props.children);

  return (
    <div className="fitbox">
      <img src={props.media_url || props.media[0].image} />
      {props.media_type === "CAROUSEL_ALBUM" && props.children && (
        <>and {props.children.data.length - 1} others</>
      )}

      <div className={fit && `description`}>
        <div>
          <a href={props.permalink || props.media[0].url}>Post Link</a>
        </div>
        <br />

        {!fit && <button onClick={addFit}>Add Fit</button>}

        {fit && <button onClick={editFit}>Edit Fit</button>}

        <div className="components">
          {props.components && (
            <Anatomy id={props.id} components={props.components} />
          )}
        </div>
      </div>

      <style jsx>{`
        .fitbox {
          margin: 2rem 2.5%;
          max-width: 40%;
        }

        .fitbox ul {
          display: flex;
          flex-wrap: wrap;
          padding: 0;
        }

        .fitbox li {
          margin: 0 1rem;
        }

        .description {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          padding: 1rem 2rem;
          align-items: center;
          background: #6f6f6f;
          border-radius: 0 0 5px 5px;
        }

        img {
          width: 100%;
          max-width: 40rem;
        }

        .bold {
          font-weight: bold;
        }

        button {
          margin: 1rem 0 0 0;
          padding: 1rem;
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

export default Gram;
