const Filters = () => {
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
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-4 py-2 my-2 overflow-y-scroll glass-dark hideScrollbar">
      {FILTERS.map((filter) => (
        <div
          key={filter}
          className="relative z-0 overflow-hidden min-w-fit px-3 py-2 text-sm font-medium text-center transition bg-opacity-0 rounded-lg cursor-pointer outline outline-1 outline-zinc-200/25 hover:bg-opacity-100 focus:bg-opacity-100 bg-zinc-100 text-nowrap max-h-10 hover:text-black focus:text-black glass before:content-[''] before:absolute before:transition-transform before:duration-100 before:ease-in-out before:inset-0 before:-z-10 before:bg-zinc-400 before:-translate-y-full active:before:-translate-y-1/2 after:content-[''] after:transition-transform after:duration-100 after:ease-in-out after:absolute after:inset-0 after:-z-10 after:bg-zinc-400 after:translate-y-full active:after:translate-y-1/2"
        >
          {filter}
        </div>
      ))}
    </div>
  );
};

export default Filters;
