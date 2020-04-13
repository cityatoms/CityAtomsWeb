var $loading = $('#loading').hide() 

$(document)
    .ajaxStart( () => {
        $loading.show()
    })
    .ajaxStop( () => {
        $loading.hide()
    } )