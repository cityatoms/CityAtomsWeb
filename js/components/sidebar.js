$('#sidebar-toggle').click( function(e) {
    console.log('Clivk')
    if($('#sidebar')) {
        let sidebarState = $('#sidebar').attr('aria-hidden')
        $('#sidebar').attr('aria-hidden', sidebarState == 'true' ? false : true)
    }
} )