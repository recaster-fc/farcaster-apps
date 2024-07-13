import { useEffect, useState } from "react";
// dynamic imports are not supported in Next.js
import dynamic from "next/dynamic";

const Arrow = dynamic(() => import("~/icons/Arrow"), {
  loading: () => <p>Loading...</p>,
});

export default function NotCoinPage() {
  const [points, setPoints] = useState(0);
  const [energy, setEnergy] = useState(3000);
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>(
    [],
  );
  const pointsToAdd = 12;
  const energyToReduce = 12;

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (energy - energyToReduce < 0) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPoints(points + pointsToAdd);
    setEnergy(energy - energyToReduce < 0 ? 0 : energy - energyToReduce);
    setClicks([...clicks, { id: Date.now(), x, y }]);
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter((click) => click.id !== id));
  };

  // useEffect hook to restore energy over time
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prevEnergy) => Math.min(prevEnergy + 1, 6500));
    }, 100); // Restore 10 energy points every second

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  return (
    <div className="bg-gradient-main flex min-h-screen flex-col items-center px-4 font-medium text-white">
      <div className="bg-gradient-overlay absolute inset-0 z-0 h-1/2"></div>
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="radial-gradient-overlay"></div>
      </div>

      <div className="z-10 flex min-h-screen w-full flex-col items-center text-white">
        <div className="fixed left-0 top-0 z-10 flex w-full flex-col items-center px-4 pt-8 text-white">
          <div className="w-full cursor-pointer">
            <div className="rounded-xl bg-[#1f1f1f] py-2 text-center">
              <p className="text-lg">
                Join Warpcast{" "}
                <Arrow size={18} className="mb-1 ml-0 inline-block" />
              </p>
            </div>
          </div>
          <div className="mt-12 flex items-center text-5xl font-bold">
            <img src={"/_images/coin.png"} width={44} height={44} />
            <span className="ml-2">{points.toLocaleString()}</span>
          </div>
          <div className="mt-2 flex items-center text-base">
            <img src={"/_images/trophy.png"} width={24} height={24} />
            <span className="ml-1">
              Gold <Arrow size={18} className="mb-1 ml-0 inline-block" />
            </span>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 z-10 w-full px-4 pb-4">
          <div className="flex w-full justify-between gap-2">
            <div className="flex w-1/3 max-w-[128px] items-center justify-start">
              <div className="flex items-center justify-center">
                <img
                  src={"/_images/high-voltage.png"}
                  width={44}
                  height={44}
                  alt="High Voltage"
                />
                <div className="ml-2 text-left">
                  <span className="block text-2xl font-bold text-white">
                    {energy}
                  </span>
                  <span className="text-large text-white opacity-75">
                    / 6500
                  </span>
                </div>
              </div>
            </div>
            <div className="flex max-w-[240px] flex-grow items-center text-sm">
              <div className="flex w-full justify-around rounded-2xl bg-[#fad258] py-4">
                <button className="flex flex-col items-center gap-1">
                  <img
                    src={"/_images/bear.png"}
                    width={24}
                    height={24}
                    alt="High Voltage"
                  />
                  <span>Frens</span>
                </button>
                <div className="h-[48px] w-[2px] bg-[#fddb6d]"></div>
                <button className="flex flex-col items-center gap-1">
                  <img
                    src={"/_images/coin.png"}
                    width={24}
                    height={24}
                    alt="High Voltage"
                  />
                  <span>Earn</span>
                </button>
                <div className="h-[48px] w-[2px] bg-[#fddb6d]"></div>
                <button className="flex flex-col items-center gap-1">
                  <img
                    src={"/_images/rocket.png"}
                    width={24}
                    height={24}
                    alt="High Voltage"
                  />
                  <span>Boosts</span>
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 w-full rounded-full bg-[#f9c035]">
            <div
              className="h-4 rounded-full bg-gradient-to-r from-[#f3c45a] to-[#fffad0]"
              style={{ width: `${(energy / 6500) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="flex flex-grow items-center justify-center">
          <div className="relative mt-4" onClick={handleClick}>
            <img
              src={"/_images/notcoin.png"}
              width={256}
              height={256}
              alt="notcoin"
            />
            {clicks.map((click) => (
              <div
                key={click.id}
                className="absolute text-5xl font-bold opacity-0"
                style={{
                  top: `${click.y - 42}px`,
                  left: `${click.x - 28}px`,
                  animation: `float 1s ease-out`,
                }}
                onAnimationEnd={() => handleAnimationEnd(click.id)}
              >
                12
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
