function cleanEmptyArrayItems( array ) {
    
    let shift = 0;
    
    for( let i = 0; i < array.length; i++ )
    {
        const item = array[i];
        
        if( item === undefined )
            shift++;
        else
            array[i] = array[i - shift];
    }
    
    array.length = array.length - shift;
    
}

export { cleanEmptyArrayItems };