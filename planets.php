<?php

require_once( 'scripts/session.inc.php' );

?>

<!DOCTYPE html>

<html>
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
    
	<title>Icosahedron Test</title>
	
    <link rel="icon" type="image/png" href="/images/cake.ico">
	
	<link rel="stylesheet" type="text/css" href="css/fontawesome5-15-4/css/all.css">
	<link rel="stylesheet" type="text/css" href="css/variables.css">
	<link rel="stylesheet" type="text/css" href="css/planet.css">
	
	<script type="module" src="js/makePlanet.js"></script>
</head>
<body>
	<section id="interface-bg-top" class="interface interface-border-all"></section>
	
	<section id="interface-name" class="interface">
		<p>Name !!</p>
	</section>
	
	<section id="interface-info" class="interface interface-button interface-border-tablet">
		<p>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512">
				<path d="M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z"></path>
			</svg>
		</p>
	</section>
	
	<section id="interface-list" class="interface interface-button interface-border-tablet">
		<p>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
				<path d="M80 368H16a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16zm0-320H16A16 16 0 0 0 0 64v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16zm0 160H16a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16zm416 176H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z"></path>
			</svg>
		</p>
	</section>
	
	<section id="interface-left" class="interface interface-button interface-border-all">
		<p>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
				<path d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"></path>
			</svg>
		</p>
	</section>
	
	<section id="interface-pause" class="interface interface-button interface-border-all">
		<p>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
				<path d="M384 64H192C86 64 0 150 0 256s86 192 192 192h192c106 0 192-86 192-192S490 64 384 64zm0 320c-70.8 0-128-57.3-128-128 0-70.8 57.3-128 128-128 70.8 0 128 57.3 128 128 0 70.8-57.3 128-128 128z"></path>
			</svg>
		</p>
	</section>
	
	<section id="interface-right" class="interface interface-button interface-border-all">
		<p>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
				<path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path>
			</svg>
		</p>
	</section>
</body>
</html>