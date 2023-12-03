import React, { useEffect, useState, useRef, useContext, MutableRefObject } from 'react';
import { CanvasContext } from '../Canvas';
import './Text.css'

interface TextProps {
    text: string | undefined
    colour: string | undefined
    size: number | undefined
    focused: boolean
    selected: boolean
    onChildUpdate: (updates:any) => void
    setShouldDelete: (status:boolean) => void
}

const Text: React.FC<TextProps> = (props) => {

    const textRef = useRef<HTMLInputElement | null>(null)
    const [text, setText] = useState(props.text)
    const [textSize, setTextSize] = useState(props.size)
    const [colour, setColour] = useState(props.colour)

    const hasSetSize = useRef(false);
    const hasSetColour = useRef(false);

    const canvasContext = useContext(CanvasContext)

    const style = {
        color: colour,
        fontSize: `${textSize}px`
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value)
        props.onChildUpdate({
            text: text,
            colour: colour,
            size: props.size
        })
        props.setShouldDelete(event.target.value === "")
    }

    const handleMouseDown = (event: React.MouseEvent<HTMLInputElement>) => {
        event.stopPropagation()
    }

    const handleKeyDown = (event: any) => {
        if (event.key === "Escape") {
            textRef.current?.blur()
        } else if (event.ctrlKey && event.keyCode === 83) {
            event.preventDefault()
        } else {
            event.stopPropagation()
        }
    }

    useEffect(() => {
        props.setShouldDelete(text === "")
        if (props.focused) {
            textRef.current?.focus()
        }
    }, [])

    useEffect(() => {
    }, [canvasContext.toolboxState.font])
    
    useEffect(() => {
        if (!hasSetSize.current) {
            hasSetSize.current = true
            return
        }
        if (props.selected && hasSetSize.current) {
            setTextSize(canvasContext.toolboxState.textSize)
            props.onChildUpdate({
                text: canvasContext.toolboxState.textSize,
                colour: colour,
                size: textSize
            })
        }
    }, [canvasContext.toolboxState.textSize])

    useEffect(() => {
        if (!hasSetColour.current) {
            hasSetColour.current = true
            return
        }
        if (props.selected && hasSetColour.current) {
            setColour(canvasContext.toolboxState.colour)
            props.onChildUpdate({
                text: text,
                colour: canvasContext.toolboxState.colour,
                size: textSize
            })
        }
    }, [canvasContext.toolboxState.colour])

    return (
        <input ref={textRef} className="text" value={text} onChange={handleInputChange} style={style} onMouseDown={handleMouseDown} onKeyDown={handleKeyDown}/>
    )
}

export default Text