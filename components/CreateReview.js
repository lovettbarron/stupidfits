import React, { useEffect, useState } from "react";
import fetch from "isomorphic-unfetch";
import Link from "next/link";
import { Select, TYPE } from "baseui/select";
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

const CreateReview = (props) => {
  const [session, loading] = useSession();
  const [errorMessage, setErrorMessage] = useState("");
  const [itemSaveLoading, setItemSaveLoading] = useState(false);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error.message}</p>;

  const handle = (data) => {
    props.handler(data);
  };

  const submitData = async (e) => {
    e.preventDefault();
    setItemSaveLoading(true);
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
    fetchBrand();

    return () => {};
  }, [session]);

  return (
    <>
      <div className="page">
        <div className="form">
          <label>
            <h3>What is it?</h3>

            <StatefulButtonGroup
              mode={MODE.radio}
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
          </label>

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
          <br />
          <Link href="/review">
            <a>or return to Reviews</a>
          </Link>
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

export default CreateReview;
