import React, { useState } from "react";
import fetch from "isomorphic-unfetch";
import Layout from "../../components/Layout";
import Router from "next/router";
import { Select } from "baseui/select";
import { Input } from "baseui/input";
import FitBox from "../../components/FitBox";

const types = [
  { label: "Carry", id: "BAG" },
  { label: "Shoe", id: "SHOE" },
  { label: "Outerwear", id: "JACKET" },
  { label: "Pants", id: "PANT" },
  { label: "Shirt", id: "SHIRT" },
  { label: "Layers", id: "LAYER" },
  { label: "Extras", id: "EXTRA" },
];

const colour = [];

const qual = [];

const Fit = (props) => {
  const [brand, setBrand] = useState([]);
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [type, setType] = React.useState(props.type || "");

  const submitData = async (e) => {
    e.preventDefault();
    try {
      const body = { title, content, authorEmail };
      const res = await fetch(`${process.env.HOST}/api/item`, {
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
          <h1>Describe your gear</h1>
          <Select
            options={types}
            value={type}
            required
            placeholder="What is it?"
            onChange={(params) => setType(params.value)}
          />
          <label>
            <br />
            <Select
              creatable
              options={props.brands}
              value={brand}
              // isLoading
              multi
              placeholder="Brand"
              onChange={(params) => setBrand(params.value)}
            />
          </label>
          <label>
            <br />
            <Input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Model"
              clearOnEscape
            />
          </label>
          <label>
            <br />
            <Input
              value={model}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Year or Season"
              clearOnEscape
            />
          </label>
          <button
            disabled={!brand || !model || !type}
            type="submit"
            value="model"
          >
            Set Item
          </button>
          <br />
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

        form > * {
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
    props: {
      ...data,
      brands: [
        { label: "acronym", id: "1" },
        { label: "stone island", id: 2 },
      ],
      url: process.env.HOST,
    },
  };
};

export default Fit;
