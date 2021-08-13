import React, { useState } from "react";
import styled, { css } from "styled-components";
import { SmallColorList } from "./colors";

export const ImportArray = () => {
  // const justTwoColors = SmallColorList.slice(0, 2);
  // console.log("JUSTTWOCOLOURS", justTwoColors);

  const [color1, setColor1] = useState("");
  const [color2, setColor2] = useState("");
  const [result, setResult] = useState([]);

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
  const luminance = (r, g, b) => {
    const a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const handleClick = () => {
    let colorArray = [];

    SmallColorList.forEach((color1) => {
      SmallColorList.forEach((color2) => {
        // 1) read the colours and transform them into rgb format
        const color1rgb = hexToRgb(color1);
        const color2rgb = hexToRgb(color2);

        // 2) calculate the relative luminance
        const color1luminance = luminance(
          color1rgb.r,
          color1rgb.g,
          color1rgb.b
        );
        const color2luminance = luminance(
          color2rgb.r,
          color2rgb.g,
          color2rgb.b
        );

        // 3) calculate the color contrast ratio
        const ratio =
          color1luminance > color2luminance
            ? (color2luminance + 0.05) / (color1luminance + 0.05)
            : (color1luminance + 0.05) / (color2luminance + 0.05);

        const aaLarge = ratio < 1 / 3 ? "pass" : "fail";
        const aaSmall = ratio < 1 / 4.5 ? "pass" : "fail";
        const aaaLarge = ratio < 1 / 4.5 ? "pass" : "fail";
        const aaaSmall = ratio < 1 / 7 ? "pass" : "fail";

        const output = {
          color1: color1,
          color2: color2,
          colors: [color1, color2],
          ratio: ratio,
          aaLarge: aaLarge,
          aaSmall: aaSmall,
          aaaLarge: aaaLarge,
          aaaSmall: aaaSmall,
        };

        colorArray.push(output);
      });
    });

    setResult(colorArray);
  };

  return (
    <div>
      <button onClick={handleClick}>Calculate colour contrast</button>
      <p>
        Excellent accessibility = AAA small text (1:7 contrast ratio), AAA large
        text (1:4.5 contrast ratio)
      </p>
      <p>
        Good accessibility = AA small text (1:4.5 contrast ratio), AA large text
        (1:3 contrast ratio)
      </p>
      {result.map((palette, index) => {
        return (
          <Result key={color1 + color2 + index}>
            {palette.aaLarge === "pass" && palette.aaSmall === "fail" && (
              <p>
                <LargeSquare1 color1={palette.color1} color2={palette.color2}>
                  Large AA {palette.aaLarge}
                </LargeSquare1>
                <LargeSquare2 color1={palette.color2} color2={palette.color1}>
                  Large AA {palette.aaLarge}
                </LargeSquare2>
              </p>
            )}
            {palette.aaSmall === "pass" && palette.aaaSmall === "fail" && (
              <p>
                <SmallSquare1 color1={palette.color1} color2={palette.color2}>
                  Small AA & Large AAA {palette.aaSmall}
                </SmallSquare1>
                <SmallSquare2 color1={palette.color2} color2={palette.color1}>
                  Small AA & Large AAA {palette.aaSmall}
                </SmallSquare2>
              </p>
            )}
            {palette.aaaLarge === "pass" && palette.aaaSmall === "fail" && (
              <p>
                <LargeSquare1 color1={palette.color1} color2={palette.color2}>
                  Large AAA {palette.aaaLarge}
                </LargeSquare1>
                <LargeSquare2 color1={palette.color2} color2={palette.color1}>
                  Large AAA {palette.aaaLarge}
                </LargeSquare2>
              </p>
            )}
            {palette.aaaSmall === "pass" && (
              <p>
                <SmallSquare1 color1={palette.color1} color2={palette.color2}>
                  Small AAA {palette.aaaSmall}
                </SmallSquare1>
                <SmallSquare2 color1={palette.color2} color2={palette.color1}>
                  Small AAA {palette.aaaSmall}
                </SmallSquare2>
              </p>
            )}
          </Result>
        );
      })}
    </div>
  );
};

const Result = styled.div`
  text-align: left;
`;

const square = () => css`
  display: inline-block;
  height: 40px;
  line-height: 40px;
  text-align: center;
  width: 230px;
`;

const SmallSquare1 = styled.span`
  ${square};
  color: ${(props) => props.color2 || "orange"};
  background-color: ${(props) => props.color1 || "yellow"};
`;

const SmallSquare2 = styled.span`
  ${square};
  color: ${(props) => props.color2 || "orange"};
  background-color: ${(props) => props.color1 || "yellow"};
`;

const LargeSquare1 = styled.span`
  ${square};
  font-size: 24px;
  color: ${(props) => props.color2 || "orange"};
  background-color: ${(props) => props.color1 || "yellow"};
`;

const LargeSquare2 = styled.span`
  ${square};
  font-size: 24px;
  color: ${(props) => props.color2 || "orange"};
  background-color: ${(props) => props.color1 || "yellow"};
`;
