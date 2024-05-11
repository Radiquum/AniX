"use client";

import "beercss";
import "material-dynamic-colors";
import { NavigationRail } from "@/app/components/NavigationRail/NavigationRail";
import { useEffect, useState } from "react";
import { ColorPicker } from "@/app/components/ColorPicker/ColorPicker";
import { useUserStore } from "./store/user-store";
import Settings from "./components/Settings/Settings";

function setMode(mode) {
  localStorage.setItem("mode", mode);
}
function getMode() {
  return localStorage.getItem("mode");
}

function setTheme(theme) {
  localStorage.setItem("theme", theme);
}
function getTheme() {
  return localStorage.getItem("theme");
}

export const App = (props) => {
  const [colorPicker, setColorPicker] = useState(false);
  const [settingsPopup, setSettingsPopup] = useState(false);
  const userStore = useUserStore();

  const theme = async (from) => {
    setTheme(from);
    await ui("theme", from);
  };

  const mode = () => {
    let newMode = ui("mode") == "dark" ? "light" : "dark";
    setMode(newMode);
    ui("mode", getMode());
  };

  useEffect(() => {
    const mode = getMode();
    const theme = getTheme();
    if (mode != ui("mode")) {
      ui("mode", getMode());
    }
    if (theme != ui("theme")) {
      ui("theme", theme);
    }
  }, []);

  useEffect(() => {
    userStore.checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <body>
      <div style={{ display: "flex", "flex-direction": "row" }}>
        <div style={{ "padding-inline-start": "0" }}>
          <NavigationRail
            colorPicker={colorPicker}
            settingsPopup={settingsPopup}
            setColorPicker={setColorPicker}
            setSettingsPopup={setSettingsPopup}
          />
          {colorPicker && (
            <ColorPicker
              mode={mode}
              theme={theme}
              colorPicker={colorPicker}
              setColorPicker={setColorPicker}
            />
          )}
          {settingsPopup && (
            <Settings
              settingsPopup={settingsPopup}
              setSettingsPopup={setSettingsPopup}
            />
          )}
        </div>
        <main
          className="max padding"
          style={{
            height: "calc(100vh - 2rem)",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <div
            className="border round padding"
            style={{ height: "calc(100vh - 2rem)", "overflow-y": "scroll" }}
          >
            {props.children}
          </div>
        </main>
      </div>
    </body>
  );
};
