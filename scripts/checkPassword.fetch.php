<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once( __DIR__ . '/../privates/mongoConnect.inc.php' );
require_once( '../classes/Snippet.php' );

$dataString = file_get_contents( 'php://input' );
$dataObject = json_decode( $dataString );

$users = $client->webber->users;

if(
    isset( $dataObject->password ) &&
    isset( $dataObject->username )
) {
    $user = $users->findOne( array( 'username'=> $dataObject->username ) );
    
    if( $userExists !== null )
    {
        var_dump( $user );
    }
}
else
    echo 'error';

?>