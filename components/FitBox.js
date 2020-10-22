import React, { useEffect, useState } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import Anatomy from "./Anatomy";
import Image from "./Image";
import { Cap } from "./Anatomy";

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
    Router.push(`/fit/${fit || props.id}`);
  };

  const exportFit = async (e) => {
    Router.push(`/p/${fit || props.id}`);
  };

  const copyFit = async () => {
    const order = {
      BAG: 6,
      SHOE: 5,
      JACKET: 1,
      PANT: 4,
      SHIRT: 3,
      LAYER: 2,
      EXTRA: 7,
    };

    const con = props.components.sort((a, b) => {
      return order[a.type] - order[b.type];
    });

    const text = `${con
      .map((c) => `${Cap(c.brand.name)} ${c.model}`)
      .join("\n\r")}

Details at stupidfits.com/f/${props.id}
    `;

    if (navigator) {
      navigator.clipboard.writeText(text).then(
        function () {
          alert("Copied text to clipboard");
        },
        function () {
          alert("Something broke");
        }
      );
    }
  };

  const checkIfExists = async () => {
    const res = await fetch(`${process.env.HOST}/api/insta/${props.id}`);
    try {
      const fit = await res.json();
      // console.log("Got media for ", props.id, media.id);
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
    <>
      <div className="fitbox">
        <Image url={props.imageUrl} media={props.media} />

        <div className="description">
          <div className="header">
            <h3>
              {(props.user && (
                <Link href={`/u/${props.user.username}`}>
                  <a>{props.user.username || props.media.username}</a>
                </Link>
              )) || <>{props.username || props.media.username}</>}
            </h3>
            <div>
              <a href={props.media.url || props.url}>Instagram</a>
              <Link href={`/f/${props.id}`}>
                <a>Permalink</a>
              </Link>
            </div>
          </div>
        </div>
        <br />
        {props.caption || props.media.description}
        {!props.media && !fit && <button onClick={addFit}>Add Fit</button>}
        <div className="components">
          {session && (
            <>
              <br />
              <button onClick={editFit}>Edit Fit</button>
              <button onClick={exportFit}>Export image</button>
              <button onClick={copyFit}>Copy Fit</button>
            </>
          )}
          {props.components && (
            <Anatomy
              id={props.id}
              nocomment={props.nocomment || false}
              components={props.components}
            />
          )}
        </div>
        <br />
        {props.desc && <p>{props.desc}</p>}
      </div>

      <style jsx>{`
        .fitbox {
          margin: 2rem 0;
          background: #6f6f6f;
          border-radius: 0 0 5px 5px;
        }

        button {
          padding: 5px;
          margin: 5px;
        }

        .header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
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

export default FitBox;
