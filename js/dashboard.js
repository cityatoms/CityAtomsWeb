import {renderMapComponent} from '../js/components/map-data.js'
import {renderWorldDataComponent} from '../js/components/world-data.js'

$('#data-type').change( (e) => {
	switch(e.target.value) {
		case 'ca-open-data':
			renderMapComponent()
			break
		case 'world-data':
			renderWorldDataComponent()
			break
		case 'safegraph-data':
			console.log('Safegraph data display')
			break	
	}

})