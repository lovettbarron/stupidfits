import React, { useEffect, useState } from "react";
import fetch from "isomorphic-unfetch";
import Layout from "../../components/Layout";
import { useSession } from "next-auth/client";
import { Button } from "baseui/button";
import { fabric } from "fabric";
import { Radio, RadioGroup } from "baseui/radio";
import { Cap } from "../../components/Anatomy";
const FitImage = (props) => {
  const [session, loading] = useSession();
  const [value, setValue] = React.useState("1");

  let canvas = null;

  let img = null;
  let text_iter = 0;

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
      width: 1080,
      height: 1960,
      top: 0,
      left: -100,
      absolutePositioned: true,
    });

    img = fabric.util.loadImage(
      props.media.image,
      function (url) {
        var img = new fabric.Image(url);
        img.clipPath = clipPath;
        // img.scaleToWidth(1080 / 3);
        img.scaleToHeight(1980 / 3);
        canvas.add(img);
        canvas.sendToBack(img);
        // canvas.add(img);
      },
      null,
      {
        crossOrigin: "anonymous",
      }
    );
  };

  const addElement = (text, iter) => {
    // Load text onto canvas
    const height = 640;
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
    canvas.add(textbox);
    canvas.bringToFront(textbox);
    console.log("Added", Formatted(text, value), iter, offset);
    text_iter += 1;
  };

  const addLogo = () => {
    // Load text onto canvas
    const height = 640;
    const textbox = new fabric.Textbox(
      `stupidfits.com/f/${props.id}\nstupidfits.com/u/${props.user.username}`,
      {
        left: 0,
        top: 0.9 * height,
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
    canvas.add(textbox);
  };

  // Pul all canvas code in a function so we can call it after google fonts have loaded
  const initCanvas = () => {
    // Make canvas a fabric canvas
    canvas = new fabric.Canvas("c", {
      preserveObjectStacking: true,
    });

    canvas.backgroundColor = "rgb(21,21,21)";
    canvas.controlsAboveOverlay = true;
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
    const radio = document.getElementById("radio");
    radio.addEventListener(
      "change",
      (e) => {
        console.log("Changed fired", e.target.value);
        const value = String(e.target.value);
        let i = 0;
        const objs = canvas.getObjects();

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
            canvas.renderAll();
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
        canvas.overlayImage = null;
        canvas.renderAll.bind(canvas);
        // Remove canvas clipping so export the image
        canvas.clipTo = null;
        // Export the canvas to dataurl at 3 times the size and crop to the active area
        const imgData = canvas.toDataURL({
          format: "jpeg",
          quality: 1,
          multiplier: 3,
          left: 0,
          top: 0,
          width: 360,
          height: 640,
        });

        const strDataURI = imgData.substr(22, imgData.length);

        const blob = dataURLtoBlob(imgData);

        const objurl = URL.createObjectURL(blob);
        link.download = `${props.id}.jpg`;
        link.href = objurl;

        // Reset the clipping path to what it was
        canvas.clipTo = function (ctx) {
          ctx.rect(220, 80, 360, 640);
        };

        canvas.renderAll();
      },
      false
    );

    canvas.on("mouse:wheel", function (opt) {
      var delta = opt.e.deltaY;
      var zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });
  };

  useEffect(() => {
    if (!canvas) {
      setTimeout(() => {
        initCanvas();
        addImage();
        addLogo();
        RenderControls(true);

        props.components &&
          props.components.map((c) => {
            addElement(c, text_iter);
          });
      }, 1000);
    }
    console.log("Props", props);

    return () => {};
  }, []);

  return (
    <Layout>
      <div className="page">
        <h1>Export Anatomy</h1>
        <p>
          Export your fitpics with annotations for an easy upload to instagram
          stories (or wherever)
        </p>
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
        <canvas id="c" width={360} height={640} style={{ zoom: "100%" }} />
        <br />
        <div className="save">
          <a id="saveimage">
            <Button>Save Image</Button>
          </a>
        </div>
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
  // Get Fit
  const res = await fetch(`${process.env.HOST}/api/fits/${context.params.id}`);
  let data;
  try {
    data = await res.json();
  } catch (e) {
    console.log("error:", e.message);
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
