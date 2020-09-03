import React, { useEffect, useState } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import Anatomy from "./Anatomy";

const FitBox = (props) => {
  const router = useRouter();
  const [session, loading] = useSession();
  const [fit, setFit] = useState(false);

  const addFit = async (e) => {
    e.preventDefault();
    console.log("Adding fit", `${process.env.HOST}/api/insta/{props.id}`);
    try {
      const body = { ...props };
      const res = await fetch(`${process.env.HOST}/api/insta/{props.id}`, {
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

  const editFit = async (e) => {};

  const checkIfExists = async () => {
    const res = await fetch(`${process.env.HOST}/api/insta/${props.id}`);
    try {
      const media = await res.json();
      console.log("Got media for ", props.id, media.id);
      setFit(media.id ? true : false);
    } catch (e) {
      console.log("error:", e.message);
    }
  };

  useEffect(() => {
    checkIfExists();
    return () => {};
  }, [session]);

  return (
    <div className="fitbox">
      <img src={props.imageUrl || props.media.image} />

      <div className="description">
        <div>
          <h3>{props.username || props.media.username}</h3>
          <br />
          <a href={props.url || props.media.url}>Post Link</a>
        </div>
        <br />
        {props.caption || props.media.description}
        {!props.media && !fit && <button onClick={addFit}>Add Fit</button>}

        <div className="components">
          {props.components && <Anatomy components={props.components} />}
        </div>
      </div>

      <style jsx>{`
        .fitbox {
          margin: 2rem 0;
        }

        .fitbox ul {
          display: flex;
          flex-wrap: wrap;
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

export default FitBox;
