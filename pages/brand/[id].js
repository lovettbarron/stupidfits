import fetch from "isomorphic-unfetch";
import Layout from "../../components/Layout";
import FitBox from "../../components/FitBox";
import { useSession, getSession } from "next-auth/client";
import Link from "next/link";
import { Navigation } from "baseui/side-navigation";
import { Tabs, Tab, FILL } from "baseui/tabs-motion";
import { Cap } from "../../components/Anatomy";
import { NextSeo } from "next-seo";

const BrandFilter = ({ items, filter, modelid }) => {
  const it = modelid ? items.filter((i) => i.id === modelid) : items;
  if (!filter)
    return (
      <>
        <div className="items">
          {it.map((i) => (
            <React.Fragment key={i.id}>
              <h3>{i.model}</h3>
              {i.fit &&
                i.fit.map((f) => <FitBox key={f.id} {...f} fit={f.id} />)}
            </React.Fragment>
          ))}
        </div>
        <style jsx>{`
          .items {
            max-width: 80%;
          }
        `}</style>
      </>
    );

  const filtered = it.filter((f) => f.type === filter);

  if (filtered.length <= 0) return <div>Nothing yet</div>;

  return (
    <>
      <div className="items">
        {filtered.map((i) => (
          <>
            <h3>{i.model}</h3>
            {i.fit && i.fit.map((f) => <FitBox key={f.id} {...f} fit={f.id} />)}
          </>
        ))}
      </div>
      <style jsx>{`
        .items {
          max-width: 80%;
        }
      `}</style>
    </>
  );
};

const Nav = ({ items, setActiveItemId, activeItemId, filter }) => {
  const it = filter ? items.filter((f) => f.type === filter) : items;
  return (
    <>
      <div className="nav">
        <Navigation
          items={it
            .sort(function (a, b) {
              var textA = a.model.toUpperCase();
              var textB = b.model.toUpperCase();
              return textA < textB ? -1 : textA > textB ? 1 : 0;
            })
            .map((i) => ({
              title: i.model,
              itemId: i.id,
              disabled: i.fit.length < 1,
            }))}
          activeItemId={activeItemId}
          onChange={({ event, item }) => {
            // prevent page reload
            event.preventDefault();
            setActiveItemId(item.itemId);
          }}
        />
      </div>
      <style jsx>{`
        .nav {
          max-width: 20%;
          text-align: left;
          margin: 0 1rem 0 0;
        }

        @media screen and (max-width: 800px) {
          .withside {
            flex-wrap: wrap;
          }
          .nav {
            max-width: 100% !important;
          }
        }
      `}</style>
    </>
  );
};

const TabContent = ({ setActiveItemId, activeItemId, items, filter }) => (
  <>
    <div className="withside">
      <Nav
        filter={filter}
        setActiveItemId={setActiveItemId}
        activeItemId={activeItemId}
        items={items}
      />
      <BrandFilter items={items} filter={filter} modelid={activeItemId} />
    </div>
    <style jsx>{`
      .items {
        max-width: 80%;
      }

      .withside {
        width: 100%;
        display: flex;
        flex-wrap: none;
        flex: 1 1 0;
      }

      .nav {
        max-width: 30%;
        margin: 0 1rem 0 0;
      }
    `}</style>
  </>
);

const BrandProfile = (props) => {
  const [activeKey, setActiveKey] = React.useState("0");
  const [activeItemId, setActiveItemId] = React.useState(null);

  const getFits = props.brand.items.map((i) => i.fit).flat();

  const getTopFit = getFits.find(
    (f) => f.media && f.media[0].cloudinary.length > 0
  );

  const seourl =
    (getTopFit &&
      `https://res.cloudinary.com/stupidsystems/image/upload/${
        getTopFit && getTopFit.media[0].cloudinary
      }.png`) ||
    "https://stupidfits.com/img/appicon.png";
  const seourlfb =
    (getTopFit &&
      `https://res.cloudinary.com/stupidsystems/image/upload/b_rgb:151515,c_lpad,h_630,w_1200/${
        getTopFit && getTopFit.media[0].cloudinary
      }.png`) ||
    "https://stupidfits.com/img/appicon.png";

  return (
    <Layout>
      <NextSeo
        title={`${Cap(props.brand.name)} fits on Stupidfits.`}
        description={`All the ${Cap(props.brand.name)} fits on Stupid Fits`}
        canonical={`${process.env.HOST}/brand/${props.brand.name}`}
        openGraph={{
          keywords: props.brand.name,
          url: `${process.env.HOST}/brand/${props.brand.name}`,
          title: `${props.brand.name} Fits on Stupid Fits`,
          description: `All the ${Cap(props.brand.name)} fits on Stupid Fits`,
          type: "website",
          images: [
            {
              url: seourlfb,
              width: 1200,
              height: 630,
              type: "image/png",
              alt: `${props.brand.name} Fits on Stupid Fits`,
            },
            {
              url: seourl,
              width: 1200,
              height: 1200,
              type: "image/png",
              alt: `${props.brand.name} Fits on Stupid Fits`,
            },
          ],
        }}
        twitter={{
          image: seourlfb,
          cardType: "summary_large_image",
        }}
      />
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
              <TabContent
                setActiveItemId={setActiveItemId}
                activeItemId={activeItemId}
                items={props.brand.items}
                filter={null}
              />
            </Tab>
            {props.brand.items.filter((t) => t.type === "CARRY").length >=
              1 && (
              <Tab title="Carry">
                <TabContent
                  setActiveItemId={setActiveItemId}
                  activeItemId={activeItemId}
                  items={props.brand.items}
                  filter={"CARRY"}
                />
              </Tab>
            )}
            {props.brand.items.filter((t) => t.type === "JACKET").length >=
              1 && (
              <Tab title="Outerwear">
                <TabContent
                  setActiveItemId={setActiveItemId}
                  activeItemId={activeItemId}
                  items={props.brand.items}
                  filter={"JACKET"}
                />
              </Tab>
            )}
            {props.brand.items.filter((t) => t.type === "LAYER").length >=
              1 && (
              <Tab title="Layer">
                <TabContent
                  setActiveItemId={setActiveItemId}
                  activeItemId={activeItemId}
                  items={props.brand.items}
                  filter={"LAYER"}
                />
              </Tab>
            )}
            {props.brand.items.filter((t) => t.type === "SHIRT").length >=
              1 && (
              <Tab title="Shirt">
                <TabContent
                  setActiveItemId={setActiveItemId}
                  activeItemId={activeItemId}
                  items={props.brand.items}
                  filter={"SHIRT"}
                />
              </Tab>
            )}
            {props.brand.items.filter((t) => t.type === "PANT").length >= 1 && (
              <Tab title="Bottom">
                <TabContent
                  setActiveItemId={setActiveItemId}
                  activeItemId={activeItemId}
                  items={props.brand.items}
                  filter={"PANT"}
                />
              </Tab>
            )}
            {props.brand.items.filter((t) => t.type === "SHOE").length >= 1 && (
              <Tab title="Shoe">
                <TabContent
                  setActiveItemId={setActiveItemId}
                  activeItemId={activeItemId}
                  items={props.brand.items}
                  filter={"SHOE"}
                />
              </Tab>
            )}
            {props.brand.items.filter((t) => t.type === "EXTRA").length >=
              1 && (
              <Tab title="Extra">
                <TabContent
                  setActiveItemId={setActiveItemId}
                  activeItemId={activeItemId}
                  items={props.brand.items}
                  filter={"EXTRA"}
                />
              </Tab>
            )}
          </Tabs>
        </main>
      </div>
      <style jsx>{`
        main {
          justify-content: center;
          min-width: 20rem;
          width: 100%;
          margin: 0;
        }

        .withside {
          width: 100%;
          display: flex;
          flex-wrap: none;
          flex: 1 1 0;
        }

        .nav {
          max-width: 30%;
          margin: 0 1rem 0 0;
        }

        .tabs {
          max-width: 80%;
        }

        @media screen and (max-width: 800px) {
          .withside {
            flex-wrap: wrap;
          }
          .nav {
            max-width: 100% !important;
          }
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
    if (context.res) {
      context.res.writeHead(302, { Location: `/brand` });
      context.res.end();
    }
    return {};
  }

  return {
    props: { brand: b },
  };
};

export default BrandProfile;
