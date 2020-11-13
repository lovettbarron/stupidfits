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
  const [brand, setBrand] = useState(
    Array.isArray(props.brand)
      ? props.brand.map((b) => ({ label: b.name, id: b.id }))
      : [{ label: props.brand.name, id: props.brand.id }]
  );
  const [model, setModel] = useState(props.model);
  const [type, setType] = useState(
    Array.isArray(props.type)
      ? props.type.map((t) => types.find((t) => t.id === props.type))
      : [types.find((t) => t.id === props.type)]
  );
  const [year, setYear] = useState(props.year);
  const [photo, setPhoto] = useState("");
  const [sale, setSale] = useState(props.sale);
  const [errorMessage, setErrorMessage] = React.useState("");

  const { upload, data, isLoading, isError, error } = useUpload({
    endpoint: "/your/endpoint",
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error.message}</p>;

  const submitData = async (e) => {
    e.preventDefault();
    console.log("Submitting data");
    try {
      const body = { brand, model, type, sale, year };
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
          <h3>What is it?</h3>
          <Select
            options={types}
            value={type}
            required
            placeholder="What is it?"
            onChange={(params) => setType(params.value)}
          />
          <label>
            <br />
            <h3>What's the brand?</h3>

            <Select
              creatable
              options={props.brands}
              value={brand.map((b) => props.brands.find((t) => b.id === t.id))}
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
            />
          </label>
          <label>
            <br />
            <h3>Want to include an external link?</h3>
            <p>This might be to grailed or your own store.</p>
            <Input
              value={sale}
              onChange={(e) => setSale(e.target.value)}
              placeholder="Grailed or something"
              clearOnEscape
            />
          </label>
          <br />
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
          {photo && <img alt="Uploaded image" src={data.url} />}
          <button
            disabled={!brand || !model || !type}
            type="submit"
            value="model"
          >
            Save Item
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

        p {
          font-size: 1rem;
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
