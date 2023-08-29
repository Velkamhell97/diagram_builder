import { useRef, useState, useMemo } from "react";
import { Circle, Group, Layer, Line, Rect, Stage, Text } from "react-konva";
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
import ToolsBar from './SideBar';
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
  // Refs
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
  const [entityFields, setEntityFields] = useState([]);

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
    setEntity({});
    setEntityFields([]);
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
          
          
          {/* Enties */}
          <Layer>
            {
              entities.map((entity) => {
                return <EntityBlock
                  key={entity.name} 
                  id={entity.name}
                  entity={entity}
                  x={100}
                  y={100}
                />
              })
            }
            

            {/* {line && (
              <Line
                stroke="red"
                strokeWidth={10}
                points={[line.from.x, line.from.y, line.to.x, line.to.y]}
              />
            )} */}

          {/* 
            Rectangulo () 
              Header (x, 30)
                Titulo ()
              Campos
                Nombre(100)

          */}
          

           
          </Layer>
        </Stage> 
      </Canvas>

      <Modal show={showModal} onHide={closeModal} centered size="lg">
        <Modal.Header closeButton>
         <Form.Control  style={{border: 0, boxShadow: "none", fontWeight: "bold", fontSize: 18}} autoFocus type="name" placeholder="Mi entidad" onChange={(event) => {
            setEntity({...entity, 'name': event.target.value})
          }} />
        </Modal.Header>
        <Modal.Body>
          <BContainer>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Nombre del campo</Form.Label>
                  <Form.Control value={entity.fieldName ?? ""} placeholder="" onChange={(event) => {
                    setEntity({...entity, 'fieldName': event.target.value})
                  }} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Tipo</Form.Label>
                  <Form.Select value={entity.fieldType ?? "string"} aria-label="Default select example" onChange={(event) => {
                    setEntity({...entity, 'fieldType': event.target.value})
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
                  <Form.Control value={entity.fieldValue ?? ""} type="value" placeholder="" onChange={(event) => {
                    setEntity({...entity, 'fieldValue': event.target.value})
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
              entityFields.map((entityField) => {
                return <Row>
                  <Col>
                    {entityField.name}
                  </Col>
                  <Col>
                    {entityField.type}
                  </Col>
                  <Col>
                    {entityField.value}
                  </Col>
                </Row>
              })
            }
          </BContainer>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => {
            setEntityFields([
              ...entityFields, 
              {
                'name': entity.fieldName,
                'type': entity.fieldType ?? "string", 
                'value': entity.fieldValue
              }
            ]);
            setEntity({'name': entity.name});
          }}>
            Agregar atributo
          </Button>
          <Button variant="primary" onClick={() => {
            setEntityFields([]);
            setEntities([
              ...entities, 
              {
                'name': entity.name,
                'fields': entityFields
              }
            ])
            setShowModal(false);
          }}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default DiagramBuilder;