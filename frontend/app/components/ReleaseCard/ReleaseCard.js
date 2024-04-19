"use client";

import Link from "next/link";

export const ReleaseCard = (props) => {
  return (
    <Link href={`/release/${props.id}`} className="s3">
      <article className="no-padding round fill" style={{"aspectRatio": "9/16"}}>
        <img className="responsive large top-round" src={props.poster} />
        <div className="padding">
          <h6>{props.title}</h6>
          <p>{props.description}</p>
        </div>
      </article>
    </Link>
  );
};
