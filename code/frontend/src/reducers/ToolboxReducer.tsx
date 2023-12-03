interface ToolboxState {
    currentAsset: String,
    font: String,
    textSize: Number,
    colour: String
  }

const initialState:ToolboxState = {
      currentAsset: "1",
      font: "Arial",
      textSize: 20,
      colour: "#0000FF"
  };

enum ToolboxActionTypes {
    SET_COLOUR = 'SET_COLOUR',
    SET_FONT = 'SET_FONT',
    SET_TEXTSIZE = 'SET_TEXTSIZE'
  }

type ToolboxAction =
  | { type: ToolboxActionTypes.SET_COLOUR; payload: { colour: String } }
  | { type: ToolboxActionTypes.SET_FONT; payload: { font: String } }
  | { type: ToolboxActionTypes.SET_TEXTSIZE; payload: { size: Number } };

const toolboxReducer = (state: ToolboxState, action: ToolboxAction): ToolboxState => {
switch (action.type) {
    case ToolboxActionTypes.SET_COLOUR:
    return {
        ...state,
        colour: action.payload.colour
    };
    case ToolboxActionTypes.SET_FONT:
    return {
        ...state,
        font: action.payload.font
    };
    case ToolboxActionTypes.SET_TEXTSIZE:
        return {
            ...state,
            textSize: action.payload.size
        }
    default:
    return state;
    }
};

export { toolboxReducer, ToolboxActionTypes, initialState };
export type {ToolboxState, ToolboxAction};