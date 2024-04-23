"use client";

import "beercss";
import "material-dynamic-colors";
import { NavigationRail } from "@/app/components/NavigationRail/NavigationRail";
import { useEffect, useState } from "react";
import { ColorPicker } from "@/app/components/ColorPicker/ColorPicker";
import { useUserStore } from "./store/user-store";

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
      <div>
        <NavigationRail
          colorPicker={colorPicker}
          setColorPicker={setColorPicker}
        />
        {colorPicker && (
          <ColorPicker
            mode={mode}
            theme={theme}
            colorPicker={colorPicker}
            setColorPicker={setColorPicker}
          />
        )}
      </div>
      <main className="responsive">{props.children}</main>
    </body>
  );
};
