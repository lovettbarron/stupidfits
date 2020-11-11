import React, { useEffect, useState } from "react";
import fetch from "isomorphic-unfetch";
import Link from "next/link";
import Router from "next/router";
import { Select, TYPE } from "baseui/select";
import { Input } from "baseui/input";
import { Button } from "baseui/button";
import { ButtonGroup, MODE } from "baseui/button-group";
import { Textarea } from "baseui/textarea";
import { Checkbox, LABEL_PLACEMENT, STYLE_TYPE } from "baseui/checkbox";

import { useSession } from "next-auth/client";
import MediaManager from "./MediaManager";
import { itemToOptions } from "../pages/fit/[id]";

const CreateReview = ({ review, styles, handler }) => {
  const [session, loading] = useSession();
  const [errorMessage, setErrorMessage] = useState("");

  // Loading func
  const [isLoading, setIsLoading] = useState(false);
  const [newItemLoad, setNewItemLoad] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saved, setSaved] = useState(false);

  // Content
  const [focus, setFocus] = React.useState(
    (review && review.title) || "REVIEW"
  );
  const [reviewid, setReviewid] = useState((review && review.id) || null);
  const [published, setPublished] = useState(review.published || false);
  const [title, setTitle] = useState((review && review.title) || "");
  const [reviewtext, setReviewtext] = useState((review && review.review) || "");
  const [slug, setSlug] = useState((review && review.slug) || "");

  const [tags, setTags] = useState((review && review.tags) || []);

  const [items, setItems] = useState(null);
  const [components, setComponents] = React.useState(
    review && review.item && itemToOptions(review.item)
  );

  const handle = (data) => {
    props.handler(data);
  };

  const fetchItems = async (first) => {
    if (Array.isArray(items) && items.length > 0) return;
    // Get Items
    // console.log("session", session);
    const b = await fetch(`${process.env.HOST}/api/item`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let it;
    if (first) {
      it = await b.json();
      setItems(it);
    }
    try {
      it = await b.json();
      const diff = it.filter((i) => !items.find((t) => t.id === i.id));
      setItems(it);
      setComponents(components.concat(itemToOptions(diff)));
      console.log("Components after refresh!", components);
      setNewItemLoad(false);
    } catch (e) {
      console.log("error:", e.message);
    }
  };

  // Save functionality
  const submitData = async () => {
    setIsLoading(true);

    // If has not been saved yet, create based off of title only
    if (!reviewid) {
      setSaving(true);
      try {
        const body = { title, review: reviewtext, slug, focus };
        const res = await fetch(`${process.env.HOST}/api/review/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        try {
          const data = await res.json();
          setReviewid(data.id);
          Router.push({
            pathname: `/review/edit/${data.id}`,
          });
        } catch (e) {
          console.log("error:", e.message);
        }
        setSaved(true);
        setSaving(false);
      } catch (err) {
        // 6. let's save the error so we can let the user know a save failed
        setSaveError("Error Message");
      }
    } else {
      // IF id exists
      try {
        const body = {
          title,
          review: reviewtext,
          item: components,
          tags,
          slug,
          published,
        };
        const res = await fetch(`${process.env.HOST}/api/review/${reviewid}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        try {
          const data = await res.json();
          setSaved(true);
          setSaving(false);
          setIsLoading(false);
        } catch (e) {
          console.log("error:", e.message);
        }
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    }
  };

  const AUTOSAVE_INTERVAL = 3000;

  useEffect(() => {
    fetchItems(true);
    handler({ title, review: reviewtext, focus });

    const timer = setTimeout(() => {
      if (title.length > 5) {
        submitData();
      }
    }, AUTOSAVE_INTERVAL);
    return () => clearTimeout(timer);
  }, [title, reviewtext, slug]);

  // if (isLoading) return <p>Loading...</p>;
  return (
    <>
      <div className="form">
        {/* <ButtonGroup
          mode={MODE.radio}
          selected={focus}
          onClick={(event, index) => {
            setFocus(index);
          }}
        >
          <Button>Item</Button>
          <Button>Style</Button>
          <Button>Fit</Button>
        </ButtonGroup> */}
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
            disabled={reviewid ? false : true}
            onChange={(e) => {
              const v = e.target.value.replace(" ", "").toLowerCase();
              const safe = v.replace(/[^\w\s-_]/gi, "");
              setSlug(safe);
            }}
            placeholder=""
          />
        </label>
        <Checkbox
          checked={published}
          disabled={reviewid ? false : true}
          checkmarkType={STYLE_TYPE.toggle_round}
          labelPlacement={LABEL_PLACEMENT.right}
          onChange={() => setPublished(!published)}
        >
          Publish Review
        </Checkbox>

        <h3>What are you reviewing?</h3>
        <Select
          options={
            items &&
            items.map((i) => ({
              label: `${i.brand.name} ${i.model} ${i.year > 0 ? i.year : ""}`,
              id: i.id,
            }))
          }
          value={components}
          isLoading={newItemLoad || !items}
          multi
          disabled={reviewid ? false : true}
          type={TYPE.search}
          closeOnSelect
          clearable={false}
          placeholder="Fit Anatomy"
          onChange={(params) => {
            setComponents(params.value);
          }}
          noResultsMsg={<>You can only review stuff that's in your closet.</>} //"Don't see your stuff? Use the button below"
        />
        <br />

        <h3>Media Upload</h3>
        <MediaManager id={reviewid} media={review.media} />
        <label>
          <h3>The Review</h3>
          <small>
            This is a markdown form.{" "}
            <a
              href="https://guides.github.com/features/mastering-markdown/"
              target="_blank"
            >
              There's a good guide here.
            </a>
          </small>

          <Textarea
            value={reviewtext}
            onChange={(e) => setReviewtext(e.target.value)}
            placeholder="Start writing"
            disabled={reviewid ? false : true}
            overrides={{
              Input: {
                style: {
                  maxHeight: "300px",
                  minHeight: "50vh",
                  minWidth: "100%",
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
        <h3>What Styles Interest You?</h3>
        <Select
          options={
            styles &&
            styles.map((s) => ({
              id: s.id,
              label: s.name,
            }))
          }
          disabled={reviewid ? false : true}
          value={tags}
          multi
          placeholder="Pick a few"
          onChange={(params) => setTags(params.value)}
        />

        <Button
          onClick={(e) => {
            e.preventDefault();
          }}
          isLoading={isLoading}
          disabled={!title || !review}
          type="submit"
          value="model"
        >
          Close Editor
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
