import "~/styles/notcoin.css";
import { type GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { getServerProxySSGHelpers } from "./utils/ssg";
import { api } from "~/utils/api";
import LeaderBoard from "./components/LeaderBoard";

export default function NotCoinPage({
  user,
}: {
  user?: { fid: number; username: string; avatar: string; score: number };
}) {
  const mutation = api.game.updateScore.useMutation();
  const [points, setPoints] = useState(user?.score ?? 0);
  const [energy, setEnergy] = useState(1000);
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>(
    [],
  );
  const pointsToAdd = 12;
  const energyToReduce = 12;

  const [showLeaderboard, setShowLeaderboard] = useState(false);

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
    if (user) {
      mutation.mutate({
        fid: user.fid,
        score: pointsToAdd,
        clicks: clicks,
      });
    }
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter((click) => click.id !== id));
  };

  // useEffect hook to restore energy over time
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prevEnergy) => Math.min(prevEnergy + 1, 3000));
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
              <p className="text-lg">Farcaster NotCoin: Tap to Earn</p>
            </div>
          </div>
          <div className="relative flex w-full flex-row justify-center">
            {user && (
              <div className="absolute left-4 top-4 flex flex-row items-center gap-x-2">
                <img
                  src={user.avatar}
                  className="h-10 w-10 rounded-full"
                  alt="Avatar"
                />
                <div className="text-2xl font-bold">{user.username}</div>
              </div>
            )}
            <div className="mt-20 flex items-center text-5xl font-bold">
              <img src={"/_images/coin.png"} width={44} height={44} />
              <span className="ml-2">{points.toLocaleString()}</span>
            </div>
            <div />
          </div>
          {/* <div className="mt-2 flex items-center text-base">
            <img src={"/_images/trophy.png"} width={24} height={24} />
            <span className="ml-1">
              Gold <Arrow size={18} className="mb-1 ml-0 inline-block" />
            </span>
          </div> */}
        </div>

        {user && (
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
                      / 3000
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex max-w-[240px] flex-grow items-center text-sm">
                <div className="flex w-full justify-around rounded-2xl bg-[#fad258] py-4">
                  <button
                    className="flex flex-col items-center gap-1"
                    onClick={() => {
                      setShowLeaderboard(true);
                    }}
                  >
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
        )}
        {!user && (
          <div className="flex flex-grow items-center justify-center">
            <a
              className="mt-4 rounded-xl bg-[#1f1f1f] px-4 py-2 text-lg font-bold"
              href="https://warpcast.com/"
            >
              This game is only available on Farcaster
            </a>
          </div>
        )}
        {user && !showLeaderboard && (
          <div className="flex flex-grow cursor-pointer items-center justify-center">
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
        )}
        {showLeaderboard && (
          <div className="absolute top-1/4 mt-20 h-[400px] w-[70%] rounded-xl bg-[#fad258]/80 shadow-2xl md:w-[50%]">
            <LeaderBoard onClose={() => setShowLeaderboard(false)} />
          </div>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const params = ctx.query as { token?: string };
  if (!params?.token) {
    return {
      props: {
        user: null,
      },
    };
  }
  const ssg = await getServerProxySSGHelpers();
  const user = await ssg.game.getUser({ token: params.token });
  return {
    props: {
      user: user,
    },
  };
};
