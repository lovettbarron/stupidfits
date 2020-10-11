import React, { useEffect, useState } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import Anatomy from "./Anatomy";

const FitBox = (props) => {
  const router = useRouter();
  const [session, loading] = useSession();
  const [fit, setFit] = useState(props.fit || false);

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

  const editFit = async (e) => {
    Router.push(`/fit/${fit}`);
  };

  const checkIfExists = async () => {
    const res = await fetch(`${process.env.HOST}/api/insta/${props.id}`);
    try {
      const fit = await res.json();
      console.log("Got media for ", props.id, media.id);
      setFit(fit.id ? true : false);
    } catch (e) {
      console.log("error:", e.message);
    }
  };

  useEffect(() => {
    // component is used for both displaying instagram images that aren't yet in the db, and fits that are currently in the db. It probably shouldn't, but this just prevent weird api request
    if (props.imageUrl) checkIfExists();
    return () => {};
  }, [session]);

  return (
    <div className="fitbox">
      <img src={props.imageUrl || `${props.media.url}media/?size=l`} />

      <div className="description">
        <div>
          <h3>
            {(props.user && (
              <Link href={`/u/${props.user.username}`}>
                <a>{props.user.username || props.media.username}</a>
              </Link>
            )) || <>{props.username || props.media.username}</>}
          </h3>
          <br />
          <a href={props.url || props.media.url}>Post Link</a>
          {session && (
            <>
              <br />
              <button onClick={editFit}>Edit Fit</button>
            </>
          )}
        </div>
        <br />
        {props.caption || props.media.description}
        {!props.media && !fit && <button onClick={addFit}>Add Fit</button>}

        <div className="components">
          {props.components && <Anatomy components={props.components} />}
        </div>
        {props.desc && <p>{props.desc}</p>}
      </div>

      <style jsx>{`
        .fitbox {
          margin: 2rem 0;
        }

        button {
          padding: 5px;
          margin: 5px;
        }

        .fitbox ul {
          display: flex;
          flex-wrap: wrap;
          list-style: none;
        }

        .fitbox li {
          margin: 0 1rem;
          list-style: none !important;
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

        .components {
          font-size: 1rem;
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
