"use client";
import { CollectionsOfTheWeek } from "#/components/Discovery/CollectionsOfTheWeek";
import { DiscussingToday } from "#/components/Discovery/DiscussingToday";
import { InterestingCarousel } from "#/components/Discovery/InterestingCarousel";
import { PopularModal } from "#/components/Discovery/Modal/PopularModal";
import { RecommendedCarousel } from "#/components/Discovery/RecommendedCarousel";
import { WatchingNowCarousel } from "#/components/Discovery/WatchingNowCarousel";
import { Button } from "flowbite-react";
import { useState } from "react";

export const DiscoverPage = () => {
  const [PopularModalOpen, setPopularModalOpen] = useState(false);

  return (
    <>
      <InterestingCarousel />
      <div className="grid grid-cols-2 gap-4 my-4 lg:grid-cols-4">
        <Button
          size="xl"
          color="yellow"
          onClick={() => setPopularModalOpen(true)}
        >
          <span className="flex-shrink-0 inline-block w-8 h-8 mr-2 iconify mdi--fire"></span>
          <span>Популярное</span>
        </Button>
        <Button size="xl" color="blue">
          <span className="flex-shrink-0 inline-block w-8 h-8 mr-2 iconify mdi--calendar-month"></span>
          <span>Расписание</span>
        </Button>
        <Button size="xl" color="purple">
          <span className="flex-shrink-0 inline-block w-8 h-8 mr-2 iconify mdi--collections-bookmark"></span>
          <span>Коллекции</span>
        </Button>
        <Button size="xl" color="green">
          <span className="flex-shrink-0 inline-block w-8 h-8 mr-2 iconify mdi--mixer-settings"></span>
          <span>Фильтр</span>
        </Button>
      </div>
      <RecommendedCarousel />
      <DiscussingToday />
      <WatchingNowCarousel />
      <CollectionsOfTheWeek />

      <PopularModal isOpen={PopularModalOpen} setIsOpen={setPopularModalOpen} />
    </>
  );
};
