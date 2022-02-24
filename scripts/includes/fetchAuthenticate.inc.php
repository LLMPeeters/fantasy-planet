<?php

if( $dataObject['type'] !== 'find' )
{
    $verify = false;
    
    if(
        isset( $dataObject['auth'] ) &&
        isset( $dataObject['auth']['sessionId'] ) &&
        isset( $dataObject['auth']['username'] )
    ) {
        $sessions = $client->webber->sessions;
        $users = $client->webber->users;
        
        $session = $sessions->findOne( array(
            'id'=> $dataObject['auth']['sessionId']
        ) );
        
        $user = $users->findOne( array(
            '_id'=> $session->userId
        ) );
        
        $verify = $user->username === $dataObject['auth']['username'];
    }
    
    if( $verify === false )
        exit();
}

?>