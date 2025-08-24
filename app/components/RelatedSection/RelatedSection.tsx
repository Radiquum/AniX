import { numberDeclension } from "#/api/utils";
import Link from "next/link";
import Image from "next/image";

export const RelatedSection = (props: any) => {
  const declension = numberDeclension(
    props.release_count,
    "релиз",
    "релиза",
    "релизов"
  );
  return (
    <section>
      <div className="flex flex-col justify-between gap-4 p-4 xl:flex-row">
        <div className="flex items-center justify-center p-4">
          {props.images.map((item, index) => {
            return (
              <div key={`related-img-${index}`} className="w-[100px] lg:w-[300px] aspect-[9/12] even:scale-110 shadow-md even:[box-shadow:_0px_0px_16px_black;] even:z-20 origin-center first:[transform:translateX(25%)] last:[transform:translateX(-25%)] rounded-lg overflow-hidden">
                <Image
                  fill={true}
                  src={item}
                  alt=""
                  sizes="
                  (max-width: 1024px) 100px,
                  300px
                  "
                />
              </div>
            );
          })}
        </div>
        <div className="flex flex-col items-center justify-center flex-1 gap-2 max-w-[400px] mx-auto">
          <h1 className="text-2xl font-bold">{props.name_ru}</h1>
          <p>
            {props.release_count} {declension} во франшизе
          </p>
          <Link href={`/related/${props.id}`}>
            <div className="flex items-center px-8 py-2 transition border border-black rounded-full hover:text-white hover:bg-black dark:border-white hover:dark:text-black hover:dark:bg-white">
              <p className="text-xl font-bold">Перейти</p>
              <span className="w-6 h-6 iconify mdi--arrow-right"></span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
