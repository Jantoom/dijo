import axios from 'axios'
import { useQueryClient, useQuery, useMutation } from 'react-query';
import { purchaseAsset } from '../api/AssetApi';
import SpinningIcon from '../assets/SpinningIcon';

interface Prop {
    id: string
    name: string,
    description: string,
    presigned_url: string,
    buy: boolean,
    uploader: boolean
}

function AssetCard({id, name, description, presigned_url, buy}: Prop) {

    const queryClient = useQueryClient();

    const assetData = useQuery(['asset', presigned_url], () =>
        getAssetsFromS3(presigned_url)
    );

    const purchaseAssetMutation = useMutation({
        mutationFn: (id) =>
            purchaseAsset(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assets"]})
        },
        onError: () => {
            alert('You already own this asset!');
        }
    })

    const getAssetsFromS3 = async (url: string) => {
        const response = await axios.get(url, {responseType: 'blob'});
        const responseData = await response.data;
        const fileReader = new FileReader();
        return new Promise((resolve, reject) => {
          fileReader.onloadend = () => {
              resolve(fileReader.result);
          };
      
          fileReader.onerror = () => {
              reject(new DOMException("Error getting data from S3 bucket"));
          };
      
          fileReader.readAsDataURL(responseData);
        });
      };

    if (assetData.isLoading) {
        return <div className='w-40 h-48 mx-auto'><SpinningIcon></SpinningIcon></div>;
    }

    if (assetData.error) {
        return <div>error</div>;
    }

    const imgData = "data:;base64"+assetData.data;
    const label = "my-asset-modal-"+id;

    return (
        <div>
            <label htmlFor={label}>
            <div>
                <div className="mx-auto bg-cover border bg-center h-40 w-40" style={{backgroundImage:`url(${presigned_url})`}}></div>
                <h2 className='w-50 my-2 text-center text-xl font-medium break-words text-dijo-dark-grey'>{name.toUpperCase()}</h2>
            </div>
           </label>
           <input type="checkbox" id={label} className="modal-toggle"/>
           <div className="modal">
            <div className="modal-box bg-white w-3/4 h-1/2">
                <div className="grid grid-cols-2 grid-rows-7 gap-0 h-full">
                    <div className="row-span-6 flex"><img src={imgData} className="object-cover ht-auto"/></div>
                    <div className="row-span-6 p-8">
                        <h3 className="text-3xl text-center text-dijo-dark-grey">{name.toUpperCase()}</h3>
                        <p className="text-center">{description}</p>
                    </div>
                    <div className="col-span-2 mt-4 ml-auto row-start-7">
                        <label htmlFor={label}
                            className="btn mx-2 bg-dijo-dark-grey border-none text-white rounded-full">Close</label>
                        {buy && (<label htmlFor={label} onClick={() => (
                            purchaseAssetMutation.mutate(id)
                            )} className="btn mx-2 bg-dijo-orange border-none text-white rounded-full"
                            >Buy It Now
                        </label>)}
                    </div>
                </div>
            </div>
           </div>
       </div>
      );
}

export default AssetCard