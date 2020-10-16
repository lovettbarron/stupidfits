import fetch from "isomorphic-unfetch";
import { NextSeo } from "next-seo";
import Layout from "../../components/Layout";
import FitBox from "../../components/FitBox";
import { useSession, getSession } from "next-auth/client";
import Link from "next/link";
import { Tabs, Tab, FILL } from "baseui/tabs-motion";
import Anatomy from "../../components/Anatomy";

const BrandList = (props) => {
  const [activeKey, setActiveKey] = React.useState("0");

  return (
    <Layout>
      <NextSeo
        title={`Brands List on Stupid Fits`}
        description={`All the brands`}
      />
      <div className="page">
        <main>
          <div className="top">
            <h1>
              <Link href="/">
                <a>Stupid Fits</a>
              </Link>
            </h1>

            <ul className="brands">
              {props.brands &&
                props.brands.map((b) => (
                  <li>
                    <Link href={`/brand/${b.name}`}>
                      <a>{b.name}</a>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </main>
      </div>
      <style jsx>{`
        main {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          min-width: 20rem;
          width: 100%;
          margin: 0;
        }

        .top {
          text-align: center;
          width: 100%;
        }

        .brands {
          font-size: 2rem;
        }

        ul {
          list-style: none;
        }

        h1 > a {
          color: #ffffff;
          text-decoration: none;
        }

        h1:hover {
          animation: shake 0.5s;
          animation-iteration-count: infinite;
        }

        .post {
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
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
    </Layout>
  );
};

export const getServerSideProps = async (context) => {
  // Fetch fits for this user and check against existing instagram
  const brands = await fetch(`${process.env.HOST}/api/brand`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: context.req.headers.cookie,
    },
  });
  let b = null;
  try {
    b = await brands.json();
  } catch (e) {
    console.log("error:", e.message);
  }

  return {
    props: { brands: b },
  };
};

export default BrandList;
