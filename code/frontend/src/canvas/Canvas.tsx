import React, { useState, useEffect, useRef, useReducer, MutableRefObject } from 'react'
import Container from './container/Container.js'
import { calculateSelectionBox, generateID, Position } from './utils.js'
import Toolbox from './Toolbox.js';
import { toolboxReducer, initialState } from '../reducers/ToolboxReducer.js';
import Alert from './Alert.js';
import './Canvas.css'

interface CanvasProps {
    pageContentUpdate: number
    pageContent: MutableRefObject<string>
    saveContent: (content: string) => void
}

export const CanvasContext = React.createContext<any>(null);

const Canvas = ({ pageContentUpdate, pageContent, saveContent }: CanvasProps) => {
    
    const componentsRef = useRef<any[]>([])
    const selectedComponentsRef = useRef<any[]>([])
    const copiedComponentsRef = useRef<any[]>([])
    const lastCursorClickRef = useRef<Position>({ x: 0, y: 0 })
    const cursorPositionRef = useRef<Position>({ x: 0, y: 0 })
    const isItemSelectedRef = useRef<boolean>(false)
    const canvasRef = useRef<HTMLDivElement | null>(null)
    
    const [saved, setSaved] = useState<boolean>(false)
    const [canvasOffset, setCanvasOffset] = useState<Position>({ x: 0, y: 0 })
    const [components, setComponents] = useState<any[]>([])
    const [update, setUpdate] = useState<number>(0)
    const [deselect, setDeselect] = useState<number>(0)
    const [isDragging, setIsDragging] = useState<boolean>(false)
    const [_, setCursorUpdate] = useState<Position>({ x: 0, y: 0 })
    const [selectionStyle, setSelectionStyle] = useState({ left: 0, top: 0, width: 0, height: 0, display: "none" })
    
    const [toolboxState, dispatch] = useReducer(toolboxReducer, initialState);
    
    const contextValue = {
        cursorPositionRef, lastCursorClickRef, isItemSelectedRef, isDragging, update, deselect, canvasOffset, toolboxState
    }

    const setSelectedComponent = (component:any) => {
        selectedComponentsRef.current.push(component)
    }

    useEffect(() => {
        const bounds = canvasRef.current?.getBoundingClientRect()
        if (bounds !== undefined) {
            setCanvasOffset({x: bounds?.x, y: bounds.y})
        }
    }, [canvasRef.current])

    useEffect(() => {
        const parsedContent = JSON.parse(pageContent.current)
        setComponents(parsedContent)
    }, [pageContentUpdate])

/**************************************************************************************************************
 *  Mouse Movements                                                                                           *
**************************************************************************************************************/

    const handleMouseDown = (event: React.MouseEvent) => {
        const bounds = canvasRef.current?.getBoundingClientRect()
        if (bounds !== undefined) {
            setCursorUpdate({ x: event.clientX - bounds.left, y: event.clientY - bounds.top });
            setIsDragging(true);
            lastCursorClickRef.current = { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
            selectedComponentsRef.current = []
        }
    }
    
    const handleMouseMove = (event: React.MouseEvent) => {
        const bounds = canvasRef.current?.getBoundingClientRect()
        if (bounds !== undefined) {
            setCursorUpdate({ x: event.clientX - bounds.left, y: event.clientY - bounds.top });
            cursorPositionRef.current = { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
        }
        if (isDragging) {
            if (!isItemSelectedRef.current) {
                updateSelectionBox(true)
            }
        }
    }

    const handleMouseUp = (event: React.MouseEvent) => {
        setIsDragging(false);
        if (!isItemSelectedRef.current && event.clientX - canvasOffset.x == lastCursorClickRef.current.x) {
            addTextBox()
        }
        updateSelectionBox(false)
        isItemSelectedRef.current = false;
        selectedComponentsRef.current = []
    }


/**************************************************************************************************************
 *  Regularly Updates of Canvas Components                                                                    *
 **************************************************************************************************************/

    /**
     * Initialises a timer on component start up that will create updates to all the components
     * within the Canvas.
     * 
     * The component buffer will replace the old components and will be flushed for the next
     * call of the interval.
     */
    useEffect(() => {
        const timer = setInterval(() => {
            componentsRef.current = []
            setUpdate(update => update + 1)
        }, 100);
    
        return () => {
          clearInterval(timer);
        };
    }, []);

    /**
     * At each interval, objects will fill the component buffer with information about changes
     * to the component since the last render. 
     * 
     * @param component Object of the Component
     */
    const updateComponentBuffer = (component:any) => {
        componentsRef.current.push(component)
    }

/**************************************************************************************************************
 *  Adding Components to the Canvas                                                                           *
 **************************************************************************************************************/

    const addComponent = (component:any, atCusor: boolean = false) => {
        if (atCusor) {
            component.container = { 
                ...component.container,
                left: lastCursorClickRef.current.x - component.container.width / 2,
                top: lastCursorClickRef.current.y - component.container.height / 2
            }
        } else {
            component.container = { 
                ...component.container,
                left: component.container.left + 50,
                top: component.container.top + 50
            }
        }
        componentsRef.current.push({
            ...component, 
            id: generateID()
        })
    }

    const addTextBox = () => {
        componentsRef.current.push({
            id: generateID(),
            type: "Text",
            text: "",
            colour: "black",
            size: 40,
            focus: true,
            container: {
                left: cursorPositionRef.current.x - 250,
                top: cursorPositionRef.current.y - 50,
                width: 500,
                height: 100,
                rotation: 0,
                zIndex: 0
            }
        })
        updateComponentsArray()
    }

    const addAsset = (assetPath: string) => {
        const bounds = canvasRef.current?.getBoundingClientRect()
        if (bounds !== undefined) {
            componentsRef.current.push({
                id: generateID(),
                type: "Image",
                src: assetPath,
                container: {
                    left: bounds.width / 2 - 250,
                    top: bounds.height / 2 - 150,
                    width: 500,
                    height: 300,
                    rotation: 0,
                    zIndex: 0
                }
            })
            updateComponentsArray()
        }
    }

    const updateComponentsArray = () => {
        setComponents([... componentsRef.current])
        componentsRef.current = []
        setUpdate(update => update + 1)
    }


/**************************************************************************************************************
 *  Commands for Copy, Pasting and Deletion                                                                   *
 **************************************************************************************************************/

    const handleCopy = (event: any) => {
        copiedComponentsRef.current = [ ... selectedComponentsRef.current]
        event.preventDefault()
    }
    
    const handlePaste = (event: any) => {
        if (copiedComponentsRef.current.length === 0) return
        for (const component of copiedComponentsRef.current) {
            addComponent(component)
        }
        updateComponentsArray()
        event.preventDefault()
    }

    const handleKeyDown = (event:any) => {
        if (event.keyCode === 8) {
            const set = new Set()
            for (const component of selectedComponentsRef.current) {
                set.add(component.id)
            }
            const filteredComponents = componentsRef.current.filter(component => !set.has(component.id))
            componentsRef.current = filteredComponents
            setComponents(filteredComponents)
        } else if (event.ctrlKey && event.keyCode === 83) {
            event.preventDefault()
            setSaved(true)
            setTimeout(() => {
                setSaved(false)
            }, 1000)
            saveContent(JSON.stringify(componentsRef.current))
        } else if (event.key === 'Escape') {
            setDeselect(update => update + 1)
        }
    }

    useEffect(() => {
        document.addEventListener('copy', handleCopy);
        document.addEventListener('paste', handlePaste);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('paste', handlePaste);
            document.removeEventListener('delete', handlePaste);
        }
    }, [])


/**************************************************************************************************************
 *  Commands for Copy, Pasting and Deletion                                                                   *
 **************************************************************************************************************/

    const updateSelectionBox = (active: boolean) => {
        const selectionBoxContainer = calculateSelectionBox(lastCursorClickRef.current, cursorPositionRef.current)
        if (active) {
            setSelectionStyle({
                ...selectionBoxContainer,
                display: "block"
            })
        } else {
            setSelectionStyle({
                ... selectionBoxContainer, 
                display: "none"
            })
        }
    }

    return (
        <div className="flex">
            <div ref={canvasRef} id="canvas" className="grow canvas" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onKeyDown={handleKeyDown}>
                    <div className="selection-box" style={selectionStyle}/>
                    <CanvasContext.Provider value={contextValue}>
                        {components.map((com:any) =>
                            <Container key={com.id}
                                component={com}
                                update={updateComponentBuffer}
                                setSelectedComponent={(component) => setSelectedComponent(component)}
                                setItemSelected={() => isItemSelectedRef.current = true}
                            />)}
                    </CanvasContext.Provider>
            </div>
            <Toolbox toolboxState={toolboxState} dispatch={dispatch} insertAsset={addAsset}/>
            <Alert status={saved}/>
        </div>
    )
}

export default Canvas