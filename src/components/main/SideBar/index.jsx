import styled from "styled-components"
import CanvasShape from "./CanvaShape"
import CanvaCircle from "./CanvaCircle"

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
  grid-template-columns: repeat(2, 100px);
  grid-gap: 10px;
  grid-auto-rows: 100px;
`

const SideElement = styled.div`
  border: 1px solid black;
`

function ToolsBar() {
  const onDragStart = (e, type) => {
    e.dataTransfer.setData("type", type)
  }
  
  return (
    <SideBar>
      <SideContent>
        <SideElement 
          draggable="true" 
          onDragStart={(e) => onDragStart(e, "rect")}
        > 
          <CanvasShape />
        </SideElement>

        <SideElement 
          draggable="true" 
          onDragStart={(e) => onDragStart(e, "circle")} 
        >
          <CanvaCircle />
        </SideElement>

        <SideElement />

        <SideElement />

        <SideElement />

        <SideElement />

      </SideContent>
    </SideBar>
  )
}

export default ToolsBar;