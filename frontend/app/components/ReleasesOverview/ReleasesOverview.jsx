import { CardList } from "@/app/components/CardList/CardList";

export default function ReleasesOverview(props) {
  return (
    <>
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

      {props.releases ? (
        <>
          <div className="grid">
            <CardList data={props.releases} />
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
