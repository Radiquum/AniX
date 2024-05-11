import { CardList } from "@/app/components/CardList/CardList";
import { useState } from "react";

export default function ReleasesOverview(props) {
  const [view, setView] = useState("grid");

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {props.chips && (
          <div>
            {props.chips.map((item) => {
              return (
                <button
                  key={item.list}
                  className={`chip ${props.list == item.list ? "fill" : ""}`}
                  onClick={() => {
                    props.setList(item.list);
                  }}
                >
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>
        )}

        <div>
          <button
            className="circle transparent"
            onClick={() => {
              setView("list");
            }}
          >
            <i className={view == "list" ? "fill" : ""}>view_agenda</i>
          </button>
          <button
            className="circle transparent"
            onClick={() => {
              setView("grid");
            }}
          >
            <i className={view == "grid" ? "fill" : ""}>cards</i>
          </button>
        </div>
      </div>

      {props.releases ? (
        <>
          <div className="grid">
            <CardList data={props.releases} view={view} />
          </div>

          {props.isNextPage && (
            <nav className="large-margin center-align">
              <button
                className="large"
                onClick={() => {
                  props.setPage(props.page + 1);
                }}
              >
                <i>add</i>
                <span>загрузить ещё</span>
              </button>
            </nav>
          )}
        </>
      ) : (
        <progress className="s1"></progress>
      )}
    </>
  );
}
