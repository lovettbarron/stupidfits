import React, { useEffect, useState } from "react";
import psl from "psl";

export const extractHostname = (url) => {
  let hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname3\

  if (url.indexOf("//") > -1) {
    hostname = url.split("/")[2];
  } else {
    hostname = url.split("/")[0];
  }

  //find & remove port number
  hostname = hostname.split(":")[0];
  //find & remove "?"
  hostname = hostname.split("?")[0];

  return hostname;
};

const isUrl = (s) => {
  var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return regexp.test(s);
};

const Clicker = (props) => {
  if (!props.sale || !isUrl(props.sale)) return <>{props.children}</>;

  const domain = psl.get(extractHostname(props.sale));

  return (
    <>
      <span tooltip={domain} flow="right">
        <a href={props.sale} target="_blank">
          {props.children}
        </a>
      </span>
      <style jsx>{``}</style>
    </>
  );
};
export default Clicker;
