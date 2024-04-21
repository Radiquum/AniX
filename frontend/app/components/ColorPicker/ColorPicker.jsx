"use client";

import { useState } from "react";
import Styles from "./ColorPicker.module.css"

export const ColorPicker = (props) => {
  const colors = [
    { hex: "#ffffff", color: "white" },
    { hex: "#e91e63", color: "pink" },
    { hex: "#ff9800", color: "orange" },
    { hex: "#4caf50", color: "green" },
    { hex: "#009688", color: "teal" },
    { hex: "#9c27b0", color: "purple" },
    { hex: "#673ab7", color: "deep-purple" },
    { hex: "#ffeb3b", color: "yellow" },
    { hex: "#ffc8ff", color: Styles["radiquum-pink"]},
    { hex: "#0087c7", color: Styles["fuxigen-blue"]},
    { hex: "#e54040", color: Styles["anixart-red"]},
  ];
  const [mode, setMode] = useState(ui("mode"));

  return (
    <dialog className="active">
      <h5>Theme Select</h5>
      <div className="grid center-align">
        {colors.map((item) => {
          return (
            <button
              key={item.color}
              className={`circle small ${item.color} s2`}
              onClick={() => props.theme(item.hex)}
            ></button>
          );
        })}
      </div>
      <div className="medium-divider"></div>
      <button
        className={`circle small transparent`}
        onClick={() => {
          props.mode();
          setMode(ui("mode"));
        }}
      >
        {mode == "light" ? <i>dark_mode</i> : <i>light_mode</i>}
      </button>
    </dialog>
  );
};
