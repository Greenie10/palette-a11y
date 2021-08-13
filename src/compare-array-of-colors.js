import React, { useState } from "react";
import styled from "styled-components";
import { SmallColorList } from "./colors.js";

export const CompareArrayOfColors = () => {
  const [result, setResult] = useState("");

  // create an array with all the details in
  const colorArray = [];
  const createColorArray = (hex) => {
    const rgb = hexToRgb(hex);
    const luminance = calculateLuminance(rgb.r, rgb.g, rgb.b);
    colorArray.push([hex, rgb, luminance]);
  };

  // break the colour into rgb
  const hexToRgb = (hex) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // calculate luminance for each colour
  const calculateLuminance = (r, g, b) => {
    const a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const handleClick = () => {
    SmallColorList.map((x) => createColorArray(x));
    const ratio = {};
    // const rgb = ColorList.map((x) => hexToRgb(x));
    // const luminanceArray = rgb.map((x) => calculateLuminance(x.r, x.g, x.b));

    // set a ratio for each combination of colours
    colorArray.forEach(([hex, _rgb, luminance]) => {
      colorArray.forEach(([hex2, _rgb2, luminance2]) => {
        ratio[`${hex}_${hex2}`] =
          luminance >= luminance2
            ? (luminance2 + 0.05) / (luminance + 0.05)
            : (luminance + 0.05) / (luminance2 + 0.05);
      });
    });

    console.log("colorArray: ", colorArray);
    console.log("ratio: ", ratio);

    setResult(<div>stuff</div>);
  };

  return (
    <div>
      <button onClick={handleClick}>Show array</button>
      <Result id="result">{result}</Result>
    </div>
  );
};

const Result = styled.div`
  text-align: left;
`;
