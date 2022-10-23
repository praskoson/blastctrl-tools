import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Tools | Blast Ctrl - Home</title>
        <meta name="description" content="Home Navigation" />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
