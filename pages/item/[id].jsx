import React, { useState } from "react";
import fetch from "isomorphic-unfetch";
import Layout from "../../components/Layout";
import Router from "next/router";
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
  const [brand, setBrand] = useState(props.brand);
  const [model, setModel] = useState(props.model);
  const [thetype, setThetype] = useState(props.type);
  const [year, setYear] = useState(props.year);
  const [photo, setPhoto] = useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const { upload, data, isLoading, isError, error } = useUpload({
    endpoint: "/your/endpoint",
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error.message}</p>;

  const submitData = async (e) => {
    e.preventDefault();
    try {
      const body = { brand, model, type: thetype, year };
      const res = await fetch(`${process.env.HOST}/api/item/${props.id}`, {
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
          <Select
            options={types}
            value={types.find((c) => c.id === thetype)}
            required
            placeholder="What is it?"
            onChange={(params) => setThetype(params.value)}
          />
          <label>
            <br />
            <Select
              creatable
              options={props.brands}
              value={props.brands.filter((c) => c.id === brand.id)}
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
          <br />
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
            disabled={!brand || !model || !thetype}
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
  // Get item
  const res = await fetch(`${process.env.HOST}/api/item/${context.params.id}`);
  let data;
  try {
    data = await res.json();
  } catch (e) {
    console.log("error:", e.message);
  }

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
      ...data,
      brands: brands && brands.map((b) => ({ label: b.name, id: b.id })),
      url: process.env.HOST,
    },
  };
};

export default Item;
