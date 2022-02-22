<?php

require_once( __DIR__ . '/../scripts/includes/mongoConnect.inc.php' );
require_once( __DIR__ . '/JWTs.php' );

class Login extends JWTS {
	
	private string $username;
	private string $unhashedPassword;
	private MongoDB\Collection $users;
	
	public function __construct(
		array $payload,
		string $password,
		MongoDB\Collection $usersCollection,
		MongoDB\Collection $tokensCollection,
		string $alg = 'HS256',
		string $hash = 'sha256'
	) {
		
		parent::__construct( $tokensCollection, $alg, $hash );
		
		$this->users = $usersCollection;
		$this->username = $payload['username'];
		$this->unhashedPassword = $password;
		
		$this->token = $this->makeJWT( $payload );
		
		if( $this->verifyPassword() === true )
		{
			$mongoPayload = array(
				'ip'=> $payload['ip'],
				'username'=> $this->username,
				'createdAt'=> new MongoDB\BSON\UTCDateTime( $payload['createdAt'] )
			);
			
			$this->token = self::makeJWT( $payload, $alg, $hash );
			$this->mongoPayload = $mongoPayload;
		}
		
	}
	
	private function verifyPassword() {
		
		$user = $this->users->findOne( array(
			'username'=> $this->username
		) );
		
		return password_verify( $this->unhashedPassword, $user->password );;
		
	}
	
	function verifyUserJWT(
		string $userJWT,
		MongoDB\Collection $collection,
		string $alg = 'HS256',
		string $hash = 'sha256'
	) {
		
		$split = explode( '.', $userJWT );
		$header = $split[0];
		$payload = $split[1];
		$signature = $split[2];
		
		$signatureCheck = base64_encode( hash_hmac( $hash, $header . $payload, self::code, true ) ) === $signature;
		
		if( $signatureCheck === true )
		{
			
		}
		
	}
		
}

?>