<?php

require_once( 'scripts/session.inc.php' );

require_once( __DIR__ . '/privates/mongoConnect.inc.php' );
require_once( 'classes/MongoHelper.php' );
require_once( 'classes/FanDoc.php' );

MongoHelper::updateSessionTime( $client, session_id() );

?>

<!DOCTYPE html>

<html>
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		
		<title>Fantasy documents</title>
		
		<link rel="icon" type="image/png" href="/images/cake.ico">
		
		<link rel="stylesheet" type="text/css" href="css/fontawesome5-15-4/css/all.css">
		<link rel="stylesheet" type="text/css" href="css/variables.css">
		<link rel="stylesheet" type="text/css" href="css/css.css">
		<!-- <link rel="stylesheet" type="text/css" href="css/controlPanel.css"> -->
		
		<script type="module" src="js/cmsFantasy.js" defer></script>
	</head>

	<body>
		<main>
			<section class="block">
				<h1>Fantasy documents</h1>
				<?php require_once('scripts/components/navigation.php'); ?>
			</section>
			
			<section class="block">
				<h1>The list</h1>
				
				<ul class="browse fantasy-docs"></ul>
			</section>
			
			<section class="block fantasy-docs reader">
				<h1>Nothing here yet!</h1>
				
				<p>Select a document from the list above to view it.</p>
			</section>
		</main>
	</body>
</html>