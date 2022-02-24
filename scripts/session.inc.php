<?php

session_start();

if( isset( $_SESSION['login'] ) )
    $isLoggedIn = true;
else
    $isLoggedIn = false;

?>