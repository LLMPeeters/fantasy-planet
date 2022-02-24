<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

abstract class MongoHelper {
    
    static public function executeFind(
        MongoDB\Collection $collection,
        array $filter = array(),
        array $options = array()
    ):MongoDB\Driver\Cursor {
        
        $result = $collection->find( $filter, $options );
        
        return $result;
        
    }
    
    static public function executeUpdateOne(
        MongoDB\Collection $collection,
        array $newData,
        array $filter = array(),
        array $options = array()
    ):MongoDB\UpdateResult {
        
        $updateData = array( '$set'=> $newData );
        $filter = array( 'text'=> 'wasghsrhgasrdhg' );
        $result = $collection->updateOne( $filter, $updateData, $options );
        
        return $result;
        
    }
    
    static public function executeDeleteOne(
        MongoDB\Collection $collection,
        array $filter,
        array $options = array()
    ):MongoDB\DeleteResult {
        
        $result = $collection->deleteOne( $filter, $options );
        
        echo '<pre>';
        var_dump( $result );
        echo '</pre>';
        
        return $result;
        
    }
    
    static public function executeInsertOne(
        MongoDB\Collection $collection,
        array $document,
        array $options = array()
    ):MongoDB\InsertOneResult {
        
        $result = $collection->insertOne( $document, $options );
        
        return $result;
        
    }
    
    static public function getSnippets( MongoDB\Client $client ) {
        
        $webber = $client->webber;
        
        return $webber->selectCollection( 'snippets' )->find()->toArray();
        
    }
    
    static public function updateSessionTime( MongoDB\Client $client, string $session_id ):bool {
        
        $sessions = $client->webber->sessions;
        
        $session = $sessions->findOne( array( 'id'=> $session_id ) );
        
        if( $session !== null )
        {
            $sessions->updateOne(
                array( '_id'=> $session->_id ),
                array( '$set'=> array(
                    'lastVisit'=> new MongoDB\BSON\UTCDateTime()
                ) )
            );
            
            return true;
        }
        
        return false;
        
    }
    
    static public function checkLoginStatus( MongoDB\Client $client, string $session_id, string $username ):bool {
        
        $users = $client->webber->users;
        $sessions = $client->webber->sessions;
        
        $session = $sessions->findOne( array( 'id'=> $session_id ) );
        
        if( $session !== null )
        {
            $user = $users->findOne( array(
                '_id'=> $session->userId,
                'username'=> $username
            ) );
            
            if( $user !== null )
            {
                return true;
            }
        }
        
        return false;
        
    }
    
}

?>