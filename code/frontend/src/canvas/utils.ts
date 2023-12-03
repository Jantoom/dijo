export interface ContainerBox {
    left: number
    top: number
    width: number
    height: number
}

export interface Position {
    x: number
    y: number
}

export const boxesIntersect = (container: ContainerBox, selectionBox: ContainerBox) =>
    container.left <= selectionBox.left + selectionBox.width &&
    container.left + container.width >= selectionBox.left &&
    container.top <= selectionBox.top + selectionBox.height &&
    container.top + container.height >= selectionBox.top;

export const calculateSelectionBox = (startPoint: Position, endPoint: Position) => ({
    left: Math.min(startPoint.x, endPoint.x),
    top: Math.min(startPoint.y, endPoint.y),
    width: Math.abs(startPoint.x - endPoint.x),
    height: Math.abs(startPoint.y - endPoint.y),
});

export const calculateRotation = (border: any, cursorPosition: Position) => {
    if (border !== undefined) {
        const x = (border.left + border.right) / 2
        const y = (border.top + border.bottom) / 2
        const deltaX = x - cursorPosition.x
        const deltaY = y - cursorPosition.y
        const offset = deltaX < 0 ? 0 : 180
        return Math.atan(deltaY / deltaX) * 180 / Math.PI + 90 + offset
    }
    return 0
}

export const generateID = () => {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
