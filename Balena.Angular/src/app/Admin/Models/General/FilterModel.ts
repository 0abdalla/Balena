export interface FilterModel {
    categoryName?: string;
    categoryNameAr?: string;
    itemId?: string;
    itemKey?: string;
    itemValue?: string;
    isChecked?: boolean;
    from?: string;
    to?: string;
    filterItems?: FilterModel[];
}