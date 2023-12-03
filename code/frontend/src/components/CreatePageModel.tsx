import { ReactNode, useState} from "react";
import { useMutation, useQueryClient} from 'react-query'
import { createPage } from "../api/NotebookApi";
import { Page } from "../types/Notebook";

interface propType {
    children: ReactNode;
    notebookID: string;
    bookIndex: number;
    updatePages: (bookIndex: number, page: Page) => void
}

function CreatePageModel({children, notebookID, bookIndex, updatePages} : propType) {
    const [notebookName, setNotebookName] = useState("")

    const queryClient = useQueryClient()

    const addPage = useMutation ({
        mutationFn: (page: {notebookID: string, title: string, content: string}) =>
            createPage(page),
        onSuccess: (response) => {
            queryClient.invalidateQueries({queryKey: ['notebooks']})
            console.log(response)
            updatePages(bookIndex, response)
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
            <label htmlFor={`${bookIndex}-modal`}>{children}</label>

            {/* Put this part before </body> tag */}
            <input type="checkbox" id={`${bookIndex}-modal`} className="modal-toggle" onChange={functionToCreate2} />
            <div className="modal">
            <div className="modal-box bg-white w-1/4 px-12 py-8">
                <form>
                    <label className="font-medium text-xl text-dijo-dark-grey">New Page Name:</label>
                        <input type="text" placeholder="Enter page name" value={notebookName} onChange={(event) => (setNotebookName(event.target.value))} className="mt-6 inline-block input bg-white input-bordered w-full max-w-xs" />
                    <div className="modal-action">
                        <label htmlFor={`${bookIndex}-modal`} className="btn bg-dijo-dark-grey border-none text-white rounded-full">Cancel</label>
                        <label htmlFor={`${bookIndex}-modal`} onClick={() => (
                            addPage.mutate({
                                title: notebookName,
                                content: "[]",
                                notebookID: notebookID
                            })
                        )} className="btn bg-dijo-orange border-none text-white rounded-full">Create</label>
                    </div>
                </form>
            </div>
            </div>
        </div>
    )
}

export default CreatePageModel