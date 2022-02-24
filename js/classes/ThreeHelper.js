class ThreeHelper {
    
    static setPerspective( renderer, camera ) {
	
        camera.aspect = window.innerWidth / window.innerHeight;
        
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        
        camera.updateProjectionMatrix();
        
    }
    
}

export { ThreeHelper };