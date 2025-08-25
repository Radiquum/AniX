import { CollectionLink } from "../CollectionLink/CollectionLink";
import { AddCollectionLink } from "../AddCollectionLink/AddCollectionLink";

export const CollectionsSection = (props: {
  sectionTitle?: string;
  content: any;
  isMyCollections?: boolean;
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
        <div className="grid justify-center grid-cols-2 gap-2 lg:grid-cols-3 xl:grid-cols-4">
          {props.isMyCollections && <AddCollectionLink />}
          {props.content.map((collection) => {
            return (
              <div key={collection.id} className="w-full h-full aspect-video">
                <CollectionLink {...collection} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
