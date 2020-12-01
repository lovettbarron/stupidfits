import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useSession, getProviders, getCsrfToken } from "next-auth/client";
import { StatefulPopover } from "baseui/popover";
import { Input } from "baseui/input";

import { Button, KIND, SIZE as BUTTONSIZE } from "baseui/button";
import { Block } from "baseui/block";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE,
  ROLE,
} from "baseui/modal";

const LoginBox = (props) => {
  const router = useRouter();
  const [session, loading] = useSession();
  const [providers, setProviders] = useState([]);
  const [csrfToken, setCsrfToken] = useState();
  const [collections, setCollections] = useState([]);
  const [email, setEmail] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const setup = async () => {
    const p = await getProviders();
    console.log(p);
    const c = await getCsrfToken();
    setCsrfToken(c);
    setProviders(Object.keys(p).map((key) => p[key]));
  };

  const providersToRender = () => {
    return providers.filter((provider) => {
      if (provider.type === "oauth" || provider.type === "email") {
        // Always render oauth and email type providers
        return true;
      } else if (provider.type === "credentials" && provider.credentials) {
        // Only render credentials type provider if credentials are defined
        return true;
      } else {
        // Don't render other provider types
        return false;
      }
    });
  };

  useEffect(() => {
    setup();
    return () => {};
  }, [session]);

  // console.log("Providers", getProviders());

  const prov = async () => {
    return getProviders();
  };

  return (
    <>
      <StatefulPopover
        content={() => {
          return (
            <Block padding={"20px"}>
              <h3>Login or Create via</h3>

              {providers &&
                providersToRender().map((provider, i) => (
                  <div key={provider.id} className="provider">
                    {provider.type === "oauth" && (
                      <form action={provider.signinUrl} method="POST">
                        {provider.preface && <p>{provider.preface}</p>}
                        <Input
                          type="hidden"
                          name="csrfToken"
                          value={csrfToken}
                        />
                        {/* {callbackUrl && (
                            <input
                              type="hidden"
                              name="callbackUrl"
                              value={callbackUrl}
                            />
                          )} */}
                        <Button
                          type="submit"
                          className="button"
                          overrides={{
                            BaseButton: {
                              style: {
                                width: "100%",
                              },
                            },
                          }}
                        >
                          Sign in with {provider.name}
                        </Button>
                      </form>
                    )}
                    {(provider.type === "email" ||
                      provider.type === "credentials") &&
                      i > 0 &&
                      providersToRender()[i - 1].type !== "email" &&
                      providersToRender()[i - 1].type !== "credentials" && (
                        <hr />
                      )}
                    {provider.type === "email" && (
                      <form action={provider.signinUrl} method="POST">
                        {provider.preface && <p>{provider.preface}</p>}
                        <input
                          type="hidden"
                          name="csrfToken"
                          value={csrfToken}
                        />
                        <label for={`input-email-for-${provider.id}-provider`}>
                          Email
                        </label>
                        <Input
                          id={`input-email-for-${provider.id}-provider`}
                          autoFocus
                          type="text"
                          name="email"
                          onChange={(e) => setEmail(e.target.value)}
                          value={email}
                          placeholder="email@example.com"
                        />
                        <Button
                          type="submit"
                          overrides={{
                            BaseButton: {
                              style: {
                                width: "100%",
                              },
                            },
                          }}
                        >
                          Sign in with {provider.name}
                        </Button>
                      </form>
                    )}
                    {provider.type === "credentials" && (
                      <form action={provider.callbackUrl} method="POST">
                        <input
                          type="hidden"
                          name="csrfToken"
                          value={csrfToken}
                        />
                        {Object.keys(provider.credentials).map((credential) => {
                          return (
                            <div key={`input-group-${provider.id}`}>
                              <label
                                for={`input-${credential}-for-${provider.id}-provider`}
                              >
                                {provider.credentials[credential].label ||
                                  credential}
                              </label>
                              <Input
                                name={credential}
                                id={`input-${credential}-for-${provider.id}-provider`}
                                type={
                                  provider.credentials[credential].type ||
                                  "text"
                                }
                                value={
                                  provider.credentials[credential].value || ""
                                }
                                placeholder={
                                  provider.credentials[credential]
                                    .placeholder || ""
                                }
                              />
                            </div>
                          );
                        })}
                        <Button
                          type="submit"
                          overrides={{
                            BaseButton: {
                              style: {
                                width: "100%",
                              },
                            },
                          }}
                        >
                          Sign in with {provider.name}
                        </Button>
                      </form>
                    )}
                    {(provider.type === "email" ||
                      provider.type === "credentials") &&
                      i + 1 < providersToRender().length && <hr />}
                  </div>
                ))}

              <Button
                kind={KIND.secondary}
                size={BUTTONSIZE.mini}
                onClick={() => setIsOpen(true)}
              >
                Explain accounts to me?
              </Button>

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
                size={SIZE.default}
                role={ROLE.dialog}
              >
                <ModalHeader>About StupidFits Accounts</ModalHeader>
                <ModalBody>
                  <p>
                    Hi! Having an account all over the internet is kind of
                    annoying.
                  </p>
                  <p>
                    {" "}
                    If you get value from Stupid Fits without an account, please
                    go for it! Unfortunately, to do things like upload images,
                    vote in competitions, or submit to collections, we do
                    require that you have an account. There is a _very_ light
                    layer of moderation on the platform — mostly just for the
                    global feed and to prevent absuive images or content
                  </p>
                </ModalBody>
              </Modal>
            </Block>
          );
        }}
        returnFocus
        autoFocus
      >
        <img
          style={{ maxWidth: props.big ? "300px" : "200px" }}
          alt="Login or Create Account"
          src={`/img/login.png`}
        />
      </StatefulPopover>

      <style jsx>{`
        .save {
          width: 100%;
        }

        img {
          // max-width: 200px;
          margin: 0 2rem 0 0;
        }

        ul {
          list-style: none;
          padding: 0;
          max-height: 200px;
          overflow-x: hidden;
          overflow-y: auto;
        }

        li {
          list-style: none;
          text-align: left;
          padding: 0.5rem 0;
          position: relative;
          transition: all 0.4s;
          background: transparent;
          cursor: pointer;
        }

        li.added {
          cursor: not-allowed;
          text-decoration: line-through;
        }

        li:not(.added):hover {
          padding-left: 0.5rem;
          background: #151515;
          color: white;
        }

        .back {
          margin-left: 1rem;
        }
      `}</style>
    </>
  );
};

export default LoginBox;
