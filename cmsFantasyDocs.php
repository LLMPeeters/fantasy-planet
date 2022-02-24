<?php

require_once( 'scripts/session.inc.php' );

if( $isLoggedIn === false )
	require_once( 'scripts/redirectToIndex.inc.php' );

require_once( __DIR__ . '/privates/mongoConnect.inc.php' );
require_once( 'classes/MongoHelper.php' );

MongoHelper::updateSessionTime( $client, session_id() );

?>

<!DOCTYPE html>

<html>
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		
		<title>Fantasy Docs CMS</title>
		
		<link rel="icon" type="image/png" href="/images/cake.ico">
		
		<link rel="stylesheet" type="text/css" href="css/fontawesome5-15-4/css/all.css">
		<link rel="stylesheet" type="text/css" href="css/variables.css">
		<link rel="stylesheet" type="text/css" href="css/css.css">
		<link rel="stylesheet" type="text/css" href="css/controlPanel.css">
		
		<script type="module" src="js/cmsFantasy.js" defer></script>
	</head>

	<body session="<?=session_id()?>" username="<?=$_SESSION['login']['username']?>">
		<main>
			<section class="page-flip">
				<section class="page toggle">
					<h1>Add doc</h1>
					
					<form class="add-form fantasy-docs" method="post" action="#" autocomplete="off">
						<input type="text" name="name" placeholder="Name">
						<textarea class="ck-edit" name="text"></textarea>
						
						<ul class="browse browse-short fantasy-sections"></ul>
						
						<input type="submit" name="ck" value="Add">
					</form>
				</section>
				
				<section class="page">
					<h1>Update or delete doc</h1>
					
					<form class="update-form fantasy-docs" method="post" action="#" autocomplete="off">
						<input type="text" name="name" placeholder="Name">
						<textarea class="ck-edit" name="text"></textarea>
						
						<ul class="browse browse-short fantasy-sections"></ul>
						
						<input type="submit" name="update" value="Update">
						<input type="submit" name="delete" value="Delete">
					</form>
				</section>
				
				<button class="right">Next</button>
			</section>
			
			<section class="tiles">
				<section class="block">
					<ul class="browse fantasy-docs">
						<li>🔷 All docs</li>
					</ul>
				</section>
				
				<section class="block">
					<ul class="browse fantasy-sections">
						<li>🔷 All sections</li>
					</ul>
				</section>
			</section>
		</main>
	</body>
</html>