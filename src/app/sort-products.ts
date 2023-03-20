import { ProductItem, ProductItemModel, SortType } from '../models';
import { StoreLocalStorage } from './local-storage';

const sortGoods: HTMLElement = <HTMLElement>document.querySelector('#sort');

export class SortProducts {
    private storeLocalStorage: StoreLocalStorage;
    
    constructor () {
        this.storeLocalStorage = new StoreLocalStorage();
    }

    public sortGoods(callback: ()=> void): void {
        this.sortName(callback);
        
    }

    public sortBy(currentSort: SortType, goods: ProductItemModel[]): ProductItemModel[] {
        switch (currentSort) {
        case SortType.sortA:
            return goods.sort((a: { name: string }, b: { name: string }) => (a.name > b.name ? 1 : -1));
         
        case SortType.sortZ:
            return goods.sort((a: { name: string }, b: { name: string }) => (a.name > b.name ? -1 : 1));
          
        case SortType.sortOne:
            return  goods.sort((a: { cost: number }, b: { cost: number }) => (a.cost > b.cost ? 1 : -1));
         
        case SortType.sortNine:
            return goods.sort((a: { cost: number }, b: { cost: number }) => (a.cost > b.cost ? -1 : 1));
           
        case SortType.sortWish:
            return  goods.filter((item) => item[ProductItem.IsFavoriteNames]);    
        }
    }

    public sortName(callback: ()=> void): void {
        const divProduct: HTMLElement = <HTMLElement>document.querySelector('.filter-products-product');
  
        sortGoods.addEventListener('click', (event: MouseEvent): void => {
            const currentSort: SortType = (<HTMLElement>event.target).dataset.sort as SortType;
            
            this.storeLocalStorage.setSort(currentSort);
            divProduct.innerHTML = '';
            callback();
            
        });
    }
}

