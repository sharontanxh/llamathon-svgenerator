import Image from "next/image";
import Link from "next/link";
import logo from "../public/llamination_logo.svg";

export default function Header() {
  return (
    <header className="relative mx-auto mt-5 flex-col w-full items-center justify-center px-2 pb-7 sm:px-4">
      <div className="text-center">
        <Link
          href="/"
          className="relative mt-4 flex w-full items-center justify-center gap-4 align-middle"
        >
          <Image alt="header text" src={logo} className="h-5 w-5" />
          <h1 className="text-3xl tracking-tight">
            <span className="text-green-600">Llam</span>ination
          </h1>
        </Link>
      </div>
      <div className="mt-2 flex flex-col items-center">
        <span className="mt-1 items-center rounded-[50px] border-[0.5px] border-solid border-[#E6E6E6] bg-[rgba(234,238,255,0.65)] bg-orange-100 px-3 py-1 text-sm shadow-[0px_1px_1px_0px_rgba(0,0,0,0.25)]">
          <span className="text-center">
            Powered by <span className="font-medium">Llama 3.1</span>
          </span>
        </span>
        <span className="mt-2 items-center rounded-[50px] border-[0.5px] border-solid border-[#E6E6E6] bg-[rgba(234,238,255,0.65)] bg-orange-100 px-3 py-1 text-sm shadow-[0px_1px_1px_0px_rgba(0,0,0,0.25)]">
          <span className="text-center">
            Forked from <a href="https://llamacoder.together.ai/" className="font-medium">LlamaCoder</a>
          </span>
        </span>
      </div>
    </header>
  );
}
