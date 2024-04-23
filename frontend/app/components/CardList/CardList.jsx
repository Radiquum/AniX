import { ReleaseCard } from "@/app/components/ReleaseCard/ReleaseCard";

export const CardList = (props) => {
  return props.data.map((item) => {
    return (
      <ReleaseCard
        key={item.id}
        id={item.id}
        title={item.title_ru}
        poster={item.image}
        description={item.description}
      />
    );
  });
};
