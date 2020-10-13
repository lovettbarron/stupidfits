import React, { useEffect, useState } from "react";
import fetch from "isomorphic-unfetch";
import Layout from "../../components/Layout";
import { useSession } from "next-auth/client";
import { Button } from "baseui/button";
import { fabric } from "fabric";
const FitImage = (props) => {
  const [session, loading] = useSession();

  let canvas = null;
  let text_iter = 0;

  function handleResize() {
    var w = window.innerWidth - 2; // -2 accounts for the border
    var h = window.innerHeight - 2;
    canvas.width = w;
    canvas.height = h;
    //
    var ratio = 100 / 100; // 100 is the width and height of the circle content.
    var windowRatio = w / h;
    var scale = w / 100;
    if (windowRatio > ratio) {
      scale = h / 100;
    }
    // Scale up to fit width or height
    fitImage.scaleX = c.scaleY = scale;

    // Center the shape
    fitImage.x = w / 2;
    fitImage.y = h / 2;
  }

  const addImage = () => {
    var clipPath = new fabric.Rect({
      width: 1080,
      height: 1960,
      top: 0,
      left: 0,
      absolutePositioned: true,
    });

    fabric.util.loadImage(
      props.media.image,
      function (url) {
        var img = new fabric.Image(url);
        img.clipPath = clipPath;
        img.scaleToWidth(1080 / 3);
        canvas.add(img);
        canvas.sendToBack(img);
        // canvas.add(img);
      },
      null,
      {
        crossOrigin: "anonymous",
      }
    );

    // fabric.Image.fromURL(props.media.image, function (img) {
    //   img.clipPath = clipPath;
    //   img.scaleToWidth(1080 / 3);
    //   canvas.add(img);
    //   canvas.sendToBack(img);
    // });
  };

  const addElement = (text, iter) => {
    // Load text onto canvas
    const offset = 1080 / props.components.length;
    const textbox = new fabric.Textbox(text, {
      left: 0,
      top: iter * offset,
      width: 320,
      fontSize: 28,
      fill: "#fff",
      fontFamily: "Apercu",
      fontWeight: 800,
      textAlign: "center",
      cornerSize: 12,
      transparentCorners: false,
    });

    // textbox.setShadow("0px 0px 10px rgba(0, 0, 0, 1)");
    canvas.add(textbox);
    text_iter += 1;
    console.log("Added", text, iter);
  };

  const addLogo = (text, iter) => {
    // Load text onto canvas
    const offset = 640;
    const textbox = new fabric.Textbox("stupidfits.com", {
      left: 0,
      top: 0.9 * offset,
      width: 360,
      fontSize: 12,
      fill: "#fff",
      textBackgroundColor: "#151515",
      fontFamily: "Apercu",
      fontWeight: 800,
      textAlign: "center",
      cornerSize: 12,
      transparentCorners: false,
    });

    // textbox.setShadow("0px 0px 10px rgba(0, 0, 0, 1)");
    canvas.add(textbox);
    text_iter += 1;
    console.log("Added", text, iter);
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
      initCanvas();
      addImage();
      addLogo();
      RenderControls(true);
    }
    if (text_iter === 0) {
      props.components &&
        props.components.map((c) => {
          addElement(c.model, text_iter);
        });
    }
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

  return {
    props: { ...data },
  };
};

export default FitImage;
