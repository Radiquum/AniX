"use client";

import { ENDPOINTS } from "#/api/config";
import { useSWRfetcher } from "#/api/utils";
import useSWR from "swr";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Styles from "./InterestingCarousel.module.css";
import Link from "next/link";

export const InterestingCarousel = () => {
  const { data, isLoading, error } = useSWR(
    ENDPOINTS.discover.interesting,
    useSWRfetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    }
  );

  if (error)
    return (
      <div className="flex flex-col justify-between w-full p-4 border border-red-200 rounded-md md:flex-row bg-red-50 dark:bg-red-700 dark:border-red-600">
        <div className="mb-4 md:mb-0 md:me-4">
          <p>Произошла ошибка загрузки интересных релизов</p>
        </div>
      </div>
    );
  if (isLoading) return <></>;

  return (
    <div>
      <Swiper
        modules={[Navigation]}
        spaceBetween={8}
        slidesPerView={"auto"}
        direction={"horizontal"}
        rewind={true}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        allowTouchMove={true}
        breakpoints={{
          1800: {
            initialSlide: 1,
            centeredSlides: true,
          },
        }}
        className={Styles.swiper}
      >
        {data.content.map((item) => {
          return (
            <SwiperSlide
              key={`discover-interesting-${item.id}`}
              style={{ maxWidth: "fit-content" }}
            >
              <Link href={`/release/${item.action}`}>
                <div className="relative w-[300px] md:w-[480px] aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt=""
                    fill={true}
                    className="absolute inset-0 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-xl font-bold">{item.title}</p>
                    <p>{item.description}</p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
        <div
          className={`swiper-button-prev ${Styles["swiper-button"]} after:iconify after:material-symbols--chevron-left aspect-square bg-black bg-opacity-25 backdrop-blur rounded-full after:bg-white`}
          style={{ "--swiper-navigation-size": "64px" } as React.CSSProperties}
        ></div>
        <div
          className={`swiper-button-next ${Styles["swiper-button"]} after:iconify after:material-symbols--chevron-right aspect-square bg-black bg-opacity-25 backdrop-blur rounded-full after:bg-white`}
          style={{ "--swiper-navigation-size": "64px" } as React.CSSProperties}
        ></div>
      </Swiper>
    </div>
  );
};
