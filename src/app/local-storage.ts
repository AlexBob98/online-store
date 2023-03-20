import { ProductItem, SizeProductType, FiltersValue, ICart, IFavorite, IFiltersModel, ISort, SortType } from '../models';


export class StoreLocalStorage {
    private filterKey = 'filterKey';
    private sortKey = 'sortKey';
    private cartKey = 'cartKey';
    private prepareCartKey = 'prepareCartKey';
    private favoriteKey = 'favoriteKey';

    public getFilters(): IFiltersModel {
        const filters: string = <string>localStorage.getItem(this.filterKey);
        return filters ? JSON.parse(filters) : {};
    }
    public getSort(): ISort {
        const sorts: string = <string>localStorage.getItem(this.sortKey);
        return sorts ? JSON.parse(sorts) : {};
    }
    public getPrepareToCart(): ICart {
        const prepareCart: string = <string>localStorage.getItem(this.prepareCartKey);
        return prepareCart ? JSON.parse(prepareCart) : {};
    }
    public getCart(): string[] {
        const cart: string = <string>localStorage.getItem(this.cartKey);
        return cart ? JSON.parse(cart) : [];
    }

    public getFavorite(): IFavorite {
        const favorite: string = <string>localStorage.getItem(this.favoriteKey);
        return favorite ? JSON.parse(favorite) : {};
    }

    public setFilter(key: string, values: FiltersValue): void {
        const currentFilters: IFiltersModel = this.getFilters();
        if (currentFilters) {
            localStorage.setItem(this.filterKey, JSON.stringify({ ...currentFilters, [key]: values }));
        } else {
            localStorage.setItem(this.filterKey, JSON.stringify({ [key]: values }));
        }
    }
    public deleteSizeFromFilter(value: SizeProductType | string): void {
        const currentFilters: IFiltersModel = this.getFilters();
        const currentSizes: string[] = this.getFilters().size;
        if (currentSizes) {
            const filterSizes: string[] = currentSizes.filter((item) => item != value);
            localStorage.setItem(
                this.filterKey,
                JSON.stringify({ ...currentFilters, [ProductItem.Size]: filterSizes })
            );
        }
    }
    public setSort(sortValue: SortType): void {
        localStorage.setItem(this.sortKey, JSON.stringify({ sortType: sortValue }));
    }
    public setCart(name: string): void {
        const currentItemsInCart: string[] = this.getCart();
        localStorage.setItem(this.cartKey, JSON.stringify([ ...currentItemsInCart, name ]));
    }
    public deleteFromCart (name: string): void {
        const currentItemsInCart: string[] = this.getCart();
        if (currentItemsInCart.length > 0) {
            const namesInCart = currentItemsInCart.filter((items: string) => items != name);
            localStorage.setItem(this.cartKey, JSON.stringify(namesInCart));
        } 
    }
    public setPrepareToCart(item: { name: string; selectedColor?: string; selectedSize?: string }): void {
        const currentItems: ICart = this.getPrepareToCart();
        const currentItemsKeys: string[] = Object.keys(currentItems);
        if (currentItemsKeys.length > 0) {
            localStorage.setItem(
                this.prepareCartKey,
                JSON.stringify({
                    ...currentItems,
                    [item.name]: { selectedColor: item.selectedColor, selectedSize: item.selectedSize },
                })
            );
        } else {
            localStorage.setItem(
                this.prepareCartKey,
                JSON.stringify({ [item.name]: { selectedColor: item.selectedColor, selectedSize: item.selectedSize } })
            );
        }
    }
    public deleteFromPrepareCart(name: string): void {
        const currentItems: ICart = this.getPrepareToCart();
        const currentItemsKeys: string[] = Object.keys(currentItems);

        if (currentItemsKeys.length > 0) {
            delete currentItems[name];
            localStorage.setItem(this.prepareCartKey, JSON.stringify({ ...currentItems }));
        }
    }
    public isItemReadyToBuy(name: string): boolean {
        const currentItems: ICart = this.getPrepareToCart();
        const currentItemsKeys: string[] = Object.keys(currentItems);

        if (currentItemsKeys.length > 0) {
            const foundItem = currentItems[name];
            if (foundItem) {
                return Boolean(foundItem.selectedColor) && Boolean(foundItem.selectedSize);
            }
        }
        return false;
    }
    public setFavorite(name: string): void {
        const currentNames: string[] = this.getFavorite().favoriteNames;
        if (currentNames) {
            localStorage.setItem(this.favoriteKey, JSON.stringify({ favoriteNames: [...currentNames, name] }));
        } else {
            localStorage.setItem(this.favoriteKey, JSON.stringify({ favoriteNames: [name] }));
        }
    }
    public deleteFromFavorite(name: string): void {
        const currentNames: string[] = this.getFavorite().favoriteNames;
        if (currentNames) {
            const filterNames: string[] = currentNames.filter((item) => item != name);
            localStorage.setItem(this.favoriteKey, JSON.stringify({ favoriteNames: filterNames }));
        }
    }
}

export const customLocalStorage = new StoreLocalStorage();