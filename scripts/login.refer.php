<?php

require_once( 'session.inc.php' );

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once( 'mongoConnect.inc.php' );
require_once( '../classes/MongoHelper.php' );

if( isset( $_POST['login'] ) )
{
    if(
        isset( $_POST['username'] ) &&
        isset( $_POST['password'] )
    ) {
        $users = $client->webber->users;
        $user = $users->findOne( array( 'username'=> $_POST['username'] ) );
        
        if( $user !== null && password_verify( $_POST['password'], $user->password ) === true )
        {
            $_SESSION['login'] = array(
                'username'=> $user->username,
                'id'=> session_id()
            );
            
            $sessions = $client->webber->sessions;
            
            $sessions->insertOne( array(
                
                'id'=> session_id(),
                'userId'=> $user->_id,
                'createdAt'=> new MongoDB\BSON\UTCDateTime(),
                'lastVisit'=> new MongoDB\BSON\UTCDateTime()
                
            ) );
            
            // Can only create once, don't know how to edit or anything
            $sessions->createIndex( array( 'createdAt'=> 1 ), array( 'expireAfterSeconds'=> 60 * 60 * 24 ) );
            $sessions->createIndex( array( 'lastVisit'=> 1 ), array( 'expireAfterSeconds'=> 14400 ) );
        }
        
    }
}

header( 'Location: ' . $_SERVER['HTTP_REFERER'] );
exit();

?>