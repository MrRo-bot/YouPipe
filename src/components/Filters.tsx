import { UIEvent, useState, useRef, useEffect } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const Filters = () => {
  const [scrollArrow, setScrollArrow] = useState({ left: false, right: true });
  const [scroll, setScroll] = useState({ side: "" });
  const scrollProgressRef = useRef<HTMLUListElement>(null);

  const FILTERS: string[] = [
    "All",
    "Gaming",
    "Music",
    "Podcasts",
    "Live",
    "SpaceX",
    "Action Thrillers",
    "Sci-fi films",
    "Thrillers",
    "Test Cricket",
    "JavaScript",
    "4K resolution",
    "Superhero movies",
    "Motovlogs",
    "Gaming computers",
    "Nature documentaries",
    "Dramedy",
    "Website",
    "Recently uploaded",
    "Watched",
    "New to you",
  ];

  const handleFilterArrow = (data: { side: string }) => {
    setScroll((prev) => ({ ...prev, side: data.side }));
  };

  useEffect(() => {
    const ref = scrollProgressRef.current;
    if (ref !== null) {
      if (scroll.side === "left") ref.scrollLeft -= 150;
      if (scroll.side === "right") ref.scrollLeft += 150;
    }
  }, [scroll]);

  const handleScroll = (e: UIEvent<HTMLUListElement>) => {
    const target = e.target as HTMLDivElement;
    const scrollLeft = target.scrollLeft;
    const scrollWidth = target.scrollWidth;
    const clientWidth = target.clientWidth;

    if (scrollLeft === 0) setScrollArrow({ left: false, right: true });

    if (scrollWidth - (clientWidth + scrollLeft) < 50)
      return setScrollArrow({ left: true, right: false });

    if (scrollLeft > 50) return setScrollArrow({ left: true, right: true });
  };

  return (
    <div className="relative w-full">
      <div
        onClick={() => handleFilterArrow({ side: "left" })}
        className={`${
          scrollArrow.left ? "block" : "hidden"
        } absolute cursor-pointer transition-all top-0 left-0 z-50 h-full w-16 bg-filterGradient rounded-s-lg`}
      >
        <div className="absolute left-0 p-1 transition -translate-y-1/2 rounded-full top-1/2 w-9 h-9 hover:bg-zinc-400/25 focus:bg-zinc-400/25">
          <MdKeyboardArrowLeft className="w-full h-full" />
        </div>
      </div>

      <ul
        ref={scrollProgressRef}
        onScroll={(e) => handleScroll(e)}
        className="sticky top-0 flex items-center justify-between gap-4 px-3 py-2 my-2 overflow-y-scroll glass-dark hideScrollbar"
      >
        {FILTERS.map((filter) => (
          <li
            key={filter}
            className="relative z-0 overflow-hidden min-w-fit px-3 py-2 text-sm font-medium text-center transition bg-opacity-0 rounded-lg  outline outline-1 cursor-pointer outline-zinc-200/25 hover:bg-opacity-100 focus:bg-opacity-100 bg-zinc-100 text-nowrap max-h-10 hover:text-black focus:text-black glass before:content-[''] before:absolute before:transition-transform before:duration-100 before:ease-in-out before:inset-0 before:-z-10 before:bg-zinc-400 before:-translate-y-full active:before:-translate-y-1/2 after:content-[''] after:transition-transform after:duration-100 after:ease-in-out after:absolute after:inset-0 after:-z-10 after:bg-zinc-400 after:translate-y-full active:after:translate-y-1/2"
          >
            {filter}
          </li>
        ))}
      </ul>

      <div
        onClick={() => handleFilterArrow({ side: "right" })}
        className={`${
          scrollArrow.right ? "block" : "hidden"
        } absolute  transition-all top-0 right-0 z-50 h-full w-16 bg-filterGradientRev rounded-e-lg`}
      >
        <div className="absolute right-0 p-1 transition -translate-y-1/2 rounded-full cursor-pointer top-1/2 w-9 h-9 hover:bg-zinc-400/25 focus:bg-zinc-400/25">
          <MdKeyboardArrowRight className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default Filters;
