import { useRef, useState, useMemo } from "react";
import { Circle, Group, Layer, Line, Rect, Stage, Text } from "react-konva";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import styled from "styled-components";
import { v4 as uuidv4 } from 'uuid';

import EntityBlock from "../konva/EntityBlock";
import { EditableText } from "../konva/EditableText/KonvaEditableText";
import ToolsBar from './SideBar';
import { KonvaEditableTextInput } from "../konva/EditableText/KonvaEditableTextInput";
import { Tab, Tabs } from "react-bootstrap";


const RootContainer = styled.div`
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
  const [entity, setEntity] = useState({});
  const [entities, setEntities] = useState([]);
  const [entityForm, setEntityForm] = useState({});

  // const size = {width: 180, height: 200};
  // const radius = 100;

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
    setEntityForm({});
    setShowModal(false);
  }

  const isEntityEmpty = () => Object.keys(entityForm).length === 0;
  
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
    <RootContainer>
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
                  key={entity.id} 
                  id={entity.id}
                  entity={entity}
                  x={100} y={100}
                  onClick={() => {
                    setEntity(entity);
                    setShowModal(true);
                  }}
                />
              })
            }
          </Layer>
        </Stage> 
      </Canvas>

      <Modal show={showModal} onHide={closeModal} centered size="lg">
        <Modal.Header closeButton>
          <Form.Control 
            value={entity.name ?? ""}
            style={{border: 0, boxShadow: "none", fontWeight: "bold", fontSize: 18}} 
            autoFocus={!entity.id} type="name" placeholder="Mi entidad" 
            onChange={(event) => {
              setEntity({...entity, 'name': event.target.value})
            }} 
          />
        </Modal.Header>

        <Modal.Body>
          <Tabs id="tabs" className="mb-3" >
            <Tab eventKey="home" title="Propiedades">
              {/* Formulario para propiedades */}
              <Container>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre del campo</Form.Label>
                      <Form.Control autoFocus={entity.id} value={entityForm.name ?? ""} onChange={(event) => {
                        setEntityForm({...entityForm, 'name': event.target.value})
                      }} />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Tipo</Form.Label>
                      <Form.Select value={entityForm.type ?? "string"} onChange={(event) => {
                        setEntityForm({...entityForm, 'type': event.target.value})
                      }}>
                        <option value="string">String</option>
                        <option value="integer">Integer</option>
                        <option value="boolean">Boolean</option>
                      </Form.Select>
                    </Form.Group> 
                  </Col>

                  <Col md="1">
                    <Form.Group className="mb-3">
                      <Form.Label>PK</Form.Label>
                      <Form.Check 
                        type="checkbox" 
                        checked={isEntityEmpty() ? false : (entityForm.pk ?? false)} 
                        onChange={(event) => setEntityForm({...entityForm, 'pk': event.target.checked})} 
                      />
                    </Form.Group> 
                  </Col>

                  <Col md="1">
                    <Form.Group className="mb-3">
                      <Form.Label>NN</Form.Label>
                      <Form.Check 
                        type="checkbox" 
                        checked={isEntityEmpty() ? false : (entityForm.nn ?? false)} 
                        onChange={(event) => setEntityForm({...entityForm, 'nn': event.target.checked})} 
                      />
                    </Form.Group> 
                  </Col>
                </Row>
              </Container>
              
              {/* Propiedades */}
              <Container>
                <Row>
                  <Col>
                    <h6>Nombre</h6>
                  </Col>
                  <Col>
                    <h6>Tipo</h6>
                  </Col>
                  <Col md="1">
                    <h6>PK</h6>
                  </Col>
                  <Col md="1">
                    <h6>NN</h6>
                  </Col>
                </Row>
                {
                  (entity?.fields ?? []).map((field) => {
                    return <Row key={field.name}>
                      <Col>
                        {field.name}
                      </Col>
                      <Col>
                        {field.type}
                      </Col>
                      <Col md="1">
                        <Form.Check type="checkbox" readOnly checked={field.pk} />
                      </Col>
                      <Col md="1">
                        <Form.Check type="checkbox" readOnly checked={field.nn}/>
                      </Col>
                    </Row>
                  })
                }
              </Container>  
            </Tab>
            
            <Tab eventKey="profile" title="Metodos">
              {/* Formulario para metodos */}
              <Container>
                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Nombre del metodo</Form.Label>
                      <Form.Control value={entityForm.method?.name ?? ""} onChange={(event) => {
                        setEntityForm({...entityForm, method: {name: event.target.value}});
                      }} />
                    </Form.Group>
                  </Col>

                  {/* <Col>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Tipo</Form.Label>
                      <Form.Select value={entityForm.type ?? "string"} onChange={(event) => {
                        setEntityForm({...entityForm, 'type': event.target.value})
                      }}>
                        <option value="string">String</option>
                        <option value="integer">Integer</option>
                        <option value="boolean">Boolean</option>
                      </Form.Select>
                    </Form.Group> 
                  </Col> */}
                </Row>
              </Container>
              
              {/* Propiedades */}
              <Container>
                <Row>
                  <Col>
                    <h6>Nombre</h6>
                  </Col>
                </Row>
                {
                  (entity?.methods ?? []).map((method) => {
                    return <Row key={method.name}>
                      <Col>
                        {method.name}()
                      </Col>
                    </Row>
                  })
                }
              </Container>  
            </Tab>
          </Tabs>
         
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={() => {
            const field = {
              'name': entityForm.name,
              'type': entityForm.type ?? "string",
              'pk': entityForm.pk ?? false,
              'nn': entityForm.nn ?? false, 
            }

            const method = entityForm.method;

            setEntity({
              ...entity, 
              ...(field.name) && {fields: [...(entity.fields ?? []), field]},
              ...(method) && {methods: [...(entity.methods ?? []), method]}
            });

            setEntityForm({});
          }}>
            Agregar atributo
          </Button>

          <Button variant="primary" onClick={() => {
            if(entity.id) {
              setEntities(entities.map(value => {
                return entity.id === value.id ? entity : value;
              }));
            } else {
              setEntities([...entities, {...entity, 'id': uuidv4()}])
            }

            setEntity({});
            
            setShowModal(false);
          }}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </RootContainer>
  )
}

export default DiagramBuilder;