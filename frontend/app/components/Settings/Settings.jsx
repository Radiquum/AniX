export default function Settings() {
  return (
    <>
      <dialog
        className="active left round bottom small"
        style={{ blockSize: "unset" }}
      >
        <h5>Настройки</h5>
        <nav className="wrap">
          <div class="max">
            <h6 className="small">сохранение в истории просмотров</h6>
          </div>
          <label class="switch">
            <input type="checkbox" />
            <span></span>
          </label>
        </nav>
        <li className="small-divider"></li>
        <nav className="wrap small-space">
          <button className="red">
            <i>delete_forever</i>
            <span>Удалить все настройки</span>
          </button>
          <button className="red">
            <i>delete_history</i>
            <span>Удалить историю поиска</span>
          </button>
        </nav>
      </dialog>
    </>
  );
}
