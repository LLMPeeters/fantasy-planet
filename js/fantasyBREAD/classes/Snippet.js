import { BREAD } from "./BREAD.js";
import { cleanEmptyArrayItems } from "../helperFunctions/cleanEmptyArrayItems.js";

class Snippet extends BREAD {
    
    _tags;
    
    static fetchURL;
    static keyList = new Object();
    static browseLists = new Array();
    
    // Must be a nested array:
        // [ form element, CKEditor instance ]
        // form element has an input with name="name"
        // textarea/ck-editor is name="text"
        // there is only one type="submit" for addForms
        // one type="submit" & name="update" and then with name="delete"
    static _updateForms = new Array();
    static _addForms = new Array();
    
    // tags comes in as a string, which is turned into an array by 'set tags()'
    // tags can also come in as an already-made array
    constructor( name, tags, text, idString ) {
        
        super();
        
        this.name = name;
        this.text = text;
        this.tags = tags;
        this.id = idString;
        
        this.elements = {
            listItems: new Array(),
            divs: new Array()
        };
        
        this.constructor.keyList[ this.id ] = this;
        
    }
    
    get tags() {
        
        return this._tags;
        
    }
    
    set tags( input ) {
        
        if( Array.isArray( input ) === true )
            this._tags = input;
        else
            this._tags = input.split( `, ` );
        
    }
    
    // dontPush: if true, will not push to this.elements.listItems
    getSmallListItemWithClickEvent( dontPush ) {
        
        const snippet = this;
        const li = document.createElement( `li` );
        
        li.innerText = this.name;
        li.setAttribute( `object-id`, this.id );
        
        li.addEventListener( `click`, function(e) {
            
            e.preventDefault;
            
            snippet.constructor.listItemClickHandler( snippet );
            
        } )
        
        if( dontPush !== true )
            this.elements.listItems.push( li );
        
        return li;
        
    }
    refreshListItems() {
        
        const listItems = this.elements.listItems;
        
        for( let i = 0; i < listItems.length; i++ )
        {
            const oldItem = listItems[i];
            const newItem = this.getSmallListItemWithClickEvent( true );
            
            oldItem.insertAdjacentElement( `afterend`, newItem );
            oldItem.remove();
            
            listItems[i] = newItem;
        }
        
    }
    deleteListItems() {
        
        const listItems = this.elements.listItems;
        
        for( let i = 0; i < listItems.length; i++ )
        {
            const item = listItems[i];
            
            item.remove();
            
            listItems[i] = undefined;
        }
        
        cleanEmptyArrayItems( listItems );
        
    }
    
    // dontPush: if true, will not push to this.elements.divs
    getFullDiv( dontPush ) {
        
        const div = document.createElement( `div` );
        
        div.insertAdjacentHTML( `beforeend`, this.text );
        div.setAttribute( `object-id`, this.id );
        
		if( this.tags.includes( `good` ) )
			div.classList.add( `good` );
		
		if( this.tags.includes( `very good` ) )
			div.classList.add( `very-good` );
		
        if( dontPush !== true )
            this.elements.divs.push( div );
        
        return div;
        
    }
    refreshDivs() {
        
        const divs = this.elements.divs;
        
        for( let i = 0; i < divs.length; i++ )
        {
            const oldDiv = divs[i];
            const newDiv = this.getFullDiv( true );
            
            oldDiv.insertAdjacentElement( `afterend`, newDiv );
            oldDiv.remove();
            
            divs[i] = newDiv;
        }
        
    }
    deleteDivs() {
        
        const divs = this.elements.divs;
        
        for( let i = 0; i < divs.length; i++ )
        {
            const div = divs[i];
            
            div.remove();
            
            divs[i] = undefined;
        }
        
        cleanEmptyArrayItems( divs );
        
    }
    
    async updateMe( name, tags, text ) {
        
        const filter = { 'id': this.id }
        
        this.name = name;
        this.tags = tags;
        this.text = text;
        
        if( await this.constructor.updateOne( name, this.tags, text, filter ) !== false )
        {
            this.refreshListItems();
            this.refreshDivs();
            
            return true;
        }
        
        return false;
        
    }
    
    async deleteMe() {
        
        const filter = { 'id': this.id }
        
        if( await this.constructor.deleteOne( filter ) !== false )
        {
            this.deleteListItems();
            this.deleteDivs();
            
            return true;
        }
        
        return false;
        
    }
    
    static addForm( addFormArray ) {
        
        const form = addFormArray[0];
        const ck = addFormArray[1];
        const submit = form.querySelector( `[type="submit"]` );
        
        submit.addEventListener( `click`, async function(e) {
            
            e.preventDefault();
            
            const name = form.querySelector( `[name="name"]` );
            const tags = form.querySelector( `[name="tags"]` );
            
            if( name.value.length > 0 )
            {
                const result = await Snippet.insertOne(
                    name.value,
                    tags.value.split( `, ` ),
                    ck.getData()
                );
                const snippet = result[0];
                
                name.value = ``;
                tags.value = ``;
                ck.setData(``);
                
                for( let i = 0; i < Snippet.browseLists.length; i++ )
                {
                    const list = Snippet.browseLists[i];
                    
                    list.insertAdjacentElement(
                        `beforeend`,
                        snippet.getSmallListItemWithClickEvent()
                    );
                }
            }
            
        } );
        
        this._addForms.push( addFormArray );
        
    }
    
    static updateForm( updateFormArray ) {
        
        const form = updateFormArray[0];
        const ck = updateFormArray[1];
        const update = form.querySelector( `[type="submit"][name="update"]` );
        const deleet = form.querySelector( `[type="submit"][name="delete"]` );
        
        update.addEventListener( `click`, async function(e) {
            
            e.preventDefault();
            
            const name = form.querySelector( `[name="name"]` );
            const tags = form.querySelector( `[name="tags"]` );
            const id = form.getAttribute( `snippet-id` );
            
            if( name.value.length > 0 )
            {
                if( Snippet.keyList[ id ] !== undefined )
                {
                    const snippet = Snippet.keyList[ id ];
                    
                    snippet.updateMe( name.value, tags.value.split( `, ` ), ck.getData() );
                    
                    name.value = ``;
                    tags.value = ``;
                    ck.setData(``);
                    form.removeAttribute( `snippet-id` );
                }
            }
            
        } );
        
        deleet.addEventListener( `click`, async function(e) {
            
            e.preventDefault();
            
            const name = form.querySelector( `[name="name"]` );
            const tags = form.querySelector( `[name="tags"]` );
            const id = form.getAttribute( `snippet-id` );
            
            if( id !== null )
            {
                const confirmation = window.confirm( `Are you sure you wish to delete this?` );
                
                if( confirmation === true )
                {
                    if( Snippet.keyList[ id ] !== undefined )
                    {
                        const snippet = Snippet.keyList[ id ];
                        
                        snippet.deleteMe();
                        
                        name.value = ``;
                        tags.value = ``;
                        ck.setData(``);
                        form.removeAttribute( `snippet-id` );
                    }
                }
            }
            
        } )
        
        this._updateForms.push( updateFormArray );
        
    }
    
    static async find( filter = {}, options = {} ) {
        
        const newFind = {
            type: `find`,
            filter: filter,
            options: options
        };
        const fetchObjectJSON = JSON.stringify( newFind );
        const fetchResult = await super.makeFetch( this.fetchURL, fetchObjectJSON );
        
        if( fetchResult !== false )
        {
            const findObject = JSON.parse( fetchResult );
            const resultArray = new Array();
            
            for( let i = 0; i < findObject.length; i++ )
            {
                const snippet = findObject[i];
                
                snippet.id = snippet.id.$oid;
                
                if( this.keyList[ snippet.id ] === undefined )
                {
                    resultArray.push(
                        new this(
                            snippet.name,
                            snippet.tags,
                            snippet.text,
                            snippet.id
                        )
                    );
                }
                else
                {
                    resultArray.push( this.keyList[ snippet.id ] );
                }
                
                
            }
            
            return resultArray;
        }
        else
            return false;
        
    }
    
    static async insertOne( name, tags, text ) {
        
        const newInsert = {
            type: `insert`,
            name: name,
            tags: tags,
            text: text,
            auth: BREAD.auth
        };
        const fetchObjectJSON = JSON.stringify( newInsert );
        const fetchResult = await super.makeFetch( this.fetchURL, fetchObjectJSON );
        
        if( fetchResult !== false )
        {
            const findObject = JSON.parse( fetchResult );
            const resultArray = new Array();
            const snippet = findObject;
            
            snippet.id = snippet.id.$oid;
            
            resultArray.push(
                new this(
                    snippet.name,
                    snippet.tags,
                    snippet.text,
                    snippet.id
                )
            );
            
            return resultArray;
        }
        else
            return false;
        
    }
    
    static async updateOne( name, tags, text, filter, options = {} ) {
        
        const newUpdate = {
            type: `update`,
            name: name,
            tags: tags,
            text: text,
            filter: filter,
            options: options,
            auth: BREAD.auth
        };
        const fetchObjectJSON = JSON.stringify( newUpdate );
        const fetchResult = await super.makeFetch( this.fetchURL, fetchObjectJSON );
        
        if( fetchResult !== false )
        {
            const findObject = JSON.parse( fetchResult );
            const resultArray = new Array();
            const snippet = findObject;
            
            snippet.id = snippet.id.$oid;
            
            if( this.keyList[ snippet.id ] === undefined )
            {
                resultArray.push(
                    new this(
                        snippet.name,
                        snippet.tags,
                        snippet.text,
                        snippet.id
                    )
                );
            }
            else
            {
                const oldSnippet = this.keyList[ snippet.id ];
                
                oldSnippet.id = snippet.id;
                oldSnippet.name = snippet.name;
                oldSnippet.tags = snippet.tags
                oldSnippet.text = snippet.text;
                
                resultArray.push( oldSnippet );
            }
            
            return resultArray;
        }
        else
            return false;
        
    }
    
    static async deleteOne( filterIdObject, options = {} ) {
        
        const newUpdate = {
            type: `delete`,
            filter: filterIdObject,
            options: options,
            auth: BREAD.auth
        };
        const fetchObjectJSON = JSON.stringify( newUpdate );
        const fetchResult = await super.makeFetch( this.fetchURL, fetchObjectJSON );
        
        if( fetchResult !== false )
        {
            const findObject = JSON.parse( fetchResult );
            
            delete this.keyList[ filterIdObject.id ];
            
            return Boolean( findObject );
        }
        else
            return false;
        
    }
    
}

export { Snippet };