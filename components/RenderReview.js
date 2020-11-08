import React, { useEffect, useState, createElement } from "react";
import marksy from "marksy";

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
        return <h1>{props.children}</h1>;
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
        .stats {
          display: flex;
          justify-content: space-around;
          align-items: center;
        }

        .weather {
        }
      `}</style>
    </div>
  );
};
export default RenderReview;
