import { ReleaseCard } from "@/app/components/ReleaseCard/ReleaseCard";
import { ReleaseList } from "@/app/components/ReleaseList/ReleaseList";

export const CardList = (props) => {
  return props.data.map((item) => {
    if (props.view == "grid") {
      return (
        <ReleaseCard
          key={item.id}
          id={item.id}
          title={item.title_ru}
          poster={item.image}
          description={item.description}
        />
      );
    }
    if (props.view == "list") {
      return (
        <ReleaseList
          key={item.id}
          id={item.id}
          title={item.title_ru}
          poster={item.image}
          description={item.description}
        />
      );
    }
  });
};
