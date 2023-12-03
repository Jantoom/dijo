import './ResizeBox.css'

interface ResizeBoxProps {
    resizeContainer: () => void;
}

const ResizeBox: React.FC<ResizeBoxProps> = ({ resizeContainer }) => {
    return (
        <div className="resize-box bottom-right" onMouseDown={() => resizeContainer()}></div>
    )
}

export default ResizeBox;