<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once( __DIR__ . '/../privates/mongoConnect.inc.php' );
require_once( '../classes/FantasyText.php' );
require_once( '../classes/MongoHelper.php' );

$dataString = file_get_contents( 'php://input' );
$dataObject = json_decode( $dataString );

$webber = $client->webber;

if( $dataObject->type === 'update' )
{
    if(
        isset( $dataObject->text ) && is_string( $dataObject->text ) && strlen( $dataObject->text ) < 2000 &&
        isset( $dataObject->textId ) &&
        isset( $dataObject->username ) &&
        isset( $dataObject->sessionId )
    ) {
        $checkSession = $webber->sessions->findOne( array( 'id'=> $dataObject->sessionId ) );
        
        if( $checkSession !== null )
        {
            $checkUser = $webber->users->findOne( array( '_id'=> $checkSession->userId, 'username'=> $dataObject->username ) );
            
            if( $checkUser !== null )
            {
                MongoHelper::updateSessionTime( $client, $dataObject->sessionId );
                
                $id = new MongoDB\BSON\ObjectId( $dataObject->id );
                
                $newSnippet = new Snippet(
                    $dataObject->tags,
                    $dataObject->name,
                    $dataObject->text
                );
                
                $result = $collection->updateOne(
                    ['_id'=> new MongoDB\BSON\ObjectId( $dataObject->id )],
                    [
                        '$set'=> $newSnippet,
                        '$push'=> ['editedAt'=> new MongoDB\BSON\UTCDateTime()]
                    ]
                );
                
                echo 'success';
                
                exit();
            }
        }
    }
}
elseif( $dataObject->type === 'delete' )
{
    if(
        isset( $dataObject->tags ) && is_array( $dataObject->tags ) && strlen( implode( '', $dataObject->tags ) ) < 1024 &&
        isset( $dataObject->name ) && is_string( $dataObject->name ) && strlen( $dataObject->name ) < 128 &&
        isset( $dataObject->text ) && is_string( $dataObject->text ) && strlen( $dataObject->text ) < 2000 &&
        isset( $dataObject->username ) &&
        isset( $dataObject->sessionId )
    ) {
        $checkSession = $webber->sessions->findOne( array( 'id'=> $dataObject->sessionId ) );
        
        if( $checkSession !== null )
        {
            $checkUser = $webber->users->findOne( array( '_id'=> $checkSession->userId, 'username'=> $dataObject->username ) );
            
            if( $checkUser !== null )
            {
                MongoHelper::updateSessionTime( $client, $dataObject->sessionId );
                
                $filter = array(
                    'name'=> $dataObject->name,
                    'text'=> $dataObject->text,
                    'tags'=> $dataObject->tags,
                    '_id'=> new MongoDB\BSON\ObjectId( $dataObject->id )
                );
                
                $result = $collection->deleteOne( $filter );
                
                echo 'success';
                
                exit();
            }
        }
    }
}
elseif( $dataObject->type === 'add' )
{
    if(
        isset( $dataObject->text ) && is_string( $dataObject->text ) &&
        isset( $dataObject->username ) &&
        isset( $dataObject->sessionId )
    ) {
        $checkSession = $webber->sessions->findOne( array( 'id'=> $dataObject->sessionId ) );
        
        if( $checkSession !== null )
        {
            $checkUser = $webber->users->findOne( array( '_id'=> $checkSession->userId, 'username'=> $dataObject->username ) );
            
            if( $checkUser !== null )
            {
                MongoHelper::updateSessionTime( $client, $dataObject->sessionId );
                
                $newText = new FantasyText( $dataObject->text, $checkUser->_id );
                $newId = null;
                
                $result = $webber->texts->insertOne( $newText );
                
                echo( $result->getInsertedId() );
                
                exit();
            }
        }
    }
}
elseif( $dataObject->type === 'get' )
{
    echo json_encode( $client->webber->snippets->find()->toArray() );
    
    exit();
}

echo 'error';

?>