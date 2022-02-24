import { BREAD } from "./BREAD.js";
import { Section } from "./Section.js";
import { cleanEmptyArrayItems } from "../helperFunctions/cleanEmptyArrayItems.js";

class Doc extends BREAD {
    
    static fetchURL;
    static keyList = new Object();
    static browseLists = new Array();
    static readerLists = new Array();
    
    // Must be a nested array:
        // [ form element, CKEditor instance ]
        // form element has an input with name="name"
        // textarea/ck-editor is name="text"
        // there is only one type="submit" for addForms
        // one type="submit" & name="update" and then with name="delete"
    static _updateForms = new Array();
    static _addForms = new Array();
    
    constructor( name, text, idString, sectionIdStrings ) {
        
        super();
        
        this.name = name;
        this.text = text;
        this.id = idString;
        this.sections = sectionIdStrings;
        
        this.elements = {
            listItems: new Array(),
            articles: new Array()
        };
        
        this.constructor.keyList[ this.id ] = this;
        
    }
    
    // dontPush: if true, will not push to this.elements.listItems
    getSmallListItemWithClickEvent( dontPush ) {
        
        const doc = this;
        const li = document.createElement( `li` );
        
        li.innerText = this.name;
        li.setAttribute( `object-id`, this.id );
        
        li.addEventListener( `click`, function(e) {
            
            e.preventDefault;
            
            doc.constructor.listItemClickHandler( doc );
            
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
        const sectionFilter = {
            id: {
                $in: this.sections
            }
        };
        const sections = await Section.find( sectionFilter );
        const hackySections = new Array();
		
		for( let i = 0; i < this.sections.length; i++ )
		{
			for( let ii = 0; ii < sections.length; ii++ )
			{
				if( this.sections[i] === sections[ii].id )
					hackySections.push( sections[ii] );
			}
		}
		
        article.insertAdjacentHTML( `beforeend`, this.text );
        article.setAttribute( `object-id`, this.id );
        
        for( const section of hackySections )
            article.insertAdjacentElement( `beforeend`, await section.getFullArticle( true ) );
        
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
    
    async updateMe( name, text, sectionIds ) {
        
        const filter = { 'id': this.id }
        
        this.name = name;
        this.text = text;
        this.sections = sectionIds;
        
        if( await this.constructor.updateOne( name, text, sectionIds, filter ) !== false )
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
        const sectionUl = form.querySelector( `.browse` );
        
        submit.addEventListener( `click`, async function(e) {
            
            e.preventDefault();
            
            const name = form.querySelector( `[name="name"]` );
            
            if( name.value.length > 0 )
            {
                const sectionIds = Array.from( sectionUl.querySelectorAll( `li.toggle` ) );
                
				sectionIds.sort( function( a, b ) {
					
					const aOrder = a.getAttribute( `custom-order` );
					const bOrder = b.getAttribute( `custom-order` );
					
					return aOrder < bOrder ? -1 : 1;
					
				} );
				
                for( let i = 0; i < sectionIds.length; i++ )
                {
                    const li = sectionIds[i];
                    
                    li.classList.toggle( `toggle` );
                    
                    sectionIds[i] = sectionIds[i].getAttribute( `object-id` );
                }
                
                const result = await Doc.insertOne(
                    name.value,
                    ck.getData(),
                    sectionIds
                );
                const doc = result[0];
                
                name.value = ``;
                ck.setData(``);
                
                for( let i = 0; i < Doc.browseLists.length; i++ )
                {
                    const list = Doc.browseLists[i];
                    
                    list.insertAdjacentElement(
                        `beforeend`,
                        doc.getSmallListItemWithClickEvent()
                    );
                }
            }
            
        } );
        
        sectionUl.addEventListener( `click`, function(e) {
            
            e.preventDefault();
            
            const path = e.composedPath();
            
            for( let i = 0; i < path.length; i++ )
            {
                const element = path[i];
                
                if( element.tagName === `LI` )
				{
					element.classList.toggle( `toggle` );
					
					element.setAttribute( `custom-order`, new Date().getTime() );
				}
                else if( element === this )
                    break;
            }
            
        } );
        
        
        this._addForms.push( addFormArray );
        
    }
    
    static updateForm( updateFormArray ) {
        
        const form = updateFormArray[0];
        const ck = updateFormArray[1];
        const update = form.querySelector( `[type="submit"][name="update"]` );
        const deleet = form.querySelector( `[type="submit"][name="delete"]` );
        const sectionUl = form.querySelector( `.browse` );
        
        update.addEventListener( `click`, async function(e) {
            
            e.preventDefault();
            
            const name = form.querySelector( `[name="name"]` );
            const id = form.getAttribute( `doc-id` );
            
            if( name.value.length > 0 )
            {
                if( Doc.keyList[ id ] !== undefined )
                {
                    const sectionIds = Array.from( sectionUl.querySelectorAll( `li.toggle` ) );
                    
					sectionIds.sort( function( a, b ) {
					
						const aOrder = a.getAttribute( `custom-order` );
						const bOrder = b.getAttribute( `custom-order` );
						
						return aOrder < bOrder ? -1 : 1;
						
					} );
					
					// They are in the correct order here
                    for( let i = 0; i < sectionIds.length; i++ )
                    {
                        const li = sectionIds[i];
                        
                        li.classList.toggle( `toggle` );
                        
                        sectionIds[i] = sectionIds[i].getAttribute( `object-id` );
                    }
                    
                    const doc = Doc.keyList[ id ];
                    
                    doc.updateMe(
                        name.value,
                        ck.getData(),
                        sectionIds
                    );
                    
                    name.value = ``;
                    ck.setData(``);
                    form.removeAttribute( `doc-id` );
                }
            }
            
        } );
        
        deleet.addEventListener( `click`, async function(e) {
            
            e.preventDefault();
            
            const name = form.querySelector( `[name="name"]` );
            const id = form.getAttribute( `doc-id` );
            if( id !== null )
            {
                const confirmation = window.confirm( `Are you sure you wish to delete this?` );
                
                if( confirmation === true )
                {
                    if( Doc.keyList[ id ] !== undefined )
                    {
                        const doc = Doc.keyList[ id ];
                        
                        doc.deleteMe();
                        
                        name.value = ``;
                        ck.setData(``);
                        form.removeAttribute( `doc-id` );
                        
                        for( const li of sectionUl.querySelectorAll( `li.toggle` ) )
                            li.classList.toggle( `toggle` );
                    }
                }
            }
            
        } )
        
        sectionUl.addEventListener( `click`, function(e) {
            
            e.preventDefault();
            
            const path = e.composedPath();
            
            for( let i = 0; i < path.length; i++ )
            {
                const element = path[i];
                
                if( element.tagName === `LI` )
                {
					element.classList.toggle( `toggle` );
					
					element.setAttribute( `custom-order`, new Date().getTime() );
				}
                else if( element === this )
                    break;
            }
            
        } );
        
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
                const doc = findObject[i];
                
                doc.id = doc.id.$oid;
                
                for( let ii = 0; ii < doc.sections.length; ii++ )
                    doc.sections[ii] = doc.sections[ii].id.$oid;
                
                if( this.keyList[ doc.id ] === undefined )
                {
                    resultArray.push(
                        new this(
                            doc.name,
                            doc.text,
                            doc.id,
                            doc.sections
                        )
                    );
                }
                else
                {
                    resultArray.push( this.keyList[ doc.id ] );
                }
                
                
            }
            
            return resultArray;
        }
        else
            return false;
        
    }
    
    static async insertOne( name, text, sectionIds ) {
        
        const newInsert = {
            type: `insert`,
            name: name,
            text: text,
            sectionIds: sectionIds,
            auth: BREAD.auth
        };
        const fetchObjectJSON = JSON.stringify( newInsert );
        const fetchResult = await super.makeFetch( this.fetchURL, fetchObjectJSON );
        
        if( fetchResult !== false )
        {
            const findObject = JSON.parse( fetchResult );
            const resultArray = new Array();
            const doc = findObject;
            
            doc.id = doc.id.$oid;
            
            for( let i = 0; i < doc.sections.length; i++ )
                doc.sections[i] = doc.sections[i].id.$oid;
            
            resultArray.push(
                new this(
                    doc.name,
                    doc.text,
                    doc.id,
                    doc.sections
                )
            );
            
            return resultArray;
        }
        else
            return false;
        
    }
    
    static async updateOne( name, text, sectionIds, filter, options = {} ) {
        
		// This does not the order of the sectionIds into account
        const newUpdate = {
            type: `update`,
            name: name,
            text: text,
            sectionIds: sectionIds,
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
            const doc = findObject;
            
            doc.id = doc.id.$oid;
            
            for( let ii = 0; ii < doc.sections.length; ii++ )
                doc.sections[ii] = doc.sections[ii].id.$oid;
            
            if( this.keyList[ doc.id ] === undefined )
            {
                resultArray.push(
                    new this(
                        doc.name,
                        doc.text,
                        doc.id,
                        doc.sections
                    )
                );
            }
            else
            {
                const oldDoc = this.keyList[ doc.id ];
                
                oldDoc.id = doc.id;
                oldDoc.name = doc.name;
                oldDoc.text = doc.text;
                oldDoc.sections = doc.sections;
                
                resultArray.push( oldDoc );
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

export { Doc };