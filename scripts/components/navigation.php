<ul>
    <li><a href="home" target="_self"><i class="fas fa-home"></i> Home</a></li>
    <li><a href="planets" target="_blank"><i class="fas fa-globe"></i> Planets</a></li>
    <li><a href="docs" target="_self"><i class="fas fa-file-alt"></i> Documents</a></li>
    
    <?php if( $isLoggedIn === true ) { ?>
    
    <li><a href="login.php" target="_self"><i class="fas fa-user"></i> Account management</a></li>
    <li><a href="scripts/logout.refer.php" target="_self"><i class="fas fa-sign-out-alt"></i> Log out</a></li>
    <li>
        <i class="fas fa-user-cog"></i> CMS links
        
        <ul class="indent">
            <li><a href="cmsFantasyDocs.php" target="_blank">Doc CMS</a></li>
            <li><a href="cmsFantasySections.php" target="_blank">Section CMS</a></li>
            <li><a href="cmsFantasySnippets.php" target="_blank">Snippet CMS</a></li>
        </ul>
    </li>
    
    <?php } else { ?>
    
    <li><a href="login.php" target="_self"><i class="fas fa-user"></i> Log in</a></li>
    
    <?php } ?>
</ul>