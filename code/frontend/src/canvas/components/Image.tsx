import React from 'react';
import './Image.css'

interface ImageProps {
    src: string | undefined
}

const Image: React.FC<ImageProps> = (props) => {
    
    return (
        <img src={props.src} className="image" draggable={false}/>
    )
}

export default Image