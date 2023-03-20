import { JsonResponseModel } from './json-response.model';
import { ProductItemModel } from './product-item.model';

export interface ProductGeneratorModel {
  mapProductFromJson(jsonResponse: JsonResponseModel[], itemsInCart: string[], favoriteItems: string[]): ProductItemModel[];
}
