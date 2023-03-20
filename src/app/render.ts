import { Color, ColorType, ProductItem, ProductItemModel, SizeProduct, SizeProductType } from '../models';
import { StoreLocalStorage } from './local-storage';

export const allProducts: HTMLDivElement = <HTMLDivElement>document.querySelector('.filter-products-product');

export class Render {
    public storeLocalStorage: StoreLocalStorage;

    constructor() {
        this.storeLocalStorage = new StoreLocalStorage();
    }

    public renderItems(items: ProductItemModel[]): void {
        this.colorButtons();

        const itemsContainer: DocumentFragment = document.createDocumentFragment();
        items.forEach((item: ProductItemModel): void => {
            const mainDivElement: HTMLDivElement = this.createBox(item);
            const imageProduct: HTMLImageElement = this.createImages(item);
            const likeButton: HTMLDivElement = this.createLikeButton(item);
            const nameProduct: HTMLDivElement = this.createTitleBox();
            const title: HTMLParagraphElement = this.createParagraph(item);
            const titleCategory: HTMLSpanElement = this.createTitleForParagraph(item);
            const divSizeBlock: HTMLDivElement = this.createDivSize();
            const sizeBtn: HTMLDivElement = this.createSizeBtn(item);
            const buttonDivColors: HTMLDivElement = this.addButtonColors();
            const buttons: HTMLDivElement = this.createButtonColors(item);
            const priceProduct: HTMLDivElement = this.createPrice(item);
            const addToCart: HTMLDivElement = this.createCartBtn(item);
            const deleteFromCart: HTMLButtonElement = this.deleteBtn(item);

            divSizeBlock.append(sizeBtn);
            buttonDivColors.append(buttons);
            nameProduct.append(
                title,
                titleCategory,
                divSizeBlock,
                buttonDivColors,
                priceProduct,
                addToCart,
                deleteFromCart
            );
            mainDivElement.append(imageProduct, likeButton, nameProduct);
            itemsContainer.append(mainDivElement);
        });
        if (allProducts) {
            allProducts.append(itemsContainer);
        }
    }

    private createBox(item: ProductItemModel): HTMLDivElement {
        const box: HTMLDivElement = document.createElement('div');
        box.setAttribute('data-name', item[ProductItem.Name]);
        box.classList.add('filter-products__box', item[ProductItem.Category]);
        if (item[ProductItem.IsItemInCart]) {
            box.style.background = 'rgb(198 0 0 / 15%)';
        }

        return box;
    }

    private createImages(item: ProductItemModel): HTMLImageElement {
        const goodsImage: HTMLImageElement = <HTMLImageElement>document.createElement('img');
        goodsImage.classList.add('filter-products__box-image');
        goodsImage.setAttribute('title', item[ProductItem.Name]);
        goodsImage.setAttribute('data-image', item[ProductItem.Name]);
        goodsImage.src = item[ProductItem.Img];
        goodsImage.alt = item[ProductItem.Name];
        return goodsImage;
    }

    private createLikeButton(item: ProductItemModel): HTMLDivElement {
        const likeGoods: HTMLDivElement = document.createElement('div');
        likeGoods.classList.add('like-btn');
        likeGoods.setAttribute('data-like', item[ProductItem.Name] as string);
        likeGoods.innerHTML = '<i class="fa-regular fa-heart"></i>';

        if (item[ProductItem.IsFavoriteNames]) {
            (<HTMLDivElement>likeGoods).innerHTML = '<i class="fa-solid fa-heart"></i>';
            (<HTMLElement>likeGoods).style.color = '#c60000';
            (<HTMLElement>likeGoods).style.animation = 'heartbeat 1s infinite';
        } else {
            (<HTMLDivElement>likeGoods).innerHTML = '<i class="fa-regular fa-heart"></i>';
        }
        return likeGoods;
    }

    private createTitleBox(): HTMLDivElement {
        const titleBox: HTMLDivElement = document.createElement('div');
        titleBox.classList.add('filter-products__box-title');
        return titleBox;
    }

    private createParagraph(item: ProductItemModel): HTMLParagraphElement {
        const title: HTMLParagraphElement = <HTMLParagraphElement>document.createElement('p');
        title.innerHTML = item[ProductItem.Name];
        return title;
    }

    private createTitleForParagraph(item: ProductItemModel): HTMLSpanElement {
        const titleCategory: HTMLSpanElement = <HTMLSpanElement>document.createElement('span');
        titleCategory.classList.add('filter-products__box-category');
        titleCategory.innerHTML = 'Category: ' + item[ProductItem.Category];
        return titleCategory;
    }

    private createDivSize(): HTMLDivElement {
        const size: HTMLDivElement = <HTMLDivElement>document.createElement('div');
        size.classList.add('filter-products__size-buttons');
        return size;
    }

    private createSizeBtn(item: ProductItemModel): HTMLDivElement {
        const sizeProduct: SizeProductType[] = Object.values(SizeProduct);
        const sizeButtonsContainer: HTMLDivElement = document.createElement('div');
        sizeButtonsContainer.classList.add('size-btn');
        sizeProduct.forEach((sizeName: SizeProductType): void => {
            if (item[ProductItem.Size].includes(sizeName)) {
                const sizeBtn = <HTMLButtonElement>document.createElement('button');
                sizeBtn.setAttribute('data-cartsize', sizeName);
                sizeBtn.setAttribute('title', 'Size: ' + sizeName.toUpperCase());
                sizeBtn.classList.add('color-btn-size', sizeName);
                sizeBtn.innerHTML = sizeName.toUpperCase();
                sizeButtonsContainer.append(sizeBtn);
            }
        });
        return sizeButtonsContainer;
    }

    private addButtonColors(): HTMLDivElement {
        const buttonColors: HTMLDivElement = <HTMLDivElement>document.createElement('div');
        buttonColors.classList.add('filter-products__box-colors');
        return buttonColors;
    }

    private createButtonColors(item: ProductItemModel): HTMLDivElement {
        const buttons: ColorType[] = Object.values(Color);
        const colorButtonsContainer: HTMLDivElement = document.createElement('div');
        colorButtonsContainer.classList.add('filter-products__box-colors', 'btn-col');

        buttons.forEach((checkBtn: ColorType): void => {
            if (item[ProductItem.Color].includes(checkBtn)) {
                const button = <HTMLDivElement>document.createElement('div');
                button.classList.add('color', checkBtn);
                button.setAttribute('data-colorsize', checkBtn);
                button.setAttribute('title', 'Color: ' + checkBtn.toUpperCase());

                this.generateBtns(checkBtn, button);
                colorButtonsContainer.append(button);
            }
        });
        return <HTMLDivElement>colorButtonsContainer;
    }
    private createPrice(item: ProductItemModel): HTMLDivElement {
        const costProduct: HTMLDivElement = <HTMLDivElement>document.createElement('div');
        costProduct.classList.add('filter-products__box-category');
        const price: number = item[ProductItem.Cost];
        (costProduct as HTMLElement).innerHTML = 'Price: ' + price + ' $';
        return costProduct;
    }

    private changeCartStatus(cartButton: HTMLElement, name: string): void {
        if (this.storeLocalStorage.isItemReadyToBuy(name)) {
            cartButton?.classList.remove('btn-disable');
            cartButton?.classList.add('add-to-cart-active');
        } else {
            cartButton?.classList.add('btn-disable');
        }
    }

    private createCartBtn(item: ProductItemModel): HTMLDivElement {
        const addToCart: HTMLDivElement = <HTMLDivElement>document.createElement('div');
        addToCart.classList.add('filter-products__btn-cart');
        addToCart.setAttribute('data-cart', item[ProductItem.Name]);
        addToCart.innerHTML = '<button class="btn-cart add-to-cart">Add to Cart</button>';
        this.changeCartStatus(addToCart, item.name);
        return addToCart;
    }

    private deleteBtn(item: ProductItemModel): HTMLButtonElement {
        const minus: HTMLButtonElement = <HTMLButtonElement>document.createElement('button');
        minus.classList.add('remove');
        minus.setAttribute('data-delete', item[ProductItem.Name]);
        minus.innerHTML = '<i class="fa-solid fa-circle-minus"></i>';
        if (item[ProductItem.IsItemInCart]) {
            minus.style.visibility = 'visible';
            minus.classList.add('active');
        } else {
            minus.style.visibility = 'hidden';
        }
        return minus;
    }

    private colorButtons(): void {
        const colorBtn: HTMLElement = <HTMLElement>document.querySelector('#color');
        const buttons: ColorType[] = Object.values(Color);
        colorBtn.innerHTML = '';

        buttons.forEach((buttonColor): void => {
            const button: HTMLDivElement = <HTMLDivElement>document.createElement('div');
            (<HTMLDivElement>button).classList.add('color-filter', buttonColor);
            (<HTMLDivElement>button).setAttribute('data-color', buttonColor);
            (<HTMLDivElement>button).setAttribute('title', buttonColor.toUpperCase());
            this.generateBtns(buttonColor, button);

            (<HTMLDivElement>colorBtn).append(button);

        });
      
    }

    public generateBtns(item: string, button: HTMLDivElement): HTMLDivElement {
        switch (item) {
        case Color.Black:
            (<HTMLDivElement>button).style.background = '#000';
            break;
        case Color.White:
            (<HTMLDivElement>button).style.background = '#fff';
            break;
        case Color.Yellow:
            (<HTMLDivElement>button).style.background = '#f8e201';
            break;
        case Color.Green:
            (<HTMLDivElement>button).style.background = '#018a30';
            break;
        case Color.Pink:
            (<HTMLDivElement>button).style.background = '#ef1cb7';
            break;
        case Color.Red:
            (<HTMLDivElement>button).style.background = '#aa030b';
            break;
        }
        return button;
    }
}


