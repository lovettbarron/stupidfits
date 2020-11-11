import React, { useEffect, useState, createElement } from "react";
import marksy from "marksy";
import EmbedImage from "./EmbedImage";
import Image from "./Image";
import Link from "next/link";

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
      {media && (
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
        <div className="content" style={preview && { width: "100%" }}>
          {compiled.tree}
        </div>
      </div>
      <style jsx>{`
        .post {
          width: 100%;
        }
        .cont {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
        }
        .nav {
          width: 30%;
        }
        .content {
          margin: 1rem;
          text-align: left;
          width: 70%;
        }
      `}</style>
    </div>
  );
};
export default RenderReview;
