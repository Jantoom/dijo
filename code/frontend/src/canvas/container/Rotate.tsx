import React from 'react';
import './Rotate.css'

interface RotationProps {
    setRotate: () => void;
}

const RotateButton: React.FC<RotationProps> = (props) => {

    return (
        <div className="rotate-button" onMouseDown={() => props.setRotate()}/>
    )
}

export default RotateButton