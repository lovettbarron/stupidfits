import React, { useEffect, useState } from "react";
import fetch from "isomorphic-unfetch";
import Link from "next/link";
import { Select, TYPE, SIZE } from "baseui/select";
import { Input } from "baseui/input";
import { StatefulButtonGroup, MODE } from "baseui/button-group";
import { Button } from "baseui/button";

import { FileUploader } from "baseui/file-uploader";
import { useUpload } from "use-cloudinary";
import { useSession } from "next-auth/client";

export const types = [
  { label: "Carry", id: "BAG" },
  { label: "Shoe", id: "SHOE" },
  { label: "Outerwear", id: "JACKET" },
  { label: "Bottom", id: "PANT" },
  { label: "Shirt", id: "SHIRT" },
  { label: "Layers", id: "LAYER" },
  { label: "Extras", id: "EXTRA" },
];

const colour = [];

const qual = [];

const CreateItem = (props) => {
  const [session, loading] = useSession();
  const [brand, setBrand] = useState([]);
  const [model, setModel] = useState("");
  const [sale, setSale] = useState("");
  const [year, setYear] = useState("");
  const [photo, setPhoto] = useState("");
  const [type, setType] = React.useState(props.type || "");
  const [errorMessage, setErrorMessage] = useState("");
  const [itemSaveLoading, setItemSaveLoading] = useState(false);

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
    setItemSaveLoading(true);
    try {
      const body = { brand, model, year, type, sale };
      const res = await fetch(`${process.env.HOST}/api/item`, {
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
      setItemSaveLoading(false);
    }
  };

  const fetchBrand = async () => {
    // console.log("Fetch Branding");
    const b = await fetch(`${process.env.HOST}/api/brand`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let brands;
    try {
      brands = await b.json();
      setBrandList(brands && brands.map((b) => ({ label: b.name, id: b.id })));
    } catch (e) {
      console.log("error:", e.message);
    }
  };

  useEffect(() => {
    // console.log("URL check", props.url);
    fetchBrand();

    return () => {
      // console.log("This will be logged on unmount");
    };
  }, [session]);

  return (
    <>
      <div className="page">
        <div className="form">
          <label>
            <h3>What is it?</h3>

            <StatefulButtonGroup
              mode={MODE.radio}
              initialState={{ selected: types.length - 1 }}
              overrides={{
                Root: {
                  style: {
                    flexWrap: "wrap",
                    maxWidth: "600px",
                    justifyContent: "center",
                    margin: "0 auto",
                  },
                },
              }}
            >
              {types.map((t, i) => (
                <Button onClick={() => setType(t.id)}>{t.label}</Button>
              ))}
            </StatefulButtonGroup>
            {/*
            <Select
              options={types}
              value={type}
              required
              startOpen
              placeholder="What is it?"
              onChange={(params) => setType(params.value)}
            /> */}
          </label>
          <label>
            <br />
            <h3>What's the brand?</h3>

            <Select
              creatable
              size={SIZE.large}
              options={brandList}
              value={brand}
              isLoading={!brandList}
              multi
              required
              type={TYPE.search}
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
              required
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
          {/* <h3>Upload a photo (doesn't work yet)</h3> */}
          {/* <FileUploader
            errorMessage={errorMessage}
            disabled
            onChange={() => {
              upload({
                file,
                uploadOptions,
              });
            }}
          /> */}
          {photo && <img src={data.url} />}
          <Button
            onClick={(e) => {
              e.preventDefault();
              if (!brand || !model || !type) return null;
              else submitData(e);
            }}
            isLoading={itemSaveLoading}
            disabled={!brand || !model || !type}
            type="submit"
            value="model"
          >
            Save Item
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

export default CreateItem;
