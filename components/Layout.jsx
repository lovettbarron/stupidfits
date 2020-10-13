import Header from "./Header";

const Layout = (props) => (
  <div>
    <Header />
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

      body {
        margin: 0;
        padding: 0;
        font-size: 10px;
        font-family: "Apercu", Helvetica, Arial, sans-serif, "Apple Color Emoji",
          "Segoe UI Emoji", "Segoe UI Symbol";
        background: #151515;
        color: #ffffff;
        max-width: 600px;
        width: 100%;
        margin: 0 auto;
        text-align: center;
      }

      p {
        font-size: 1.6rem;
      }

      h1,
      h2,
      h3,
      h4 {
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

export default Layout;
