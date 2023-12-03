import React from 'react';
import './Video.css'

interface VideoProps {
    src: string | undefined
}

const Video: React.FC<VideoProps> = (props) => {
    
    return (
        <iframe className="video" src={props.src} allow="autoplay; encrypted-media;" ></iframe>
    )
}

export default Video