import React, { useState } from "react";
import fetch from "isomorphic-unfetch";
import Layout from "../../components/Layout";
import Router from "next/router";
import Link from "next/link";
import { Select } from "baseui/select";
import { Input } from "baseui/input";
import { FileUploader } from "baseui/file-uploader";
import FitBox from "../../components/FitBox";
import { useUpload } from "use-cloudinary";
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

const Item = (props) => {
  const [brand, setBrand] = useState([]);
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [photo, setPhoto] = useState("");
  const [type, setType] = React.useState(props.type || "");
  const [errorMessage, setErrorMessage] = React.useState("");

  const { upload, data, isLoading, isError, error } = useUpload({
    endpoint: "/your/endpoint",
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error.message}</p>;

  const submitData = async (e) => {
    e.preventDefault();
    try {
      const body = { brand, model, year, type };
      const res = await fetch(`${process.env.HOST}/api/item`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      await Router.push("/closet");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="page">
        <form onSubmit={submitData}>
          <h1>Describe your gear</h1>
          <label>
            <br />
            <h3>What is it?</h3>
            <Select
              options={types}
              value={type}
              required
              startOpen
              placeholder="What is it?"
              onChange={(params) => setType(params.value)}
            />
          </label>
          <label>
            <br />
            <h3>What's the brand?</h3>
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
            <h3>Model name or description</h3>
            <Input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Model"
              clearOnEscape
            />
          </label>
          <label>
            <br />
            <h3>Is it from a specific year?</h3>
            <Input
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Year or Season"
              clearOnEscape
              type="Number"
            />
          </label>
          <br />
          <h3>Upload a photo (doesn't work yet)</h3>
          <FileUploader
            errorMessage={errorMessage}
            disabled
            onChange={() => {
              upload({
                file,
                uploadOptions,
              });
            }}
          />
          {photo && <img src={data.url} />}
          <button
            disabled={!brand || !model || !type}
            type="submit"
            value="model"
          >
            Save Item
          </button>
          <br />
          <Link href="/closet">
            <a>or Cancel</a>
          </Link>
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
  // Fetch Brands
  const b = await fetch(`${process.env.HOST}/api/brand`);
  let brands;
  try {
    brands = await b.json();
  } catch (e) {
    console.log("error:", e.message);
  }

  return {
    props: {
      brands: brands && brands.map((b) => ({ label: b.name, id: b.id })),
      url: process.env.HOST,
    },
  };
};

export default Item;
