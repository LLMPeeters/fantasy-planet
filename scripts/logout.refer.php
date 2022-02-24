<?php

require_once( 'session.inc.php' );

if( $isLoggedIn === false )
	require_once( 'scripts/redirectToIndex.inc.php' );

if( isset( $_SESSION['login'] ) )
{
    unset( $_SESSION['login'] );
    session_regenerate_id();
    
    header( 'Location: ../index.php?message=You are logged out.' );
    
    exit();
}

header( 'Location: ../index.php?error=logout' );

exit();

?>