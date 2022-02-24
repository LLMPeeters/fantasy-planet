class PageFlip {
    
    constructor( container ) {
        
        const rightButton = container.querySelector( `:scope > .right` );
        
        rightButton.addEventListener( `click`, function(e) {
            
            const pages = Array.from( container.querySelectorAll( `.page` ) );
            const activePage = container.querySelector( `.page.toggle` );
            const currentIndex = pages.indexOf( activePage );
            const nextIndex = currentIndex+1 > pages.length-1 ? 0 : currentIndex+1;
            console.log(pages);
            activePage.classList.toggle( `toggle` );
            pages[nextIndex].classList.toggle( `toggle` );
            
        } );
        
    }
    
};

export { PageFlip };