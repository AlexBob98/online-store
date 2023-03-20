import { StoreLocalStorage } from './local-storage';
import { moveToCart } from '../utils/animation-cart';

export class Cart<T extends HTMLElement> {
    public storeLocalStorage: StoreLocalStorage;
    public divContainer: HTMLElement = <T>document.getElementById('popular');

    constructor() {
        this.storeLocalStorage = new StoreLocalStorage();
    }

    public init(): void {
        this.addToCart();
        this.addToCartSize();
        this.addToCartColor();
        this.activeSizeBtnToCart();
        this.activeColorBtnToCart();
        this.deleteFromCart();
        this.updateCartStatus();
    }

    public updateCartStatus(): void {
        const itemsInCart: Element = document.getElementsByClassName('header__nav-basket-number')[0];
        const itemsInCartValue: number = this.storeLocalStorage.getCart().length;
        itemsInCart.innerHTML = itemsInCartValue.toString();
    }

    public addToCartSize(): void {
        this.divContainer.addEventListener('click', (event) => {
            const currentSize: string = <string>(<T>event.target).dataset.cartsize;
            const parentTitle: HTMLElement = <T>(<T>(
                    (<T>(<T>event.target).parentElement).parentElement
                )).parentElement;
            const itemName: string = parentTitle.parentElement?.dataset.name as string;
            const itemInCart: {selectedSize: string;
                    selectedColor: string;} = this.storeLocalStorage.getPrepareToCart()[itemName];
            if (itemInCart) {
                this.storeLocalStorage.setPrepareToCart({
                    ...itemInCart,
                    name: itemName,
                    selectedSize: currentSize[0],
                });
            } else {
                this.storeLocalStorage.setPrepareToCart({ name: itemName, selectedSize: currentSize[0] });
            }
            const cartButton: HTMLElement = <T>parentTitle?.getElementsByClassName('btn-cart')[0];

            this.changeCartStatus(cartButton, itemName);
        });
        
    }

    public addToCartColor(): void {
        this.divContainer.addEventListener('click', (event: Event): void => {
            const currentColor: string = <string>(<T>event.target).dataset.colorsize;
            const parentTitle: HTMLElement = <T>(<T>(
                    (<T>(<T>event.target).parentElement).parentElement
                )).parentElement;
            const itemName: string = parentTitle?.parentElement?.dataset.name as string;
            const itemInCart: {selectedSize: string;
                    selectedColor: string;} = this.storeLocalStorage.getPrepareToCart()[itemName];
            if (itemInCart) {
                this.storeLocalStorage.setPrepareToCart({
                    ...itemInCart,
                    name: itemName,
                    selectedColor: currentColor,
                });
            } else {
                this.storeLocalStorage.setPrepareToCart({ name: itemName, selectedColor: currentColor });
            }
            const cartButton: HTMLElement = <T>parentTitle?.getElementsByClassName('btn-cart')[0];

            this.changeCartStatus(cartButton, itemName);
            
        });
    }

    public activeSizeBtnToCart(): void {
        this.divContainer.addEventListener('click', (event): void => {
            const currTarget: HTMLElement= <T>event.target;
            const sizeName: string = (<T>event.target).dataset.cartsize as string;
            const removeBtn: HTMLCollection = <HTMLCollection>currTarget.parentElement?.children ;

            if (sizeName) {
                this.removeSizeBtnActiveClass(Array.from(removeBtn) as HTMLElement[]);
                currTarget.classList.add('size-active');
            }
        });
    }

    public removeSizeBtnActiveClass(buttons: HTMLElement[]): void {
        buttons.forEach((btn: HTMLElement): void => btn.classList.remove('size-active'));
    }

    public activeColorBtnToCart(): void {
        this.divContainer.addEventListener('click', (event): void => {
            const currTarget: HTMLElement= <T>event.target;
            const colorName: string = (<T>event.target).dataset.colorsize as string;
            const removeBtn: HTMLCollection = <HTMLCollection>currTarget.parentElement?.children ;

            if (colorName) {
                this.removeColorBtnActiveClass(Array.from(removeBtn) as HTMLElement[]);
                currTarget.classList.add('color-active');
            }
        });
        
    }

    public removeColorBtnActiveClass(buttons: HTMLElement[]): void {
        buttons.forEach((btn: HTMLElement): void => btn.classList.remove('color-active'));
    }

    public deleteFromCart(): void {
        this.divContainer.addEventListener('click', (event: MouseEvent): void => {
            const curretTarget: HTMLElement = <T>event.target;
            const parentTitle: HTMLElement = <T>(<T>event.target).parentElement;
            const itemName: string = parentTitle.dataset.delete as string;

            if (itemName) {
                curretTarget.classList.remove('active');
                curretTarget.style.visibility = 'hidden';
                this.storeLocalStorage.deleteFromCart(itemName);
                this.storeLocalStorage.deleteFromPrepareCart(itemName);
            }

            this.updateCart();
        });
    }

    public updateCart(): void {
        const addToCartBtn: Element[] = Array.from(document.getElementsByClassName('btn-cart'));
        const itemsInCart: Element = document.getElementsByClassName('header__nav-basket-number')[0];
        const activeSizeBtn: Element[] = Array.from(document.getElementsByClassName('color-btn-size'));
        const activeColorBtn: HTMLElement[] = Array.from(document.getElementsByClassName('color') as HTMLCollectionOf<T>);
        const thisBox: HTMLDivElement[] = Array.from(
            document.getElementsByClassName('filter-products__box')
        ) as HTMLDivElement[];
        const deleteBtn: HTMLButtonElement[] = Array.from(
            document.getElementsByClassName('remove')
        ) as HTMLButtonElement[];

        const itemsInCartValue: number = this.storeLocalStorage.getCart().length;
        itemsInCart.innerHTML = itemsInCartValue.toString();
        const itemNameCart: string[] = this.storeLocalStorage.getCart();

        deleteBtn.forEach((item): void => {
            if (itemNameCart.includes(item.dataset.delete as string)) {
                item.style.visibility = 'visible';
                item.classList.add('active');
            }
        });

        thisBox.filter((item): void => {
            if (itemNameCart.includes(item.dataset.name as string)) {
                item.style.background = 'rgb(198 0 0 / 15%)';
            } else {
                item.style.background = '#f5f5f5';
            }
        });
        const fullCart = 20;

        if (itemsInCartValue === fullCart) {
            addToCartBtn.forEach((item): void => {
                item.innerHTML = '<div>Cart is full</div>';
                item.setAttribute('disabled', 'disabled');
            });
            activeSizeBtn.forEach((btn): void => btn.setAttribute('disabled', 'disabled'));
            activeColorBtn.forEach((btn): void => {
                btn.setAttribute('disabled', 'disabled');
                btn.style.pointerEvents = 'none';
            });

            setTimeout((): void => {
                (document.getElementsByClassName('.helpcl')[0] as HTMLElement)?.classList.add('open');
                (document.getElementsByClassName('.backhpl')[0] as HTMLElement)?.classList.add('open');
            }, 300);

            setTimeout((): void => {
                (document.getElementsByClassName('.helpcl')[0] as HTMLElement)?.classList.remove('open');
                (document.getElementsByClassName('.backhpl')[0] as HTMLElement)?.classList.remove('open');
            }, 2000);
        }
    }

    public addToCart = (): void => {
        const thisPicture: Element[] = Array.from(document.getElementsByClassName('filter-products__box-image'));
        const cart: HTMLElement = <T>document.getElementsByClassName('header__nav-basket')[0];

        this.divContainer.addEventListener('click', (event): void => {
            const curretTarget: HTMLElement = <T>event.target;
            const parentTitle: HTMLElement = <T>(<T>(
                    (<T>(<T>event.target).parentElement).parentElement
                )).parentElement;
            const itemName: string = parentTitle.dataset.name as string;

            if (this.storeLocalStorage.isItemReadyToBuy(itemName)) {
                this.storeLocalStorage.setCart(itemName);
                curretTarget.classList.add('cart-none');

                curretTarget.setAttribute('disabled', 'disabled');
                curretTarget.classList.remove('add-to-cart-active');
                this.updateCart();

                thisPicture.filter((item) => {
                    if (item.getAttribute('alt') === itemName) {
                        moveToCart(item as HTMLImageElement, cart);
                    }
                });
            }
        });
    };

    public changeCartStatus(cartButton: HTMLElement, name: string): void {
        if (this.storeLocalStorage.isItemReadyToBuy(name)) {
            cartButton?.classList.remove('btn-disable');
            cartButton?.classList.add('add-to-cart-active');
        } else {
            cartButton?.classList.add('btn-disable');
        }
    }
}
