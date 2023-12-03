import { ToolboxActionTypes, ToolboxState, ToolboxAction } from '../reducers/ToolboxReducer';
import { ChangeEvent, useState, useEffect } from "react";
import { Asset } from '../types/Asset';
import { fetchAssets } from '../api/AssetApi';

interface propType {
  toolboxState: ToolboxState | null;
  dispatch: React.Dispatch<ToolboxAction>;
  insertAsset: (assetPath:string) => void;
}

function Toolbox({toolboxState, dispatch, insertAsset} : propType) {
  const [purchasedAssets, setPurchasedAssets] = useState<Asset[]>([])
  const defaultColours = ["bg-[#FD2D00]", "bg-[#FD8A00]", "bg-[#FDDE00]", "bg-[#00FD17]", "bg-[#004DFD]", "bg-[#7F00FD]", "bg-[#FD00F5]", "bg-[#FD0000]", "bg-[#000000]"]

  useEffect(() => {
    fetchAssets(true, false, null, null).then((response) => {
        setPurchasedAssets(response.assets)
        console.log(response.assets)
      });
  },[])

  const setColour = (colour: String) => {
    dispatch({
      type: ToolboxActionTypes.SET_COLOUR,
      payload: { colour },
    });
  };

  const setFont = (font: String) => {
    dispatch({
      type: ToolboxActionTypes.SET_FONT,
      payload: { font },
    });
  };

  const setTextSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    dispatch({
      type: ToolboxActionTypes.SET_TEXTSIZE,
      payload: { size: newValue }
    });
  };

  return (
    <div className="h-screen w-1/5 flex flex-col bg-dijo-xlight-grey px-4 max-h-screen -mt-10 py-5 overflow-auto">
      <h1 className='text-2xl my-6 text-dijo-dark-grey'>Text</h1>
      <div className='my-4'>
        <span className="label-text mr-10 text-dijo-dark-grey">Font</span>
        <select 
          defaultValue="Arial" 
          className="bg-white border rounded-md px-4 py-1 w-3/6 max-w-xs"
          onChange={
            (event: ChangeEvent<HTMLSelectElement>) => setFont(event.target.value)
          }>
          <option>Arial</option>
        </select>
      </div>
      <div className='my-4'>
        <span className="label-text mr-10 text-dijo-dark-grey">Size</span>
        <input
              className="bg-white border rounded-md w-full py-2 my-2 px-5 text-dijo-light-grey leading-tight focus:outline-none focus:shadow-outline"
              id="size"
              type="number"
              min="1"
              max="100"
              onChange={
                (event: ChangeEvent<HTMLInputElement>) => setTextSize(event)
              }
              onKeyDown={(event: any) => event.stopPropagation()}
            />
      </div>
      <h1 className='text-2xl my-6 text-dijo-dark-grey'>Colours</h1>
      <div className='mx-8'>
        <div className="grid grid-cols-3 gap-4 h-full">
          {defaultColours.map((colour, index) => (
                                  <div 
                                    key={index}
                                    className={`w-8 h-8 ${colour} rounded-md`}
                                    onClick={() => {
                                      setColour(colour.substring(4,11))
                                    }}
                                  ></div> 
                              ))}
        </div>
      </div>
      <h1 className='text-2xl my-6 text-dijo-dark-grey'>Assets</h1> 
      <div className='overflow-y-auto grow'>
        {purchasedAssets.map((asset, index) => (
          <img 
            key={index} 
            src={asset.presigned_url} 
            className='mb-4 w-full'
            onClick={() => {insertAsset(asset.presigned_url)}}></img>
        ))}
      </div>
    </div>
  )
}

export default Toolbox