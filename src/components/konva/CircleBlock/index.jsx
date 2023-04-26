import { useEffect, useRef } from 'react'
import { Rect, Transformer } from "react-konva";

function EntityBlock(props) {
  const entitiRef = useRef();
  const transformerRef = useRef();

  useEffect(() => {
    if (props.selected) {
      transformerRef.current.nodes([entitiRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [props.selected]);

  return(
    <>
      <Rect
        ref={entitiRef}
        onClick={() => props.onSelect()}
        name='entity'
        {...props}
      />

      {props.selected && (
        <Transformer 
          ref={transformerRef}
          rotateEnabled={false}
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            return newBox;
          }}
        />
      )}
    </>
  );
}

export default EntityBlock;