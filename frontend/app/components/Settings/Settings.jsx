"use client";

import { useUserStore } from "@/app/store/user-store";
import { useSettingsStore } from "@/app/store/settings-store";

function deleteAllSettings() {
  localStorage.removeItem("mode");
  localStorage.removeItem("theme");
  localStorage.removeItem("settings");
}

function deleteSearchHistory() {
  localStorage.removeItem("searches");
}

export default function Settings(props) {
  const userStore = useUserStore();
  const settingsStore = useSettingsStore();

  return (
    <>
      <dialog
        className="active left round bottom small"
        style={{ blockSize: "unset" }}
      >
        <h5>Настройки</h5>
        {userStore.isAuth && (
          <>
            <nav className="wrap">
              <div className="max">
                <h6 className="small">сохранение в истории просмотров</h6>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settingsStore.saveToHistory}
                  onChange={() =>
                    settingsStore.setSettings({
                      saveToHistory: !settingsStore.saveToHistory,
                    })
                  }
                />
                <span></span>
              </label>
            </nav>
            <li className="small-divider"></li>
          </>
        )}
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
        <div className="medium-divider"></div>
        <nav>
          <button
            className={`circle small transparent `}
            onClick={() => props.setSettingsPopup(!props.settingsPopup)}
          >
            <i>close</i>
          </button>
        </nav>
      </dialog>
    </>
  );
}
