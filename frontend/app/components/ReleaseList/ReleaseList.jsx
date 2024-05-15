import Link from "next/link";
import Image from "next/legacy/image";

export const ReleaseList = (props) => {
  return (
    <Link
      href={`/release/${props.id}`}
      className={props.className ? props.className : "round padding fill"}
      style={{ width: "100%", height: "100%", gridColumn: "1/-1" }}
    >
      <nav
        className="m l"
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Image
          className="round"
          style={{ aspectRatio: "1/1" }}
          width="128px"
          height="128px"
          src={props.poster}
          alt=""
        />

        <div style={{ width: "calc(100% - 10rem)" }}>
          <h5 className="small">{`${props.title.substring(0, 90)}${
            [...props.title].length > 90 ? "..." : ""
          }`}</h5>
          <p>{`${props.description.substring(0, 170)}${
            [...props.description].length > 170 ? "..." : ""
          }`}</p>
        </div>
      </nav>

      <nav
        className="s"
        style={{
          alignItems: "center",
          maxWidth: "100%",
        }}
      >
        <Image
          className="round"
          style={{ aspectRatio: "1/1" }}
          width="128px"
          height="128px"
          src={props.poster}
          alt=""
        />

        <div style={{ width: "calc(20%)" }}>
          <h5 className="small">{`${props.title.substring(0, 90)}${
            [...props.title].length > 90 ? "..." : ""
          }`}</h5>
        </div>
      </nav>
    </Link>
  );
};
