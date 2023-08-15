import { useRef, useState, useLayoutEffect, useMemo } from "react";
import { Circle, Group, Layer, Line, Rect, Stage } from "react-konva";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import BContainer from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import styled from "styled-components";
import { v4 as uuidv4 } from 'uuid';

import EntityBlock from "../konva/EntityBlock";
import { EditableText } from "../konva/EditableText/KonvaEditableText";
import ToolsBar from './SideBar'
import { KonvaEditableTextInput } from "../konva/EditableText/KonvaEditableTextInput";

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

  // Shapes
  const [rects, setRects] = useState([]);
  const [circles, setCircles] = useState([]);
  const [lines, setLines] = useState([]);

  // Lines
  const [selected, setSelected] = useState(null);
  const [line, setLine] = useState(null);
  const [hovered, setHovered] = useState(null);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [entity, setEntity] = useState({'type': "string"});
  const [entities, setEntities] = useState([]);

  const size = {width: 180, height: 200};
  const radius = 100;

  const gap = 20.0;
  const xLines = [];
  const yLines = [];

  useMemo(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const numberOfHorizontalLines = width / gap;
    const numberOfVerticalLines = height / gap;

    for (let index = 0; index < numberOfHorizontalLines; index++) {
      xLines.push(
        <Line 
          x={gap * index}
          y={0}
          points={[0, 0, 0, height]}
          stroke='rgba(0, 0, 0, 0.2)'
          strokeWidth={1}
        />
      )
    }
    
    for (let index = 0; index < numberOfVerticalLines; index++) {
      yLines.push(
        <Line 
          x={0}
          y={gap * index}
          points={[0, 0, width, 0]}
          stroke='rgba(0, 0, 0, 0.2)'
          strokeWidth={1}
        />
      )
    }
  }, []);

  const closeModal = () => {
    setShowModal(false);
  }
  

  const onMouseDown = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    
    if(selected && clickedOnEmpty) {
      setSelected(null);
      return;
    }

    console.log(clickedOnEmpty);

    if(clickedOnEmpty) {
      console.log('entre');
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
    if(hovered && line) {
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

  const width = window.innerWidth;
  const height = window.innerHeight;

  const numberOfHorizontalLines = width / gap;
  const numberOfVerticalLines = height / gap;

  for (let index = 0; index < numberOfHorizontalLines; index++) {
    xLines.push(
      <Line 
        x={gap * index}
        y={0}
        points={[0, 0, 0, height]}
        stroke='rgba(0, 0, 0, 0.2)'
        strokeWidth={1}
      />
    )
  }
  
  for (let index = 0; index < numberOfVerticalLines; index++) {
    yLines.push(
      <Line 
        x={0}
        y={gap * index}
        points={[0, 0, width, 0]}
        stroke='rgba(0, 0, 0, 0.2)'
        strokeWidth={1}
      />
    )
  }

  return(
    <Container>
      <ToolsBar 
        onClickEntity={() => {
          setShowModal(true);
        }}
      />

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
          {/* Grid */}
          <Layer>
            <Rect 
              x={0}
              y={0}
              width={window.innerWidth}
              height={window.innerHeight}
              fill="#f0f0f0"
            />

            {
              [xLines, yLines]
            }
          </Layer>  
          
          
          {/* Shapes */}
          <Layer>
          <EditableText 
                    x={100}
                    y={100}
                    value={"Title"}
                    width={100}
                    height={100}
                    onChange={(value) => {}}
                  />

            {
              rects.map((rect, index) => {
                return <Group
                  x={rect.x - size.width / 2}
                  y={rect.y - size.height / 2}
                  key={rect.id}
                  draggable="true"
                >
                  <EntityBlock 
                    id={rect.id}
                    width={size.width}
                    height={size.height}
                    fill="white"
                    shadowBlur={8}
                    shadowOpacity={0.1}
                    cornerRadius={8.0}
                    // draggable="true"
                    strokeWidth={0.25}
                    stroke="black"
                    onSelect={() => setSelected(rect.id)}
                    selected={rect.id === selected}
                  />
                  
                  <KonvaEditableTextInput 
                    x={0}
                    y={0}
                    text={"Hola Mundo"}
                    width={100}
                    height={100}
                    onChange={(value) => {}}
                  />
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

            {/* {line && (
              <Line
                stroke="red"
                strokeWidth={10}
                points={[line.from.x, line.from.y, line.to.x, line.to.y]}
              />
            )} */}
          </Layer>
        </Stage> 
      </Canvas>

      <Modal show={showModal} onHide={closeModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Nueva entidad</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BContainer>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Nombre del campo</Form.Label>
                  <Form.Control type="name" placeholder="" onChange={(event) => {
                    setEntity({...entity, 'name': event.target.value})
                  }} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Tipo</Form.Label>
                  <Form.Select aria-label="Default select example" onChange={(event) => {
                    setEntity({...entity, 'type': event.target.value})
                  }}>
                    <option value="string" selected>String</option>
                    <option value="integer">Integer</option>
                    <option value="boolean">Boolean</option>
                  </Form.Select>
                </Form.Group> 
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Valor</Form.Label>
                  <Form.Control type="value" placeholder="" onChange={(event) => {
                    setEntity({...entity, 'value': event.target.value})
                  }} />
                </Form.Group>
              </Col>
            </Row>
          </BContainer>

          <BContainer>
            <Row>
              <Col>
                <h6>Nombre</h6>
              </Col>
              <Col>
                <h6>Tipo</h6>
              </Col>
              <Col>
                <h6>Valor</h6>
              </Col>
            </Row>
            {
              entities.map((entity) => {
                return <Row>
                  <Col>
                    {entity.name}
                  </Col>
                  <Col>
                    {entity.type}
                  </Col>
                  <Col>
                    {entity.value}
                  </Col>
                </Row>
              })
            }
          </BContainer>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => {
            console.log(entity);
            setEntities([...entities, {'name': entity.name, 'type': entity.type, 'value': entity.value}]);
            setEntity({"type":"string"});
          }}>
            Agregar atributo
          </Button>
          <Button variant="primary" onClick={() => {
            setShowModal(false);
          }}>
            Guardar cambion
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default DiagramBuilder;