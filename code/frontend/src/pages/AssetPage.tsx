import React from 'react'
import HomeIcon from '../assets/HomeIcon'
import BinIcon from '../assets/BinIcon'
import { deleteNotebook, fetchNotebooks } from "../api/NotebookApi";
import { deleteAsset, fetchAssets } from "../api/AssetApi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AssetCard from "../marketplace/AssetCard";
import { Asset } from '../types/Asset';
import { Notebook } from '../types/Notebook';

function AssetPage() {
  const [purchasedAssets, setPurchasedAssets] = useState<Asset[]>([]);
  const [uploadedAssets, setUploadedAssets] = useState<Asset[]>([]);
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);

  // false because we do not want the modal that opens on asset click to enable buying
  const buy = false;

  useEffect(() => {
          fetchAssets(true, false, null, null).then((response) => {
              setPurchasedAssets(response.assets)
            });
          fetchAssets(false, true, null, null).then((response) => {
              setUploadedAssets(response.assets)
          });
          fetchNotebooks().then((response) => {
              setNotebooks(response)
          });
      },[])

   const deleteNotebookWrapper = (id: string) => {
        deleteNotebook(id).then( () => {
            const filtered = notebooks.filter( function(notebook) { return notebook.notebook.id != id });
            setNotebooks(filtered);
        });
   }

   const deletePurchasedAssetWrapper = (id: string) => {
       deleteAsset(id).then( () => {
           const filtered = purchasedAssets.filter( function(asset) { return asset.id != id });
           setPurchasedAssets(filtered);
       });
  }

  if ((!purchasedAssets) || (!uploadedAssets) || (!notebooks)) {
    return (<div>Loading</div>);
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-dijo-blue flex justify-between items-center	px-8">
        <h1 className='text-dijo-orange text-5xl font-semibold'>DIJO</h1>
        <h2 className='text-white text-4xl font-semibold'>Manage My Assets</h2>
        <a href="/main" className='w-12'><HomeIcon/></a>
      </div>
      <div className="bg-white grow p-12">
        <div className="flex flex-col">
        <div>
          <h2 className="text-dijo-dark-grey text-3xl font-semibold">Purchased Assets</h2>
          <div className="flex overflow-x-auto gap-x-6 h-72">
            {purchasedAssets.map((asset: any) => (
                <div key={`${asset.id}_purchased`} className="py-4">
                  <div className="bg-cover bg-center mx-6 h-40 w-40 relative">
                  <label htmlFor={`my-purchased-asset-modal-${asset.id}`} className="absolute bottom-1 right-1 h-1/4">
                    <BinIcon></BinIcon>
                  </label>
                  <input type="checkbox" id={`my-purchased-asset-modal-${asset.id}`} className="modal-toggle"/>
                    <div className="modal">
                        <div className="modal-box bg-white w-1/4 px-12 py-8">
                            <p>Are you sure you want to delete {asset.name}?</p>
                            <form className="flex justify-center gap-x-3 my-2">
                                <label htmlFor={`my-purchased-asset-modal-${asset.id}`}
                                    className="btn bg-dijo-dark-grey border-none text-white rounded-full">Cancel</label>
                                <label htmlFor={`my-purchased-asset-modal-${asset.id}`} onClick={() => (
                                    deletePurchasedAssetWrapper(asset.id)
                                )} className="btn bg-dijo-orange border-none text-white rounded-full">Delete</label>
                            </form>
                        </div>
                    </div>
                    <AssetCard id={asset.id} name={asset.name} description={asset.description} presigned_url={asset.presigned_url} buy={buy} uploader={false}/>
                  </div>
                </div>
            )
            )}
          </div>
        </div>
        <div>
          <h2 className="text-dijo-dark-grey text-3xl font-semibold">Uploaded Assets</h2>
          <div className="flex overflow-x-auto gap-x-6 h-72">
            {uploadedAssets.map((asset: any) => (
                <div key={`${asset.id}_uploaded`} className="py-4">
                    <div className="bg-cover bg-center mx-6 h-28 w-28 relative">
                        <AssetCard  id={asset.id} name={asset.name} description={asset.description} presigned_url={asset.presigned_url} buy={buy} uploader={true}/>
                    </div>
                </div>
            )
            )}
          </div>
        </div>
        <div>
          <h2 className="text-dijo-dark-grey text-3xl font-semibold">My Notebooks</h2>
          <div className="h-auto">
            <ul>
              {notebooks.map((book, index) => (
                <li className="py-2">
                  <div className="h-6 flex content-center gap-x-2">
                    <label htmlFor={`my-notebook-modal-${book.notebook.id}`} className="h-full">
                      <BinIcon></BinIcon>
                    </label>
                    <h3 className="text-dijo-dark-grey text-xl">{book.notebook.title}</h3>
                  </div>
                  <input type="checkbox" id={`my-notebook-modal-${book.notebook.id}`} className="modal-toggle"/>
                    <div className="modal">
                        <div className="modal-box bg-white w-1/4 px-12 py-8">
                            <p>Are you sure you want to delete {book.notebook.title}?</p>
                            <form className="flex justify-center gap-x-3 my-2">
                                <label htmlFor={`my-notebook-modal-${book.notebook.id}`}
                                    className="btn bg-dijo-dark-grey border-none text-white rounded-full">Cancel</label>
                                <label htmlFor={`my-notebook-modal-${book.notebook.id}`} onClick={() => (
                                    deleteNotebookWrapper(book.notebook.id)
                                )} className="btn bg-dijo-orange border-none text-white rounded-full">Delete</label>
                            </form>
                        </div>
                    </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default AssetPage