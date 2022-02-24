import { BREAD } from "./BREAD.js";
import { Snippet } from "./Snippet.js";
import { cleanEmptyArrayItems } from "../helperFunctions/cleanEmptyArrayItems.js";

class Section extends BREAD {
    
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
    
    constructor( name, text, idString ) {
        
        super();
        
        this.name = name;
        this.text = text;
        this.id = idString;
        
        this.elements = {
            listItems: new Array(),
            articles: new Array()
        };
        
        this.constructor.keyList[ this.id ] = this;
        
    }
    
    // dontPush: if true, will not push to this.elements.listItems
    getSmallListItemWithClickEvent( dontPush ) {
        
        const section = this;
        const li = document.createElement( `li` );
        
        li.innerText = this.name;
        li.setAttribute( `object-id`, this.id );
        
        li.addEventListener( `click`, function(e) {
            
            e.preventDefault;
            
            section.constructor.listItemClickHandler( section );
            
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
    
    // dontPush: if true, will not push to this.elements.articles
    async getFullArticle( dontPush ) {
        
        const article = document.createElement( `article` );
        
        article.insertAdjacentHTML( `beforeend`, this.text );
        article.setAttribute( `object-id`, this.id );
        
        const snippetBoxes = article.querySelectorAll( `.snippet-box` );
        
        for( const box of snippetBoxes )
        {
            const tags = box.innerText.split( `, ` );
            const filter = {
                tags: {
                    $all: tags
                }
            };
            const limit = { $limit: Number( box.getAttribute( `limit` ) ) };
            const snippets = await Snippet.find( filter, limit );
            
            box.innerText = ``;
            
            for( const snippet of snippets )
                box.insertAdjacentElement( `beforeend`, snippet.getFullDiv() );
        }
        
        if( dontPush !== true )
            this.elements.articles.push( article );
        
        return article;
        
    }
    refreshArticles() {
        
        const articles = this.elements.articles;
        
        for( let i = 0; i < articles.length; i++ )
        {
            const oldArticle = articles[i];
            const newArticle = this.getFullArticle( true );
            
            oldArticle.insertAdjacentElement( `afterend`, newArticle );
            oldArticle.remove();
            
            articles[i] = newArticle;
        }
        
    }
    deleteArticles() {
        
        const articles = this.elements.articles;
        
        for( let i = 0; i < articles.length; i++ )
        {
            const article = articles[i];
            
            article.remove();
            
            articles[i] = undefined;
        }
        
        cleanEmptyArrayItems( articles );
        
    }
    
    async updateMe( name, text ) {
        
        const filter = { 'id': this.id }
        
        this.name = name;
        this.text = text;
        
        if( await this.constructor.updateOne( name, text, filter ) !== false )
        {
            this.refreshListItems();
            this.refreshArticles();
            
            return true;
        }
        
        return false;
        
    }
    
    async deleteMe() {
        
        const filter = { 'id': this.id }
        
        if( await this.constructor.deleteOne( filter ) !== false )
        {
            this.deleteListItems();
            this.deleteArticles();
            
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
            
            if( name.value.length > 0 )
            {
                const result = await Section.insertOne(
                    name.value,
                    ck.getData()
                );
                const section = result[0];
                
                name.value = ``;
                ck.setData(``);
                
                for( let i = 0; i < Section.browseLists.length; i++ )
                {
                    const list = Section.browseLists[i];
                    
                    list.insertAdjacentElement(
                        `beforeend`,
                        section.getSmallListItemWithClickEvent()
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
            const id = form.getAttribute( `section-id` );
            
            if( name.value.length > 0 )
            {
                if( Section.keyList[ id ] !== undefined )
                {
                    const section = Section.keyList[ id ];
                    
                    section.updateMe( name.value, ck.getData() );
                    
                    name.value = ``;
                    ck.setData(``);
                    form.removeAttribute( `section-id` );
                }
            }
            
        } );
        
        deleet.addEventListener( `click`, async function(e) {
            
            e.preventDefault();
            
            const name = form.querySelector( `[name="name"]` );
            const id = form.getAttribute( `section-id` );
            if( id !== null )
            {
                const confirmation = window.confirm( `Are you sure you wish to delete this?` );
                
                if( confirmation === true )
                {
                    if( Section.keyList[ id ] !== undefined )
                    {
                        const section = Section.keyList[ id ];
                        
                        section.deleteMe();
                        
                        name.value = ``;
                        ck.setData(``);
                        form.removeAttribute( `section-id` );
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
                const section = findObject[i];
                
                section.id = section.id.$oid;
                
                if( this.keyList[ section.id ] === undefined )
                {
                    resultArray.push(
                        new this(
                            section.name,
                            section.text,
                            section.id
                        )
                    );
                }
                else
                {
                    resultArray.push( this.keyList[ section.id ] );
                }
                
                
            }
            
            return resultArray;
        }
        else
            return false;
        
    }
    
    static async insertOne( name, text ) {
        
        const newInsert = {
            type: `insert`,
            name: name,
            text: text,
            auth: BREAD.auth
        };
        const fetchObjectJSON = JSON.stringify( newInsert );
        const fetchResult = await super.makeFetch( this.fetchURL, fetchObjectJSON );
        
        if( fetchResult !== false )
        {
            const findObject = JSON.parse( fetchResult );
            const resultArray = new Array();
            const section = findObject;
            
            section.id = section.id.$oid;
            
            resultArray.push(
                new this(
                    section.name,
                    section.text,
                    section.id
                )
            );
            
            return resultArray;
        }
        else
            return false;
        
    }
    
    static async updateOne( name, text, filter, options = {} ) {
        
        const newUpdate = {
            type: `update`,
            name: name,
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
            const section = findObject;
            
            section.id = section.id.$oid;
            
            if( this.keyList[ section.id ] === undefined )
            {
                resultArray.push(
                    new this(
                        section.name,
                        section.text,
                        section.id
                    )
                );
            }
            else
            {
                const oldSection = this.keyList[ section.id ];
                
                oldSection.id = section.id;
                oldSection.name = section.name;
                oldSection.text = section.text;
                
                resultArray.push( oldSection );
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

export { Section };