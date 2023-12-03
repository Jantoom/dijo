export interface Notebook {
    "notebook": Cover
    "pages": Page[]
}

export interface Cover {
    "id": string,
    "user_id": string,
    "title": string,
    "description": string
}

export interface Page {
    id: string,
    notebook_id: string,
    title: string,
    content: string,
    created_at: Date
}
