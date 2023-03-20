const searchBtn: HTMLElement = <HTMLElement>document.querySelector('.header__nav-search-icon');
const searchForm: HTMLElement = <HTMLElement>document.querySelector('.header__nav-searchform input');
const closeSearchBtn: HTMLElement = <HTMLElement>document.querySelector('.close-search');
const clickGoods: HTMLElement = <HTMLDivElement>document.querySelector('#popular');

export class SearchForm {
    public subscribeOnSearchForm(callback: ()=> void): void {
        this.onMouseEnter();
        this.onMouseOut();
        this.onCloseSearchButtonClick(callback);
        this.onSearchButtonInput(callback);
        this.onSearchFormClick();
        this.onSearchFormKeyDown();
        this.onSearchButtonClick();
    }

    private onMouseEnter(): void {
        searchBtn.addEventListener('mouseenter', (): void => {
            if (searchBtn) {
                searchForm.classList.add('active');
            }
        });
    }

    private onMouseOut(): void {
        searchBtn.addEventListener('mouseout', (): void => {
            if (searchBtn) {
                searchForm.classList.remove('active');
            }
        });
    }

    private onCloseSearchButtonClick(callback: (input?: string)=> void): void {
        closeSearchBtn.addEventListener('click', (): void => {
            closeSearchBtn.classList.remove('show');
            (<HTMLInputElement>searchForm).value = '';
            callback();
        });
    }

    private onSearchButtonInput(callback: (input?: string)=> void): void {
        searchForm.addEventListener('input', (event: Event): void => {
            const input: string = <string>(<HTMLInputElement>searchForm).value.toLowerCase();
            (<HTMLElement>closeSearchBtn).classList.toggle('show', (<HTMLInputElement>event.target).value !== '');
            input ? callback(input) : callback();
        });
    }

    private onSearchFormClick(): void {
        searchForm.addEventListener('click', (event: MouseEvent): void => {
            closeSearchBtn.classList.toggle('show', (<HTMLInputElement>event.target).value !== '');
        });
    }

    private onSearchFormKeyDown(): void {
        searchForm.addEventListener('keydown', (event: KeyboardEvent): void => {
            if (event.key === 'Enter') {
                event.preventDefault();
                clickGoods.scrollIntoView();
            }
        });
    }

    private onSearchButtonClick(): void {
        searchBtn.addEventListener('click', (event: MouseEvent): void => {
            event.preventDefault();
            clickGoods.scrollIntoView();
        });
    }
}
