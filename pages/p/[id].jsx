import React, { useEffect, useState } from "react";
import fetch from "isomorphic-unfetch";
import Layout from "../../components/Layout";
import Router from "next/router";
import { Select } from "baseui/select";
import FitBox from "../../components/FitBox";
import CreateItem from "../../components/CreateItem";
import { useSession } from "next-auth/client";
import { fabric } from "fabric";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE,
  ROLE,
} from "baseui/modal";
import Fit from "../create";

const FitImage = (props) => {
  const [session, loading] = useSession();
  const [desc, setDesc] = useState("");
  const [items, setItems] = useState(null);
  const [components, setComponents] = useState(
    props.components && itemToOptions(props.components)
  );

  const canvas = null;

  const [isOpen, setIsOpen] = React.useState(false);
  const addElement = (type, text) => {
    textbox.setShadow("0px 0px 10px rgba(0, 0, 0, 1)");
    canvas.add(textbox);
  };

  // Pul all canvas code in a function so we can call it after google fonts have loaded
  const template1 = () => {
    // Make canvas a fabric canvas
    canvas = new fabric.Canvas("c", {
      preserveObjectStacking: true,
    });
    canvas.backgroundColor = "rgb(140,140,140)";
    canvas.clipTo = function (ctx) {
      ctx.rect(220, 80, 360, 640);
    };
    canvas.controlsAboveOverlay = true;
    canvas.setOverlayImage(
      "img/overlay-bg.png",
      canvas.renderAll.bind(canvas),
      {
        opacity: 0.5,
        angle: 0,
        left: 0,
        top: 0,
        originX: "left",
        originY: "top",
        crossOrigin: "anonymous",
      }
    );

    // Loading image onto canvas
    var tempImg = "img/birdbox.jpg";

    var birdbox;
    var birdboxImg = new Image();
    birdboxImg.onload = function (img) {
      birdbox = new fabric.Image(birdboxImg, {
        angle: 0,
        width: 1171,
        height: 1950,
        left: 200,
        top: 80,
        scaleX: 0.33,
        scaleY: 0.33,
        selectable: true,
        borderColor: "red",
        cornerColor: "green",
        cornerSize: 12,
        transparentCorners: false,
      });
      canvas.add(birdbox);
      // This is like z-index, this keeps the image behind the text
      canvas.moveTo(birdbox, 0);
    };
    birdboxImg.src = tempImg;

    // Load text onto canvas
    var textbox = new fabric.Textbox(
      "Caption goes here - you can resize the text with the handles",
      {
        left: 240,
        top: 455,
        width: 320,
        fontSize: 28,
        fill: "#fff",
        fontFamily: "Open Sans",
        fontWeight: 800,
        textAlign: "center",
        borderColor: "red",
        cornerColor: "green",
        cornerSize: 12,
        transparentCorners: false,
      }
    );
    // Add shadow to the textbox with this line

    // Function to update image src - timout added to fix image loading bug
    function addImage(img) {
      birdbox.setSrc(img);
      setTimeout(function () {
        canvas.renderAll();
      }, 1);
    }

    // Pick new background image
    var bgpicker = document.querySelector("#backgroundpick");
    bgpicker.onchange = function (e) {
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.onload = function (file) {
        addImage(file.target.result);
      };
      reader.readAsDataURL(file);
    };
  };

  // dataURLtoBlob function for saving
  const dataURLtoBlob = (dataurl) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const bindEvents = () => {
    // Save image
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
        var imgData = canvas.toDataURL({
          format: "jpeg",
          quality: 1,
          multiplier: 3,
          left: 220,
          top: 80,
          width: 360,
          height: 640,
        });

        var strDataURI = imgData.substr(22, imgData.length);

        var blob = dataURLtoBlob(imgData);

        var objurl = URL.createObjectURL(blob);
        link.download = "story.jpg";
        link.href = objurl;
        // Reset the clipping path to what it was
        canvas.clipTo = function (ctx) {
          ctx.rect(220, 80, 360, 640);
        };
        // Reset overlay image
        canvas.setOverlayImage(
          props.media.image,
          canvas.renderAll.bind(canvas),
          {
            opacity: 0.5,
            angle: 0,
            left: 0,
            top: 0,
            originX: "left",
            originY: "top",
            crossOrigin: "anonymous",
          }
        );
        canvas.renderAll();
      },
      false
    );
  };

  useEffect(() => {
    bindEvents(true);
    return () => {};
  }, [session]);

  return (
    <Layout>
      <div className="page">
        <h1>Export Anatomy</h1>

        <main id="main-area">
          <canvas id="c" width="1080" height="1920" style={{ zoom: "50%" }} />
          <img class="gui" src={props.media.image} />
          <a id="saveimage">Save Image</a>
        </main>
      </div>
      <style jsx>{`
        .page {
          padding: 3rem;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
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
    props: { ...data, url: process.env.HOST },
  };
};

export default FitImage;
