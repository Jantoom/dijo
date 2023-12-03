import React, { useState } from 'react';
import AssetDisplayer from "./AssetDisplayer";
import Uploader from "./Uploader";

const SearchWrapper = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [assets, setAssets] = useState(null);

    const handleSearchTermSubmit = (e) => {
        e.preventDefault();
        setSearchTerm(e.target[0].value);
    }

    const setPageFromChild = (page) => {
        setPage(page);
    };

    return(
    <div>
        <form onSubmit={handleSearchTermSubmit}>
            <input type="text" name="search_term" id="search"/>
            <button type="submit">Search</button>
        </form>
        <Uploader/>
        <AssetDisplayer key={assets} searchTerm={searchTerm} page={page} assets={assets}
            setPageFromChild={setPageFromChild}/>
    </div>
    )
}

export default SearchWrapper;
