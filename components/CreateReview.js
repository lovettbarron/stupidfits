import React, { useEffect, useState } from "react";
import fetch from "isomorphic-unfetch";
import Link from "next/link";
import { Select, TYPE } from "baseui/select";
import { Input } from "baseui/input";
import { Button } from "baseui/button";
import { ButtonGroup, MODE } from "baseui/button-group";
import { Textarea } from "baseui/textarea";

import { FileUploader } from "baseui/file-uploader";
import { useUpload } from "use-cloudinary";
import { useSession } from "next-auth/client";

const CreateReview = ({ review, handler }) => {
  const [session, loading] = useSession();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focus, setFocus] = React.useState(
    (review && review.title) || "REVIEW"
  );

  const [title, setTitle] = useState((review && review.title) || "");
  const [reviewtext, setReviewtext] = useState((review && review.review) || "");
  const [slug, setSlug] = useState((review && review.slug) || "");

  if (isLoading) return <p>Loading...</p>;

  const handle = (data) => {
    props.handler(data);
  };

  const submitData = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      ///
      /// Edit below
      ///
      const body = { brand, model, year, type, sale };
      const res = await fetch(`${process.env.HOST}/api/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      try {
        const data = await res.json();
        if (props.handler) {
          handle(data);
        }
      } catch (e) {
        console.log("error:", e.message);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handler({ title, review: reviewtext, focus });

    return () => {};
  }, [title, reviewtext, focus]);

  return (
    <>
      <div className="form">
        <ButtonGroup
          mode={MODE.radio}
          selected={focus}
          onClick={(event, index) => {
            setFocus(index);
          }}
        >
          <Button>Item</Button>
          <Button>Style</Button>
          <Button>Fit</Button>
        </ButtonGroup>
        <label>
          <h3>What is it?</h3>

          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What are you writing about?"
          />
        </label>
        <label>
          <h4>Slug</h4>
          <Input
            value={slug}
            onChange={(e) => {
              const v = e.target.value.replace(" ", "").toLowerCase();
              const safe = v.replace(/[^\w\s-_]/gi, "");
              setSlug(safe);
            }}
            placeholder=""
          />
        </label>

        <label>
          <h3>Write It Up</h3>

          <Textarea
            value={reviewtext}
            onChange={(e) => setReviewtext(e.target.value)}
            placeholder="Start writing"
            overrides={{
              Input: {
                style: {
                  maxHeight: "300px",
                  minHeight: "100px",
                  minWidth: "50vh",
                  width: "100vw", // fill all available space up to parent max-width
                  resize: "vertical",
                },
              },
              InputContainer: {
                style: {
                  maxWidth: "100%",
                  width: "min-content",
                },
              },
            }}
          />
        </label>

        <Button
          onClick={(e) => {
            e.preventDefault();
            if (!title || !review) return null;
            else submitData(e);
          }}
          isLoading={isLoading}
          disabled={!title || !review}
          type="submit"
          value="model"
        >
          Save Item
        </Button>
        <br />
        <Link href="/review">
          <a>or return to Reviews</a>
        </Link>
      </div>

      <style jsx>{`
        .page {
          padding: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1;
        }

        .form > * {
          margin: 0.5rem 0;
        }

        input[type="text"],
        select,
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type="submit"] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }

        .back {
          margin-left: 1rem;
        }
      `}</style>
    </>
  );
};

export default CreateReview;
