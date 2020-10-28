import React, { useEffect, useState, useRef, useCallback } from "react";
import { getSession, useSession } from "next-auth/client";
import fetch from "isomorphic-unfetch";
import Layout from "../../components/Layout";
import Canvas from "../../components/Canvas";
import { Button } from "baseui/button";
import { ButtonGroup } from "baseui/button-group";
import { Radio, RadioGroup } from "baseui/radio";
import { StatefulButtonGroup, MODE } from "baseui/button-group";
import { Tabs, Tab, FILL } from "baseui/tabs-motion";

export const providers = [
  {
    label: "4x3 Landscape",
    id: "LAND",
    w: "1600",
    h: "1920",
    s: "c_fill",
    ylock: false,
    xlock: true,
  },
  {
    label: "4x3 Portrait",
    id: "PORT",
    w: "1920",
    h: "1600",
    s: "c_fit",
    ylock: true,
    xlock: false,
  },
  {
    label: "Instagram Story",
    id: "IGSTORY",
    w: "1080",
    h: "1960",
    s: "c_fit",
    ylock: true,
    xlock: false,
  },
  {
    label: "Instagram Post",
    id: "IGPOST",
    w: "1200",
    h: "1200",
    s: "c_lpad",
    ylock: false,
    xlock: true,
  },
  {
    label: "Reddit Post",
    id: "REDPOST",
    w: "1600",
    h: "1200",
    s: "c_lpad",
    ylock: false,
    xlock: true,
  },
  {
    label: "Facebook Post",
    id: "FBPOST",
    w: "1920",
    h: "900",
    s: "c_lpad",
    ylock: false,
    xlock: true,
  },
];

const FitImage = (props) => {
  const [value, setValue] = useState("1");
  const [type, setType] = useState("LAND");
  const [media, setMedia] = useState(props.media[0]);
  const [activeKey, setActiveKey] = React.useState("0");

  const ref = useRef();

  useEffect(() => {
    return () => {};
  }, [media, type]);

  return (
    <Layout>
      <div className="page">
        <h1>Export</h1>
        <p>Export your fitpics with annotations for easy uploading wherever</p>

        <Tabs
          activeKey={activeKey}
          fill={FILL.fixed}
          onChange={({ activeKey }) => {
            setActiveKey(activeKey);
          }}
          activateOnFocus
        >
          <Tab title="Image">
            <div>
              <Canvas
                {...props}
                ref={ref}
                p={providers.find((p) => p.id === type)}
                image={media}
                user={props.user}
              />
            </div>
          </Tab>
          <Tab title="Settings">
            <div>
              <h3>Change Image</h3>
              <ButtonGroup>
                {props.media.map((m, i) => (
                  <Button key={i} onClick={() => setMedia(m)}>
                    {i}
                  </Button>
                ))}
              </ButtonGroup>
              <h3>Image Layout</h3>
              <StatefulButtonGroup
                mode={MODE.radio}
                initialState={{ selected: 0 }}
                overrides={{
                  Root: {
                    style: {
                      flexWrap: "wrap",
                      maxWidth: "600px",
                      justifyContent: "center",
                    },
                  },
                }}
              >
                {providers.map((t, i) => (
                  <Button key={t.id} onClick={() => setType(t.id)}>
                    {t.label}
                  </Button>
                ))}
              </StatefulButtonGroup>
              <h3>Captions</h3>
              <RadioGroup
                id={`radio`}
                align="horizontal"
                name="horizontal"
                onChange={(e) => {
                  console.log("Change the value", e.target.value);
                  setValue(String(e.target.value));
                }}
                value={value}
              >
                <Radio value={"1"}>Outfit</Radio>
                <Radio value={"2"}>Brands Only</Radio>
                <Radio value={"3"}>Nothing</Radio>
              </RadioGroup>
            </div>
          </Tab>
        </Tabs>
        <br />
      </div>
      <style jsx>{`
        .page {
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
        }

        .save {
          width: 100%;
        }

        canvas {
          overflow: hidden;
          border: 1px solid #ffffff;
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
  const session = await getSession(context);

  const id = parseInt(context.params.id);

  if (!session || !session.user) {
    if (context.res) {
      context.res.writeHead(302, { Location: `/f/${id}` });
      context.res.end();
    }
    return {};
  }

  const res = await fetch(`${process.env.HOST}/api/fits/${id}`);
  let data;
  try {
    data = await res.json();
  } catch (e) {
    console.log("error:", e.message);
    if (context.res) {
      context.res.writeHead(302, { Location: `/` });
      context.res.end();
    }
    return {};
  }

  const order = {
    BAG: 5,
    SHOE: 7,
    JACKET: 2,
    PANT: 6,
    SHIRT: 4,
    LAYER: 3,
    EXTRA: 1,
  };

  data.components.sort((a, b) => {
    return order[a.type] - order[b.type];
  });

  if (session.user.email !== data.user.email) {
    if (context.res) {
      context.res.writeHead(302, { Location: `/f/${id}` });
      context.res.end();
    }
    return {};
  }

  return {
    props: { ...data },
  };
};

export default FitImage;
