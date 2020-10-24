import React, { useEffect, useState, useRef, useCallback } from "react";
import { getSession, useSession } from "next-auth/client";
import fetch from "isomorphic-unfetch";
import Layout from "../../components/Layout";
import { Button } from "baseui/button";
import { fabric } from "fabric";
import { Radio, RadioGroup } from "baseui/radio";
import { Cap } from "../../components/Anatomy";
import { StatefulButtonGroup, MODE } from "baseui/button-group";

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
  const [session, loading] = useSession();
  const [value, setValue] = useState("1");
  const [type, setType] = useState("IGSTORY");
  // const [canvas, setCanvas] = useState(false);
  const canvasDom = useRef();
  let canvas = useRef(); // useRef(null);
  let img = null;
  let text_iter = 0;

  const getDim = () => {
    return providers.find((p) => p.id === type);
  };

  const Formatted = (c, v) => {
    console.log("Value", v);
    switch (v) {
      case "1":
        return `${Cap(c.brand.name)} ${c.model}`;
      case "2":
        return `${Cap(c.brand.name)}`;
      default:
        return ``;
    }
  };

  const addImage = () => {
    var clipPath = new fabric.Rect({
      width: getDim().w,
      height: getDim().h,
      top: 0,
      left: 0,
      absolutePositioned: true,
    });

    img = fabric.util.loadImage(
      `https://res.cloudinary.com/stupidsystems/image/upload/b_rgb:151515,${
        getDim().s
      },h_${getDim().h},w_${getDim().w}/${props.media[0].cloudinary}.png`,
      function (url) {
        var img = new fabric.Image(url);

        // img.clipPath = clipPath;
        img.lockMovementY = getDim().ylock;
        img.lockMovementX = getDim().xlock;
        // img.scaleToWidth(1080 / 3);
        img.scaleToHeight(getDim().h / 3);
        canvas.current.add(img);
        canvas.current.sendToBack(img);
      },
      null,
      {
        crossOrigin: "anonymous",
      }
    );
  };

  const addElement = (text, iter) => {
    // Load text onto canvas.current
    const height = getDim().h / 3;
    const offset = (iter / props.components.length) * height;
    const textbox = new fabric.Textbox(Formatted(text, value), {
      id: "text" + iter,
      left: 0,
      top: offset,
      width: 150,
      fontSize: 14,
      fill: "#fff",
      textBackgroundColor: "#151515",
      fontFamily: "Apercu",
      fontWeight: 800,
      textAlign: "center",
      cornerSize: 12,
      transparentCorners: false,
    });
    canvas.current.add(textbox);
    canvas.current.bringToFront(textbox);
    console.log("Added", Formatted(text, value), iter, offset);
    text_iter += 1;
  };

  const addLogo = () => {
    // Load text onto canvas.current
    const height = getDim().h / 3;
    const textbox = new fabric.Textbox(
      `stupidfits.com/f/${props.id}\nstupidfits.com/u/${props.user.username}`,
      {
        left: 0,
        top: height - 30,
        width: 360,
        fontSize: 12,
        fill: "#fff",
        textBackgroundColor: "#151515",
        fontFamily: "Apercu",
        fontWeight: 800,
        textAlign: "center",
        cornerSize: 12,
        transparentCorners: false,
      }
    );
    canvas.current.add(textbox);
  };

  // Pul all canvas.current code in a function so we can call it after google fonts have loaded
  const initCanvas = () => {
    canvas.current =
      canvas.current ||
      new fabric.Canvas(canvasDom.current, {
        preserveObjectStacking: true,
        allowTouchScrolling: true,
      });
    canvas.current.setDimensions({ width: "100%", height: "100%" });
    canvas.current.setWidth(getDim().w / 3);
    canvas.current.setHeight(getDim().h / 3);
    canvas.current.backgroundColor = "rgb(21,21,21)";
    canvas.current.controlsAboveOverlay = true;
  };
  // dataURLtoBlob function for saving
  const dataURLtoBlob = (dataurl) => {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const RenderControls = () => {
    if (!document) return null;
    const radio = document.getElementById("radio");
    if (!radio) return null;
    radio.addEventListener(
      "change",
      (e) => {
        console.log("Changed fired", e.target.value);
        const value = String(e.target.value);
        let i = 0;
        const objs = canvas.current.getObjects();

        objs.forEach((o) => {
          if (!o.id) return null;
          else if (o.id && !!(String(o.id).indexOf("text") >= 0)) {
            console.log(
              "Changing to ",
              Formatted(props.components[o.id.split("text")[1]], value)
            );
            o.set(
              "text",
              Formatted(props.components[o.id.split("text")[1]], value)
            );
            // console.log("Updating", o);
            canvas.current.renderAll();
          }
        });
      },
      false
    );

    const link = document.getElementById("saveimage");
    link.addEventListener(
      "click",
      function () {
        // Remove overlay image
        canvas.current.overlayImage = null;
        canvas.current.renderAll.bind(canvas.current);
        // Remove canvas.current clipping so export the image
        canvas.current.clipTo = null;
        // Export the canvas.current to dataurl at 3 times the size and crop to the active area
        const imgData = canvas.current.toDataURL({
          format: "png",
          quality: 1,
          multiplier: 3,
          left: 0,
          top: 0,
          width: getDim().w / 3,
          height: getDim().h / 3,
        });

        const strDataURI = imgData.substr(22, imgData.length);

        const blob = dataURLtoBlob(imgData);

        const objurl = URL.createObjectURL(blob);
        link.download = `stupidfits-${getDim().label}-${props.id}.png`;
        link.href = objurl;

        // Reset the clipping path to what it was
        canvas.current.clipTo = function (ctx) {
          ctx.rect(220, 80, 360, 640);
        };

        canvas.current.renderAll();
      },
      false
    );

    // canvas.current.on("mouse:wheel", function (opt) {
    //   var delta = opt.e.deltaY;

    //   // const objs = canvas.current.getObjects();
    //   // const img = objs.find((o) => o.id === "bgimage");

    //   // img.scaleX += delta;
    //   // img.scaleY += delta;

    //   // img.setCoords();
    //   // canvas.current.renderAll();

    //   // var zoom = canvas.current.getZoom();
    //   // zoom *= 0.999 ** delta;
    //   // if (zoom > 20) zoom = 20;
    //   // if (zoom < 0.01) zoom = 0.01;
    //   // canvas.current.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    //   opt.e.preventDefault();
    //   opt.e.stopPropagation();
    // });
  };

  useEffect(() => {
    console.log("Killing prev canvas.current");
    // canvas.current.setWidth(getDim().w / 3);
    // canvas.current.setHeight(getDim().h / 3);
    canvas.current && canvas.current.dispose();
    // canvas.current && canvas.current.clear();
    // canvas.current && canvas.current.remove(canvas.current.getActiveObject());
    canvas.current && canvas.current.removeListeners();
    canvas.current = null;

    // if (!canvas) {
    setTimeout(() => {
      initCanvas();
      addImage();
      addLogo();
      RenderControls(true);

      props.components &&
        props.components.map((c) => {
          addElement(c, text_iter);
        });
    }, 200);
    // }
    console.log("Props", props);

    return () => {};
  }, [type]);

  return (
    <Layout>
      <div className="page">
        <h1>Export</h1>
        <p>Export your fitpics with annotations for easy uploading wherever</p>
        <StatefulButtonGroup
          mode={MODE.radio}
          initialState={{ selected: getDim().id }}
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
        <div className="save">
          <a id="saveimage">
            <Button>Save Image</Button>
          </a>
        </div>

        <canvas
          id="c"
          ref={canvasDom}
          width={getDim().w / 3}
          height={getDim().h / 3}
          style={{ zoom: "100%" }}
        />

        {/* <CanvasDom key={type} type={type} w={getDim().w} h={getDim().h} /> */}

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

  return {
    props: { ...data },
  };
};

export default FitImage;
