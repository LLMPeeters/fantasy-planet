import { BREAD, Section, Doc, Snippet } from "./fantasyBREAD/main.js";
import * as CK from "./ckeditor5-31-1-0/build/ckeditor.js";
import { PageFlip } from "./classes/PageFlip.js";

const pageFlips = document.querySelectorAll( `.page-flip` );

for( const flip of pageFlips )
    new PageFlip( flip );

const sections = await Section.find();
const docs = await Doc.find();
const snippets = await Snippet.find();
const auth = {
    sessionId: document.body.getAttribute( `session` ),
    username: document.body.getAttribute( `username` )
};
BREAD.auth = auth;

let sectionUpdateForm = document.querySelector( `form.update-form.fantasy-sections` );
let sectionAddForm = document.querySelector( `form.add-form.fantasy-sections` );

let docUpdateForm = document.querySelector( `form.update-form.fantasy-docs` );
let docAddForm = document.querySelector( `form.add-form.fantasy-docs` );

let snippetUpdateForm = document.querySelector( `form.update-form.fantasy-snippets` );
let snippetAddForm = document.querySelector( `form.add-form.fantasy-snippets` );

if( sectionUpdateForm !== null )
{
    sectionUpdateForm = new Array(
        sectionUpdateForm,
        await ClassicEditor.create(
            sectionUpdateForm.querySelector( `.ck-edit` ), {
				heading: {
					options: [
						{ model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
						{ model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
						{ model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
						{ model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
						{ model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
						{ model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
						{ model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
					]
				}
			}
        ).catch( error=> console.error( error ) )
    );
    
    Section.updateForm( sectionUpdateForm );
}
if( sectionAddForm !== null )
{
    sectionAddForm = new Array(
        sectionAddForm,
        await ClassicEditor.create(
            sectionAddForm.querySelector( `.ck-edit` ), {
				heading: {
					options: [
						{ model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
						{ model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
						{ model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
						{ model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
						{ model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
						{ model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
						{ model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
					]
				}
			}
        ).catch( error=> console.error( error ) )
    );
    
    Section.addForm( sectionAddForm );
}

if( docUpdateForm !== null )
{
    docUpdateForm = new Array(
        docUpdateForm,
        await ClassicEditor.create(
            docUpdateForm.querySelector( `.ck-edit` ), {
				heading: {
					options: [
						{ model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
						{ model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
						{ model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
						{ model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
						{ model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
						{ model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
						{ model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
					]
				}
			}
        ).catch( error=> console.error( error ) )
    );
    
    Doc.updateForm( docUpdateForm );
}
if( docAddForm !== null )
{
    docAddForm = new Array(
        docAddForm,
        await ClassicEditor.create(
            docAddForm.querySelector( `.ck-edit` ), {
				heading: {
					options: [
						{ model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
						{ model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
						{ model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
						{ model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
						{ model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
						{ model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
						{ model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
					]
				}
			}
        ).catch( error=> console.error( error ) )
    );
    
    Doc.addForm( docAddForm );
}

if( snippetUpdateForm !== null )
{
    snippetUpdateForm = new Array(
        snippetUpdateForm,
        await ClassicEditor.create(
            snippetUpdateForm.querySelector( `.ck-edit` ), {
				heading: {
					options: [
						{ model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
						{ model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
						{ model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
						{ model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
						{ model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
						{ model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
						{ model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
					]
				}
			}
        ).catch( error=> console.error( error ) )
    );
    
    Snippet.updateForm( snippetUpdateForm );
}
if( snippetAddForm !== null )
{
    snippetAddForm = new Array(
        snippetAddForm,
        await ClassicEditor.create(
            snippetAddForm.querySelector( `.ck-edit` ), {
				heading: {
					options: [
						{ model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
						{ model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
						{ model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
						{ model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
						{ model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
						{ model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
						{ model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
					]
				}
			}
        ).catch( error=> console.error( error ) )
    );
    
    Snippet.addForm( snippetAddForm );
}

Section.browseLists = Array.from( document.querySelectorAll( `.browse.fantasy-sections` ) );
Doc.browseLists = Array.from( document.querySelectorAll( `.browse.fantasy-docs` ) );
Doc.readerLists = Array.from( document.querySelectorAll( `.reader.fantasy-docs` ) );
Snippet.browseLists = Array.from( document.querySelectorAll( `.browse.fantasy-snippets` ) );

Section.listItemClickHandler = function( section ) {
    
    const targets = section.constructor._updateForms;
    
    for( let i = 0; i < targets.length; i++ )
    {
        const data = targets[i];
        const form = data[0];
        const ckeditor = data[1];
        
        form.setAttribute( `section-id`, section.id );
        form.querySelector( `[name="name"]` ).value = section.name;
        ckeditor.setData( section.text );
    }
    
}
Doc.listItemClickHandler = async function( doc ) {
    
    const targets = doc.constructor._updateForms;
    
    for( let i = 0; i < targets.length; i++ )
    {
        const data = targets[i];
        const form = data[0];
        const ckeditor = data[1];
        const sectionsUl = form.querySelector( `.browse` );
        const items = sectionsUl.querySelectorAll( `li` );
        
        form.setAttribute( `doc-id`, doc.id );
        form.querySelector( `[name="name"]` ).value = doc.name;
        ckeditor.setData( doc.text );
        
        for( const item of items )
            item.classList.remove( `toggle` );
        
        for( let ii = 0; ii < items.length; ii++ )
        {
            if( doc.sections.includes( items[ii].getAttribute( `object-id` ) ) )
                items[ii].classList.toggle( `toggle` );
        }
    }
    
    for( let i = 0; i < doc.constructor.readerLists.length; i++ )
    {
        const reader = doc.constructor.readerLists[i];
        const article = await doc.getFullArticle( true );
        
        reader.innerHTML = ``;
        
        reader.insertAdjacentElement( `beforeend`, article );
    }
    
}
Snippet.listItemClickHandler = function( snippet ) {
    
    const targets = snippet.constructor._updateForms;
    
    for( let i = 0; i < targets.length; i++ )
    {
        const data = targets[i];
        const form = data[0];
        const ckeditor = data[1];
        
        form.setAttribute( `snippet-id`, snippet.id );
        form.querySelector( `[name="name"]` ).value = snippet.name;
        form.querySelector( `[name="tags"]` ).value = snippet.tags.join( `, ` );
        ckeditor.setData( snippet.text );
    }
    
}

for( let i = 0; i < Section.browseLists.length; i++ )
{
    const target = Section.browseLists[i];
    
    for( let ii = 0; ii < sections.length; ii++ )
    {
        const newItem = sections[ii].getSmallListItemWithClickEvent();
        
        target.insertAdjacentElement( `beforeend`, newItem );
    }
}
for( let i = 0; i < Doc.browseLists.length; i++ )
{
    const target = Doc.browseLists[i];
    
    for( let ii = 0; ii < docs.length; ii++ )
    {
        const newItem = docs[ii].getSmallListItemWithClickEvent();
        
        target.insertAdjacentElement( `beforeend`, newItem );
    }
}
for( let i = 0; i < Snippet.browseLists.length; i++ )
{
    const target = Snippet.browseLists[i];
    
    for( let ii = 0; ii < snippets.length; ii++ )
    {
        const newItem = snippets[ii].getSmallListItemWithClickEvent();
        
        target.insertAdjacentElement( `beforeend`, newItem );
    }
}
