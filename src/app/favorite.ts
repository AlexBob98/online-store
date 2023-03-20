import { IFavorite } from '../models';
import { StoreLocalStorage } from './local-storage';

export class Favorite {
    public likeB: Element = <Element>document.querySelector('.filter-products-product');
    private storeLocaStorage: StoreLocalStorage;

    constructor() {
        this.storeLocaStorage = new StoreLocalStorage();
    }

    public favorite(): void {
        this.likeB.addEventListener('click', (event): void => {
            const likedItems: IFavorite = this.storeLocaStorage.getFavorite();
            const parentContainer: HTMLElement = <HTMLElement>(<HTMLElement>event.target).parentElement;
            const productName: string = parentContainer.dataset.like as string;

            if (parentContainer.classList.contains('like-btn')) {
                if (likedItems.favoriteNames && likedItems.favoriteNames.includes(productName)) {
                    this.storeLocaStorage.deleteFromFavorite(productName);
                    parentContainer.innerHTML = '<i class="fa-regular fa-heart"></i>';
                    parentContainer.style.color = '#8f8f8f';
                    parentContainer.style.animation = '';
                } else {
                    this.storeLocaStorage.setFavorite(productName);
                    parentContainer.innerHTML = '<i class="fa-solid fa-heart"></i>';
                    parentContainer.style.color = '#c60000';
                    parentContainer.style.animation = 'heartbeat 1s infinite';
                }
            }
        });
    }
}
