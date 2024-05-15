import { CardList } from "@/app/components/CardList/CardList";
import { useState } from "react";

export default function ReleasesOverview(props) {
  const [view, setView] = useState("grid");

  return (
    <>
      <nav
        className="l"
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          maxWidth: "calc(100% - 12rem)",
          margin: "auto",
        }}
      >
        {props.chips && (
          <nav className="scroll">
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
          </nav>
        )}

        <div className="secondary-container round tiny-padding">
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
      </nav>

      <nav
        className="s m"
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          margin: "auto",
          maxWidth: "100%",
        }}
      >
        {props.chips && (
          <nav className="scroll" style={{ maxWidth: "100%" }}>
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
          </nav>
        )}

        <div className="secondary-container round tiny-padding">
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
      </nav>

      {props.releases ? (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat( auto-fill, 300px )",
              gap: "1rem",
              justifyContent: "center",
              justifyItems: "center",
              paddingTop: "1rem",
            }}
          >
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
