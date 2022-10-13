import { AppProps } from "next/app";
import Head from "next/head";
import { FC } from "react";
import { ContextProvider } from "../contexts/ContextProvider";
import { AppBar } from "../components/AppBar";
import { Footer } from "../components/Footer";
import Notifications from "../components/Notification";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import Link from "next/link";
// import { Breadcrumbs } from 'components/Breadcrumbs';

dayjs.extend(relativeTime);
require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>BlastCtrl Tools</title>
      </Head>

      <ContextProvider>
        <div className="flex h-screen flex-col">
          <Notifications />
          <AppBar />
          {/* <Breadcrumbs /> */}
          <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              <Component {...pageProps} />
            </div>

            {/* SideBar / Drawer */}
            <div className="drawer-side">
              <label htmlFor="my-drawer" className="drawer-overlay"></label>
              <ul className="menu w-80 overflow-y-auto bg-base-100 p-4">
                <li>
                  <h1>Menu</h1>
                </li>
                <li>
                  <Link href="/">
                    <a>Home</a>
                  </Link>
                </li>
                <li>
                  <Link href="/collections">
                    <a>Collections</a>
                  </Link>
                </li>
                <li>
                  <Link href="/arweave">
                    <a>Arweave</a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* <Footer></Footer> */}
      </ContextProvider>
    </>
  );
};

export default App;
