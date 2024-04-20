"use client";

import Link from "next/link";

export const ReleaseCard = (props) => {
  return (
    <Link href={`/release/${props.id}`} className="s3">
      <article className="no-padding round fill" style={{width: 284, height: 508}}>
        <img className="responsive large top-round" src={props.poster} />
        <div className="padding">
          <h6>{`${props.title.substring(0, 36)}${[...props.title].length > 36 ? "..." : ""}`}</h6>
          <p>{`${props.description}${[...props.description].length > 160 ? "..." : ""}`}</p>
        </div>
      </article>
    </Link>
  );
};
