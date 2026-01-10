import { ReleaseLink } from "../ReleaseLink/ReleaseLinkUpdate";

export const ReleaseSection = (props: {
  sectionTitle?: string;
  content: any;
}) => {
  return (
    <section>
      {props.sectionTitle && (
        <div className="flex justify-between px-4 py-2 border-b-2 border-black dark:border-white">
          <h1 className="font-bold text-md sm:text-xl md:text-lg xl:text-xl">
            {props.sectionTitle}
          </h1>
        </div>
      )}
      <div className="m-4">
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 2xl:grid-cols-5">
          {props.content.map((release) => {
            return (
              <div key={release.id} className="w-full h-full">
                <ReleaseLink
                  {...release}
                  lastWatchedHidden={
                    props.sectionTitle.toLowerCase() != "история"
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
