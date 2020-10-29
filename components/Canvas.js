import React, { useEffect, useState, useRef, useCallback } from "react";
import { fabric } from "fabric";
import { Cap } from "./Anatomy";
import { Button } from "baseui/button";

const Canvas = (props) => {
  const [value, setValue] = useState("1");
  const [type, setType] = useState("LAND");
  // const [canvas, setCanvas] = useState(false);
  const canvasDom = useRef();
  let canvas = useRef(); // useRef(null);
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
      width: props.p.w,
      height: props.p.h,
      top: 0,
      left: 0,
      absolutePositioned: true,
    });

    img = fabric.util.loadImage(
      `https://res.cloudinary.com/stupidsystems/image/upload/b_rgb:151515,${props.p.s},h_${props.p.h},w_${props.p.w}/${props.image.cloudinary}.png`,
      function (url) {
        var img = new fabric.Image(url);

        // img.clipPath = clipPath;
        img.lockMovementY = props.p.ylock;
        img.lockMovementX = props.p.xlock;
        // img.scaleToWidth(1080 / 3);
        img.scaleToHeight(props.p.h / 3);
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
    const height = props.p.h / 3;
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
    const height = props.p.h / 3;
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
    canvas.current.setWidth(props.p.w / 3);
    canvas.current.setHeight(props.p.h / 3);
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
      width: props.p.w / 3,
      height: props.p.h / 3,
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

    const saveSVG= () => {
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
        width: props.p.w / 3,
        height: props.p.h / 3,
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
          addElement(c, text_iter);
        });
    }, 200);
    // }
    console.log("Props", props);

    return () => {};
  }, [props]);

  return (
    <>
      <div className="save">
        <a id="saveimage" onClick={saveImage}>
          <Button>Save Image</Button>
        </a>
      </div>
      <canvas
        id="c"
        ref={canvasDom}
        width={props.p.w / 3}
        height={props.p.h / 3}
        style={{ zoom: "100%" }}
      />
      <style jsx>{`
        canvas {
          overflow: hidden;
          border: 1px solid #ffffff;
        }
      `}</style>
    </>
  );
};

export default Canvas;
