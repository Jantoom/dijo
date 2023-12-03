import UploadModal from "../marketplace/UploadModal";
import SearchWrapper from "../marketplace/SearchWrapper";
import SearchBar from "../marketplace/SearchBar";
import { useState } from "react";
import HomeIcon from "../assets/HomeIcon";
import AssetDisplayer from "../marketplace/AssetDisplayer";

function MarketplacePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);

    return (
        // <SearchWrapper></SearchWrapper>
        <div className="min-h-screen flex flex-col">
            <div className="h-20 dijo-dark-grey flex justify-between items-center	px-8">
                <h1 className='text-dijo-blue text-5xl font-semibold'>DIJO</h1>
                <div className="w-1/2">
                    <SearchBar setSearchTerm={setSearchTerm}></SearchBar>
                </div>
                <div className="flex items-center gap-x-2">
                    <UploadModal>
                        Upload
                    </UploadModal>
                    <div className="w-10">
                        <a href="/main"><HomeIcon></HomeIcon></a>
                    </div>
                </div>
            </div>
            <div className="bg-dijo-xlight-grey grow p-12">
                <h2 className="px-14 pb-5 text-4xl font-semibold my-5 text-dijo-dark-grey">DIJO Asset Marketplace</h2>
                <div className="">
                    <AssetDisplayer page={page} searchTerm={searchTerm} setPageFromChild={setPage}></AssetDisplayer>
                </div>
            </div>
        </div>
      )
}

export default MarketplacePage;