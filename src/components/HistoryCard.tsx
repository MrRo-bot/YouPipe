import { motion } from "framer-motion";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdCheckCircle, MdOutlineClose } from "react-icons/md";

const HistoryCard = () => {
  return (
    <motion.div
      variants={{
        hidden: { scale: 0.95 },
        visible: { scale: 1 },
      }}
      initial={"hidden"}
      whileInView={"visible"}
      className="flex items-start gap-1 p-2 transition-all glass rounded-2xl "
    >
      <div className="relative w-5/6 overflow-hidden min-w-4/6 aspect-video rounded-2xl">
        <img
          className="object-cover"
          src="https://images.pexels.com/photos/7001554/pexels-photo-7001554.jpeg?auto=compress&cs=tinysrg&dpr=1&w=480"
          alt=""
        />
        <div className="absolute z-50 p-1 text-xs text-white rounded-2xl bottom-1 right-1 glass-dark">
          2:30
        </div>
      </div>
      <div className="flex flex-col ml-3 flex-start">
        <div className="relative flex items-start justify-between gap-1">
          <h3 className="w-4/5 text-xl text-ellipsis line-clamp-2">
            Samay raina Reacts to Mr Bean in Cyberpunk 2077
          </h3>
          <div className="flex gap-4">
            <MdOutlineClose className="text-zinc-200 absolute w-10 h-10 cursor-pointer -top-1.5 right-10" />
            <BsThreeDotsVertical className="absolute w-5 h-5 cursor-pointer text-zinc-200 top-1 right-1" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          @samayraina <MdCheckCircle /> • 1.7M subscribers
        </div>
        <p className="w-5/6 mt-2 mb-1 text-xs whitespace-normal line-clamp-2 text-zinc-400 text-ellipsis">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deserunt
          tenetur cumque voluptas quas maxime possimus? Molestiae hic a eveniet
          iste veritatis, vel asperiores officiis impedit officia expedita
          explicabo corporis mollitia.
        </p>
      </div>
    </motion.div>
  );
};

export default HistoryCard;
