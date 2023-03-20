import {JsonResponseModel, ProductItem} from '../models';
import * as data from '../products/products.json';
import { StoreLocalStorage } from './local-storage';

const filterColorBtn: HTMLElement = <HTMLElement>document.getElementById('color');
const resetLocal: HTMLElement = <HTMLElement>document.querySelector('.reset');
const filterSizeBtns: HTMLElement = <HTMLElement>document.querySelector('#size');

export class FilterProducts {
    public storeLocalStorage: StoreLocalStorage;

    constructor() {
        this.storeLocalStorage = new StoreLocalStorage();
    }

    public filterProductsModule(callback: ()=> void): void {
        this.addIdBtnCategory();
        this.filterCategory(callback);
        this.filterColor(callback);
        this.priceFilter(callback);
        this.filterSize(callback);
        this.clearLocalBtn();
    }

    public addIdBtnCategory(): void {
        const filterBtns: Element[] = Array.from(document.querySelectorAll('.filter-btn'));
        filterBtns.forEach((filterButton): void => {
            const currentNameBtn: string = <string>filterButton.textContent?.replace(/ [\s\S]+/, '').toLowerCase();
            filterButton.setAttribute('data-filter', currentNameBtn);
        });
    }

    public filterCategory(callback: ()=> void): void {
        const divProduct: HTMLDivElement = <HTMLDivElement>document.querySelector('.filter-products-product');
        const containerCategory: HTMLDivElement = <HTMLDivElement>document.querySelector('#category');

        containerCategory.addEventListener('click', (event: Event): void => {
            const currentFilter: string = <string>(<HTMLElement>event.target).dataset.filter;
            this.storeLocalStorage.setFilter(ProductItem.Category, currentFilter);
            divProduct.innerHTML = '';
            callback();
        });
    }

    public filterColor(callback: ()=> void): void {
        const divProduct: HTMLDivElement = <HTMLDivElement>document.querySelector('.filter-products-product');

        filterColorBtn.addEventListener('click', (event): void => {
            const currentColorData: string = <string>(<HTMLElement>event.target).dataset.color;
            this.storeLocalStorage.setFilter(ProductItem.Color, currentColorData);
            divProduct.innerHTML = '';
            callback();
        });
    }

    public priceFilter(callback: ()=> void): void {
        const priceFilterMax: HTMLInputElement = <HTMLInputElement>document.querySelector('.price-filter-max');
        const priceFilterMin: HTMLInputElement = <HTMLInputElement>document.querySelector('.price-filter-min');
        const textMaxPrice: HTMLDivElement = <HTMLDivElement>document.querySelector('#two');
        const textMinPrice: HTMLDivElement = <HTMLDivElement>document.querySelector('#one');

        const maxFilter: number[] = (Array.from(data) as JsonResponseModel[]).map((item) => item.cost);
        const maxPrice: number = Math.max(...maxFilter);
        const minPrice: number = Math.min(...maxFilter);

        textMinPrice.textContent = `Min: $${minPrice}`;
        textMaxPrice.textContent = `Max: $${maxPrice}`;
        const divProduct: HTMLDivElement = <HTMLDivElement>document.querySelector('.filter-products-product');

        priceFilterMax.addEventListener('input', (): void => {
            const valueMin: number = parseInt(priceFilterMin.value);
            const valueMax: number = parseInt(priceFilterMax.value);

            textMaxPrice.innerHTML = `Max: $${valueMax}`;
            this.storeLocalStorage.setFilter(ProductItem.Cost, [JSON.stringify(valueMin), JSON.stringify(valueMax)]);

            divProduct.innerHTML = '';
            callback();
        });
        priceFilterMin.addEventListener('input', (): void => {
            const valueMax: number = parseInt(priceFilterMax.value);
            const valueMin: number = parseInt(priceFilterMin.value);

            textMinPrice.innerHTML = `Min: $${valueMin}`;
            this.storeLocalStorage.setFilter(ProductItem.Cost, [JSON.stringify(valueMin), JSON.stringify(valueMax)]);

            divProduct.innerHTML = '';
            callback();
        });
    }

    public filterSize(callback: ()=> void): void {
        const divProduct: HTMLDivElement = <HTMLDivElement>document.querySelector('.filter-products-product');

        filterSizeBtns.addEventListener('change', (event) => {
            const checkBox: HTMLInputElement = event.target as HTMLInputElement;
            const currentSizeData: string = <string>(<HTMLElement>event.target).dataset.size;
            const currentSize = this.storeLocalStorage.getFilters().size;

            if (checkBox.checked) {
                if (currentSize) {
                    this.storeLocalStorage.setFilter(ProductItem.Size, [...currentSize, currentSizeData[0]]);
                } else {
                    this.storeLocalStorage.setFilter(ProductItem.Size, [currentSizeData[0]]);
                }
            } else {
                this.storeLocalStorage.deleteSizeFromFilter(currentSizeData[0]);
            }

            divProduct.innerHTML = '';
            callback();
        });
    }

    private clearLocalBtn(): void {
        resetLocal.addEventListener('click', () => {
            localStorage.clear();
            location.reload();
        });
    }
}
