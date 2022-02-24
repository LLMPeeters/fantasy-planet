<?php

require_once( __DIR__ . '/../privates/mongoConnect.inc.php' );

abstract class JWTS {
	
	const code = "4g6AY-#85+xrHKsgx@6A=wT++x5KpV+v6XCVWZES4r_Q!gWbPmLXQrQB@j=ZgJq?BSnNgmjRSf^Cgf6kvEY?cvGq_XXTc%d#7^sjcHbv-^2zkPBQzmcMjnzNf35*dDpp4ZrfkjUYYcfV4V9eJa&!MmkVVTW^-y^?4hTx!3Tm8b3r3!qknmd+GTbt?TT=REHPL2*yGUhG!wjuq5as#aP3wt4aRJf-b5uKLTuEH8U%dPM=nDpSExJpA2hryH";
	
    static function insertToken( $payload ) {
        
        $this->tokens->insertOne( array(
            'ip'=> $payload['ip'],
            'username'=> $payload['username'],
            'createdAt'=> new MongoDB\BSON\UTCDateTime( $payload['createdAt'] ),
            'lastUpdate'=> new MongoDB\BSON\UTCDateTime()
        ) );
        
    }
    
    static function updateToken( string $ip, string $username, MongoDB\Collection $tokens ) {
        
        $filter = array(
            'ip'=> $ip,
            'username'=> 'username'
        );
        $update = array(
            'lastUpdate'=> new MongoDB\BSON\UTCDateTime()
        );
        
        $tokens->updateOne( $filter, $update );
        
    }
    
    static function checkJWT( string $token, string $hash = 'sha256' ) {
        
		$split = explode( '.', $token );
		$header = $split[0];
		$payload = $split[1];
		$userSignature = $split[2];
		
        $goodSignature = str_replace(
			['+', '/', '='],
			['-', '_', ''],
			base64_encode(
				hash_hmac( $hash, $header . '.' . $payload, self::code, true )
			)
		);
        
        if( $userSignature === $goodSignature )
            return true;
        else
            return false;
        
    }
	
	static function makeJWT( array $payload, string $alg = 'HS256', string $hash = 'sha256' ):string {
		
		$header = str_replace(
			['+', '/', '='],
			['-', '_', ''],
			base64_encode( json_encode( ['typ'=> 'JWT', 'alg'=> $alg] ) )
		);
		$payload = str_replace(
			['+', '/', '='],
			['-', '_', ''],
			base64_encode( json_encode( $payload ) )
		);
		$signature = str_replace(
			['+', '/', '='],
			['-', '_', ''],
			base64_encode(
				hash_hmac( $hash, $header . '.' . $payload, self::code, true )
			)
		);
		
		$userJWT = $header . '.' . $payload . '.' . $signature;
		
		return $userJWT;
		
	}
	
}

?>