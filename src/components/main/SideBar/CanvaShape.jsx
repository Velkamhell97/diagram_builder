import { useRef, useEffect } from 'react'

function CanvasShape(props) {
  const canvasRef = useRef(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    const width = context.canvas.width;
    const height = context.canvas.height;

    context.fillStyle = '#000000';
    context.fillRect(25, 25, 50, 50);
  }, [])
  
  return <canvas ref={canvasRef} width={100} height={100}  {...props}/>
}

export default CanvasShape;