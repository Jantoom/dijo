import React from 'react';
import './Rectangle.css'

interface RectangleProps {
    colour: string | undefined
}

const Rectangle: React.FC<RectangleProps> = (props) => {

    const styles = {
        backgroundColor: props.colour,
    }

    return (
        <div style={styles} className="rectangle" draggable={false}/>
    )
}

export default Rectangle