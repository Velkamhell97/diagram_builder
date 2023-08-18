import { useMemo } from 'react'
import { Group, Rect, Line, Text } from "react-konva";

// Block
const blockWidth = 200;
const minBlockHeight = 200;

// Spaces
const horizontalPadding = 5;
const verticalSpace = 0;

// Header
const headerHeight = minBlockHeight * 0.2;
const titleWidth = blockWidth - horizontalPadding;
const titleHeight = headerHeight - horizontalPadding;
const titleFontSize = headerHeight * 0.5;

// Fields
const fieldHeight = 20;
const nameFieldWidth = blockWidth * 0.65;
const typeFieldWidth = blockWidth - nameFieldWidth;
const fieldFontSize = fieldHeight * 0.6;


function EntityBlock({entity, ...props}) {
  const blockHeight = useMemo(() => {
    const fieldsHeight = (entity.fields?.length ?? 0) * fieldHeight;
    return Math.max(fieldsHeight, minBlockHeight);
  }, []);

  let yPosition = headerHeight;

  return(
    <Group
      id={props.id}
      x={props.x} y={props.y}
      name={props.name}
      draggable="true"
      width={blockWidth}
      height={blockHeight}
    >
      <Rect
        x={0} y={0}
        width={blockWidth}
        height={blockHeight}
        fill="white"
        shadowBlur={8}
        shadowOpacity={0.1}
        cornerRadius={8.0}
        strokeWidth={1.0}
        stroke="#bdbdbd"
      />

      <>
        <Rect
          x={0} y={0}
          width={blockWidth}
          height={headerHeight}
          fill="#e5e5e5"
        />

        <Line
          x={0} y={headerHeight}
          points={[0, 0, blockWidth, 0]}
          stroke="#bdbdbd"
          strokeWidth={1.0}
        />

        <Text
          text={entity.name}
          align="center"
          y={(titleFontSize) / 2}
          width={titleWidth}
          height={titleHeight}
          fontSize={titleFontSize}
          wrap="none"
          ellipsis={true}
        />
      </>


      {
        (entity?.fields ?? []).map((field) => {
          yPosition += fieldHeight + (verticalSpace * 2)

          return <>
            <Text 
              x={horizontalPadding} y={yPosition}
              text={field.name}
              width={nameFieldWidth - horizontalPadding}
              height={fieldHeight}
              fontSize={fieldFontSize}
              strokeWidth={2}
              strokeEnabled={true}
            />

            <Text 
              x={nameFieldWidth} y={yPosition}
              align='right'
              text={field.type} 
              width={typeFieldWidth - horizontalPadding}   
              height={fieldHeight}
              fontSize={fieldFontSize - 1}
              fontStyle="italic"
              fill='gray'
            />
          </>
        })
      }

      {/* <Text
        text="int"
        align="right"
        x={-5}
        y={30}
        width={100}
        fontStyle="italic"
        fill="gray"
        height={30}
      />

      <Text
        text="nombre"
        align="left"
        x={5}
        y={30 + 20}
        height={30}
      />

      <Text
        text="int"
        align="right"
        x={-5}
        y={30 + 20}
        width={100}
        fontStyle="italic"
        fill="gray"
        height={30}
      />

      <Text
        text="activo"
        align="left"
        x={5}
        y={30 + 40}
        height={30}
      />

      <Text
        text="bool"
        align="right"
        x={-5}
        y={30 + 40}
        width={100}
        fontStyle="italic"
        fill="gray"
        height={30}
      />
 */}

      {/* {props.selected && (
        <Transformer
          ref={transformerRef}
          rotateEnabled={false}
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            return newBox;
          }}
        />
      )} */}
    </Group>
  );
}

export default EntityBlock;