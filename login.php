<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once( 'scripts/session.inc.php' );

require_once( $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php' );
require_once( __DIR__ . '/privates/mongoConnect.inc.php' );
require_once( 'classes/MongoHelper.php' );

require_once( 'classes/Login.php' );

$thing = Login::code;

?>

<!DOCTYPE html>

<html>
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		
		<title>F&mdash;Log in</title>
		
		<link rel="icon" type="image/png" href="/images/cake.ico">
		
		<link rel="stylesheet" type="text/css" href="css/fontawesome5-15-4/css/all.css">
		<link rel="stylesheet" type="text/css" href="css/variables.css">
		<link rel="stylesheet" type="text/css" href="css/css.css">
	</head>
    
	<body>
        <main>
            <section class="block">
                <h1>Login page</h1>
                
                <?php require_once('scripts/components/navigation.php'); ?>
            </section>
			
            <?php if( $isLoggedIn === true ) { ?>
            
            <section style="word-break: break-word">
                <pre><?php var_dump($thing); ?></pre>
			</section>
            
            <?php } ?>
            
            <section class="tiles">
                <?php if( $isLoggedIn === false ) { ?>
                
                <section class="block">
                    <h1>Log in</h1>
                    
                    <form action="scripts/login.refer.php" method="POST">
                        <input type="text" name="username" placeholder="Username" autofocus>
                        <input type="password" name="password" placeholder="Password">
                        
                        <input type="submit" name="login" value="Log in">
                    </form>
                </section>
                
                <?php } elseif( $isLoggedIn === true ) { ?>
                
                <section class="block">
                    <h1>Create account</h1>
                    
                    <form action="scripts/createAccount.refer.php" method="POST" autocomplete="off">
                        <input type="text" name="username" placeholder="Username">
                        <input type="password" name="password" placeholder="Password">
                        
                        <input type="submit" name="create" value="Create account">
                    </form>
                </section>
                
                <?php } ?>
            </section>
        </main>
	</body>
</html>