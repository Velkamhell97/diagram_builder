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
const dividerHeight = 20.0;

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
  let yPosition = headerHeight;

  const [fieldsHeight, methodsHeight , blockHeight] = useMemo(() => {
    const fieldsHeight = (entity.fields?.length ?? 0) * fieldHeight;

    const methodsHeight = (entity.methods?.length ?? 0) * fieldHeight;

    const blockHeight = headerHeight + (verticalPadding * 2) + fieldsHeight + methodsHeight + dividerHeight;

    // return headerHeight + fieldsHeight + (verticalPadding * 2);
    
    // return Math.min(fieldsHeight, minBlockHeight);

    return [fieldsHeight, methodsHeight, blockHeight];
  }, [entity]);

  return(
    <Group
      id={props.id}
      x={props.x} y={props.y}
      name={props.name}
      draggable="true"
      width={blockWidth}
      height={blockHeight}
      onClick={onClick}
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
      </>

      
      {
        (entity?.fields ?? []).map((field, index) => {
          yPosition += index === 0 ? verticalPadding : fieldHeight;

          return <>
            <Text 
              x={horizontalPadding} y={yPosition}
              text={field.name}
              width={nameFieldWidth - horizontalPadding}
              height={fieldHeight}
              
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

      {
        (entity.methods.length) && 
        <>
          <Line
            x={0} y={blockHeight - verticalPadding - methodsHeight - dividerHeight / 2}
            points={[0, 0, blockWidth, 0]}
            stroke="#bdbdbd"
            strokeWidth={1.0}
          />
          
          {
            (entity?.methods ?? []).map((method, index) => {
              yPosition += index === 0 ? (fieldHeight + dividerHeight) : fieldHeight;

              return <>
                <Text 
                  x={horizontalPadding} y={yPosition}
                  text={`${method.name}()`}
                  width={nameFieldWidth - horizontalPadding}
                  height={fieldHeight}
                  
                  fontSize={fieldFontSize}
                  strokeWidth={2}
                  strokeEnabled={true}
                  verticalAlign='middle'
                />

                <Text 
                  x={nameFieldWidth} y={yPosition}
                  align='right'
                  text={"void"} 
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
      }
    </Group>
  );
}

export default EntityBlock;

// sceneFunc={(context, shape) => {
//   context.fillStyle = 'rgb(255,255,204)';
//   context.fillRect(0,0,shape.width(),shape.height());
// }}

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