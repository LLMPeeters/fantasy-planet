<?php

require_once( __DIR__ . '/../../classes/Login.php' );
require_once( __DIR__ . '/../includes/mongoConnect.inc.php' );

// $dataString = file_get_contents( 'php://input' );
// $dataObject = json_decode( $dataString, true );

// $dataObject['type']
// $dataObject['username']

if( true )
{
    $dataObject = array(
        'type'=> 'login',
        'username'=> 'Lulu',
        'password'=> 'testiny'
    );
}

if( isset( $dataObject['type'] ) )
{
    $users = $client->webber->users;
    $tokens = $client->webber->tokens;
    $payload = array(
        
        'ip'=> $_SERVER['REMOTE_ADDR'],
        'username'=> $dataObject['username'],
        'createdAt'=> floor(microtime(true) * 1000)
        
    );
    
    $login = new Login( $payload, $dataObject['password'], $users, $tokens );
    
    
    
    echo '<pre>';
    var_dump( $login->token );
    echo '</pre>';
    
}

?>