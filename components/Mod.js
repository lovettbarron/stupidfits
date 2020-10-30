import React, { useEffect, useState } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import Anatomy from "./Anatomy";
import Image from "./Image";
import { Button } from "baseui/button";

const Mod = (props) => {
  const router = useRouter();
  const [session, loading] = useSession();
  const [fit, setFit] = useState(props);
  const [changed, setChanged] = useState(false);

  // console.log("Fit?", props.fit);
  const approve = async (status) => {
    try {
      const body = {
        id: props.id,
        status: status,
      };

      const res = await fetch(`${process.env.HOST}/api/admin/feed/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.id === props.id) setFit(null);
      else console.log("Something went wrong");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // component is used for both displaying instaMod images that aren't yet in the db, and fits that are currently in the db. It probably shouldn't, but this just prevent weird api request

    return () => {};
  }, [session]);
  if (!fit) return null;
  return (
    <div className="fitbox">
      <Image {...fit} media={fit.media} />

      <div className={fit && `description`}>
        <div>
          <Link href={`/f/${props.id}`}>
            <a>Permalink</a>
          </Link>
        </div>
        <br />
        <h3>{props.status}</h3>

        <Button
          disabled={props.status === "PUBLIC"}
          onClick={() => approve("PUBLIC")}
        >
          Approve
        </Button>
        <Button
          disabled={props.status === "FEATURED"}
          onClick={() => approve("FEATURED")}
        >
          Feature
        </Button>
        <Button
          disabled={props.status === "PENDING"}
          onClick={() => approve("PENDING")}
        >
          Pending
        </Button>
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

export default Mod;
