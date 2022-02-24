<?php

require_once( __DIR__ . '/FantasyBREAD.php' );
require_once( __DIR__ . '/FanSection.php' );

class FanDoc extends FantasyBREAD {
    
    // Object properties
    public ?MongoDB\BSON\ObjectId $id;
    public ?string $name;
    public ?string $text;
    
    // sections are an array of Section objects
    public ?array $sections;
    
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
    // $newSection is an array of FanSection objects
    public function updateMe( string $newName, string $newText, array $newSections ):bool {
        
        $newSectionIds = array();
        
        foreach( $newSections as $section )
            $newSectionIds[] = $section->id;
        
        // Has to use $set to update the given fields
        $updateFilter = array( '_id'=> $this->id );
        $updateDocument = array(
            '$set'=> array(
                'name'=> $newName, 'text'=> $newText, 'sections'=> $newSectionIds
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
            $this->sections = $newSections;
            
            return true;
        }
        
        return false;
        
    }
    
    // Static & class methods
    // $sections is an array of ObjectIds
    // $sections is in fact an array of FanSection objects
    public function __construct( string $name, string $text, array $sections = array(), ?MongoDB\BSON\ObjectId $id = null ) {
        
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
            $sectionIds = array();
            
            foreach( $sections as $section )
                $sectionIds[] = $section->id;
            
            $document = array(
                'name'=> $name,
                'text'=> $text,
                'sections'=> $sectionIds,
                'createdAt'=> new MongoDB\BSON\UTCDateTime(),
                'editedAt'=> array()
            );
            
            $insertResult = self::insertOne( $document );
            $id = $insertResult->getInsertedId();
        }
        
        $this->name = $name;
        $this->text = $text;
        $this->id = $id;
        $this->sections = $sections;
        
    }
    
    static public function __init( MongoDB\Client $client, MongoDB\Database $database, MongoDB\Collection $collection ):void {
        
        self::$cl = $collection;
        self::$db = $database;
        self::$client = $client;
        
        self::$initialized = true;
        
    }
    
    static public function getExistingDocs( array $filter = array(), array $options = array() ):array {
        
        $found = array();
        
        $result = self::find( $filter, $options )->toArray();
        
        foreach( $result as $doc )
        {
            $sectionFilter = array(
                '_id'=> array(
                    '$in'=> $doc->sections
                )
            );
			
            $sections = FanSection::getExistingSections( $sectionFilter );
            
			// Hacky method of including the correct order
			$hackySections = array();
			
			foreach( $doc->sections as $idString )
			{
				foreach( $sections as $section )
				{
					$sectionId = $section->id;
					
					if( $sectionId == $idString )
						$hackySections[] = $section;
				}
			}
			
            $found[] = new FanDoc( $doc->name, $doc->text, $hackySections, $doc->_id );
        }
        
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