import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import Anatomy from "./Anatomy";
import { StatefulPopover } from "baseui/popover";
import { StatefulButtonGroup, MODE } from "baseui/button-group";
import { Input } from "baseui/input";
import { Button, KIND, SIZE as BUTTONSIZE } from "baseui/button";
import Canvas from "./Canvas";
import { Block } from "baseui/block";
import { Checkbox, LABEL_PLACEMENT } from "baseui/checkbox";

import { providers } from "../pages/p/[id]";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  FocusOnce,
  SIZE,
  ROLE,
} from "baseui/modal";

const ExportModal = ({ media, components, layers, user, fit, handler }) => {
  const router = useRouter();
  const [session, loading] = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [hideface, setHideface] = useState(user.hideface);
  const [value, setValue] = useState("1");
  const [type, setType] = useState(null);

  const [activeKey, setActiveKey] = React.useState("0");

  const ref = useRef();

  useEffect(() => {
    if (type) {
      setIsOpen(true);
      handler(false);
    }
    return () => {};
  }, [media, type, session]);

  return (
    <div className="modal">
      <StatefulPopover
        content={() => (
          <Block padding={"20px"}>
            Export Options
            <StatefulButtonGroup
              mode={MODE.radio}
              initialState={{ selected: 0 }}
              overrides={{
                Root: {
                  style: {
                    flexWrap: "wrap",
                    maxWidth: "300px",
                    justifyContent: "space-between",
                  },
                },
              }}
            >
              {providers().map((t, i) => (
                <Button key={t.id} onClick={() => setType(t.id)}>
                  {t.label}
                </Button>
              ))}
            </StatefulButtonGroup>
            <Checkbox
              checked={hideface}
              onChange={(e) => setHideface(e.target.checked)}
              labelPlacement={LABEL_PLACEMENT.right}
            >
              Hide my face
            </Checkbox>
          </Block>
        )}
        returnFocus
        autoFocus
      >
        <Button kind={KIND.secondary} size={BUTTONSIZE.mini}>
          Export Image
        </Button>
      </StatefulPopover>
      <Modal
        onClose={() => {
          setIsOpen(false);
          setType(null);
          handler(true);
        }}
        closeable
        autoFocus
        focusLock
        isOpen={isOpen}
        animate
        unstable_ModalBackdropScroll
        size={SIZE.default}
        role={ROLE.dialog}
      >
        <FocusOnce>
          <ModalHeader>Add To Your Closet</ModalHeader>
        </FocusOnce>
        <ModalBody>
          {isOpen && (
            <Canvas
              id={fit}
              ref={ref}
              p={providers().find((p) => p.id === type)}
              hideface={hideface}
              components={components}
              image={media}
              layers={media.layers}
              user={user}
            />
          )}
        </ModalBody>
      </Modal>
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
    </div>
  );
};

export default ExportModal;
