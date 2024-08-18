import Image from "next/image";
import Link from "next/link";

import logo from "@/assets/yellow-logo.svg";
import UserButton from "./UserButton";
import SearchField from "./SearchField";

export default function Navbar() {
  return (
    <header className="sticky top-0 sm:top-4 z-40 flex-none w-full max-w-7xl mx-auto backdrop-blur transition-colors duration-500 h-20 bg-card/60 sm:rounded-full shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-5 px-5 py-3">
        <Link href="/">
          <Image
            src={logo}
            alt="Logo"
            width={140}
            height={40}
            className="-rotate-6"
          />
        </Link>
        <div className="flex items-center space-x-4">
          <SearchField className="border ps-3 pe-0 md:pe-10 placeholder:text-transparent focus:placeholder:text-gray-400 md:placeholder:text-gray-400 placeholder:font-light size-9 focus:w-40 cursor-pointer focus:cursor-text md:w-40 md:h-9 md:focus:w-60 transition-all outline-none duration-300 rounded-full" />
          <UserButton />
        </div>
      </div>
    </header>
  );
}
