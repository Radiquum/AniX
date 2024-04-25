import Link from "next/link";
import Image from "next/legacy/image";

export const ReleaseCard = (props) => {
  return (
    <Link
      href={`/release/${props.id}`}
      className={props.className ? props.className : "s3"}
    >
      <article
        className="no-padding round fill"
        style={{ width: 284, height: props.height ? props.height : 508 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div style={{ aspectRatio: "1/1" }}>
          <Image
            className="responsive large top-round"
            layout="fill"
            style={{ aspectRatio: "1/1" }}
            src={props.poster}
            alt=""
            sizes={"100vw"}
          />
        </div>
        <div className="padding">
          <h6>{`${props.title.substring(0, 30)}${
            [...props.title].length > 30 ? "..." : ""
          }`}</h6>
          <p>{`${props.description.substring(0, 150)}${
            [...props.description].length > 150 ? "..." : ""
          }`}</p>
        </div>
      </article>
    </Link>
  );
};
