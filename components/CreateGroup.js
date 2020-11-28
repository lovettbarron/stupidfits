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

const CreateGroup = ({ group, fit }) => {
  const [session, loading] = useSession();

  const [pub, setPub] = useState((group && group.public) || false);
  const [inviteonly, setInviteonly] = useState(
    (group && group.inviteonly) || false
  );
  const [published, setPublished] = useState(
    (group && group.published) || false
  );
  const [name, setName] = useState((group && group.name) || "");
  const [description, setDescription] = useState(
    (group && group.description) || ""
  );
  const [link, setLink] = useState((group && group.link) || "");
  const [slug, setSlug] = useState((group && group.slug) || "");

  const [defslug, setDefslug] = useState(group && group.id ? true : false);

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
        name,
        slug,
        link,
        description,
        public: pub,
        inviteonly,
      };
      const res = await fetch(
        `${process.env.HOST}/api/group/${group ? group.id : "create"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      try {
        const data = await res.json();
        Router.push({
          pathname: `/group/${data.id}`,
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
        const v = name.split(" ").join("-").toLowerCase();
        const safe = v.replace(/[^\w\s-_]/gi, "");
        setSlug(safe);
      }
    };
  }, [session, name, defslug]);

  return (
    <>
      <div className="page">
        <div className="form">
          <h4>Before making a group!</h4>
          <p style={{ fontSize: "1rem" }}>
            This is a support tool for existing communities, not a community
            platform. We don't provide tools for chat or similar: It's just not
            our thing. <br />
            Rather, Stupid Fits aims to provide handy tools for existing fashion
            communities like collaborative albums, tournaments, and fit
            references. <br />
            We love ya, <a href="mailto:alb@stupidfits.com">let us know</a> if
            there's other things we can help with!
          </p>
          <label>
            <h3>Group Name</h3>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name of your group"
            />
          </label>

          <label>
            <h4>Slug</h4>
            <small>StupidFits.com/group/{slug}</small>
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
              placeholder="Any instructions for or description of the group?"
            />
          </label>

          <Checkbox
            checked={pub}
            checkmarkType={STYLE_TYPE.toggle_round}
            labelPlacement={LABEL_PLACEMENT.right}
            onChange={() => setPub(!pub)}
          >
            Publicly Listed
          </Checkbox>

          <Checkbox
            checked={inviteonly}
            checkmarkType={STYLE_TYPE.toggle_round}
            labelPlacement={LABEL_PLACEMENT.right}
            onChange={() => setInviteonly(!inviteonly)}
          >
            Invite Only
          </Checkbox>

          <Button
            onClick={(e) => {
              e.preventDefault();
              if (!name) return null;
              else submitData(e);
            }}
            isLoading={saveLoading}
            disabled={!name}
            type="submit"
            value="model"
          >
            Save Group
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

export default CreateGroup;
