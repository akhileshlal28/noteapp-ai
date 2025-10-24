import { Pin, Star, PinOff, Sparkles } from "lucide-react";
import { FaStar } from "react-icons/fa";

const MAX_LENGTH = 120;
const NoteCard = ({
  title,
  content,
  date,
  onShowMore,
  togglePin,
  note,
  toggleFav,
}) => {
  const isLong = content.length > MAX_LENGTH;
  const displayContent = isLong
    ? content.slice(0, MAX_LENGTH) + "..."
    : content;
  return (
    <div className="bg-blend-color rounded-xl shadow-md p-5 mb-4 max-w-md transition-shadow hover:shadow-lg">
      <div className="text-lg font-semibold mb-2 flex justify-between">
        {title}
        <div>
          {note.pinned ? (
            <PinOff
              className="inline-block text-yellow-500 cursor-pointer"
              size={16}
              onClick={togglePin}
              title="Unpin"
            />
          ) : (
            <Pin
              className="inline-block text-yellow-500 cursor-pointer"
              size={16}
              onClick={togglePin}
              title="Pin"
            />
          )}
          {note.favourite ? (
            <FaStar
              className="inline-block text-yellow-500 cursor-pointer ml-2"
              size={16}
              onClick={toggleFav}
              title="Favourite"
            />
          ) : (
            <Star
              className="inline-block text-yellow-500 cursor-pointer ml-2"
              size={16}
              onClick={toggleFav}
              title="Unfavourite"
            />
          )}
        </div>
      </div>
      <p className="w-full min-h-[60px] bg-gray-100 rounded-md p-2 text-base resize-none mb-2 border-none focus:outline-none">
        {displayContent}
        {isLong && (
          <button
            className="text-blue-500 hover:underline text-sm font-medium ml-2"
            onClick={onShowMore}
          >
            Read More
          </button>
        )}
      </p>
      <div className="flex justify-between items-center">
        <button
          className="text-blue-500 hover:underline text-sm font-medium mt-2 cursor-pointer"
          onClick={onShowMore}
        >
          Show More
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
