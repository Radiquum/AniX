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
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {props.content.map((release) => {
            return (
              <div key={release.id} className="w-full h-full">
                <ReleaseLink
                  {...release}
                  chipsSettings={{
                    enabled: true,
                    lastWatchedHidden:
                      props.sectionTitle &&
                      props.sectionTitle.toLowerCase() != "история",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
