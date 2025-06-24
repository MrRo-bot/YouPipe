import Channel from "./Channel";
import Playlist from "./Playlist";
import Video from "./Video";
import { SearchType } from "../../types/types";

const SearchCard = ({ search }: { search: SearchType }) => {
  const kind = search?.id?.kind.split("#")[1];

  return kind === "channel" ? (
    <Channel search={search} kind={kind} />
  ) : kind === "playlist" ? (
    <Playlist search={search} kind={kind} />
  ) : (
    <>
      <Video search={search} kind={kind} />
      <Channel search={search} kind={kind} />
      <Playlist search={search} kind={kind} />
    </>
  );
};

export default SearchCard;
