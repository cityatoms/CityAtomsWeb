const mapComponent = `
    <div class="map-container">
      <div style="width: 100%"><iframe width="100%" height="500" src="https://maps.google.com/maps?width=100%&amp;height=500&amp;hl=en&amp;q=1%20Grafton%20Street%2C%20Dublin%2C%20Ireland+(My%20Business%20Name)&amp;ie=UTF8&amp;t=&amp;z=14&amp;iwloc=B&amp;output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"><a href="https://www.maps.ie/draw-radius-circle-map/">Create radius map</a></iframe></div><br />
    </div>
`

const getMapData = async () => {
    
}

export const renderMapComponent = () => {
    $('#data-section').html('')
    $('#data-section').append(mapComponent)

}