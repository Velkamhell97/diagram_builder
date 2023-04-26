import { useRef, useState } from "react";
import { Circle, Group, Layer, Line, Stage } from "react-konva";
import styled from "styled-components";
import { v4 as uuidv4 } from 'uuid';

import EntityBlock from "../konva/EntityBlock";
import ToolsBar from './SideBar'

const Container = styled.div`
  display: flex;
  height: 100%;
`

const Canvas = styled.div`
  background-color: #f2f3f5;
  height: 100vh;
  flex-grow: 1;
`

function DiagramBuilder () {
  const stageRef = useRef(null);

  const [rects, setRects] = useState([]);
  const [circles, setCircles] = useState([]);
  const [lines, setLines] = useState([]);

  const [selected, setSelected] = useState(null);
  const [line, setLine] = useState(null);
  const [hovered, setHovered] = useState(null);

  const size = {width: 180, height: 200};
  const radius = 100;

  const onMouseDown = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    
    if(selected && clickedOnEmpty) {
      setSelected(null);
      return;
    }

    if(clickedOnEmpty) {
      const point = {x: e.evt.offsetX, y: e.evt.offsetY};
      setLine({from: {x: point.x - 10, y: point.y - 10}, to: {x: point.x, y: point.y}});
    }
  }

  const onMouseMove = (e) => {
    if(line) {
      const point = {x: e.evt.offsetX, y: e.evt.offsetY};
      setLine({...line, to: {x: point.x, y: point.y}});

      if(hovered) {
        const rect = hovered.getClientRect();
      
        if(!collides(rect, line.to)) {
          hovered.stroke('black');
          setHovered(null);
        }
      }
    }
  }

  const onMouseUp = (_) => {
    if(hovered) {
      setLines([...lines, {points: [line.from.x, line.from.y, line.to.x, line.to.y]}])
    }

    setLine(null);
  }

  const onMouseOver = (e) => {
    if(!line) return

    if(e.target.hasName('entity')) {
      setHovered(e.target);

      const rect = e.target.getClientRect();
      
      if(collides(rect, line.to)) {
        e.target.stroke('red');
      };
    }
  }

  const onDrop = (e) => {
    e.preventDefault();
    
    const type = e.dataTransfer.getData("type");

    stageRef.current.setPointersPositions(e);

    const data = {id: uuidv4(), ...stageRef.current.getPointerPosition()};
    
    switch(type) {
      case "rect":
        setRects([...rects, data])
        break
      case "circle":
        setCircles([...circles, data])
        break
      default:
        return;
    }
  }

  function collides(rect, point) {
    const min = {x: rect.x, y: rect.y};
    const max = {x: rect.x + rect.width, y: rect.y + rect.height};

    return (point.x > min.x && point.y > min.y) && (point.x < max.x && point.y < max.y);
  }


  return(
    <Container>
      <ToolsBar />

      <Canvas 
        onDrop={onDrop} 
        onDragOver={(e) => e.preventDefault()}
      >
        <Stage
          width={window.innerWidth - 200}
          height={window.innerHeight}
          ref={stageRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseOver={onMouseOver}
        > 
          <Layer>
            {
              rects.map((rect, index) => {
                return <Group
                  x={rect.x - size.width / 2}
                  y={rect.y - size.height / 2}
                  key={rect.id}
                >
                  <EntityBlock 
                    id={rect.id}
                    width={size.width}
                    height={size.height}
                    fill="white"
                    shadowBlur={8}
                    shadowOpacity={0.1}
                    cornerRadius={8.0}
                    draggable="true"
                    strokeWidth={0.25}
                    stroke="black"
                    onSelect={() => setSelected(rect.id)}
                    selected={rect.id === selected}
                  />
                  
                  {/* <KonvaEditableTextInput 
                    x={0}
                    y={0}
                    value={"Title"}
                    width={100}
                    height={100}
                    onChange={(value) => {}}
                  /> */}
                </Group>
              })
            }

            {
              circles.map((circle, index) => {
                return <Group
                  x={circle.x}
                  y={circle.y}
                  key={circle.id}
                >
                  <Circle
                    radius={radius}
                    fill="white"
                    shadowBlur={8}
                    shadowOpacity={0.1}
                    cornerRadius={8.0}
                    draggable="true"
                    strokeWidth={0.25}
                    stroke="black"
                  />
                </Group>
              })
            }

            {lines.map((line, index) => {
              return <Line
                key={`line-${index}`}
                stroke="red"
                name="line"
                strokeWidth={10}
                points={line.points}
              />
            })}

            {line && (
              <Line
                stroke="red"
                strokeWidth={10}
                points={[line.from.x, line.from.y, line.to.x, line.to.y]}
              />
            )}
          </Layer>
        </Stage> 
      </Canvas>
    </Container>
  )
}

export default DiagramBuilder;