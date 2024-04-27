"use client";

function deleteAllSettings() {
  localStorage.removeItem("mode");
  localStorage.removeItem("theme");
}

function deleteSearchHistory() {
  localStorage.removeItem("searches");
}

export default function Settings() {
  return (
    <>
      <dialog
        className="active left round bottom small"
        style={{ blockSize: "unset" }}
      >
        <h5>Настройки</h5>
        <nav className="wrap">
          <div className="max">
            <h6 className="small">сохранение в истории просмотров</h6>
          </div>
          <label className="switch">
            <input type="checkbox" />
            <span></span>
          </label>
        </nav>
        <li className="small-divider"></li>
        <nav className="wrap small-space">
          <button className="red" onClick={() => deleteAllSettings()}>
            <i>delete_forever</i>
            <span>Удалить все настройки</span>
          </button>
          <button className="red" onClick={() => deleteSearchHistory()}>
            <i>delete_history</i>
            <span>Удалить историю поиска</span>
          </button>
        </nav>
      </dialog>
    </>
  );
}
