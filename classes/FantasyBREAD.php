<?php

require_once( __DIR__ . '/BaseBREAD.php' );

abstract class FantasyBREAD extends BaseBREAD {
    
    public function __construct(  ) {
        
        parent::__construct(  );
        
    }
    
    abstract static function find( array $filter = array(), array $options = array() ):MongoDB\Driver\Cursor;
    abstract static function updateOne( array $newData, array $filter = array(), array $options = array() ):MongoDB\UpdateResult;
    abstract static function deleteOne( array $filter, array $options = array() ):MongoDB\DeleteResult;
    abstract static function insertOne( array $document, array $options = array() ):MongoDB\InsertOneResult;
    
}

?>