import { ProductItem, CategoryType, ColorType, SizeProductType } from '../models';

export type FiltersValue = CategoryType | ColorType | string | [min: number, max: number] | string[];

export interface IFiltersModel {
    [ProductItem.Category]: CategoryType | string;
    [ProductItem.Size]: SizeProductType[];
    [ProductItem.Color]: ColorType[] | ColorType;
    [ProductItem.Cost]: [min: number, max: number];
}

export interface ISort {
    sortType: SortType;
}

export interface ICart {
    [keyName: string]: { selectedSize: string; selectedColor: string };
}

export interface IFavorite {
    favoriteNames: string[];
}

export enum SortType {
  sortA = 'sort-a',
  sortZ = 'sort-z',
  sortOne = 'sort-one',
  sortNine = 'sort-nine',
  sortWish = 'sort-wish',
}
