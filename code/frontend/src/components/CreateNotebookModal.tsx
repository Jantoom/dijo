import { ReactNode, useState} from "react";
import { useMutation, useQueryClient, useQuery} from 'react-query'
import { createNotebook } from "../api/NotebookApi";
import { Cover, Notebook } from "../types/Notebook";

interface propType {
    children: ReactNode;
    updateNotebooks: (newNotebook: Cover) => void
}

function CreateNotebookModal({children, updateNotebooks} : propType) {
    const [notebookName, setNotebookName] = useState("")

    const queryClient = useQueryClient()

    const addNotebook = useMutation ({
        mutationFn: (notebook: {title: string, description: string}) =>
            createNotebook(notebook),
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['notebooks']})
            console.log(data)
            updateNotebooks(data)
        },
        onError: (error) => {
            console.log(error)
        }
    })
    
    const functionToCreate2 = () => {
        // Reset notebok name so it doesn't persist each time modal is toggled
        setNotebookName("")
    }

    return (
        <div>
            {/* The button to open modal */}
            <label htmlFor="my-modal">{children}</label>

            {/* Put this part before </body> tag */}
            <input type="checkbox" id="my-modal" className="modal-toggle" onChange={functionToCreate2} />
            <div className="modal">
            <div className="modal-box bg-white w-1/4 px-12 py-8">
                <form>
                    <label className="font-medium text-xl text-dijo-dark-grey">New Notebook Name:</label>
                        <input type="text" placeholder="Enter notebook name" value={notebookName} onChange={(event) => (setNotebookName(event.target.value))} className="mt-6 inline-block input bg-white input-bordered w-full max-w-xs" />
                    <div className="modal-action">
                        <label htmlFor="my-modal" className="btn bg-dijo-dark-grey border-none text-white rounded-full">Cancel</label>
                        <label htmlFor="my-modal" onClick={() => (
                            addNotebook.mutate({
                                title: notebookName,
                                description: "whatever"
                            })
                        )} className="btn bg-dijo-orange border-none text-white rounded-full">Create</label>
                    </div>
                </form>
            </div>
            </div>
        </div>
    )
}

export default CreateNotebookModal