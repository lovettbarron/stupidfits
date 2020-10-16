import fetch from "isomorphic-unfetch";
import { NextSeo } from "next-seo";
import Layout from "../../components/Layout";
import FitBox from "../../components/FitBox";
import { useSession, getSession } from "next-auth/client";
import Link from "next/link";
import { Tabs, Tab, FILL } from "baseui/tabs-motion";
import { Cap } from "../../components/Anatomy";

const BrandFilter = ({ items, filter }) => {
  if (!filter)
    return (
      <>
        {items.map((i) => (
          <>
            <h3>{i.name}</h3>
            {i.fit && i.fit.map((f) => <FitBox {...f} fit={f.id} />)}
          </>
        ))}
      </>
    );

  const filtered = items.filter((f) => f.type === filter);

  if (filtered.length <= 0) return <div>Nothing yet</div>;

  return (
    <>
      {items.map((i) => (
        <>
          <h3>{i.name}</h3>
          {i.fit && i.fit.map((f) => <FitBox {...f} fit={f.id} />)}
        </>
      ))}
    </>
  );
};

const BrandProfile = (props) => {
  const [activeKey, setActiveKey] = React.useState("0");

  const seourl =
    (Array.isArray(props.fits) &&
      props.fits.length > 0 &&
      `https://res.cloudinary.com/stupidsystems/image/upload/${props.fits[0].media.cloudinary}`) ||
    "";

  return (
    <Layout>
      <div className="page">
        <main>
          <div className="top">
            <h1>
              <Link href="/">
                <a>Stupid Fits</a>
              </Link>
            </h1>
            <p>{Cap(props.brand.name)} fits on Stupidfits.</p>
            <small>
              {" "}
              <Link href="/brand">
                <a>View all brands</a>
              </Link>
            </small>
          </div>
          <Tabs
            activeKey={activeKey}
            fill={FILL.fixed}
            onChange={({ activeKey }) => {
              setActiveKey(activeKey);
            }}
            activateOnFocus
          >
            <Tab title="All">
              <BrandFilter items={props.brand.items} />
            </Tab>
            {props.brand.items.filter((t) => t.type === "CARRY").length >=
              1 && (
              <Tab title="Carry">
                <BrandFilter items={props.brand.items} filter={"CARRY"} />
              </Tab>
            )}
            {props.brand.items.filter((t) => t.type === "JACKET").length >=
              1 && (
              <Tab title="Outerwear">
                <BrandFilter items={props.brand.items} filter={"JACKET"} />
              </Tab>
            )}
            {props.brand.items.filter((t) => t.type === "LAYER").length >=
              1 && (
              <Tab title="Layer">
                <BrandFilter items={props.brand.items} filter={"LAYER"} />
              </Tab>
            )}
            {props.brand.items.filter((t) => t.type === "SHIRT").length >=
              1 && (
              <Tab title="Shirt">
                <BrandFilter items={props.brand.items} filter={"SHIRT"} />
              </Tab>
            )}
            {props.brand.items.filter((t) => t.type === "PANT").length >= 1 && (
              <Tab title="Bottom">
                <BrandFilter items={props.brand.items} filter={"PANT"} />
              </Tab>
            )}
            {props.brand.items.filter((t) => t.type === "SHOE").length >= 1 && (
              <Tab title="Shoe">
                <BrandFilter items={props.brand.items} filter={"SHOE"} />
              </Tab>
            )}
            {props.brand.items.filter((t) => t.type === "EXTRA").length >=
              1 && (
              <Tab title="Extra">
                <BrandFilter items={props.brand.items} filter={"EXTRA"} />
              </Tab>
            )}
          </Tabs>
          <ul>
            {props.brand.items.map((i) => (
              <li>{i.model}</li>
            ))}
          </ul>
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

        .closet {
          font-size: 2rem;
        }

        .closet ul {
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
  const brand = await fetch(
    `${process.env.HOST}/api/brand/${context.params.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: context.req.headers.cookie,
      },
    }
  );
  let b = null;
  try {
    b = await brand.json();
  } catch (e) {
    console.log("error:", e.message);
  }

  return {
    props: { brand: b },
  };
};

export default BrandProfile;
