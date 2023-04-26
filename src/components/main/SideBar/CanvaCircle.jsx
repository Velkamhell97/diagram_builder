import { useRef, useEffect } from 'react'

function CanvaCircle(props) {
  const canvasRef = useRef(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    const width = context.canvas.width;
    const height = context.canvas.height;

    context.fillStyle = '#000000';
    context.beginPath();
    context.arc(50, 50, 25, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
  }, [])
  
  return <canvas ref={canvasRef} width={100} height={100}  {...props}/>
}

export default CanvaCircle;