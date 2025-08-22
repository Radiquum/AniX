import Link from "next/link";
import { Chip } from "#/components/Chip/Chip";
import Image from "next/image";

export const CollectionLink = (props: any) => {
  return (
    <Link href={`/collection/${props.id}`}>
      <div className="w-full aspect-video group">
        <div
          className="relative w-full h-full overflow-hidden bg-center bg-no-repeat bg-cover rounded-sm group-hover:animate-bg_zoom animate-bg_zoom_rev group-hover:[background-size:110%] "
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.9) 100%)`,
          }}
        >
          <Image
            src={props.image}
            fill={true}
            alt={props.title || ""}
            className="-z-[1] object-cover"
            sizes="
                  (max-width: 768px) 300px,
                  (max-width: 1024px) 600px,
                  900px
                  "
          />
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
          <div className="absolute bottom-0 left-0 p-2 lg:translate-y-[100%] group-hover:lg:translate-y-0 transition-transform">
            <div className="transition-transform lg:-translate-y-[calc(100%_+_1rem)] group-hover:lg:translate-y-0">
              <p className="text-sm font-bold text-white md:text-base lg:text-lg xl:text-xl">
                {props.title}
              </p>
            </div>
            {props.description && (
              <p className="text-xs font-light text-white md:text-sm lg:text-base xl:text-lg">
                {`${props.description.slice(0, 125)}${
                  props.description.length > 125 ? "..." : ""
                }`}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
