import React, { useEffect, useState } from "react";
import fetch from "isomorphic-unfetch";
import { useSession } from "next-auth/client";
import FitThumb from "./FitThumb";
import { Spinner } from "baseui/spinner";

const FitGallery = ({ select, global, handler }) => {
  const [session, loading] = useSession();
  const [fits, setFits] = useState([]);
  const [selected, setSelected] = useState(select || []);

  const fetchFits = async () => {
    let res;
    if (global) {
      res = await fetch(`${process.env.HOST}/api/feed`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      res = await fetch(`${process.env.HOST}/api/feed/${session.user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    let feed = [];
    try {
      feed = await res.json();
      setFits(feed);
    } catch (e) {
      console.log("error:", e.message);
    }
  };

  useEffect(() => {
    fetchFits();
    return () => {};
  }, [session]);

  return (
    <div className="gallery">
      <div className="flex">
        {fits.length === 0 && (
          <Spinner size={96} overrides={{ Svg: { borderTopColor: "#fff" } }} />
        )}
        {fits
          .sort((a, b) => {
            return b.media[0].timestamp - a.media[0].timestamp;
          })
          .filter((f) => ["FEATURED", "PUBLIC"].includes(f.status))
          .filter((f) => f.components.length > 0)
          .map((fit) => (
            <FitThumb
              key={fit.id}
              {...fit}
              fit={fit.id}
              selected={selected.find((s) => s === fit.id) ? true : false}
              handler={handler}
            />
          ))}
      </div>
      <style jsx>{`
        .gallery {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .flex {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
};
export default FitGallery;
