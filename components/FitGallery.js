import React, { useEffect, useState } from "react";
import fetch from "isomorphic-unfetch";
import { useSession } from "next-auth/client";
import FitThumb from "./FitThumb";
import { Spinner } from "baseui/spinner";

const FitGallery = ({ select, collection, global, deleteHandler, handler }) => {
  const [session, loading] = useSession();
  const [fits, setFits] = useState([]);
  const [selected, setSelected] = useState(select || []);
  const [hasAdded, setHasAdded] = useState();

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
    if (collection) fetchFits();
    return () => {};
  }, [session]);

  return (
    <div className="gallery">
      {collection && (
        <>
          <h3>Add a fit to {collection.title}</h3>
          {collection.oneperuser && (
            <p>
              Pick carefully! You can only add one fit to this collection —
              likely because it will be used for a tournament
            </p>
          )}
          <br />
        </>
      )}
      <div className="flex">
        {fits.length === 0 && (
          <Spinner size={96} overrides={{ Svg: { borderTopColor: "#fff" } }} />
        )}
        {fits
          .sort((a, b) => {
            return b.media[0].timestamp - a.media[0].timestamp;
          })
          .map((fit) => (
            <FitThumb
              key={fit.id}
              {...fit}
              fit={fit.id}
              disabled={
                collection.oneperuser
                  ? selected.length > 0
                    ? true
                    : false
                  : false
              }
              selected={selected.find((s) => s.id === fit.id) ? true : false}
              handler={(data, cb) => {
                handler(data, cb);
                if (collection.oneperuser) setSelected((s) => [data, ...s]);
              }}
              deleteHandler={deleteHandler}
            />
          ))}
      </div>
      <style jsx>{`
        .gallery {
          text-align: center;
          // display: flex;
          // flex-wrap: wrap;
          // justify-content: center;
          // align-items: center;
        }

        .flex {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
};
export default FitGallery;
