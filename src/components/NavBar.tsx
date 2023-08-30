import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "./ui/button";

const NavBar = () => {
  return (
    <>
      <div className="fixed top-0 inset-x-0 h-fit bg-softGreen border-b border-zinc-300 z-[10] py-2">
        <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
          <Link href="/">
            <a className="flex gap-2 items-center">
              <Image src="/assets/logo.png" width={75} height={75} alt="Logo" />
              <p className="hidden text-zinc-700 text-3xl font-large font-bold md:block">Pet Connect</p>
            </a>
          </Link>
          <Link href="/pets">
            <a className={`hover:bg-gray-300 focus:bg-gray-400 active:bg-gray-500 ${buttonVariants({variant: "ghost"})}`}>Pets</a>
          </Link>
          <Link href="/maps">
            <a className={`hover:bg-gray-300 focus:bg-gray-400 active:bg-gray-500 ${buttonVariants({variant: "ghost"})}`}>Maps</a>
          </Link>
          <Link href="/messages">
            <a className={`hover:bg-gray-300 focus:bg-gray-400 active:bg-gray-500 ${buttonVariants({variant: "ghost"})}`}>Messages</a>
          </Link>
          <Link href="/api/auth/signin">
            <a className={`hover:bg-gray-300 focus:bg-gray-400 active:bg-gray-500 ${buttonVariants()}`}>Sign In</a>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NavBar;
