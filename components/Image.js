import React, { useEffect, useState, useContext, useRef } from "react";
import { Image, Transformation } from "cloudinary-react";
import {
  CarouselProvider,
  Slider,
  Slide,
  Dot,
  DotGroup,
  ButtonBack,
  ButtonNext,
  CarouselContext,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import Layer from "./Layer";
import { Button, KIND, SIZE } from "baseui/button";
import Canvas from "./Canvas";
import ExportModal from "./ExportModal";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE as MODALSIZE,
  ROLE,
} from "baseui/modal";

import { ArrowLeft, ArrowRight } from "baseui/icon";

const MediaHolder = ({
  media,
  fit,
  edit,
  children,
  setIsOpen,
  user,
  components,
  setDrag,
}) => (
  <div className="mediaholder">
    {edit && (
      <div className="edit">
        <Button
          className="edit"
          size={SIZE.mini}
          onClick={() => setIsOpen(true)}
        >
          {media.layers.length > 0 ? `Edit Layout` : `Add Layout`}
        </Button>
        <br />
        <br />
        <ExportModal
          media={media}
          components={components}
          layers={media.layers}
          user={user}
          fit={fit}
          handler={(s) => setDrag(s)}
        />
      </div>
    )}
    {media && media.layers && media.layers.length > 0 && (
      <div className="layermap">
        {media.layers.map((l) => (
          <Layer key={l.id} {...l} />
        ))}
      </div>
    )}
    <>{children}</>
    <style jsx>{`
      .mediaholder {
        width: 100%;
        height: 100%;
        position: relative;
      }


      .layermap {
        position: absolute;
        top: 0; left; bottom: 0; right: 0;
        width: 100%; height: 100%;
        transition: opacity 0.4s;
        opacity: 1;
      }


    .layermap:hover {
      opacity: 0;
    }

    .mediawrap {
      max-width: 600px;
      padding: 0;
      margin: 0;
      width: 50%;
      position: relative;
    }

    .edit {
      position: absolute;
      z-index: 1;
      top: 0.5rem;
      right: 0.5rem;
    }
    `}</style>
  </div>
);

const Pic = ({ media, fit, url, user, edit, components }) => {
  const handleDragStart = (e) => e.preventDefault();

  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [medi, setMedi] = useState(media[0]);
  const [allMedia, setAllMedia] = useState(media);
  const [drag, setDrag] = useState(true);
  const ref = useRef();

  useEffect(() => {
    setMedi(allMedia[index]);
  }, [index]);

  const mediaArray =
    Array.isArray(media) &&
    media.map((m) => (
      <MediaHolder
        media={m}
        components={components}
        edit={edit}
        user={user}
        fit={fit}
        setIsOpen={setIsOpen}
        setDrag={setDrag}
      >
        <Image
          cloudName={process.env.CLOUDINARY_CLOUD_NAME || "stupidsystems"}
          publicId={m.cloudinary} // {m.censor || m.cloudinary}
          style={{ width: "100%" }}
          secure={true}
          onDragStart={handleDragStart}
        >
          {user.hideface && <Transformation effect="pixelate_faces:15" />}
        </Image>
      </MediaHolder>
    ));

  return (
    <>
      <div className="holder">
        {(media.length > 1 && (
          <CarouselProvider
            totalSlides={media.length}
            visibleSlides={1}
            step={1}
            isIntrinsicHeight={true}
            dragEnabled={drag}
            // naturalSlideWidth={400}
            // naturalSlideHeight={400}
            // innerClassName={"carousel"}
          >
            <div className="arrows">
              <ButtonBack
                onClick={() => setIndex(index - 1)}
                disabled={index <= 0}
                className="navbutton"
                style={{ border: 0 }}
              >
                {index > 0 && <ArrowLeft size={42} />}
              </ButtonBack>

              <ButtonNext
                onClick={() => setIndex(index + 1)}
                disabled={index >= media.length - 1}
                className="navbutton"
                style={{ border: 0 }}
              >
                {index < media.length - 1 && <ArrowRight size={42} />}
              </ButtonNext>
            </div>
            <Slider>
              {mediaArray.map((m, i) => (
                <Slide key={i} index={i}>
                  {m}
                </Slide>
              ))}
            </Slider>
            {/* <div>
              {media.map((m, i) => (
                <Dot
                  key={i}
                  slide={i}
                  style={{
                    border: 0,
                    background: "#151515",
                    borderRadius: "100%",
                    margin: "1rem",
                    width: "1rem",
                    height: "1rem",
                    padding: 0,
                  }}
                />
              ))}
            </div> */}
          </CarouselProvider>
        )) || (
          <MediaHolder
            media={medi}
            edit={edit}
            user={user}
            components={components}
            fit={fit}
            setIsOpen={setIsOpen}
            setDrag={setDrag}
          >
            {edit && (
              <div className="edit">
                <Button
                  className="edit"
                  size={SIZE.mini}
                  onClick={() => setIsOpen(true)}
                >
                  {medi.layers.length > 0 ? `Edit Layout` : `Add Layout`}
                </Button>
                <br />
                <ExportModal
                  media={medi}
                  components={components}
                  layers={medi.layers}
                  user={user}
                  fit={fit}
                  handler={(s) => setDrag(s)}
                />
              </div>
            )}
            <Image
              cloudName={process.env.CLOUDINARY_CLOUD_NAME || "stupidsystems"}
              publicId={medi.cloudinary} // {media[0].censor || media[0].cloudinary}
              style={{ width: "100%" }}
              secure={true}
              onDragStart={handleDragStart}
            >
              {user.hideface && <Transformation effect="pixelate_faces:15" />}
            </Image>
          </MediaHolder>
        )}
      </div>

      {edit && (
        <Modal
          onClose={() => {
            setIsOpen(false);
          }}
          closeable
          autoFocus
          focusLock
          isOpen={isOpen}
          animate
          unstable_ModalBackdropScroll
          size={MODALSIZE.default}
          role={ROLE.dialog}
        >
          <ModalHeader>Edit Layout</ModalHeader>
          <ModalBody>
            {isOpen && (
              <div className="canvasholder">
                <Canvas
                  // {...props}
                  id={fit}
                  components={components}
                  // ref={ref}
                  layout={true}
                  p={{
                    label: "SVGLayout",
                    id: "LAND",
                    w: "400",
                    h: "500",
                    m: 1,
                    s: "c_fill",
                    ylock: true,
                    xlock: true,
                  }}
                  image={medi}
                  layers={medi.layers}
                  user={user}
                  handler={(m) => {
                    setMedi(m);
                    setAllMedia((allmed) => {
                      allmed[index] = m;
                      return [...allmed];
                    });
                    setIsOpen(false);
                  }}
                />
              </div>
            )}
          </ModalBody>
        </Modal>
      )}
      <style jsx>{`
        .holder {
          width: 100%;
          max-width: 600px;
          position: relative;
        }

        .mediawrap {
          max-width: 600px;
          padding: 0;
          margin: 0;
          width: 50%;
          position: relative;
        }

        .edit {
          position: absolute;
          z-index: 1;
          top: 0.5rem;
          right: 0.5rem;
        }

        .carousel {
          padding: 0;
          margin: 0;
        }

        .carousel li {
          padding: 0;
        }

        .arrows {
          position: absolute;
          top: 50%;
          margin-top: -32px;
          width: 100%;
          z-index: 1;
          display: flex;
          justify-content: space-between;
        }

        .arrows .navbutton {
          cursor: pointer;
          border: none !important;
        }

        .alice-carousel {
        }

        .holder img {
          width: 100%;
          min-height: 4rem;
        }

        .mediaholder {
          width: 100%;
          height: 100%;
          position: relative;
          opacity: 1;
          transition: opacity 0.4s;
        }

        .holder:hover .mediaholder {
          opacity: 0;
        }
      `}</style>
    </>
  );
};

export default Pic;
