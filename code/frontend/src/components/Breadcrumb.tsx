import { SelectedState } from "../types/SelectedState"

interface propType {
    selectedState: SelectedState
}

const Breadcrumb = ({selectedState} : propType)=> {
    return(
        <div className="text-l breadcrumbs">
            <ul>
                {selectedState.notebookID === "" 
                ? 
                <li className="text-dijo-dark-grey">No page selected</li> 
                : 
                <>
                    <li className="text-dijo-dark-grey">{selectedState.notebookTitle}</li> 
                    <li className="text-dijo-dark-grey">{selectedState.pageTitle}</li> 
                </>
                }
            </ul>
        </div>
    )
  }
export default Breadcrumb