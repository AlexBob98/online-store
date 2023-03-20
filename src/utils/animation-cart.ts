export function moveToCart(picture: HTMLImageElement, cart: HTMLElement): void {
    const pictureTwo: HTMLImageElement = <HTMLImageElement>picture.cloneNode();
    const picturePosition: DOMRect = picture.getBoundingClientRect();
    const cartPosition: DOMRect = cart.getBoundingClientRect();

    pictureTwo.style.position = 'fixed';
    pictureTwo.style.left = picturePosition['left'] + 'px';
    pictureTwo.style.top = picturePosition['top'] + 'px';
    pictureTwo.style.border = 'none';
    pictureTwo.style.zIndex = '999';

    const startPositionX: number = picturePosition['left'] + 0.5 * picturePosition['width'];
    const startPositionY: number = picturePosition['top'] + 0.5 * picturePosition['height'];

    const endPositionX: number = cartPosition['left'] + 2.5 * cartPosition['width'] - startPositionX;
    const endPositionY: number = cartPosition['top'] + 2.5 * cartPosition['height'] - startPositionY;

    document.body.appendChild(pictureTwo);
    pictureTwo.offsetWidth;
    pictureTwo.style.transform = 'translateX(' + endPositionX + 'px)';
    pictureTwo.style.transform += 'translateY(' + endPositionY + 'px)';
    pictureTwo.style.transform += 'scale(1.2)';
    pictureTwo.style.transition = '3s';

    setTimeout(() => {
        document.body.removeChild(pictureTwo);
    }, 1000);
}
