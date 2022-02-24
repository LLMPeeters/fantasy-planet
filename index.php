<?php

require_once( 'scripts/session.inc.php' );

$someURL = $_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

?>

<!DOCTYPE html>

<html>
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		
		<title>Fantasy</title>
		
		<link rel="icon" type="image/png" href="/images/cake.ico">
		
		<link rel="stylesheet" type="text/css" href="css/fontawesome5-15-4/css/all.css">
		<link rel="stylesheet" type="text/css" href="css/variables.css">
		<link rel="stylesheet" type="text/css" href="css/css.css">
	</head>

	<body>
        <main>
            <section class="block">
                <h1>Fantasy index</h1>
                
                <?php require_once('scripts/components/navigation.php'); ?>
            </section>
        </main>
	</body>
</html>