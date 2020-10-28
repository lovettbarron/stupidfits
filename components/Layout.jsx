import Transition from "../components/Transition";
import { useRouter } from "next/router";

const Layout = (props) => {
  const router = useRouter();

  return (
    <div>
      <div className="layout">{props.children}</div>

      <style jsx global>{`
        @font-face {
          font-family: "Futura";
          src: url("/fonts/FuturaPassata-DISPLAY.woff2") format("woff2"),
            url("/fonts/FuturaPassata-DISPLAY.woff") format("woff");
          font-weight: 400;
          font-style: normal;
          font-stretch: normal;
        }

        @font-face {
          font-family: "Apercu";
          src: url("/fonts/apercu-mono-webfont.woff") format("woff");
          font-weight: 400;
          font-style: normal;
          font-stretch: normal;
        }

        html {
          box-sizing: border-box;
        }

        *,
        *:before,
        *:after {
          box-sizing: inherit;
        }

        @media screen and (max-width: 800px) {
          body {
            max-width: 600px !important;
          }

          .col {
            width: 100% !important;
          }
        }

        .grid {
          display: flex;
          flex-wrap: wrap;
        }

        .col {
          width: 50%;
        }

        body {
          margin: 0;
          padding: 0;
          font-size: 10px;
          font-family: "Apercu", Helvetica, Arial, sans-serif,
            "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
          background: #151515;
          color: #ffffff;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          text-align: center;
        }

        p {
          font-size: 1.4rem;
          max-width: 600px;
        }

        h1,
        h2,
        h3,
        h4 {
          width: 100%;
          font-family: "Futura";
          color: #ffffff;
        }
        h1 {
          font-size: 3rem;
          letter-spacing: 0;
        }
        h2 {
          font-size: 31pt;
        }

        a {
          color: white;
          word-wrap: break-word;
        }

        input,
        textarea {
          font-size: 16px;
        }

        ol {
          font-size: 1.6rem;
          text-align: center;
          list-style-position: inside;
        }

        ol > li {
          margin: 1rem;
        }

        button {
          cursor: pointer;
          border: 1px solid #ffffff;
          background: transparent;
          font-size: 1rem;
          font-family: Apercu-Mono;
          padding: 2rem;
          white-space: nowrap;
          color: #ffffff;
          letter-spacing: 0;
          text-align: center;
        }

        ul.anatomy {
          display: flex;
          flex-wrap: wrap;
          list-style: none !important;
          list-style-type: none !important;
          text-align: center;
          justify-contents: center;
          padding: 0;
        }

        .anatomy li {
          justify-self: center;
          width: 100%;
          text-align: center;
          padding: 0;
          margin: 0 0rem 0.5rem 0;
          list-style: none !important;
          list-style-type: none !important;
        }

        .alert {
          padding: 1rem;
          border: 1px solid #ffffff;
          border-radius: 5px;
        }

        /* START TOOLTIP STYLES */
        [tooltip] {
          position: relative; /* opinion 1 */
          cursor: pointer;
        }

        /* Applies to all tooltips */
        [tooltip]::before,
        [tooltip]::after {
          text-transform: none; /* opinion 2 */
          font-size: 0.9em; /* opinion 3 */
          line-height: 1;
          user-select: none;
          pointer-events: none;
          position: absolute;
          display: none;
          opacity: 0;
        }
        [tooltip]::before {
          content: "";
          border: 5px solid transparent; /* opinion 4 */
          z-index: 1001; /* absurdity 1 */
        }
        [tooltip]::after {
          content: attr(tooltip); /* magic! */

          text-align: center;

          /*
         Let the content set the size of the tooltips
         but this will also keep them from being obnoxious
         */
          min-width: 3rem;
          max-width: 21rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 1ch 1.5ch;
          border-radius: 0.3ch;
          box-shadow: 0 1em 2em -0.5em rgba(0, 0, 0, 0.35);
          background: #333;
          color: #fff;
          z-index: 1000; /* absurdity 2 */
        }

        /* Make the tooltips respond to hover */
        [tooltip]:hover::before,
        [tooltip]:hover::after {
          display: block;
        }

        /* don't show empty tooltips */
        [tooltip=""]::before,
        [tooltip=""]::after {
          display: none !important;
        }

        /* FLOW: UP */
        [tooltip]:not([flow])::before,
        [tooltip][flow^="up"]::before {
          bottom: 100%;
          border-bottom-width: 0;
          border-top-color: #333;
        }
        [tooltip]:not([flow])::after,
        [tooltip][flow^="up"]::after {
          bottom: calc(100% + 5px);
        }
        [tooltip]:not([flow])::before,
        [tooltip]:not([flow])::after,
        [tooltip][flow^="up"]::before,
        [tooltip][flow^="up"]::after {
          left: 50%;
          transform: translate(-50%, -0.5em);
        }

        /* FLOW: DOWN */
        [tooltip][flow^="down"]::before {
          top: 100%;
          border-top-width: 0;
          border-bottom-color: #333;
        }
        [tooltip][flow^="down"]::after {
          top: calc(100% + 5px);
        }
        [tooltip][flow^="down"]::before,
        [tooltip][flow^="down"]::after {
          left: 50%;
          transform: translate(-50%, 0.5em);
        }

        /* FLOW: LEFT */
        [tooltip][flow^="left"]::before {
          top: 50%;
          border-right-width: 0;
          border-left-color: #333;
          left: calc(0em - 5px);
          transform: translate(-0.5em, -50%);
        }
        [tooltip][flow^="left"]::after {
          top: 50%;
          right: calc(100% + 5px);
          transform: translate(-0.5em, -50%);
        }

        /* FLOW: RIGHT */
        [tooltip][flow^="right"]::before {
          top: 50%;
          border-left-width: 0;
          border-right-color: #333;
          right: calc(0em - 5px);
          transform: translate(0.5em, -50%);
        }
        [tooltip][flow^="right"]::after {
          top: 50%;
          left: calc(100% + 5px);
          transform: translate(0.5em, -50%);
        }

        /* KEYFRAMES */
        @keyframes tooltips-vert {
          to {
            opacity: 0.9;
            transform: translate(-50%, 0);
          }
        }

        @keyframes tooltips-horz {
          to {
            opacity: 0.9;
            transform: translate(0, -50%);
          }
        }

        /* FX All The Things */
        [tooltip]:not([flow]):hover::before,
        [tooltip]:not([flow]):hover::after,
        [tooltip][flow^="up"]:hover::before,
        [tooltip][flow^="up"]:hover::after,
        [tooltip][flow^="down"]:hover::before,
        [tooltip][flow^="down"]:hover::after {
          animation: tooltips-vert 300ms ease-out forwards;
        }

        [tooltip][flow^="left"]:hover::before,
        [tooltip][flow^="left"]:hover::after,
        [tooltip][flow^="right"]:hover::before,
        [tooltip][flow^="right"]:hover::after {
          animation: tooltips-horz 300ms ease-out forwards;
        }

        @keyframes shake {
          0% {
            transform: translate(1px, 1px) rotate(0deg);
          }
          10% {
            transform: translate(-1px, -2px) rotate(-1deg);
          }
          20% {
            transform: translate(-3px, 0px) rotate(1deg);
          }
          30% {
            transform: translate(3px, 2px) rotate(0deg);
          }
          40% {
            transform: translate(1px, -1px) rotate(1deg);
          }
          50% {
            transform: translate(-1px, 2px) rotate(-1deg);
          }
          60% {
            transform: translate(-3px, 1px) rotate(0deg);
          }
          70% {
            transform: translate(3px, 1px) rotate(-1deg);
          }
          80% {
            transform: translate(-1px, -1px) rotate(1deg);
          }
          90% {
            transform: translate(1px, 2px) rotate(0deg);
          }
          100% {
            transform: translate(1px, -2px) rotate(-1deg);
          }
        }
      `}</style>
      <style jsx>{`
        .layout {
          padding: 0 2rem;
        }
      `}</style>
    </div>
  );
};

export default Layout;
