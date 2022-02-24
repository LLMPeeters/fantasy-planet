<?php

require_once( __DIR__ . '/FantasyBREAD.php' );

class FanSection extends FantasyBREAD {
    
    // Object properties
    public ?MongoDB\BSON\ObjectId $id;
    public ?string $name;
    public ?string $text;
    
    // Static properties & constants
    static private $cl;
    static private $db;
    static private $client;
    static public $initialized = false;
    
    // Object methods
    public function deleteMe():bool {
        
        $deleteFilter = array( '_id'=> $this->id );
        $result = self::deleteOne( $deleteFilter );
        $deletedCount = $result->getDeletedCount();
        
        if( $deletedCount === 1 )
        {
            foreach( $this as $key=> $property )
                $this->{ $key } = null;
            
            return true;
        }
        
        return false;
        
    }
    
    // Returns true as long as getMatchedCount is 1, even if getModifiedCount is 0
    public function updateMe( string $newName, string $newText ) {
        
        // Has to use $set to update the given fields
        $updateFilter = array( '_id'=> $this->id );
        $updateDocument = array(
            '$set'=> array(
                'name'=> $newName, 'text'=> $newText
            ),
            '$push'=> array(
                'editedAt'=> array( 'date'=> new MongoDB\BSON\UTCDateTime(), 'by'=> $_SERVER['REMOTE_ADDR'] )
            )
        );
        $result = self::updateOne( $updateDocument, $updateFilter );
        $updatedCount = $result->getModifiedCount();
        $selectedCount = $result->getMatchedCount();
        
        if( $selectedCount === 1 )
        {
            $this->name = $newName;
            $this->text = $newText;
            
            return true;
        }
        
        return false;
        
    }
    
    // Static & class methods
    public function __construct( string $name, string $text, ?MongoDB\BSON\ObjectId $id = null ) {
        
        try
        {
            if( self::$initialized !== true )
                throw new Exception( 'This class has not been initialized.' );
        }
        catch( Exception $e )
        {
            echo $e->getMessage() . ' On line: ' . $e->getLine() . '. In file: ' . basename( $e->getFile() );
            
            exit();
        }
        
        parent::__construct(  );
        
        if( $id === null )
        {
            $document = array(
                'name'=> $name,
                'text'=> $text,
                'createdAt'=> new MongoDB\BSON\UTCDateTime(),
                'editedAt'=> array()
            );
            
            $insertResult = self::insertOne( $document );
            $id = $insertResult->getInsertedId();
        }
        
        $this->name = $name;
        $this->text = $text;
        $this->id = $id;
        
    }
    
    static public function __init( MongoDB\Client $client, MongoDB\Database $database, MongoDB\Collection $collection ):void {
        
        self::$cl = $collection;
        self::$db = $database;
        self::$client = $client;
        
        self::$initialized = true;
        
    }
    
    static public function getExistingSections( array $filter = array(), array $options = array() ):array {
        
        $found = array();
        
        $result = self::find( $filter, $options )->toArray();
        
        foreach( $result as $section )
            $found[] = new FanSection( $section->name, $section->text, $section->_id );
        
        return $found;
        
    }
    
    static function find( array $filter = array(), array $options = array() ):MongoDB\Driver\Cursor {
        
        $result = self::$cl->find( $filter, $options );
        
        return $result;
        
    }
    
    static function updateOne( array $newData, array $filter = array(), array $options = array() ):MongoDB\UpdateResult {
        
        $result = self::$cl->updateOne( $filter, $newData, $options );
        
        return $result;
        
    }
    
    static function deleteOne( array $filter, array $options = array() ):MongoDB\DeleteResult {
        
        $result = self::$cl->deleteOne( $filter, $options );
        
        return $result;
        
    }
    
    static function insertOne( array $document, array $options = array() ):MongoDB\InsertOneResult {
        
        $result = self::$cl->insertOne( $document, $options );
        
        return $result;
        
    }
    
}

?>