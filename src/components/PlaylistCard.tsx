import { BsThreeDotsVertical } from "react-icons/bs";
import { MdCheckCircle, MdOutlinePlaylistPlay } from "react-icons/md";
import { useExtractColor } from "react-extract-colors";

const PlaylistCard = () => {
  const { lighterColor } = useExtractColor(
    "https://images.pexels.com/photos/17485847/pexels-photo-17485847/free-photo-of-an-artist-s-illustration-of-artificial-intelligence-ai-this-image-represents-the-ways-in-which-ai-can-help-compress-videos-and-increase-efficiency-for-users-it-was-created-by-vincent-s.png?auto=compress&cs=tinysrgb&w=480&dpr=1"
  );

  return (
    <div className="z-0 transition-opacity cursor-pointer rounded-xl group max-w-96">
      <div className="flex flex-col gap-2">
        <div className="relative">
          <div
            style={{
              backgroundColor: `${lighterColor}`,
              filter: "brightness(70%)",
            }}
            className="absolute rounded-xl aspect-[5/3] w-[90%] h-[90%] -top-[10px] left-1/2 -translate-x-1/2  outline outline-1 outline-zinc-700"
          ></div>
          <div
            style={{ backgroundColor: `${lighterColor}` }}
            className="absolute rounded-xl aspect-[5/3] w-[95%] h-[95%] -top-[5px] left-1/2 -translate-x-1/2 outline outline-1 outline-zinc-700"
          ></div>
          <div className="relative object-cover overflow-hidden aspect-[5/3] bg-zinc-200 rounded-xl">
            <img
              src="https://images.pexels.com/photos/17485847/pexels-photo-17485847/free-photo-of-an-artist-s-illustration-of-artificial-intelligence-ai-this-image-represents-the-ways-in-which-ai-can-help-compress-videos-and-increase-efficiency-for-users-it-was-created-by-vincent-s.png?auto=compress&cs=tinysrgb&w=480&dpr=1"
              alt=""
              className="transition bg-cover group-hover:scale-110 group-focus:scale-110"
            />

            <div className="absolute z-50 p-1 gap-0.5 text-xs text-white rounded-xl bottom-1 right-1 glass-dark flex items-center">
              <MdOutlinePlaylistPlay className="w-4 h-4" /> 1000 videos
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 px-2">
          <div className="flex justify-between">
            <div className="text-ellipsis line-clamp-1">Podcast wishlist</div>
            <div className="grid ml-auto transition hover:scale-105 focus:scale-105 place-items-center">
              <BsThreeDotsVertical size={1.1 + "em"} className="mb-0.5" />
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs tracking-wide text-zinc-400">
            Private
            <MdCheckCircle /> • Playlist
          </div>
          <div className="text-xs tracking-wide text-zinc-400">
            Updated Today
          </div>
          <div className="text-xs tracking-wide text-zinc-400">
            View full playlist
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;
