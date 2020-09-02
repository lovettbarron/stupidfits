import React, { useState } from "react";
import fetch from "isomorphic-unfetch";
import Layout from "../../components/Layout";
import Router from "next/router";
import { Select } from "baseui/select";
import FitBox from "../../components/FitBox";

const Fit = (props) => {
  const [desc, setDesc] = useState("");

  const [components, setComponents] = React.useState(
    (props.components &&
      props.components.map((c) => ({
        label: `${c.brand} ${c.model} ${c.year}`,
        id: c.id,
      }))) ||
      []
  );

  const submitData = async (e) => {
    e.preventDefault();
    try {
      const body = { title, content, authorEmail };
      const res = await fetch(`${process.env.HOST}/api/fit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      await Router.push("/drafts");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="page">
        <form onSubmit={submitData}>
          <h1>Describe your fit</h1>
          <FitBox {...props} />
          <Select
            creatable
            options={[
              { label: "AliceBlue", id: "#F0F8FF" },
              { label: "AntiqueWhite", id: "#FAEBD7" },
              { label: "Aqua", id: "#00FFFF" },
              { label: "Aquamarine", id: "#7FFFD4" },
              { label: "Azure", id: "#F0FFFF" },
              { label: "Beige", id: "#F5F5DC" },
            ]}
            value={components}
            isLoading
            multi
            placeholder="Fit Anatomy"
            onChange={(params) => setValue(params.value)}
          />

          <textarea
            cols={50}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Fit Description"
            rows={8}
            value={desc}
          />
          <input disabled={!desc || !components} type="submit" value="Create" />
          <a className="back" href="#" onClick={() => Router.push("/")}>
            or Cancel
          </a>
        </form>
      </div>
      <style jsx>{`
        .page {
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        input[type="text"],
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
    </Layout>
  );
};

export const getServerSideProps = async (context) => {
  const res = await fetch(`${process.env.HOST}/api/fits/${context.params.id}`);
  let data;
  try {
    data = await res.json();
  } catch (e) {
    console.log("error:", e.message);
  }
  return {
    props: { ...data, url: process.env.HOST },
  };
};

export default Fit;
