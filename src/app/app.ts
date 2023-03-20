import { AppModel, Category, ColorType, IFiltersModel, ISort, JsonResponseModel, ProductGeneratorModel, ProductItem, 
    ProductItemModel } from '../models';
import { Favorite, FilterProducts, ProductGenerate, SearchForm, SortProducts, 
    StoreLocalStorage } from '../app';
import { Render } from './render';
import * as data from '../products/products.json';
import { Cart } from './add-to-cart';

const divProduct: HTMLElement = <HTMLElement>document.querySelector('.filter-products-product');
const emptyGoods: HTMLElement = <HTMLElement>document.querySelector('.filter-products-product');

export class App implements AppModel {
    public productGenerate: ProductGeneratorModel;
    public render: Render;
    public storelocalStorage: StoreLocalStorage;
    public searchForm: SearchForm;
    public filterForm: FilterProducts;
    public sortProducts: SortProducts;
    public cart: Cart;
    public favorite: Favorite;

    constructor() {
        this.productGenerate = new ProductGenerate();
        this.render = new Render();
        this.storelocalStorage = new StoreLocalStorage();
        this.searchForm = new SearchForm();
        this.filterForm = new FilterProducts();
        this.sortProducts = new SortProducts();
        this.cart = new Cart();
        this.favorite = new Favorite();
    }

    
    public init(): void {
        this.parseProducts();
        this.searchForm.subscribeOnSearchForm(this.searchRender.bind(this));
        this.filterForm.filterProductsModule(this.parseProducts.bind(this));
        this.sortProducts.sortGoods(this.parseProducts.bind(this));
        this.cart.init();
        this.favorite.favorite();
    }

    public parseProducts(): void {
        const cartItems: string[] = this.storelocalStorage.getCart();
        const favoriteItems: string[] = this.storelocalStorage.getFavorite().favoriteNames
            ? this.storelocalStorage.getFavorite().favoriteNames
            : [];
        const filters: IFiltersModel = this.storelocalStorage.getFilters();
        const filtersKeys: string[] = Object.keys(filters);

        let goodsToFilter: ProductItemModel[] = this.productGenerate.mapProductFromJson(
            <JsonResponseModel[]>data,
            cartItems,
            favoriteItems
        );
        const sort: ISort = this.storelocalStorage.getSort();

        if (filtersKeys) {
            if (filtersKeys.includes(ProductItem.Category)) {
                if (filters[ProductItem.Category] !== Category.all) {
                    goodsToFilter = goodsToFilter.filter((item) => item.category.includes(filters.category));
                }
            }
            if (filtersKeys.includes(ProductItem.Size)) {
                if (filters.size.length != 0) {
                    goodsToFilter = goodsToFilter.filter((good): boolean =>
                        good.size.some((sizes) => filters.size.includes(sizes))
                    );
                }
            }
            if (filtersKeys.includes(ProductItem.Color)) {
                goodsToFilter = goodsToFilter.filter((item): boolean => {
                    if (Array.isArray(filters[ProductItem.Color])) {
                        return (filters[ProductItem.Color] as ColorType[]).some((color) => item.color.includes(color));
                    } else {
                        return item.color.includes(filters[ProductItem.Color] as ColorType);
                    }
                });
            }
            if (filtersKeys.includes(ProductItem.Cost)) {
                const costLimits = filters[ProductItem.Cost];
                const minValue = costLimits[0];
                const maxValue = costLimits[1];
                
                if (minValue) {
                    goodsToFilter = goodsToFilter.filter((item): boolean => item.cost >= minValue);
                }

                if (maxValue) {
                    goodsToFilter = goodsToFilter.filter((item): boolean => item.cost <= maxValue);
                }
            }
        }

        if (sort?.sortType) {
            goodsToFilter = this.sortProducts.sortBy(sort.sortType, goodsToFilter);
        }

        divProduct.innerHTML = '';

        this.render.renderItems(goodsToFilter);
    }

    public searchRender(input?: string): void {
        const cartItems: string[] = this.storelocalStorage.getCart();
        const favoriteItems: string[] = this.storelocalStorage.getFavorite().favoriteNames
            ? this.storelocalStorage.getFavorite().favoriteNames
            : [];
        const goodsToFilter: ProductItemModel[] = this.productGenerate.mapProductFromJson(
            <JsonResponseModel[]>data,
            cartItems,
            favoriteItems
        );
        if (input) {
            const filterSearch: ProductItemModel[] = goodsToFilter.filter((item: ProductItemModel) => {
                const name: string = item.name.toLowerCase();
                if (name.startsWith(input)) {
                    return item;
                }
            });

            if (filterSearch.length === 0) {
                emptyGoods.innerHTML = '<div class="not-found"><h3>Sorry, Not Found</h3></div>';
                return;
            } else {
                emptyGoods.innerHTML = '';
                this.render.renderItems(filterSearch);
                return;
            }
        }
        divProduct.innerHTML = '';
        this.render.renderItems(goodsToFilter);
    }
}