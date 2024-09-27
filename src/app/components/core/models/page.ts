export interface Page<T> {
    content:T[];
    empty: boolean,
	first: boolean,
	last: boolean,
	number: number,
	numberOfElements: number,
	pageable?: {
		offset: number,
		pageNumber: number,
		pageSize: number,
		paged: boolean,
		sort: {
			empty: boolean,
			sorted: boolean,
			unsorted: boolean
		},
		unpaged: boolean
	},
	size: number,
	sort?: {
		empty: boolean,
		sorted: boolean,
		unsorted: boolean
	},
	totalElements: number,
	totalPages: number
}

export const EMPTY_PAGE:Page<any>={
    content:[],
    empty: true,
	first: true,
	last: false,
	number: 0,
	numberOfElements: 0,
	
	size: 0,
	totalElements: 0,
	totalPages: 0
};