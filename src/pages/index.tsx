import { Button } from "~/components/ui/button";
import { NextSeo } from "next-seo";

export default function Home() {
  return (
    <div className="mx-auto max-w-screen-md px-2">
      <NextSeo
        title="Farcaster Apps"
        description="Some open source apps for Farcaster created by Haole"
      />
      <div className="mt-12 flex flex-col items-center justify-center">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://warpcast.com/haole"
          className="mt-20 hover:text-[#8a63D2]"
        >
          Recaster@{new Date().getFullYear()} - Made with ❤️ by Haole
        </a>
      </div>
    </div>
  );
}
