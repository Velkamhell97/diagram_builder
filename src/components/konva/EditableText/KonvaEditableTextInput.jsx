import React from "react";
import { Html } from "react-konva-utils";
import styled from "styled-components";

function getStyle(width, height) {
  const baseStyle = {
    width: `${width}px`,
    height: `${height}px`,
    border: "none",
    padding: "0px",
    margin: "0px",
    background: "none",
    outline: "none",
    resize: "none",
    colour: "black",
    fontSize: "24px",
    fontFamily: "sans-serif",
    margintop: "-4px"
  };
  
  return baseStyle
}

const TextArea = styled.textarea`
  width: ${props => `${(props.width || 0)}px`};
  height: ${props => `${(props.height || 0)}px`};;
  border: none;
  padding: "0px";
  margin: "0px";
  background: none;
  outline: none;
  resize: none;
`

function KonvaEditableTextInput({
  x,
  y,
  width,
  height,
  value,
  onChange,
  onKeyDown
}) {
  const style = getStyle(width, height);
  return (
    <Html groupProps={{ x, y }} divProps={{ style: { opacity: 1 } }}>
      <TextArea
        width={width}
        height={height}
        placeholder="Title"
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </Html>
  );
}

export default KonvaEditableTextInput;