import { useMemo, useState } from 'react'
import { Group, Rect, Line, Text, Image } from "react-konva";
import useImage from 'use-image';

// Block
const blockWidth = 200;
const minBlockHeight = 200;

// Spaces
const horizontalPadding = 10;
const verticalPadding = 10;
const fieldSpacing = 10;

// Header
const headerHeight = minBlockHeight * 0.2;
const titleWidth = blockWidth - horizontalPadding;
const titleHeight = headerHeight - horizontalPadding;
const titleFontSize = headerHeight * 0.5;

// Fields
const fieldHeight = 20.0;
const nameFieldWidth = blockWidth * 0.65;
const typeFieldWidth = blockWidth - nameFieldWidth;
const fieldFontSize = fieldHeight * 0.6;


function EntityBlock({entity, onClick, ...props}) {
  const [jsonView, setJsonView] = useState(false);

  const [image] = useImage("https://i.postimg.cc/brsnx6Dz/icons8-curly-brackets-50.png");

  const blockHeight = useMemo(() => {
    const fieldsHeight = (entity.fields?.length ?? 0) * fieldHeight;

    if(jsonView) {
      // const properties = Object.keys(entity.fields[0]).length;
      const properties = 2;
      const fields = entity.fields.length;
      const lines = 2 + (fields * (2 + properties));
      return headerHeight + (lines * fieldFontSize) + (verticalPadding * 2);
    } else {
      return headerHeight + fieldsHeight + (verticalPadding * 2);
    }
    // return Math.min(fieldsHeight, minBlockHeight);
  }, [entity, jsonView]);

  let yPosition = headerHeight;

  return(
    <Group
      id={props.id}
      x={props.x} y={props.y}
      name={props.name}
      draggable="true"
      width={blockWidth}
      height={blockHeight}
      // onClick={onClick}
      onClick={() => {
        setJsonView(!jsonView);
      }}
      // {...props}
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

        <Image
          x={blockWidth - 30}
          y={(headerHeight - 20) / 2}
          width={20}
          height={20}
          image={image}
        />
      </>

      <>
        {
          jsonView
          ?
            <Text 
              x={horizontalPadding} y={yPosition + verticalPadding}
              text={JSON.stringify(entity.fields, null, 2)}
              width={blockWidth - (horizontalPadding * 2)}
              // height={fieldHeight}
              // sceneFunc={(context, shape) => {
              //   context.fillStyle = 'rgb(255,255,204)';
              //   context.fillRect(0,0,shape.width(),shape.height());
              // }}
              fontSize={fieldFontSize}
              strokeWidth={2}
              strokeEnabled={true}
              verticalAlign='middle'
            />
          : (entity?.fields ?? []).map((field, index) => {
            yPosition += index === 0 ? verticalPadding : fieldHeight;

            return <>
              <Text 
                x={horizontalPadding} y={yPosition}
                text={field.name}
                width={nameFieldWidth - horizontalPadding}
                height={fieldHeight}
                // sceneFunc={(context, shape) => {
                //   context.fillStyle = 'rgb(255,255,204)';
                //   context.fillRect(0,0,shape.width(),shape.height());
                // }}
                fontSize={fieldFontSize}
                strokeWidth={2}
                strokeEnabled={true}
                verticalAlign='middle'
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
                verticalAlign='middle'
              />
            </>
          })
        }
      </>

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