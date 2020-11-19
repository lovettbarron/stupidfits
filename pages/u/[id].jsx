import Head from "next/head";
import fetch from "isomorphic-unfetch";
// import { NextSeo } from "next-seo";
import Layout from "../../components/Layout";
import FitMini from "../../components/FitMini";
import { useSession, getSession } from "next-auth/client";
import Link from "next/link";
import { Tabs, Tab, FILL } from "baseui/tabs-motion";
import Anatomy from "../../components/Anatomy";
import ReviewBox from "../../components/ReviewBox";
import CollectionBox from "../../components/CollectionBox";
import { NextSeo } from "next-seo";
import { Button } from "baseui/button";

const UserProfile = (props) => {
  const [session, loading] = useSession();
  const [activeKey, setActiveKey] = React.useState("0");

  const getTopFit = props.fits
    .reverse()
    .find((f) => f.media[0] && f.media[0].cloudinary.length > 0);
  // console.log("GetTopFit", getTopFit);

  const brandKeywords = props.fits
    .map((f) => f.components.map((c) => c.brand.name))
    .flat();

  const getBrandKeywords = (count) => {
    let o = {};
    brandKeywords.forEach(function (item) {
      item in o ? (o[item] += 1) : (o[item] = 1);
    });
    const arr = Object.keys(o).sort(function (a, b) {
      return o[a] < o[b];
    });

    return arr.slice(0, count);
  };

  // console.log("Brand count", getBrandKeywords(3));

  const seourl =
    (getTopFit &&
      `https://res.cloudinary.com/stupidsystems/image/upload/${
        props.insta.hideface && `e_pixelate_faces:15/`
      }${getTopFit && getTopFit.media[0].cloudinary}.png`) ||
    "https://stupidfits.com/img/appicon.png";

  const seourlfb =
    (getTopFit &&
      `https://res.cloudinary.com/stupidsystems/image/upload/b_rgb:151515,${
        props.insta.hideface && `e_pixelate_faces:15,`
      }c_lpad,h_630,w_1200/${
        getTopFit && getTopFit.media[0].cloudinary
      }.png`) ||
    "https://stupidfits.com/img/appicon.png";

  if (!props.insta.profilepage) {
    return (
      <Layout>
        <NextSeo
          title={`${props.insta.username}'s Fits on Stupid Fits`}
          description={`Check out all of ${
            props.insta.username
          }'s fits on Stupid Fits from brands like ${getBrandKeywords(5).join(
            ", "
          )}`}
          canonical={`${process.env.HOST}/u/${props.insta.username}`}
          openGraph={{
            keywords: getBrandKeywords(10),
            url: `${process.env.HOST}/u/${props.insta.username}`,
            title: `${props.insta.username}'s Fits on Stupid Fits`,
            description: `Check out all of ${
              props.insta.username
            }'s fits on Stupid Fits from brands like ${getBrandKeywords(5).join(
              ", "
            )}`,
            type: "profile",
            profile: {
              username: props.insta.username,
            },
          }}
        />

        <div className="page">
          <main>
            <div className="top">
              <h1>{props.insta.username}</h1>
              <p>
                {props.insta.username}'s profile isn't public, but you can visit
                their instagram here if it is public.
              </p>
              <p>
                <a
                  href={`https://instagram.com/${props.insta.instagram}`}
                  target="_blank"
                >
                  Instagram.com/{props.insta.instagram}
                </a>
              </p>
            </div>
          </main>
        </div>
      </Layout>
    );
  } else
    return (
      <Layout>
        <NextSeo
          title={`${props.insta.username}'s Fits on Stupid Fits`}
          description={`Check out all of ${
            props.insta.username
          }'s fits on Stupid Fits from brands like ${getBrandKeywords(5).join(
            ", "
          )}`}
          canonical={`${process.env.HOST}/u/${props.insta.username}`}
          openGraph={{
            keywords: getBrandKeywords(10),
            url: `${process.env.HOST}/u/${props.insta.username}`,
            title: `${props.insta.username}'s Fits on Stupid Fits`,
            description: `Check out all of ${props.insta.username}'s fits on Stupid Fits`,
            description: `Check out all of ${
              props.insta.username
            }'s fits on Stupid Fits from brands like ${getBrandKeywords(5).join(
              ", "
            )}`,
            type: "profile",
            profile: {
              username: props.insta.username,
            },
            images: [
              {
                url: seourlfb,
                width: 1200,
                height: 630,
                type: "image/png",
                alt: `${props.insta.username}'s Fits on Stupid Fits`,
              },
              {
                url: seourl,
                width: 1200,
                height: 1200,
                type: "image/png",
                alt: `${props.insta.username}'s Fits on Stupid Fits`,
              },
            ],
          }}
          twitter={{
            image: seourlfb,
            cardType: "summary_large_image",
          }}
        />
        <Head>
          <link
            rel="alternate"
            type="application/json+oembed"
            href={`${process.env.HOST}/api/embed?url=${process.env.HOST}/u/${props.insta.username}`}
            title={`${props.insta.username}'s fits on Stupid Fits`}
            key="oembed"
          />
        </Head>

        <div className="page">
          <main>
            <div className="top">
              <h1>{props.insta.username}</h1>
              {session && session.user.id === props.insta.id && (
                <>
                  <Link href={`/me`}>
                    <a>
                      <Button>Edit My Settings</Button>
                    </a>
                  </Link>
                  <br />
                  <br />
                </>
              )}
              <div className="grid">
                <div className="col">
                  <p>
                    {props.insta.style ||
                      `Welcome to ${props.insta.username}'s closet.`}
                  </p>
                  {props.insta.description && (
                    <>
                      <p className="small">{props.insta.description}</p>
                    </>
                  )}
                </div>
                <div className="col">
                  {" "}
                  <p>
                    {props.insta.url && (
                      <a href={props.insta.url}>
                        {props.insta.urllabel || props.insta.url}
                      </a>
                    )}
                  </p>
                  {props.insta.instagram && (
                    <p>
                      <a
                        href={`https://instagram.com/${props.insta.instagram}`}
                      >
                        IG: @{props.insta.instagram}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Tabs
              activeKey={activeKey}
              fill={FILL.fixed}
              onChange={({ activeKey }) => {
                setActiveKey(activeKey);
              }}
              activateOnFocus
              renderAll
            >
              <Tab title="Fits">
                <div className="flex">
                  {props.fits
                    .sort((a, b) => {
                      return b.media[0].timestamp - a.media[0].timestamp;
                    })
                    .map((fit) => (
                      <FitMini
                        key={fit.id}
                        {...fit}
                        username={props.insta.username}
                      />
                    ))}
                </div>
              </Tab>
              {props.reviews && props.reviews.length > 0 && (
                <Tab title="Reviews">
                  <div className="reviews">
                    {props.reviews &&
                      Array.isArray(props.reviews) &&
                      props.reviews
                        .sort((a, b) => {
                          return b.createdAt - a.createdAt;
                        })
                        .map((r) => <ReviewBox key={r.id} {...r} />)}
                  </div>
                </Tab>
              )}
              {props.collections && props.collections.length > 0 && (
                <Tab title="Collections">
                  <div className="reviews">
                    {props.collections &&
                      Array.isArray(props.collections) &&
                      props.collections
                        .sort((a, b) => {
                          return b.createdAt - a.createdAt;
                        })
                        .map((c) => <CollectionBox key={c.id} {...c} />)}
                  </div>
                </Tab>
              )}
              {!props.insta.hidecloset && (
                <Tab title="Closet">
                  <div>
                    {props.closet && (
                      <div className="closet">
                        <Anatomy
                          nocomment={true}
                          components={props.closet.sort(function (a, b) {
                            var textA = a.brand.name.toUpperCase();
                            var textB = b.brand.name.toUpperCase();
                            return textA < textB ? -1 : textA > textB ? 1 : 0;
                          })}
                        />
                      </div>
                    )}
                  </div>
                </Tab>
              )}
            </Tabs>
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

          .reviews {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            width: 100%;
          }

          .flex {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
          }

          p {
            margin: 1rem auto;
          }

          .top {
            text-align: center;
            width: 100%;
          }

          .closet {
            font-size: 2rem;
            padding: 0;
          }

          .closet ul {
            list-style: none;
            padding: 0;
          }

          .closet li {
            padding: 0;
            margin: 0;
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
  // export async function getServerSideProps(context) {
  // const session = await getSession(context);

  // Get user and instagram username
  const res = await fetch(`${process.env.HOST}/api/user/${context.params.id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: context.req.headers.cookie,
    },
  });

  let user;

  try {
    user = await res.json();
  } catch (e) {
    console.log("error:", e.message);
    if (context.res) {
      context.res.writeHead(302, { Location: `/` });
      context.res.end();
    }
    return {};
  }

  // Get User's Items
  const resc = await fetch(`${process.env.HOST}/api/item?id=${user.id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: context.req.headers.cookie,
    },
  });
  let closet;
  try {
    closet = await resc.json();
  } catch (e) {
    console.log("error:", e.message);
  }

  // Fetch fits for this user and check against existing instagram
  const fitres = await fetch(`${process.env.HOST}/api/feed/${user.id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: context.req.headers.cookie,
    },
  });
  let fits = null;
  try {
    fits = await fitres.json();
  } catch (e) {
    console.log("error:", e.message);
  }

  return {
    props: {
      insta: user,
      reviews: user.Review.filter((f) =>
        ["FEATURED", "PUBLIC"].includes(f.status)
      ),
      collections: user.Collection.filter((f) => f.published),
      fits: fits,
      closet: closet,
    },
  };
};

export default UserProfile;
