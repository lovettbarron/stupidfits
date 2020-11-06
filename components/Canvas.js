import React, { useEffect, useState, useRef, useCallback } from "react";
import { fabric } from "fabric";
import { Cap } from "./Anatomy";
import { Button } from "baseui/button";
import fetch from "isomorphic-unfetch";
import Router, { useRouter } from "next/router";

const Canvas = (props) => {
  const [value, setValue] = useState("1");
  const [type, setType] = useState("LAND");
  const [loadingLayout, setLoadingLayout] = useState(false);
  const hideface =
    props.hideface !== null ? props.hideface : props.user.hideface;
  // const [canvas, setCanvas] = useState(false);
  const canvasDom = useRef();
  let canvas = useRef(); // useRef(null);
  let img = null;
  let text_iter = 0;

  const Formatted = (c, v) => {
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
      width: props.p.w,
      height: props.p.h,
      top: 0,
      left: 0,
      absolutePositioned: true,
    });

    img = fabric.util.loadImage(
      `https://res.cloudinary.com/stupidsystems/image/upload/b_rgb:151515,${
        props.p.s
      }${hideface ? `,e_pixelate_faces:15` : ""},h_${props.p.h},w_${
        props.p.w
      }/${props.image.cloudinary}.png`,
      function (url) {
        var img = new fabric.Image(url);

        // img.clipPath = clipPath;
        img.lockMovementY = props.p.ylock;
        img.lockMovementX = props.p.xlock;
        // img.scaleToWidth(1080 / 3);
        img.scaleToHeight(props.p.h / props.p.m);
        canvas.current.add(img);
        canvas.current.sendToBack(img);
      },
      null,
      {
        crossOrigin: "anonymous",
      }
    );
  };

  const addElement = (text, iter, id) => {
    // Load text onto canvas.current
    const height = props.p.h / props.p.m;
    const offset = (iter / props.components.length) * height;
    const exist = props.layers && props.layers.find((l) => l.item.id === id);
    // console.log("Exists?", exist, props.layers, id);

    const s = { x: props.p.w / props.p.m, y: props.p.h / props.p.m };

    console.log("Adding", id, text.model, !!exist);

    const objs = canvas.current.getObjects();
    const cancel = objs.find((o) => o.id === "text" + id);
    if (cancel) {
      console.log("Already exists");
    } else {
      const textbox = new fabric.Textbox(Formatted(text, value), {
        id: "text" + id, //iter
        left: (exist && exist.x * s.x) || 0,
        top: (exist && exist.y * s.y) || offset,
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
    }
  };

  const addLogo = () => {
    // Load text onto canvas.current
    const height = props.p.h / props.p.m;
    const w = 360;
    const woff = props.p.w / props.p.m / 2 - w / 2;
    const textbox = new fabric.Textbox(
      `stupidfits.com/f/${props.id}\nstupidfits.com/u/${props.user.username}`,
      {
        left: woff,
        top: height - 30,
        width: w,
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
    const order = {
      EXTRA: 1,
      JACKET: 2,
      LAYER: 3,
      SHIRT: 4,
      BAG: 5,
      PANT: 6,
      SHOE: 7,
    };

    props.components.sort((a, b) => {
      return order[a.type] - order[b.type];
    });

    canvas.current =
      canvas.current ||
      new fabric.Canvas(canvasDom.current, {
        preserveObjectStacking: true,
        allowTouchScrolling: true,
      });
    canvas.current.setDimensions({ width: "100%", height: "100%" });
    canvas.current.setWidth(props.p.w / props.p.m);
    canvas.current.setHeight(props.p.h / props.p.m);
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
  };

  const saveImage = () => {
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
      width: props.p.w / props.p.m,
      height: props.p.h / props.p.m,
    });

    const strDataURI = imgData.substr(22, imgData.length);

    const blob = dataURLtoBlob(imgData);

    const objurl = URL.createObjectURL(blob);
    const link = document.getElementById("saveimage");
    link.download = `stupidfits-${props.p.label.replace(" ", "-")}-${
      props.id
    }.png`;
    link.href = objurl;

    // Reset the clipping path to what it was
    canvas.current.clipTo = function (ctx) {
      ctx.rect(220, 80, 360, 640);
    };

    canvas.current.renderAll();
  };

  const saveSVG = async () => {
    // Remove overlay image
    setLoadingLayout(true);

    const objs = canvas.current.getObjects();
    const layers = [];
    objs.forEach((o) => {
      if (!o.id) return null;
      else if (o.id && !!(String(o.id).indexOf("text") >= 0)) {
        const id = o.id.split("text")[1];
        const exist =
          props.layers && props.layers.find((l) => l.item.id === Number(id));

        // console.log(o);
        layers.push({
          id: exist ? exist.id : -1,
          x: o.left / (props.p.w / props.p.m),
          y: o.top / (props.p.h / props.p.m),
          r: 0,
          item: Number(id),
          media: props.image.id,
        });
      }
    });

    console.log(layers);

    try {
      const body = { layers: layers };
      const res = await fetch(
        `${process.env.HOST}/api/export/${props.image.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      try {
        const data = await res.json();
        if (props.handler) {
          props.handler(data);
        }
        // await Router.push(`/f/${props.id}`);
        setLoadingLayout(false);
      } catch (e) {
        console.log("error:", e.message);
        setLoadingLayout(false);
      }
    } catch (error) {
      console.error(error);
      setLoadingLayout(false);
    }

    console.log(layers);
  };

  useEffect(() => {
    console.log("Killing prev canvas.current");
    canvas.current && canvas.current.dispose();
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
          addElement(c, text_iter, c.id);
        });
    }, 200);
    // }
    console.log("Props", props);

    return () => {};
  }, [props]);

  return (
    <div className="holder">
      <div className="btn">
        <div className="save">
          {(!props.layout && (
            <a id="saveimage" onClick={saveImage}>
              <Button>Export Image</Button>
            </a>
          )) || (
            <a id="savesvg" onClick={saveSVG}>
              <Button isLoading={loadingLayout}>Save Layout</Button>
            </a>
          )}
        </div>
      </div>
      <canvas
        id="c"
        ref={canvasDom}
        width={props.p.w / props.p.m}
        height={props.p.h / props.p.m}
        style={{ zoom: "100%" }}
      />
      <style jsx>{`
        .holder {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn {
          width: 100%;
        }

        canvas {
          overflow: hidden;
          margin: 0 auto;
          border: 1px solid #ffffff;
        }
      `}</style>
    </div>
  );
};

export default Canvas;
