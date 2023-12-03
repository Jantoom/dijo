export interface Asset {
    id: string
    title: string
    description: string
    presigned_url: string
}

export interface UploadedAsset {
    name: string,
    description: string,
    price: number,
    file: File
}