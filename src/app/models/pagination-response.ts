export interface PaginationResponse<T> {
    items: T[];
    data: T[];
    totalResults: number;
}
