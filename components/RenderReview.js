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
            <hr />
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
              <Tab title="Review">{compiled.tree}</Tab>

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

        .p {
          font-size: 16px;
          line-height: 16px;
        }
        .cont {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        }
        .nav {
          width: 30%;
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
