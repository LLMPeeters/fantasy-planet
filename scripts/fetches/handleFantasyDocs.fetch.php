<?php

require_once( __DIR__ . '/../../classes/FanSection.php' );
require_once( __DIR__ . '/../../classes/FanDoc.php' );
require_once( __DIR__ . '/../../privates/mongoConnect.inc.php' );

FanSection::__init( $client, $client->webber, $client->webber->sections );
FanDoc::__init( $client, $client->webber, $client->webber->docs );

$dataString = file_get_contents( 'php://input' );
$dataObject = json_decode( $dataString, true );

// $dataObject['type']
// $dataObject['filter']
// $dataObject['filter']['id']
// $dataObject['options']
// $dataObject['name']
// $dataObject['text']
// $dataObject['sectionIds']

if( isset( $dataObject['type'] ) )
{
    if( isset( $dataObject['filter'] ) && isset( $dataObject['filter']['id'] ) )
    {
        if( isset( $dataObject['filter']['id']['$in'] ) )
        {
            $dataObject['filter']['_id'] = array();
            
            foreach( $dataObject['filter']['id'] as $key=> $idString )
            {
                $dataObject['filter']['_id'][ $key ] = array();
                
                foreach( $dataObject['filter']['id'][ $key ] as $idString )
                {
                    $dataObject['filter']['_id'][ $key ][] = new MongoDB\BSON\ObjectId( $idString );
                }
            }
        }
        else
        {
            $dataObject['filter']['_id'] = new MongoDB\BSON\ObjectId( $dataObject['filter']['id'] );
        }
        
        unset( $dataObject['filter']['id'] );
    }
    
    if( isset( $dataObject['sectionIds'] ) )
    {
        for( $i = 0; $i < count($dataObject['sectionIds']); $i++ )
            $dataObject['sectionIds'][$i] = new MongoDB\BSON\ObjectId( $dataObject['sectionIds'][$i] );
    }
    
    require_once( __DIR__ . '/../includes/fetchAuthenticate.inc.php' );
    
    // dataObject must consist of the type property, which determines what action will be taken
    // type: insert/update/delete/find
    if( $dataObject['type'] === 'find' )
    {
        // a find requires the following properties:
        // filter: an array to filter the find query
        // options: an array to add options to the find query
        if(
            isset( $dataObject['filter'] ) && is_array( $dataObject['filter'] ) &&
            isset( $dataObject['options'] ) && is_array( $dataObject['options'] )
        ) {
            $docs = FanDoc::getExistingDocs( $dataObject['filter'], $dataObject['options'] );
            
            $docsJSON = json_encode( $docs );
            
            if( $docsJSON !== false )
                echo $docsJSON;
            else
                echo 'failed to convert find to JSON';
        }
    }
    elseif( $dataObject['type'] === 'insert' )
    {
        if(
            isset( $dataObject['name'] ) && is_string( $dataObject['name'] ) &&
            isset( $dataObject['text'] ) && is_string( $dataObject['text'] ) &&
            isset( $dataObject['sectionIds'] ) && is_array( $dataObject['sectionIds'] )
        ) {
            $sectionFilter = array(
                '_id'=> array(
                    '$in'=> $dataObject['sectionIds']
                )
            );
            
            $sections = FanSection::getExistingSections( $sectionFilter );
            
            $doc = new FanDoc( $dataObject['name'], $dataObject['text'], $sections );
            
            echo json_encode( $doc );
        }
    }
    elseif( $dataObject['type'] === 'update' )
    {
        if(
            isset( $dataObject['name'] ) && is_string( $dataObject['name'] ) &&
            isset( $dataObject['text'] ) && is_string( $dataObject['text'] ) &&
            isset( $dataObject['filter'] ) && is_array( $dataObject['filter'] ) &&
            isset( $dataObject['options'] ) && is_array( $dataObject['options'] ) &&
            isset( $dataObject['sectionIds'] ) && is_array( $dataObject['sectionIds'] )
        ) {
			// This causes the sections to be inserted while ignoring order
            $sectionFilter = array(
                '_id'=> array(
                    '$in'=> $dataObject['sectionIds']
                )
            );
            
            $sections = FanSection::getExistingSections( $sectionFilter );
			
			// Hacky method of including the correct order
			$hackySections = array();
			
			foreach( $dataObject['sectionIds'] as $idString )
			{
				foreach( $sections as $section )
				{
					$sectionId = $section->id;
					
					if( $sectionId == $idString )
						$hackySections[] = $section;
				}
			}
			
            $doc = FanDoc::getExistingDocs( $dataObject['filter'], $dataObject['options'] )[0];
            
            $doc->updateMe( $dataObject['name'], $dataObject['text'], $hackySections );
            
            echo json_encode( $doc );
        }
    }
    elseif( $dataObject['type'] === 'delete' )
    {
        if(
            isset( $dataObject['filter'] ) && is_array( $dataObject['filter'] ) &&
            isset( $dataObject['options'] ) && is_array( $dataObject['options'] )
        ) {
            $doc = FanDoc::getExistingDocs( $dataObject['filter'], $dataObject['options'] )[0];
            
            echo $doc->deleteMe();
        }
    }
}

?>