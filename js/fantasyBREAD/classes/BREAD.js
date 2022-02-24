class BREAD {
    
    static async makeFetch( url, fetchBodyJSON ) {
        
        let result = null;
        
        await fetch( url, {
            method: `POST`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: fetchBodyJSON
        } ).then( (response)=> response.text() ).then( function( string ) {
            
            if( string === 'false' )
                result = false;
            else
                result = string;
            
        } );
        
        return result;
        
    }
    
}

export { BREAD };