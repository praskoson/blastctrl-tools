import { FC } from 'react';
import Link from "next/link";

export const ContentContainer: FC = props => {
  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {props.children}
      </div>

      {/* SideBar / Drawer */}
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="p-4 overflow-y-auto menu w-80 bg-base-100">
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
  );
};
