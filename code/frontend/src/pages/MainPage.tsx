import { useEffect, useState, useRef } from "react";
import Breadcrumb from "../components/Breadcrumb"
import Canvas from "../canvas/Canvas";
import NavBar from "../components/NavBar"
import { SelectedState } from "../types/SelectedState";
import { updatePage, fetchPage } from "../api/NotebookApi";
import { useMutation, useQueryClient } from "react-query";

function MainPage() {

  const initalState : SelectedState = {
    notebookID: "",
    pageID: "",
    notebookTitle: "",
    pageTitle: "",
    pageIndex: 0
  }

  const queryClient = useQueryClient();
  
  const [selectedState, setSelectedState] = useState(initalState)
  const pageContentRef = useRef<string>("[]")
  const [updatedPageContent, setUpdatedPageContent] = useState<string>("[]")
  const [update, setUpdate] = useState<number>(0)
  
  /**
   * Whenever the selected page state updates, we expect to save the current page content and rerender the new page content
   */
  useEffect(() => {
    if (selectedState.notebookID !== "" && selectedState.pageID !== "") {
      getPage.mutate({
        notebookID: selectedState.notebookID,
        pageIndex: selectedState.pageIndex
      })
    }

  }, [selectedState])

  useEffect(() => {
    if (selectedState.notebookID !== "" && selectedState.pageID !== "") {
      savePage.mutate({
        notebookID: selectedState.notebookID,
        pageIndex: selectedState.pageIndex,
        title: selectedState.pageTitle,
        content: updatedPageContent
      })
    }

  }, [updatedPageContent])


  const getPage = useMutation ({
    mutationFn: (page: {notebookID: string, pageIndex: number}) =>
      fetchPage(page),
    onSuccess: (response) => {
        queryClient.invalidateQueries({queryKey: ['notebooks', 'pages', 'page']})
        pageContentRef.current = response.content
        setUpdate(update => update + 1)
      },
      onError: (error) => {
        console.log(error)
      }
    })
    
    const savePage = useMutation ({
      mutationFn: (page: {notebookID: string, pageIndex: number, title: string, content: string}) =>
        updatePage(page),
      onSuccess: (response) => {
        queryClient.invalidateQueries({queryKey: ['notebooks', 'pages', 'page']})
    },
    onError: (error) => {
        console.log(error)
    }
  })

  return (
    <>
      <div className="h-screen bg-white">
        <div className="grid grid-cols-7 grid-rows-7 gap-0">
            <div className="row-span-6"><NavBar setSelectedState={setSelectedState}></NavBar></div>
            <div className="col-span-6 row-span-1 row-start-1 row-end-1 col-start-2"><Breadcrumb selectedState={selectedState}></Breadcrumb></div>
            <div className="col-span-6 row-span-6 col-start-2 row-start-2 row-end-7">
              <Canvas pageContentUpdate={update} pageContent={pageContentRef} saveContent={setUpdatedPageContent}/>
            </div>
        </div>
      </div>
    </>
  ) 
}

export default MainPage