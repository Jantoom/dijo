import { useEffect, useState } from 'react'
import { fetchAssets, purchaseAsset } from "../api/AssetApi";
import SpinningIcon from '../assets/SpinningIcon';
import AssetCard from './AssetCard';
import { Asset } from '../types/Asset';

// PAGE CONSTANTS
const PAGE_SIZE = 10;

interface Props {
    page: number,
    searchTerm: String,
    setPageFromChild: (n: number) => void //React.Dispatch<React.SetStateAction<number>>
}


function AssetDisplayer({page, searchTerm, setPageFromChild} : Props) {

    const [assets, setAssets] = useState<{assets: Asset[], total_asset_count: number}>();

    // true because we want the modal that opens on asset click to enable buying
    const buy = true;

    useEffect(() => {
        getAssets();
    }, [page]);

    useEffect(() => {
        getAssets();
        setPageFromChild(1);
    }, [searchTerm]);


    const getAssets = async () => {
        const response = await fetchAssets(false, false, searchTerm, page);
        setAssets(response);
    };

    if (!assets) {
        return <div className='w-40 h-40'><SpinningIcon></SpinningIcon></div>;
    }

    // PAGE FUNCTIONALITY
    let numberOfPages = Math.floor(assets.total_asset_count/PAGE_SIZE);
    if ((assets.total_asset_count%PAGE_SIZE) > 0) {
        numberOfPages += 1;
    }

    const pageNumbers = Array.from({length: numberOfPages}, (_, i) => i+1);

    return (
        <div className="flex flex-col items-center">
            <div id="displayer" className="grid grid-cols-5 gap-y-6 w-full">
                {assets.assets.map((asset, index) => (
                    <AssetCard uploader={false} key={asset.id} buy={buy} id={asset.id} name={asset.name} description={asset.description} presigned_url={asset.presigned_url}></AssetCard>
                ))}
            </div>
            <div className="">
                <div className="join">
                    {pageNumbers.map((pageNumber, index) => (
                       <button className={`join-item mx-2 btn${page === pageNumber ? ' btn-active' : ''}`} key={pageNumber}
                       onClick={() => setPageFromChild(pageNumber)}> {pageNumber} </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AssetDisplayer
