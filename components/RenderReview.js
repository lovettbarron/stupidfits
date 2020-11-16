import React, { useEffect, useState, createElement } from "react";
import marksy from "marksy";
import EmbedImage from "./EmbedImage";
import Image from "./Image";
import Link from "next/link";
import FitBox from "./FitBox";
import { Tabs, Tab, FILL } from "baseui/tabs-motion";

const RenderReview = ({
  id,
  user,
  title,
  createdAt,
  updatedAt,
  review,
  item,
  faq,
  media,
  tags,
  status,
  comment,
  slug,
  preview,
}) => {
  const [activeKey, setActiveKey] = React.useState("0");
  const compile = marksy({
    // Pass in whatever creates elements for your
    // virtual DOM library. h('h1', {})
    createElement,

    // You can override the default elements with
    // custom VDOM trees
    elements: {
      img({ src, alt }) {
        if (!media || !src) return <pre>Error loading Media</pre>;
        const mid = Array.isArray(media)
          ? media.filter((m) => String(src).split(",").includes(String(m.id)))
          : [media];
        if (!mid) return <pre>Can't find media by id</pre>;
        console.log("Media", mid);
        return (
          <Image
            fit={(media.fit && media.fit.id) || null}
            components={[]}
            url={null}
            media={mid}
            user={user}
            alt={alt}
            edit={false}
            full={true}
          />
        );
      },
      Media(props) {
        return (
          <div>
            Image!: <EmbedImage id={props.id} />
          </div>
        );
      },
    },
  });

  const compiled =
    (review &&
      compile(review, {
        // Options passed to "marked" (https://www.npmjs.com/package/marked)
      })) ||
    "No content yet";
  console.log(compiled.toc);
  return (
    <div className="post">
      <h1>{title}</h1>

      {media && media.length > 0 && (
        <Image
          fit={(media.fit && media.fit.id) || null}
          components={[]}
          url={null}
          media={media}
          user={user}
          edit={false}
          full={true}
        />
      )}
      <div className="cont">
        {user && (
          <div className="nav" style={preview && { width: "100%" }}>
            by{" "}
            <Link href={`/u/${user.username}`}>
              <a>{user.username}</a>
            </Link>
          </div>
        )}
        <div className="content">
          {(preview && compiled.tree) || (
            <Tabs
              activeKey={activeKey}
              fill={FILL.fixed}
              onChange={({ activeKey }) => {
                setActiveKey(activeKey);
              }}
              activateOnFocus
            >
              <Tab title="Review">
                <div className="struct">
                  <div className="side">
                    <div>
                      Written{" "}
                      {new Date(createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      <br />
                      Updated{" "}
                      {new Date(updatedAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <hr />
                  </div>
                  <div className="writeup">{compiled.tree}</div>
                </div>
              </Tab>

              <Tab title="Fits">
                {(Array.isArray(item) &&
                  item.map((i) => (
                    <React.Fragment key={i.id}>
                      <h3>{i.model}</h3>
                      {i.fit &&
                        i.fit.map((f) => (
                          <FitBox key={f.id} {...f} fit={f.id} />
                        ))}
                    </React.Fragment>
                  ))) ||
                  "No items"}
              </Tab>
            </Tabs>
          )}
        </div>
      </div>
      <style jsx>{`
        .post {
          width: 100%;
        }

        .struct {
          display: flex;
          flex-wrap: wrap;
          flex-direction: row-reverse;
          justify-content: space-between;
        }

        .writeup {
          width: auto;
        }

        .side {
          min-width: 20%;
        }

        .cont {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        }
        .nav {
          font-size: 2rem;
        }
        .content {
          margin: 1rem;
          text-align: left;
          width: 100%;
        }
      `}</style>
    </div>
  );
};
export default RenderReview;
