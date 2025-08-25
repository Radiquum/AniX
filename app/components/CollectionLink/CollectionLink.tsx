import Link from "next/link";
import { Chip } from "#/components/Chip/Chip";
import Image from "next/image";

export const CollectionLink = (props: any) => {
  return (
    <Link href={`/collection/${props.id}`}>
      <div className="relative w-full overflow-hidden rounded-lg group aspect-video">
        <Image
          src={props.image}
          fill={true}
          alt={""}
          className="-z-[1] object-cover inset-0 absolute w-full h-full group-hover:scale-110 transition-all duration-300 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div className="absolute flex flex-wrap items-start justify-start gap-0.5 sm:gap-1 left-2 top-2">
          <Chip
            icon_name="material-symbols--favorite"
            name_2={props.favorites_count}
          />
          {props.comment_count && (
            <Chip
              icon_name="material-symbols--comment"
              name_2={props.comment_count}
            />
          )}
          {props.is_private && (
            <div className="flex items-center justify-center bg-yellow-400 rounded-sm">
              <span className="w-3 px-4 py-2.5 text-white sm:px-4 sm:py-3 xl:px-6 xl:py-4 iconify mdi--lock"></span>
            </div>
          )}
          {props.is_favorite && (
            <div className="flex items-center justify-center bg-pink-500 rounded-sm">
              <span className="w-3 px-4 py-2.5 text-white sm:px-4 sm:py-3 xl:px-6 xl:py-4 iconify mdi--heart"></span>
            </div>
          )}
        </div>
        <div className="absolute transition-transform bottom-2 left-2 lg:translate-y-full group-hover:lg:translate-y-0">
          <p className="text-sm font-bold text-white transition-transform md:text-base lg:text-lg xl:text-xl line-clamp-2 lg:-translate-y-full group-hover:lg:translate-y-0">
            {props.title}
          </p>
          <p className="mt-2 text-sm line-clamp-2 hidden sm:[display:-webkit-box]">
            {props.description}
          </p>
        </div>
      </div>
    </Link>
  );
};
