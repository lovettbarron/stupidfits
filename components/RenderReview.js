import React, { useEffect, useState, createElement } from "react";
import marksy from "marksy";
import EmbedImage from "./EmbedImage";

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
}) => {
  const compile = marksy({
    // Pass in whatever creates elements for your
    // virtual DOM library. h('h1', {})
    createElement,

    // You can override the default elements with
    // custom VDOM trees
    elements: {
      Media(props) {
        return <EmbedImage id={props.id} />;
      },
    },
  });

  const compiled =
    (review &&
      compile(review, {
        // Options passed to "marked" (https://www.npmjs.com/package/marked)
      })) ||
    "No content yet";

  return (
    <div className="post">
      <h1>{title}</h1>
      <div className="content">{compiled.tree}</div>
      <style jsx>{`
        .content {
          margin: 1rem;
          text-align: left;
        }
      `}</style>
    </div>
  );
};
export default RenderReview;
