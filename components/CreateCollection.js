import React, { useEffect, useState } from "react";
import fetch from "isomorphic-unfetch";
import Link from "next/link";
import Router from "next/router";
import { Select, TYPE } from "baseui/select";
import { Input } from "baseui/input";
import { StatefulButtonGroup, MODE } from "baseui/button-group";
import { Button } from "baseui/button";
import { Checkbox, LABEL_PLACEMENT, STYLE_TYPE } from "baseui/checkbox";
import { Textarea } from "baseui/textarea";

import { FileUploader } from "baseui/file-uploader";
import { useUpload } from "use-cloudinary";
import { useSession } from "next-auth/client";

const CreateCollection = ({ collection, fit }) => {
  const [session, loading] = useSession();

  const [pub, setPub] = useState((collection && collection.public) || false);
  const [onePer, setOnePer] = useState(
    (collection && collection.oneperuser) || false
  );
  const [published, setPublished] = useState(
    (collection && collection.published) || false
  );
  const [title, setTitle] = useState((collection && collection.title) || "");
  const [description, setDescription] = useState(
    (collection && collection.description) || ""
  );
  const [slug, setSlug] = useState((collection && collection.slug) || "");

  const [tags, setTags] = useState((collection && collection.tags) || []);
  const [defslug, setDefslug] = useState(
    collection && collection.id ? true : false
  );

  const [errorMessage, setErrorMessage] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  const [brandList, setBrandList] = useState([]);

  const { upload, data, isLoading, isError, error } = useUpload({
    endpoint: "/your/endpoint",
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error.message}</p>;

  const handle = (data) => {
    props.handler(data);
  };

  const submitData = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const body = {
        title,
        slug,
        description,
        published,
        public: pub,
        tags,
        oneperuser: onePer,
        fit: fit,
      };
      const res = await fetch(
        `${process.env.HOST}/api/collection/${
          collection ? collection.id : "create"
        }`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      try {
        const data = await res.json();
        Router.push({
          pathname: `/collection/${data.id}`,
        });
      } catch (e) {
        console.log("error:", e.message);
      }
    } catch (error) {
      console.error(error);
      setSaveLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (!defslug) {
        const v = title.split(" ").join("-").toLowerCase();
        const safe = v.replace(/[^\w\s-_]/gi, "");
        setSlug(safe);
      }
    };
  }, [session, title, defslug]);

  return (
    <>
      <div className="page">
        <div className="form">
          <label>
            <h3>Collection Name</h3>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Name of your collection"
            />
          </label>

          <label>
            <h4>Slug</h4>
            <small>StupidFits.com/collection/{slug}</small>
            <Input
              value={slug}
              onChange={(e) => {
                setDefslug(true);
                const v = e.target.value.toLowerCase().split(" ").join("-");
                const safe = v.replace(/[^\w\s-_]/gi, "");
                setSlug(safe);
              }}
              placeholder=""
            />
          </label>

          <label>
            <h4>Description</h4>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this collection of?"
            />
          </label>

          <Checkbox
            checked={pub}
            checkmarkType={STYLE_TYPE.toggle_round}
            labelPlacement={LABEL_PLACEMENT.right}
            onChange={() => setPub(!pub)}
          >
            Accept Public Submission
          </Checkbox>

          <Checkbox
            checked={onePer}
            checkmarkType={STYLE_TYPE.toggle_round}
            labelPlacement={LABEL_PLACEMENT.right}
            onChange={() => setOnePer(!onePer)}
          >
            One Fit per User
          </Checkbox>

          <Checkbox
            checked={published}
            checkmarkType={STYLE_TYPE.toggle_round}
            labelPlacement={LABEL_PLACEMENT.right}
            onChange={() => setPublished(!published)}
          >
            Publish To Feed
          </Checkbox>

          <Button
            onClick={(e) => {
              e.preventDefault();
              if (!title) return null;
              else submitData(e);
            }}
            isLoading={saveLoading}
            disabled={!title}
            type="submit"
            value="model"
          >
            Save Collection
          </Button>
        </div>
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

export default CreateCollection;
