<?php

require_once( $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php' );

$client = new MongoDB\Client( 'mongodb://webber:qZBkmpKXS9KafVzNmVSdxwJ@llmpeeters.com:32323/?authSource=webber&readPreference=primary' );

?>