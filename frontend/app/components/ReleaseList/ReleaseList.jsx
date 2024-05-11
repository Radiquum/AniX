import Link from "next/link";
import Image from "next/legacy/image";

export const ReleaseList = (props) => {
  return (
    <Link
      href={`/release/${props.id}`}
      className={
        props.className
          ? props.className
          : "s12 round fill row padding surface-container"
      }
    >
      <Image
        className="round"
        style={{ aspectRatio: "1/1" }}
        width="128px"
        height="128px"
        src={props.poster}
        alt=""
      />

      <div className="max">
        <h5 className="small">{`${props.title.substring(0, 90)}${
          [...props.title].length > 90 ? "..." : ""
        }`}</h5>
        <p>{`${props.description.substring(0, 170)}${
          [...props.description].length > 170 ? "..." : ""
        }`}</p>
      </div>
    </Link>
  );
};
