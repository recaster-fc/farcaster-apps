import { Button } from "~/components/ui/button";
import { NextSeo } from "next-seo";

const data = [
  {
    name: "Cast AI Editor",
    href: "https://warpcast.com/~/developers/composer-actions?name=Cast+AI+editor&postUrl=https%3A%2F%2Fapps.recaster.org%2Fapi%2Feditor",
    logo: "/_images/editor.png",
  },
  {
    name: "Farcaster Notcoin",
    href: "https://warpcast.com/~/developers/composer-actions?name=Farcaster+Notcoin&postUrl=https%3A%2F%2Fapps.recaster.org%2Fapi%2Fnotcoin",
    logo: "/_images/coin.png",
  },
];
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col px-2">
      <NextSeo
        title="Farcaster Apps"
        description="Some open source apps for Farcaster created by Haole"
      />
      <div className="absolute right-0 top-0 p-4">
        <a href="https://github.com/recaster-fc/farcaster-apps" target="_blank">
          <img src="/_images/github.png" className="h-12 w-12 rounded-full" />
        </a>
      </div>
      <div className="mx-auto max-w-screen-md flex-1">
        <div className="mt-8 text-center md:mt-12">
          <h1 className="bg-gradient-to-r from-pink-500 via-red-600 to-orange-400 bg-clip-text text-4xl font-bold text-transparent">
            Farcaster Composer Action Demo
          </h1>
        </div>

        <div className="mt-20 grid grid-cols-2">
          {data.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              className="flex flex-col items-center justify-center rounded-md p-4 hover:bg-muted"
            >
              <img src={item.logo} alt={item.name} className="h-20 w-20" />
              <Button className="mt-4 text-lg font-bold" variant={"link"}>
                {item.name}
              </Button>
            </a>
          ))}
        </div>
      </div>
      <div className="flex flex-row items-center justify-center py-2">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://recaster.org"
          className="mt-20 hover:text-[#8a63D2]"
        >
          Recaster@{new Date().getFullYear()} - Made with ❤️ by Haole
        </a>
      </div>
    </div>
  );
}
