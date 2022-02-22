<?php

require_once( __DIR__ . '/../../classes/FanSnippet.php' );
require_once( __DIR__ . '/../includes/mongoConnect.inc.php' );

FanSnippet::__init( $client, $client->webber, $client->webber->snippets );

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
            $snippets = FanSnippet::getExistingSnippets( $dataObject['filter'], $dataObject['options'] );
            
            $snippetsJSON = json_encode( $snippets );
            
            if( $snippetsJSON !== false )
                echo $snippetsJSON;
            else
                echo 'failed to convert find to JSON';
        }
    }
    elseif( $dataObject['type'] === 'insert' )
    {
        if(
            isset( $dataObject['name'] ) && is_string( $dataObject['name'] ) &&
            isset( $dataObject['tags'] ) && is_array( $dataObject['tags'] ) &&
            isset( $dataObject['text'] ) && is_string( $dataObject['text'] )
        ) {
            $snippet = new FanSnippet( $dataObject['name'], $dataObject['tags'], $dataObject['text'] );
            
            echo json_encode( $snippet );
        }
    }
    elseif( $dataObject['type'] === 'update' )
    {
        if(
            isset( $dataObject['name'] ) && is_string( $dataObject['name'] ) &&
            isset( $dataObject['tags'] ) && is_array( $dataObject['tags'] ) &&
            isset( $dataObject['text'] ) && is_string( $dataObject['text'] ) &&
            isset( $dataObject['filter'] ) && is_array( $dataObject['filter'] ) &&
            isset( $dataObject['options'] ) && is_array( $dataObject['options'] )
        ) {
            $snippet = FanSnippet::getExistingSnippets( $dataObject['filter'], $dataObject['tags'], $dataObject['options'] )[0];
            
            $snippet->updateMe( $dataObject['name'], $dataObject['tags'], $dataObject['text'] );
            
            echo json_encode( $snippet );
        }
    }
    elseif( $dataObject['type'] === 'delete' )
    {
        if(
            isset( $dataObject['filter'] ) && is_array( $dataObject['filter'] ) &&
            isset( $dataObject['options'] ) && is_array( $dataObject['options'] )
        ) {
            $snippet = FanSnippet::getExistingSnippets( $dataObject['filter'], $dataObject['options'] )[0];
            
            echo $snippet->deleteMe();
        }
    }
}

?>