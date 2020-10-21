import Head from "next/head";
import fetch from "isomorphic-unfetch";
// import { NextSeo } from "next-seo";
import Layout from "../../components/Layout";
import FitBox from "../../components/FitBox";
import { useSession, getSession } from "next-auth/client";
import Link from "next/link";
import { Tabs, Tab, FILL } from "baseui/tabs-motion";
import Anatomy from "../../components/Anatomy";
import { NextSeo } from "next-seo";

const UserProfile = (props) => {
  const [activeKey, setActiveKey] = React.useState("0");

  const seourl =
    (Array.isArray(props.fits) &&
      props.fits.length > 0 &&
      `https://res.cloudinary.com/stupidsystems/image/upload/${props.fits[0].media.cloudinary}.png`) ||
    "";

  const seourlfb =
    (Array.isArray(props.fits) &&
      props.fits.length > 0 &&
      `https://res.cloudinary.com/stupidsystems/image/upload/b_rgb:151515,c_lpad,h_630,w_1200/${props.fits[0].media.cloudinary}.png`) ||
    "";

  if (!props.insta.profilepage) {
    return (
      <Layout>
        <NextSeo
          title={`${props.insta.username}'s Fits on Stupid Fits`}
          description={`Check out all of ${props.insta.username}'s fits on Stupid Fits`}
          openGraph={{
            url: `${process.env.HOST}/u/${props.insta.username}`,
            title: `${props.insta.username}'s Fits on Stupid Fits`,
            description: `Check out all of ${props.insta.username}'s fits on Stupid Fits`,
            type: "profile",
            profile: {
              username: props.insta.username,
            },
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
          description={`Check out all of ${props.insta.username}'s fits on Stupid Fits`}
          openGraph={{
            url: `${process.env.HOST}/u/${props.insta.username}`,
            title: `${props.insta.username}'s Fits on Stupid Fits`,
            description: `Check out all of ${props.insta.username}'s fits on Stupid Fits`,
            type: "profile",
            profile: {
              username: props.insta.username,
            },
            images: [
              {
                url: seourl,
                width: 1200,
                height: 1200,
                alt: "Og Image",
              },
              {
                url: seourlfb,
                width: 1200,
                height: 630,
                alt: "Og Image Alt Second",
              },
            ],
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
              <p>Welcome to {props.insta.username}'s closet.</p>
              <p>
                <a href={`https://instagram.com/${props.insta.instagram}`}>
                  Instagram
                </a>
              </p>
            </div>

            <Tabs
              activeKey={activeKey}
              fill={FILL.fixed}
              onChange={({ activeKey }) => {
                setActiveKey(activeKey);
              }}
              activateOnFocus
            >
              <Tab title="Fits">
                {" "}
                {props.fits
                  .sort((a, b) => {
                    return b.media.timestamp - a.media.timestamp;
                  })
                  .map((fit) => (
                    <FitBox
                      key={fit.id}
                      {...fit}
                      username={props.insta.username}
                    />
                  ))}
              </Tab>
              <Tab title="Closet">
                {" "}
                {props.closet && (
                  <div className="closet">
                    <Anatomy nocomment={true} components={props.closet} />
                  </div>
                )}
              </Tab>
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
  const session = await getSession(context);

  // Get user and instagram username
  const res = await fetch(`${process.env.HOST}/api/user/${context.params.id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: context.req.headers.cookie,
    },
  });
  const user = await res.json();

  if (!user) {
    res.statusCode = 302;
    res.setHeader("Location", `/`); // Replace <link> with your url link
    return { props: {} };
  }

  // Get User's Items
  const resc = await fetch(`${process.env.HOST}/api/item?id=${user.username}`, {
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
    props: { insta: user, fits: fits, closet: closet },
  };
};

export default UserProfile;
