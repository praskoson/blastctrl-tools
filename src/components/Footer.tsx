import Image from "next/image";
import BlastCtrlIconWhite from "../../public/blastctrl_icon_white.svg";
import BlastCtrlIconRed from "../../public/blastctrl_icon.svg";

export const Footer = () => {
  // return (
  //   <footer className="footer bg-neutral px-6 py-2 text-neutral-content sm:p-6">
  //     <div className="mx-auto flex w-full max-w-7xl items-center justify-between ">
  //       <a href="https://blastctrl.com" target="_blank" rel="noopener noreferrer">
  //         <div className="h-20 w-20 sm:h-28 sm:w-28">
  //           <Image src="/blastctrl_full_icon.svg" height={120} width={120} alt="logo" />
  //         </div>
  //         <p className="hidden font-light tracking-wide lg:block">
  //           Keeping you in control since 2021
  //         </p>
  //       </a>
  //       <div className="sm:justify-self-center">
  //         <span className="mb-2 block font-bold uppercase opacity-50">Socials</span>
  //         <div className="flex gap-x-4">
  //           <a
  //             href="https://twitter.com/BlastCtrl"
  //             target="_blank"
  //             rel="noopener noreferrer"
  //             className="hover:cursor-pointer"
  //           >
  //             <svg
  //               xmlns="http://www.w3.org/2000/svg"
  //               width="24"
  //               height="24"
  //               viewBox="0 0 24 24"
  //               className="fill-current hover:fill-primary"
  //             >
  //               <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
  //             </svg>
  //           </a>
  //           <a
  //             href="https://discord.gg/KHar5PyXtE"
  //             target="_blank"
  //             rel="noopener noreferrer"
  //             className="hover:cursor-pointer"
  //           >
  //             <svg
  //               xmlns="http://www.w3.org/2000/svg"
  //               width="24"
  //               height="24"
  //               viewBox="0 0 16 16"
  //               className="fill-current hover:fill-primary"
  //             >
  //               <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" />
  //             </svg>
  //           </a>
  //           <a
  //             href="https://t.me/BlastCtrl"
  //             target="_blank"
  //             rel="noopener noreferrer"
  //             className="hover:cursor-pointer"
  //           >
  //             <svg
  //               xmlns="http://www.w3.org/2000/svg"
  //               width="24"
  //               height="24"
  //               viewBox="0 0 24 24"
  //               className="fill-current hover:fill-primary"
  //             >
  //               <path
  //                 clipRule="evenodd"
  //                 d="m24 12c0 6.6274-5.3726 12-12 12-6.62742 0-12-5.3726-12-12 0-6.62742 5.37258-12 12-12 6.6274 0 12 5.37258 12 12zm-11.57-3.14107c-1.1671.48547-3.49985 1.49027-6.99809 3.01437-.56806.2259-.86563.4469-.89272.663-.04579.3652.41154.509 1.0343.7048.08471.0267.17249.0543.26247.0835.6127.1992 1.43688.4322 1.86535.4414.38865.0084.82244-.1518 1.30135-.4807 3.26854-2.2063 4.95574-3.32149 5.06164-3.34553.0748-.01696.1783-.03829.2485.02408.0701.06235.0633.18045.0558.21215-.0453.1931-1.8405 1.8621-2.7695 2.7258-.2896.2692-.495.4602-.537.5038-.0941.0978-.19.1902-.2821.279-.5692.5487-.99607.9602.0236 1.6322.4901.3229.8822.5899 1.2734.8563.4272.291.8533.5812 1.4046.9426.1405.0921.2746.1877.4053.2808.4972.3545.9439.6729 1.4957.6221.3207-.0295.6519-.331.8201-1.2302.3975-2.1252 1.1789-6.7299 1.3595-8.62742.0159-.16625-.004-.37901-.02-.4724-.016-.0934-.0494-.22647-.1708-.32498-.1438-.11666-.3657-.14126-.465-.13952-.4514.00796-1.1438.24874-4.4764 1.63485z"
  //                 fillRule="evenodd"
  //               />
  //             </svg>
  //           </a>
  //         </div>
  //       </div>
  //       <div className="hidden flex-shrink-0 grid-flow-col gap-4 pr-2 text-center sm:block sm:justify-self-end">
  //         <div>
  //           <p className="mb-4 cursor-default text-base font-light text-white">Powered by</p>
  //           <a
  //             rel="noreferrer"
  //             href="https://solana.com/"
  //             target="_blank"
  //             className="hover:text-primary-dark text-base font-bold text-white transition-all duration-200"
  //           >
  //             <Image
  //               src={SolanaLogoFull}
  //               height={32}
  //               width={220}
  //               className="flex-shrink-0 object-cover"
  //               alt="Solana"
  //             />
  //           </a>
  //         </div>
  //       </div>
  //     </div>
  //   </footer>

  return (
    <footer className="flex flex-col items-center justify-center bg-neutral py-3 text-neutral-content">
      <div className="mx-0 my-2 mt-4 flex gap-x-4">
        <a
          href="https://blastctrl.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group hover:cursor-pointer"
        >
          <div className="block group-hover:hidden">
            <Image
              unoptimized={true}
              src={BlastCtrlIconWhite}
              height="24"
              width="24"
              alt="BlastCtrl"
            />
          </div>
          <div className="hidden group-hover:block">
            <Image
              unoptimized={true}
              src={BlastCtrlIconRed}
              height="24"
              width="24"
              alt="BlastCtrl"
            />
          </div>
        </a>
        <a
          href="https://twitter.com/BlastCtrl"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="fill-current hover:fill-primary"
          >
            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
          </svg>
        </a>
        <a
          href="https://discord.gg/KHar5PyXtE"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 16 16"
            className="fill-current hover:fill-primary"
          >
            <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" />
          </svg>
        </a>
        <a
          href="https://t.me/BlastCtrl"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="fill-current hover:fill-primary"
          >
            <path
              clipRule="evenodd"
              d="m24 12c0 6.6274-5.3726 12-12 12-6.62742 0-12-5.3726-12-12 0-6.62742 5.37258-12 12-12 6.6274 0 12 5.37258 12 12zm-11.57-3.14107c-1.1671.48547-3.49985 1.49027-6.99809 3.01437-.56806.2259-.86563.4469-.89272.663-.04579.3652.41154.509 1.0343.7048.08471.0267.17249.0543.26247.0835.6127.1992 1.43688.4322 1.86535.4414.38865.0084.82244-.1518 1.30135-.4807 3.26854-2.2063 4.95574-3.32149 5.06164-3.34553.0748-.01696.1783-.03829.2485.02408.0701.06235.0633.18045.0558.21215-.0453.1931-1.8405 1.8621-2.7695 2.7258-.2896.2692-.495.4602-.537.5038-.0941.0978-.19.1902-.2821.279-.5692.5487-.99607.9602.0236 1.6322.4901.3229.8822.5899 1.2734.8563.4272.291.8533.5812 1.4046.9426.1405.0921.2746.1877.4053.2808.4972.3545.9439.6729 1.4957.6221.3207-.0295.6519-.331.8201-1.2302.3975-2.1252 1.1789-6.7299 1.3595-8.62742.0159-.16625-.004-.37901-.02-.4724-.016-.0934-.0494-.22647-.1708-.32498-.1438-.11666-.3657-.14126-.465-.13952-.4514.00796-1.1438.24874-4.4764 1.63485z"
              fillRule="evenodd"
            />
          </svg>
        </a>
      </div>
      <p className="font-sans text-sm font-light text-gray-300">
        Copyright &copy; 2022 &bull; BlastCtrl
      </p>
    </footer>
  );
};
