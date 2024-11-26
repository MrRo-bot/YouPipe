import { UIEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdOutlineSearch,
} from "react-icons/md";

import ChannelOverviewCard from "../components/ChannelOverviewCard";
import { useAppSelector } from "../app/store";

const ChannelOverview = () => {
  //to get sidebar status if its shrunk or expanded
  const isOpen = useAppSelector((state) => state.hamburger);

  //toggling arrow scrolls either one side should be active or both sides depends upon scroll progress
  const [scrollArrow, setScrollArrow] = useState<{
    youSide: { left: boolean; right: boolean };
    videoSide: { left: boolean; right: boolean };
  }>({
    youSide: { left: false, right: true },
    videoSide: { left: false, right: true },
  });

  //
  const [scroll, setScroll] = useState({ youSide: "", videoSide: "" });

  //every section requires separate scroll progress ref
  const forYouRef = useRef<HTMLDivElement>(null);
  const videosRef = useRef<HTMLDivElement>(null);

  const handleFilterArrow = (data: { youSide: string; videoSide: string }) => {
    setScroll((prev) => ({ ...prev, youSide: data.youSide }));
    setScroll((prev) => ({ ...prev, videoSide: data.videoSide }));
  };

  useEffect(() => {
    const refYou = forYouRef.current;
    const refVideos = videosRef.current;

    if (refYou && refVideos !== null) {
      if (scroll.youSide === "left") refYou.scrollLeft -= refYou.clientWidth;
      if (scroll.youSide === "right") refYou.scrollLeft += refYou.clientWidth;
      if (scroll.videoSide === "left")
        refVideos.scrollLeft -= refVideos.clientWidth;
      if (scroll.videoSide === "right")
        refVideos.scrollLeft += refVideos.clientWidth;
    }
  }, [scroll]);

  //this function and below function can be combined do check in future
  const handleYouScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const scrollLeft = target.scrollLeft;
    const scrollWidth = target.scrollWidth;
    const clientWidth = target.clientWidth;

    if (scrollLeft === 0)
      setScrollArrow((prev) => ({
        ...prev,
        youSide: { left: false, right: true },
      }));

    if (scrollWidth - (clientWidth + scrollLeft) < 50)
      return setScrollArrow((prev) => ({
        ...prev,
        youSide: { left: true, right: false },
      }));

    if (scrollLeft > 50)
      return setScrollArrow((prev) => ({
        ...prev,
        youSide: { left: true, right: true },
      }));
  };

  const handleVideoScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const scrollLeft = target.scrollLeft;
    const scrollWidth = target.scrollWidth;
    const clientWidth = target.clientWidth;

    if (scrollLeft === 0)
      setScrollArrow((prev) => ({
        ...prev,
        videoSide: { left: false, right: true },
      }));

    if (scrollWidth - (clientWidth + scrollLeft) < 50)
      return setScrollArrow((prev) => ({
        ...prev,
        videoSide: { left: true, right: false },
      }));

    if (scrollLeft > 50)
      return setScrollArrow((prev) => ({
        ...prev,
        videoSide: { left: true, right: true },
      }));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        className={`relative mx-4 mb-2 mt-3 max-h-[90vh] overflow-y-auto hideScrollbar ${
          !isOpen ? "w-[85vw]" : "w-full"
        } `}
      >
        <div className="w-9/12 mx-auto">
          <div className="h-[20vh] overflow-hidden rounded-2xl">
            <img
              className="object-cover w-full"
              src="https://images.pexels.com/photos/7001554/pexels-photo-7001554.jpeg?auto=compress&cs=tinysrg&dpr=1&w=1280"
              alt=""
            />
          </div>

          <div className="flex items-center justify-start gap-4 pt-4">
            <div className="grid w-40 overflow-hidden rounded-full place-items-center">
              <img
                className="w-full h-full"
                src="https://yt3.googleusercontent.com/ytc/AIdro_mXtRw_Eu5K5RGuxoXmnuOalGb0jRcKOcYBhsAD7hVJ0BI=s160-c-k-c0x00ffffff-no-rj"
                alt=""
              />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-extrabold">Chhavimani Choubey</h1>
              <span className="text-sm text-zinc-400">
                @chhavimanichoubey9437 • 20 subscribers • 22 videos
              </span>
              <span className="text-sm text-zinc-400">
                Control is illusion...
                <strong className="font-bold text-white">more</strong>
              </span>
              <div className="flex justify-start gap-2">
                <div className="px-4 py-2 text-sm font-semibold text-center align-middle transition bg-gray-700 rounded-full cursor-pointer focus:bg-gray-600 hover:bg-gray-600">
                  Customise Channel
                </div>
                <div className="px-4 py-2 text-sm font-semibold text-center align-middle transition bg-gray-700 rounded-full cursor-pointer focus:bg-gray-600 hover:bg-gray-600">
                  Manage Videos
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full shadow-[0_1px_0_0_gray]">
          <div className="flex items-center w-9/12 gap-5 mx-auto">
            <div className="py-4 px-0.5 font-bold shadow-[0_2px_0_0_white] cursor-pointer">
              Home
            </div>
            <div className="py-4 px-0.5 font-semibold cursor-pointer text-zinc-400">
              Videos
            </div>
            <div className="py-4 px-0.5 font-semibold cursor-pointer text-zinc-400">
              Playlists
            </div>
            <div className="py-4 px-0.5 font-semibold cursor-pointer text-zinc-400">
              Community
            </div>
            <div className="relative py-2 px-0.5 flex gap-2 cursor-pointer">
              <MdOutlineSearch className="w-6 h-6 peer" />
            </div>
          </div>
        </div>
        <div className="w-9/12 mx-auto">
          <div className="relative shadow-[0_1px_0_0_gray]">
            <div>
              <h2 className="pt-4 text-xl font-bold tracking-wide">For You</h2>
            </div>
            <div
              ref={forYouRef}
              onScroll={(e) => handleYouScroll(e)}
              className="flex gap-1 px-1 py-8 overflow-x-scroll hideScrollbar"
            >
              <div
                onClick={() =>
                  handleFilterArrow({ youSide: "left", videoSide: "" })
                }
                className={`${
                  scrollArrow.youSide.left ? "block" : "hidden"
                } absolute transition-all -left-5 hover:shadow-cardShadow rounded-full z-50 top-[55%] -translate-y-[55%]`}
              >
                <div className="p-1 transition rounded-full cursor-pointer w-9 h-9 bg-zinc-900 hover:bg-zinc-700 focus:bg-zinc-700">
                  <MdKeyboardArrowLeft className="w-full h-full" />
                </div>
              </div>
              <ChannelOverviewCard size={"big"} />
              <ChannelOverviewCard size={"big"} />
              <ChannelOverviewCard size={"big"} />
              <ChannelOverviewCard size={"big"} />
              <ChannelOverviewCard size={"big"} />
              <ChannelOverviewCard size={"big"} />
              <ChannelOverviewCard size={"big"} />
              <ChannelOverviewCard size={"big"} />
              <ChannelOverviewCard size={"big"} />
              <ChannelOverviewCard size={"big"} />
              <ChannelOverviewCard size={"big"} />
              <ChannelOverviewCard size={"big"} />
              <ChannelOverviewCard size={"big"} />
              <ChannelOverviewCard size={"big"} />
              <ChannelOverviewCard size={"big"} />
              <ChannelOverviewCard size={"big"} />
              <ChannelOverviewCard size={"big"} />
              <ChannelOverviewCard size={"big"} />
              <ChannelOverviewCard size={"big"} />
              <ChannelOverviewCard size={"big"} />
              <ChannelOverviewCard size={"big"} />
              <ChannelOverviewCard size={"big"} />
              <ChannelOverviewCard size={"big"} />
              <ChannelOverviewCard size={"big"} />
              <ChannelOverviewCard size={"big"} />
              <div
                id="youSideRight"
                onClick={() =>
                  handleFilterArrow({ youSide: "right", videoSide: "" })
                }
                className={`${
                  scrollArrow.youSide.right ? "block" : "hidden"
                } absolute transition-all -right-5 hover:shadow-cardShadow rounded-full z-50 top-[55%] -translate-y-[55%]`}
              >
                <div className="p-1 transition rounded-full cursor-pointer w-9 h-9 bg-zinc-900 hover:bg-zinc-700 focus:bg-zinc-700">
                  <MdKeyboardArrowRight className="w-full h-full" />
                </div>
              </div>
            </div>
          </div>
          <div className="relative shadow-[0_1px_0_0_gray]">
            <div>
              <h2 className="pt-4 text-xl font-bold tracking-wide">Videos</h2>
            </div>
            <div
              ref={videosRef}
              onScroll={(e) => handleVideoScroll(e)}
              className="flex gap-1 px-1 py-8 overflow-x-scroll hideScrollbar"
            >
              <div
                onClick={() =>
                  handleFilterArrow({ youSide: "", videoSide: "left" })
                }
                className={`${
                  scrollArrow.videoSide.left ? "block" : "hidden"
                } absolute transition-all -left-5 hover:shadow-cardShadow rounded-full z-50 top-[55%] -translate-y-[55%]`}
              >
                <div className="p-1 transition rounded-full cursor-pointer w-9 h-9 bg-zinc-900 hover:bg-zinc-700 focus:bg-zinc-700">
                  <MdKeyboardArrowLeft className="w-full h-full" />
                </div>
              </div>
              <ChannelOverviewCard size={"small"} />
              <ChannelOverviewCard size={"small"} />
              <ChannelOverviewCard size={"small"} />
              <ChannelOverviewCard size={"small"} />
              <ChannelOverviewCard size={"small"} />
              <ChannelOverviewCard size={"small"} />
              <ChannelOverviewCard size={"small"} />
              <ChannelOverviewCard size={"small"} />
              <ChannelOverviewCard size={"small"} />
              <ChannelOverviewCard size={"small"} />
              <ChannelOverviewCard size={"small"} />
              <ChannelOverviewCard size={"small"} />
              <ChannelOverviewCard size={"small"} />
              <ChannelOverviewCard size={"small"} />
              <ChannelOverviewCard size={"small"} />
              <ChannelOverviewCard size={"small"} />
              <ChannelOverviewCard size={"small"} />
              <ChannelOverviewCard size={"small"} />
              <ChannelOverviewCard size={"small"} />
              <ChannelOverviewCard size={"small"} />
              <ChannelOverviewCard size={"small"} />
              <ChannelOverviewCard size={"small"} />
              <ChannelOverviewCard size={"small"} />
              <ChannelOverviewCard size={"small"} />
              <ChannelOverviewCard size={"small"} />
              <div
                id="videoSideRight"
                onClick={() =>
                  handleFilterArrow({ youSide: "", videoSide: "right" })
                }
                className={`${
                  scrollArrow.videoSide.right ? "block" : "hidden"
                } absolute transition-all -right-5 hover:shadow-cardShadow rounded-full z-50 top-[55%] -translate-y-[55%]`}
              >
                <div className="p-1 transition rounded-full cursor-pointer w-9 h-9 bg-zinc-900 hover:bg-zinc-700 focus:bg-zinc-700">
                  <MdKeyboardArrowRight className="w-full h-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChannelOverview;
