import React, { useState, useRef, useContext, useEffect } from 'react';
import { CanvasContext } from '../Canvas';
import RotateButton from './Rotate';
import ResizeBox from './ResizeBox';
import ComponentTypes from '../components/ComponentTypes';
import Text from '../components/Text'
import Rectangle from '../components/Rectangle';
import Image from '../components/Image'
import Video from '../components/Video';
import { boxesIntersect, calculateSelectionBox, calculateRotation } from '../utils';
import './Container.css'

interface ContainerProps {
    component: any
    update: (component:any) => void
    setSelectedComponent: (component:any) => void
    setItemSelected: () => void
}

const Container: React.FC<ContainerProps> = ({ component, update, setSelectedComponent, setItemSelected }) => {

    const canvasContext = useContext(CanvasContext)

    const positionOffsetRef = useRef({left: 0, top: 0})
    const shouldMoveRef = useRef<boolean>(false)
    const hoveredRef = useRef<boolean>(false)
    const selectedRef = useRef<boolean>(component.focus === true)
    const shouldRotateRef = useRef<boolean>(false)
    const shouldResizeRef = useRef<boolean>(false)
    const shouldDeleteRef = useRef<boolean>(false)

    const [rotation, setRotation] = useState<number>(component.container.rotation)
    const [position, setPosition] = useState({ left: component.container.left, top: component.container.top})
    const [size, setSize] = useState({ width: component.container.width, height: component.container.height})
    const [childProperties, setChildProperties] = useState({})

    const containerRef = useRef<HTMLDivElement | null>(null)

    const style = {
        top: position.top,
        left: position.left,
        width: size.width,
        height: size.height,
        transform: `rotate(${rotation}deg)`
    }

/**************************************************************************************************************
 *  Canvas Change Callbacks                                                                                   *
**************************************************************************************************************/

    useEffect(() => {
        if (shouldRotateRef.current) {
            if (canvasContext.canvasOffset !== undefined) {
                const offset = {
                    x: canvasContext.cursorPositionRef.current.x + canvasContext.canvasOffset.x,
                    y: canvasContext.cursorPositionRef.current.y + canvasContext.canvasOffset.y,
                }
                setRotation(calculateRotation(containerRef.current?.getBoundingClientRect(), offset))
            }
        } else if (shouldMoveRef.current && canvasContext.isDragging && !shouldResizeRef.current && canvasContext.isItemSelectedRef.current) {
            setPosition({ 
                left: canvasContext.cursorPositionRef.current.x + positionOffsetRef.current.left,
                top: canvasContext.cursorPositionRef.current.y + positionOffsetRef.current.top
            })
        }
        if (shouldResizeRef.current) {
            setSize({
                width: canvasContext.cursorPositionRef.current.x - position.left,
                height: canvasContext.cursorPositionRef.current.y - position.top
            })
        }
        if (canvasContext.isDragging && !canvasContext.isItemSelectedRef.current) {
            handleSelectionBox(hoveredRef)
        }
    }, [canvasContext.cursorPositionRef.current])
    
    useEffect(() => {
        if (canvasContext.isDragging) {
            if (!canvasContext.isItemSelectedRef.current) {
                handleSelectionBox(hoveredRef)
                handleSelectionBox(shouldMoveRef)
            }
            positionOffsetRef.current = {
                left: position.left - canvasContext.cursorPositionRef.current.x,
                top: position.top - canvasContext.cursorPositionRef.current.y
            }
            setPosition({ 
                left: canvasContext.cursorPositionRef.current.x + positionOffsetRef.current.left,
                top: canvasContext.cursorPositionRef.current.y + positionOffsetRef.current.top
            })
            handleSelectionBox(selectedRef)
        } else {
            shouldMoveRef.current = false;
            shouldRotateRef.current = false
            shouldResizeRef.current = false
            if (hoveredRef.current && !canvasContext.isItemSelectedRef.current) {
                handleSelectionBox(hoveredRef)
                handleSelectionBox(shouldMoveRef)
                handleSelectionBox(selectedRef)
            }
            hoveredRef.current = false
            if (selectedRef.current) {
                onComponentSelection()
            }
        }
    }, [canvasContext.isDragging])

/**************************************************************************************************************
 *  Update Selection in Canvas                                                                                *
**************************************************************************************************************/

    useEffect(() => {

        updateConfiguration()
    }, [canvasContext.update])

    useEffect(() => {
        selectedRef.current = false
        hoveredRef.current = false
    }, [canvasContext.deselect])

    const onComponentSelection = () => {
        selectedRef.current = true
        setSelectedComponent(getUpdatedConfiguration())
    }
    
    const updateConfiguration = () => {
        if (!shouldDeleteRef.current || selectedRef.current) {
            update(getUpdatedConfiguration())
        }
    }

    const getUpdatedConfiguration = () => {
        return {
            ...component,
            ...childProperties,
            container: {
                top: position.top,
                left: position.left,
                width: size.width,
                height: size.height,
                rotation: rotation
            }
        }
    }

    const handleSelectionBox = (reference:any) => {
        const border = containerRef.current?.getBoundingClientRect()
        if (border !== undefined && canvasContext.canvasOffset !== undefined) {
            const containerBox = {
                left: border.left - canvasContext.canvasOffset.x,
                top: border.top - canvasContext.canvasOffset.y,
                width: border.width,
                height: border.height
            }
            const selectionBox = calculateSelectionBox(canvasContext.lastCursorClickRef.current, canvasContext.cursorPositionRef.current)
    
            if (boxesIntersect(containerBox, selectionBox)) {
                reference.current = true
            } else {
                reference.current = false
            }
        }
    }

    const onChildUpdate = (updates:any) => {
        setChildProperties(updates)
    }


/**************************************************************************************************************
 *  Mouse Inputs                                                                                              *
**************************************************************************************************************/

    const mouseDown = (event: React.MouseEvent) => {
        selectedRef.current = true
        setItemSelected()
        positionOffsetRef.current = {
            left: position.left - event.clientX,
            top: position.top - event.clientY
        }
        shouldMoveRef.current = true
    }

/**************************************************************************************************************
 *  Container Components and Styling                                                                          *
**************************************************************************************************************/

    const getComponent = () => {
        switch (component.type) {
            case ComponentTypes.TEXT_TYPE:
                return <Text text={component.text}
                             colour={component.colour}
                             size={component.size}
                             onChildUpdate={onChildUpdate}
                             setShouldDelete={(state) => shouldDeleteRef.current = state}
                             focused={component.focus}
                             selected={selectedRef.current}
                             />
            case ComponentTypes.IMAGE_TYPE:
                return <Image src={component.src}/>
            case ComponentTypes.RECTANGLE_TYPE:
                return <Rectangle colour={component.colour}/>
            case ComponentTypes.VIDEO_TYPE:
                return <Video src={component.src}/>
        }
    }

    const selectionWidgets = () => {
        if (selectedRef.current || shouldRotateRef.current) {
            return (
                <>
                    <RotateButton setRotate={() => shouldRotateRef.current = true}/>
                    <ResizeBox resizeContainer={() => shouldResizeRef.current = true}/>
                </>
            )
        }
    }

    const isActive = () => {
        return shouldMoveRef.current || selectedRef.current || hoveredRef.current || shouldRotateRef.current
    }
    
    return (
        <div ref={containerRef} className={`item-container ${isActive() ? "selected": ""}`} style={style} onMouseDown={mouseDown}>
            {getComponent()}
            {selectionWidgets()}
        </div>
    )
}

export default Container