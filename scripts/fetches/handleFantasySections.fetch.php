<?php

require_once( __DIR__ . '/../../classes/FanSection.php' );
require_once( __DIR__ . '/../../privates/mongoConnect.inc.php' );

FanSection::__init( $client, $client->webber, $client->webber->sections );

$dataString = file_get_contents( 'php://input' );
$dataObject = json_decode( $dataString, true );

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
            $sections = FanSection::getExistingSections( $dataObject['filter'], $dataObject['options'] );
            
            $sectionsJSON = json_encode( $sections );
            
            if( $sectionsJSON !== false )
                echo $sectionsJSON;
            else
                echo 'failed to convert find to JSON';
        }
    }
    elseif( $dataObject['type'] === 'insert' )
    {
        if(
            isset( $dataObject['name'] ) && is_string( $dataObject['name'] ) &&
            isset( $dataObject['text'] ) && is_string( $dataObject['text'] )
        ) {
            $section = new FanSection( $dataObject['name'], $dataObject['text'] );
            
            echo json_encode( $section );
        }
    }
    elseif( $dataObject['type'] === 'update' )
    {
        if(
            isset( $dataObject['name'] ) && is_string( $dataObject['name'] ) &&
            isset( $dataObject['text'] ) && is_string( $dataObject['text'] ) &&
            isset( $dataObject['filter'] ) && is_array( $dataObject['filter'] ) &&
            isset( $dataObject['options'] ) && is_array( $dataObject['options'] )
        ) {
            $section = FanSection::getExistingSections( $dataObject['filter'], $dataObject['options'] )[0];
            
            $section->updateMe( $dataObject['name'], $dataObject['text'] );
            
            echo json_encode( $section );
        }
    }
    elseif( $dataObject['type'] === 'delete' )
    {
        if(
            isset( $dataObject['filter'] ) && is_array( $dataObject['filter'] ) &&
            isset( $dataObject['options'] ) && is_array( $dataObject['options'] )
        ) {
            $section = FanSection::getExistingSections( $dataObject['filter'], $dataObject['options'] )[0];
            
            echo $section->deleteMe();
        }
    }
}

?>