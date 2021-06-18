import React, { useState } from "react";
import styled, { css } from "styled-components";

export const CompareTwoColors = () => {
  const [color1, setColor1] = useState("");
  const [color2, setColor2] = useState("");
  const [result, setResult] = useState("");

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

  const updateColor1 = (event) => {
    const color =
      event.target.value.indexOf("#") > -1
        ? event.target.value
        : `#${event.target.value}`;
    setColor1(color);
  };

  const updateColor2 = (event) => {
    const color =
      event.target.value.indexOf("#") > -1
        ? event.target.value
        : `#${event.target.value}`;
    setColor2(color);
  };

  const handleClick = () => {
    // 1) read the colours and transform them into rgb format
    const color1rgb = hexToRgb(color1);
    const color2rgb = hexToRgb(color2);

    // 2) calculate the relative luminance
    const color1luminance = luminance(color1rgb.r, color1rgb.g, color1rgb.b);
    const color2luminance = luminance(color2rgb.r, color2rgb.g, color2rgb.b);

    // 3) calculate the color contrast ratio
    const ratio =
      color1luminance > color2luminance
        ? (color2luminance + 0.05) / (color1luminance + 0.05)
        : (color1luminance + 0.05) / (color2luminance + 0.05);

    setResult(
      <Result>
        <p>
          <LargeSquare1 color1={color1} color2={color2}>
            &
          </LargeSquare1>
          <LargeSquare2 color1={color2} color2={color1}>
            &
          </LargeSquare2>
          AA-level large text: {ratio < 1 / 3 ? "PASS" : "FAIL"}
        </p>
        <p>
          <SmallSquare1 color1={color1} color2={color2}>
            &
          </SmallSquare1>
          <SmallSquare2 color1={color2} color2={color1}>
            &
          </SmallSquare2>
          AA-level small text: {ratio < 1 / 4.5 ? "PASS" : "FAIL"}
        </p>
        <p>
          <LargeSquare1 color1={color1} color2={color2}>
            &
          </LargeSquare1>
          <LargeSquare2 color1={color2} color2={color1}>
            &
          </LargeSquare2>
          AAA-level large text: {ratio < 1 / 4.5 ? "PASS" : "FAIL"}
        </p>
        <p>
          <SmallSquare1 color1={color1} color2={color2}>
            &
          </SmallSquare1>
          <SmallSquare2 color1={color2} color2={color1}>
            &
          </SmallSquare2>
          AAA-level small text: {ratio < 1 / 7 ? "PASS" : "FAIL"}
        </p>
      </Result>
    );
  };

  return (
    <div>
      <input type="text" id="color-1" value={color1} onChange={updateColor1} />
      <input type="text" id="color-2" value={color2} onChange={updateColor2} />
      <button onClick={handleClick}>Calculate colour contrast</button>
      <div id="result">{result}</div>
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
  width: 40px;
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
