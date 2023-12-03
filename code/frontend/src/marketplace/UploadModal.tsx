import { useMutation, useQueryClient } from 'react-query';
import { Formik } from 'formik';
import { uploadAsset } from "../api/AssetApi";

import {ReactNode} from 'react';
import { UploadedAsset } from '../types/Asset';

interface Props {
  children: ReactNode
}
const UploadModal = ({children} : Props) => {

    

    const queryClient = useQueryClient();

    const uploadAssetMutation = useMutation({
        mutationFn: (asset: UploadedAsset) =>
            uploadAsset(asset),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assets"]})
        }
    })


    return (
    <div>
        <label htmlFor="my-upload-modal" className="btn bg-dijo-orange border-none text-white rounded-full">
          {children}
        </label>
        <input type="checkbox" id="my-upload-modal" className="modal-toggle"/>
            <div className="modal">
            <div className="modal-box w-1/2 px-12 py-8 bg-white">
              <Formik
                      initialValues={{ name: '', description: '', price: 0, file: undefined}}
                      onSubmit={(values) => {
                        uploadAssetMutation.mutate(values)
                        let modal = document.getElementById("my-upload-modal") as HTMLInputElement
                        window.location.reload()
                        modal.checked = false //close modal
                      }}
                    >
                      {({
                        values,
                        handleChange,
                        handleSubmit,
                        setFieldValue,
                      }) => (
                  <form className='flex flex-col items-center' onSubmit={handleSubmit}>
                    <div className='w-full'> 
                      <label className="label">
                            <span className="label-text text-dijo-dark-grey">Title</span>
                      </label>
                      <input
                        className="bg-white border rounded-lg w-full py-3 my-2 px-5 text-dijo-light-grey leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="text"
                        onChange={handleChange}
                        value={values.name}
                      />
                    </div>
                    <div className='w-full'>
                      <label className="label">
                          <span className="label-text text-dijo-dark-grey">Description</span>
                      </label>
                      <input
                        className="bg-white border rounded-lg w-full py-3 my-2 px-5 text-dijo-light-grey leading-tight focus:outline-none focus:shadow-outline"
                        id="description"
                        type="text"
                        onChange={handleChange}
                        value={values.description}
                      />
                    </div>
                    <div className='w-full'>
                      <label className="label">
                          <span className="label-text text-dijo-dark-grey">Price</span>
                      </label>
                      <input
                        className="bg-white border rounded-lg w-full py-3 my-2 px-5 text-dijo-light-grey leading-tight focus:outline-none focus:shadow-outline"
                        id="price"
                        type="number"
                        onChange={handleChange}
                        value={values.price}
                      />
                    </div>
                    <div className='my-3'>
                      <input
                        className="border rounded-lg file-input-md max-w-sm"
                        id="file"
                        type="file" accept="image/*"
                        onChange={(event) => {
                          setFieldValue("file", event.currentTarget.files[0]);
                        }} 
                      />
                    </div>
                    <div className="mt-4 self-end	">
                      <label htmlFor="my-upload-modal" className="mx-2 px-6 btn bg-dijo-dark-grey border-none text-white rounded-full">
                        Cancel
                      </label>
                      <button
                        className="btn bg-dijo-orange border-none text-white rounded-full"
                        type="submit"
                      > Upload
                      </button>
                    </div>
                  </form>
                  )}
                </Formik>
            </div>
        </div>
        </div>
    )

}

export default UploadModal;
