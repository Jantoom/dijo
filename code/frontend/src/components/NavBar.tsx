import { SelectedState } from "../types/SelectedState";
import MarketplaceIcon from "../assets/MarketplaceIcon";
import LogoutIcon from "../assets/LogoutIcon";
import AddIcon from "../assets/AddIcon";
import UserFolderIcon from "../assets/UserFolderIcon";
import CreateNotebookModal from "./CreateNotebookModal";
import CreatePageModel from "./CreatePageModel";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchNotebooks } from "../api/NotebookApi";
import { Cover, Notebook, Page } from "../types/Notebook";
import useAuth from "../context/userAuth";

interface propType {
    setSelectedState: React.Dispatch<React.SetStateAction<SelectedState>>
}

function NavBar({setSelectedState} : propType) {

    const { logout } = useAuth()

    const navigate = useNavigate()

    const [myNotebooks, setMyNotebooks] = useState<Notebook[]>([])

    useEffect(() => {
        fetchNotebooks().then((response) => {
            setMyNotebooks(response)
        })
    },[])

    const updateNotebooks = (notebook: Cover) => {
        setMyNotebooks(old=> [...old, {
            "notebook": notebook, 
            "pages":[]}
        ])
    }

    const updatePages = (bookIndex:number, page: Page) => {
        const updatedBooks = [...myNotebooks];
        updatedBooks[bookIndex].pages.push(page)
        setMyNotebooks(updatedBooks);
    }

    return (
        <div>
            <div className="flex h-screen flex-col">
                <div className="h-1/4">
                    <h1 className="text-3xl font-bold mx-4 my-2 text-dijo-blue">DIJO</h1>
                </div>
                <div className="overflow-y-auto">
                    <ul className="grow menu bg-white">
                    {myNotebooks.map((item, index) => (
                        <div key={index} className="collapse">
                            <input type="checkbox" className="peer" />
                            <div className="collapse-title font-semibold text-dijo-dark-grey">
                                {item.notebook.title}
                            </div>
                            <div className="collapse-content text-dijo-dark-grey pl-8">
                            {item.pages.map((page, index) => (
                                <p 
                                    key={index} 
                                    className="py-2"
                                    onClick={() => {
                                        setSelectedState({
                                            notebookID: item.notebook.id,
                                            pageID: page.id,
                                            notebookTitle: item.notebook.title,
                                            pageTitle: page.title,
                                            pageIndex: index
                                        });
                                    }}
                                >
                                    {page.title}
                                </p> 
                            ))}
                            <CreatePageModel notebookID={item.notebook.id} bookIndex={index} updatePages={updatePages}>
                                <p>+ Create page</p>
                            </CreatePageModel>
                            </div>
                        </div>
                    ))}
                    </ul>
                </div>
                <div className="content-end mt-auto my-8">
                    <CreateNotebookModal updateNotebooks={updateNotebooks}>
                    <div className="flex h-8 mx-3 my-3">
                        <AddIcon></AddIcon>
                        <p className="ml-1 h-14 text-dijo-dark-grey">New Notebook</p>
                    </div>
                    </CreateNotebookModal>
                    <a className="flex h-8 mx-4 my-3" onClick={() => (
                        navigate('/marketplace')
                    )}>
                        <MarketplaceIcon></MarketplaceIcon>
                        <p className="ml-2 h-14 text-dijo-dark-grey">Asset Marketplace</p>
                    </a>
                    <a className="flex h-8 mx-4 my-3" href="/assets">
                        <UserFolderIcon></UserFolderIcon>
                        <p className="ml-2 h-14 text-dijo-dark-grey">Manage Assets</p>
                    </a>
                    <div className="flex h-8 mx-4 my-3" onClick={() => {
                        logout()
                        navigate('/login')
                    }}>
                        {/* This is out of scope :) */}
                        <LogoutIcon></LogoutIcon>
                        <p className="ml-2 h-14 text-dijo-dark-grey">Logout</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NavBar