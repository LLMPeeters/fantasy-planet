<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once( 'session.inc.php' );

if( $isLoggedIn === false )
	require_once( 'redirectToIndex.inc.php' );

require_once( 'mongoConnect.inc.php' );
require_once( '../classes/MongoHelper.php' );

if( isset( $_POST['create'] ) )
{
    if(
        isset( $_POST['username'] ) &&
        isset( $_POST['password'] )
    ) {
        $users = $client->webber->users;
        $usernameExists = $users->findOne( array( 'username'=> $_POST['username'] ) ) !== null;
        
        echo $usernameExists === true ? 'exists' : "doesn't exist";
        
        if( $usernameExists === false )
        {
            $users->insertOne( array(
                'username'=> $_POST['username'],
                'password'=> password_hash( $_POST['password'], PASSWORD_BCRYPT )
            ) );
        }
        
    }
}

?>