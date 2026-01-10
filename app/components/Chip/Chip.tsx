export const Chip = (props: {
  icon_name?: string;
  icon_color?: string;
  name?: string;
  name_2?: string;
  devider?: string;
  bg_color?: string;
  style?: React.CSSProperties;
  className?: string;
}) => {
  return (
    <div className={`${props.bg_color || "bg-gray-500"} rounded-sm flex items-center justify-center ${props.className || ""} bg-opacity-80 backdrop-blur-sm max-w-fit`}>
      {props.icon_name && (
        <span
          className={`iconify w-4 h-4 sm:w-6 sm:h-6 ml-2 ${props.icon_name}`}
          style={
            {
              color: "var(--icon-color)",
              "--icon-color": props.icon_color || "#fff",
            } as React.CSSProperties
          }
        ></span>
      )}
      <p className="px-2 py-1 text-white xl:text-base">
        {props.name}
        {props.name && props.devider ? props.devider : " "}
        {props.name_2}
      </p>
    </div>
  );
};
