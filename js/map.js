mapboxgl.accessToken = 'pk.eyJ1IjoibmFsMTIiLCJhIjoiY21reXBkYmxtMDltbDNyb2NmcjZpaDdvdiJ9.ZX7GLNtaTYyTjLOhx4ITqg';

proj4.defs('EPSG:2285', '+proj=lcc +lat_1=48.73333333333333 +lat_2=47.5 +lat_0=47 +lon_0=-120.8333333333333 +x_0=500000.00001016 +y_0=0 +ellps=GRS80 +to_meter=0.3048006096012192');


const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v11',
  center: [-122.335, 47.608],   
  zoom: 11,
  minZoom: 10,
  maxZoom: 15
});

map.addControl(new mapboxgl.NavigationControl(), 'top-right');

const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
  maxWidth: '260px'
});

const MHA_COLORS = {
  'M':  '#4fc3c3',   
  'M1': '#f5a623',  
  'M2': '#e74c3c',   
};

let mhaVisible = true;


map.on('load', function () {
  fetch('assets/MHA_zones_.geojson')
    .then(function (res) { return res.json(); })
    .then(function (geojson) {

      function reprojectCoords(coords) {
        if (typeof coords[0] === 'number') {
          return proj4('EPSG:2285', 'WGS84', coords);
        }
        return coords.map(reprojectCoords);
      }
      geojson.features.forEach(function(f) {
        if (f.geometry) {
          f.geometry.coordinates = reprojectCoords(f.geometry.coordinates);
        }
      });
      delete geojson.crs;

      map.addSource('mha-zones', {
        type: 'geojson',
        data: geojson,
        generateId: true   
      });


      map.addLayer({
        id: 'mha-fill',
        type: 'fill',
        source: 'mha-zones',
        paint: {
          'fill-color': [
            'match',
            ['get', 'MHA_VALUE'],
            'M',  MHA_COLORS['M'],
            'M1', MHA_COLORS['M1'],
            'M2', MHA_COLORS['M2'],
            '#333333'   
          ],
          'fill-opacity': 0.55
        }
      });

      map.addLayer({
        id: 'mha-outline',
        type: 'line',
        source: 'mha-zones',
        paint: {
          'line-color': [
            'match',
            ['get', 'MHA_VALUE'],
            'M',  MHA_COLORS['M'],
            'M1', MHA_COLORS['M1'],
            'M2', MHA_COLORS['M2'],
            '#555555'
          ],
          'line-width': 0.6,
          'line-opacity': 0.8
        }
      });

      map.addLayer({
        id: 'mha-hover',
        type: 'fill',
        source: 'mha-zones',
        paint: {
          'fill-color': '#ffffff',
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hovered'], false],
            0.12,  
            0       
          ]
        }
      });

      initMapInteractions();


      initCharts();

      
      initPanel();

    })
    .catch(function (err) {
      console.error('Failed to load MHA zones GeoJSON:', err);
    });
});


function initMapInteractions() {

  let hoveredId = null;

  map.on('mousemove', 'mha-fill', function (e) {
    if (!e.features.length) return;
    map.getCanvas().style.cursor = 'pointer';

    const feat = e.features[0];
    const props = feat.properties;

    if (hoveredId !== null) {
      map.setFeatureState(
        { source: 'mha-zones', id: hoveredId },
        { hovered: false }
      );
    }
    hoveredId = feat.id;
    map.setFeatureState(
      { source: 'mha-zones', id: hoveredId },
      { hovered: true }
    );

    const tier    = props.MHA_VALUE || 'N/A';
    const zone    = props.ZONING    || 'N/A';
    const cat     = props.CATEGORY_DESC || props.CLASS_DESC || 'N/A';
    const tierLabel = tier === 'M'  ? 'Standard (M)'
                    : tier === 'M1' ? 'Higher (M1)'
                    : tier === 'M2' ? 'Highest (M2)'
                    : 'No MHA';
    const tierColor = MHA_COLORS[tier] || '#888';

    popup
      .setLngLat(e.lngLat)
      .setHTML(
        '<div class="popup-title">' + zone + '</div>' +
        '<div class="popup-row"><span>Category</span><span>' + cat + '</span></div>' +
        '<div class="popup-row"><span>MHA Tier</span>' +
          '<span style="color:' + tierColor + '">' + tierLabel + '</span>' +
        '</div>'
      )
      .addTo(map);
  });

  map.on('mouseleave', 'mha-fill', function () {
    map.getCanvas().style.cursor = '';
    popup.remove();
    if (hoveredId !== null) {
      map.setFeatureState(
        { source: 'mha-zones', id: hoveredId },
        { hovered: false }
      );
      hoveredId = null;
    }
  });
}


function setMapLayer(layerName) {
  const visibility = layerName === 'mha' ? 'visible' : 'none';
  mhaVisible = (layerName === 'mha');

  if (map.getLayer('mha-fill')) {
    map.setLayoutProperty('mha-fill',    'visibility', visibility);
    map.setLayoutProperty('mha-outline', 'visibility', visibility);
    map.setLayoutProperty('mha-hover',   'visibility', visibility);
  }

  if (!mhaVisible) popup.remove();
}
