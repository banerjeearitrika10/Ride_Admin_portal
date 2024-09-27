export interface Column<T> {
    displayName: string;
    field: string;
    cell: (row: T) => string
}

export interface PageRequest {
    size: number;
    page: number;
    active?:boolean;
    searchKey?: string;
}

export interface ColumnAction<T> {
    icon: string;
    toolTip?: string;
    onClick?: (data: T, event?: Document) => void;
    disabled?: (data: T) => boolean;
    nestedMenus?: ColumnAction<T>[];
    text?: string;
    color?: string;
}