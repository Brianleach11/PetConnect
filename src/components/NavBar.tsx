import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "./ui/button";

const NavBar = () => {
    return (
      <>
        <div className='fixed top-0 inset-x-0 h-fit bg-softGreen border-b border-zinc-300 z-[10] py-2'>
          <div className='container max-w-7xl h-full mx-auto flex items-center justify-between gap-2'>
            <Link href='/' className='flex gap-2 items-center'>
              <Image src="/assets/logo.png" width={75} height={75} alt="Logo"/>
              <p className='hidden text-zinc-700 text-3xl font-large font-bold md:block'>Pet Connect</p>
            </Link>
            <Link href="/hello" className={buttonVariants()}>Hello!</Link>
          </div>
        </div>
      </>
    );
  };
  
export default NavBar;