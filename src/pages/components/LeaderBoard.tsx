import React from "react";
import { Trophy, Medal, LucideIcon, X } from "lucide-react";
import { api } from "~/utils/api";

interface LeaderBoardItem {
  username: string;
  avatar: string;
  score: number;
}

interface LeaderBoardItemProps extends LeaderBoardItem {
  rank: number;
  avatar: string;
}

const LeaderBoardItem: React.FC<LeaderBoardItemProps> = ({
  rank,
  avatar,
  username,
  score,
}) => {
  const isTopThree = rank <= 3;

  const renderRankIcon = () => {
    if (isTopThree) {
      const iconColor = ["text-yellow-500", "text-gray-400", "text-orange-500"][
        rank - 1
      ];
      return <Medal size={24} className={iconColor} />;
    }
    return <span>{rank}</span>;
  };

  return (
    <div className="flex items-center space-x-4 px-4 py-3 transition-colors duration-200 hover:bg-yellow-300">
      <div className="flex w-8 items-center justify-center font-bold text-gray-700">
        {renderRankIcon()}
      </div>
      <img
        src={avatar}
        alt={username}
        className="h-10 w-10 rounded-full border-2 border-white"
      />
      <div className="flex-grow">
        <p className="font-semibold text-gray-800">{username}</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-gray-800">
          {score.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default function LeaderBoard({ onClose }: { onClose?: () => void }) {
  const { data } = api.notcoin.getLeaderBoard.useQuery();
  return (
    <div className="overflow-hidden rounded-lg bg-[#fad258] shadow-lg">
      <div className="flex items-center justify-between bg-yellow-400 px-4 py-3">
        <div className="flex items-center">
          <Trophy size={24} className="mr-2 text-yellow-700" />
          <h2 className="text-2xl font-bold text-yellow-800">Leaderboard</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-yellow-700 transition-colors duration-200 hover:text-yellow-900"
            aria-label="Close leaderboard"
          >
            <X size={24} />
          </button>
        )}
      </div>
      <div className="divide-y divide-yellow-400">
        {data?.map((item, index) => (
          <LeaderBoardItem
            key={item.username}
            rank={index + 1}
            avatar={item.avatar}
            username={item.username}
            score={item.score}
          />
        ))}
      </div>
    </div>
  );
}
