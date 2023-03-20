import { CategoryType, ColorType, SizeProductType } from './product-item.model';

export interface JsonResponseModel {
  [JsonItem.Name]: string,
  [JsonItem.Img]: string,
  [JsonItem.Color]: ColorType[],
  [JsonItem.Category]: CategoryType,
  [JsonItem.Desciption]: string,
  [JsonItem.Size]: SizeProductType[],
  [JsonItem.Cost]: number, 
}

export enum JsonItem {
  Name = 'name',
  Img = 'img',
  Color = 'color',
  Category = 'category',
  Desciption = 'description',
  Size = 'size',
  Cost = 'cost',
}