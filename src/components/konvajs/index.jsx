import { useRef, useState, useId } from "react";
import { Group, Layer, Line, Rect, Stage } from "react-konva";
import styled from "styled-components";
import { Html } from 'react-konva-utils';
import KonvaEditableTextInput from "./KonvaEditableTextInput";
import EntityBlock from "./EntityBlock";
import { v4 as uuidv4 } from 'uuid';


const Container = styled.div`
  display: flex;
  height: 100%;
`

const SideBar = styled.div`
  flex-basis: 200px;
  background-color: white;
  height: 100vh;
  box-sizing: border-box;
  box-shadow: 20px 0px 22px -18px rgba(0,0,0,0.1);
  z-index: 1;
  padding: 10px;
`

const SideContent = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
  grid-auto-rows: 100px;
`

const SideElement = styled.div`
  border: 1px solid black;
`

const Canvas = styled.div`
  background-color: #f2f3f5;
  height: 100vh;
  flex-grow: 1;
`

function MyComponent () {
  const stageRef = useRef(null);

  const [shapes, setShapes] = useState([]);
  const [lines, setLines] = useState([]);

  const [selected, setSelected] = useState(null);
  const [line, setLine] = useState(null);
  const [hovered, setHovered] = useState(null);

  const size = {
    width: 180,
    height: 200
  };

  const onMouseDown = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    
    if(selected) {
      if (clickedOnEmpty) setSelected(null);
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

  const onMouseUp = (e) => {
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

  const onMouseOut = (e) => {
    if(!line || !hovered) return;

    if(e.target.hasName('entity')) {
    }
  }

  const onDrop = (e) => {
    e.preventDefault();
    stageRef.current.setPointersPositions(e);
    setShapes([...shapes, {id: uuidv4(), ...stageRef.current.getPointerPosition()}])
  }

  const onSelect = (id) => {
    setSelected(id);
  }

  function collides(rect, point) {
    const min = {x: rect.x, y: rect.y};
    const max = {x: rect.x + rect.width, y: rect.y + rect.height};

    return (point.x > min.x && point.y > min.y) && (point.x < max.x && point.y < max.y);

    // return !(
    //   r2.x > r1.x + r1.width ||
    //   r2.x + r2.width < r1.x ||
    //   r2.y > r1.y + r1.height ||
    //   r2.y + r2.height < r1.y
    // );
  }

  return(
    <Container>
      <SideBar>
        <SideContent>
          <SideElement draggable="true" />
          <SideElement />
          <SideElement />
          <SideElement />
          <SideElement />
          <SideElement />
        </SideContent>
      </SideBar>
      
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
          onMouseOut={onMouseOut}
        > 
          <Layer>
            {
              shapes.map((shape, index) => {
                return <Group
                  x={shape.x - size.width / 2}
                  y={shape.y - size.height / 2}
                  key={`group-${index}`}
                >
                  <EntityBlock 
                    id={shape.id}
                    width={size.width}
                    height={size.height}
                    fill="white"
                    shadowBlur={8}
                    shadowOpacity={0.1}
                    cornerRadius={8.0}
                    draggable="true"
                    strokeWidth={0.25}
                    stroke="black"
                    onSelect={() => onSelect(shape.id)}
                    selected={shape.id == selected}
                  />
                  
                  <KonvaEditableTextInput 
                    x={0}
                    y={0}
                    value={"Title"}
                    width={100}
                    height={100}
                    onChange={(value) => {}}
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

export default MyComponent;