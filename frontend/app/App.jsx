"use client";

import "beercss";
import "material-dynamic-colors";
import { NavigationRail } from "@/app/components/NavigationRail/NavigationRail";
import { setTheme, getTheme, setMode, getMode } from "./store/theme-store";
import { useEffect, useState } from "react";
import { ColorPicker } from "@/app/components/ColorPicker/ColorPicker";

export const App = (props) => {
  const [colorPicker, setColorPicker] = useState(false);

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
