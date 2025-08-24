import { Card } from "flowbite-react";
import Link from "next/link";
import ApexCharts from "apexcharts";
import { useEffect } from "react";
import { minutesToTime } from "#/api/utils";
import { ReleaseInfoSearchLink } from "../ReleaseInfo/ReleaseInfo.SearchLink";

type preferredItem = {
  name: string;
  percentage: number;
};

export const ProfileStats = (props: {
  lists: Array<number>;
  watched_count: number;
  watched_time: number;
  profile_id: number;
  preferred_genres: Array<preferredItem>;
  preferred_audiences: Array<preferredItem>;
  preferred_themes: Array<preferredItem>;
}) => {
  const getChartOptions = () => {
    return {
      series: props.lists,
      colors: ["#66bb6c", "#b566bb", "#5c6cc0", "#ffca28", "#ef5450"],
      chart: {
        height: 240,
        width: "100%",
        type: "donut",
      },
      stroke: {
        colors: ["transparent"],
        lineCap: "",
      },
      dataLabels: {
        enabled: false,
      },
      labels: [`Смотрю`, `В планах`, `Просмотрено`, `Отложено`, `Брошено`],
      legend: {
        show: false,
      },
      responsive: [
        {
          breakpoint: 400,
          options: {
            chart: {
              height: 170,
              width: 170,
              type: "donut",
            },
          },
        },
        {
          breakpoint: 640,
          options: {
            chart: {
              height: 200,
              width: 200,
              type: "donut",
            },
          },
        },
      ],
    };
  };
  useEffect(() => {
    if (
      document.getElementById("donut-chart") &&
      typeof ApexCharts !== "undefined"
    ) {
      const chart = new ApexCharts(
        document.getElementById("donut-chart"),
        getChartOptions()
      );
      chart.render();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="font-light h-fit">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Статистика</h1>
        <Link href={`/profile/${props.profile_id}/bookmarks`}>
          <div className="flex items-center">
            <p className="hidden text-xl font-bold sm:block">Показать все</p>
            <span className="w-6 h-6 iconify mdi--arrow-right"></span>
          </div>
        </Link>
      </div>
      <div className="flex items-center">
        <div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-2 gap-x-4">
            <p className="align-center whitespace-nowrap">
              <span className="inline-block rounded w-4 h-4 bg-[#66bb6c]"></span>{" "}
              Смотрю <span className="font-bold">{props.lists[0]}</span>
            </p>
            <p className="align-center whitespace-nowrap">
              <span className="inline-block rounded w-4 h-4 bg-[#b566bb]"></span>{" "}
              В планах <span className="font-bold">{props.lists[1]}</span>
            </p>
            <p className="align-center whitespace-nowrap">
              <span className="inline-block rounded w-4 h-4 bg-[#5c6cc0]"></span>{" "}
              Просмотрено <span className="font-bold">{props.lists[2]}</span>
            </p>
            <p className="align-center whitespace-nowrap">
              <span className="inline-block rounded w-4 h-4 bg-[#ffca28]"></span>{" "}
              Отложено <span className="font-bold">{props.lists[3]}</span>
            </p>
            <p className="align-center whitespace-nowrap">
              <span className="inline-block rounded w-4 h-4 bg-[#ef5450]"></span>{" "}
              Брошено <span className="font-bold">{props.lists[4]}</span>
            </p>
          </div>
          <div className="mt-4">
            <p>
              Жанры:{" "}
              <span>
                {props.preferred_genres.map((item, index) => {
                  return (
                    <div key={`preferred-genres-${item.name}`} className="inline">
                      {index > 0 && ", "}
                      <ReleaseInfoSearchLink
                        title={item.name}
                        searchBy={"tag"}
                      />{" "}
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item.percentage}%</span>
                    </div>
                  );
                })}
              </span>
            </p>
            <p>
              Аудитория:{" "}
              <span>
                {props.preferred_audiences.map((item, index) => {
                  return (
                    <div key={`preferred-audiences-${item.name}`} className="inline">
                      {index > 0 && ", "}
                      <ReleaseInfoSearchLink
                        title={item.name}
                        searchBy={"tag"}
                      />{" "}
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item.percentage}%</span>
                    </div>
                  );
                })}
              </span>
            </p>
            <p>
              Тематика:{" "}
              <span>
                {props.preferred_themes.map((item, index) => {
                  return (
                    <div key={`preferred-themes-${item.name}`} className="inline">
                      {index > 0 && ", "}
                      <ReleaseInfoSearchLink
                        title={item.name}
                        searchBy={"tag"}
                      />{" "}
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item.percentage}%</span>
                    </div>
                  );
                })}
              </span>
            </p>

            <p>
              Просмотрено серий:{" "}
              <span className="font-bold">{props.watched_count}</span>
            </p>
            <p>
              Время просмотра:{" "}
              <span className="font-bold">
                ~{minutesToTime(props.watched_time)}
              </span>
            </p>
          </div>
        </div>
        <div id="donut-chart"></div>
      </div>
    </Card>
  );
};
