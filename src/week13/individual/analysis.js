function analyze(){

  //
  // Getting To Know the Data
  //

  heading('Examples')

  ask('how many measurements were included in this dataset?', example1)

  ask('how many samples does each measurement contain?', example2)

  ask('at the 10-th measurement, what are valid sample values (> 0)?', example3)
  // a sample value is valid if it is greater than zero

  heading('Measurements and Samples')

  ask('how many unique non-zero, non-negative sample values in this dataset? what are they?', func1)

  ask('what is the average time (seconds) between two measurements?', func2)

  ask('at 09:57:18, how many samples in this measurement have the value 7?', func3)

  ask('which measurement has the most number of samples with the value 3?', func4)

  ask('how many measurements have no sample value greater than zero?', func5)

  ask('which valid (i.e., greater than zero) sample value is the most common?', func6)

  heading('Mapping')

  ask('when was the boat furthest away from NYC (40.7127 N, 74.0059 W)? what was the distance?', func7)
  // use Leaflet to draw a line between NYC and this "furtherest away" location

  ask('what was the path of the boat?', func8)
  // use Leaflet to draw a line between every two locations

  ask('where were the most common sample value measured?', func9)
  // say, your answer to Question Six is 13, draw a marker for each measurement that has
  // at least one sample whose value is 13

  ask('how does the desensity of valid sample values change across the geographical area?', func10)
  // use the brightness to indicate high number of valid sample values each
  // for each measurement, draw a marker,
  // use the brightness to represent the number of valid samples
  // the brighter a spot, the higher the number
  // for those measurements without a valid sample, draw nothing

  heading('Science')

  ask('what is the distribution of fish?', func11)

  ask('what is the distribution of  are schools of zooplankton?', func12)


  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  })
  toggleSourecode()
}

function example1(){
  return items.length
}

function example2(){
  return items[0].Samples.length
}

function example3(){
  return _.filter(items[9].Samples, function(d){
    return d > 0
  }).join(', ')
}

function func1(){
  var uniqueSamples = []
  var samples = _.map(items, function(d) {
    return _.map(d['Samples'], function(f) {
      if (f > 0) { uniqueSamples[uniqueSamples.length] = f }
    })
  })

  var numberUniqueSamples = 'There are ' + _.uniq(uniqueSamples).length +' and they are ' + _.uniq(uniqueSamples).join(', ')

  return numberUniqueSamples

}


function func2(){
  return '...'
}

function func3(){
  var time = _.filter(items, function(d) {
    return d['Ping_time'] == "09:57:18"
  })
  var sample7 = _.filter(time[0].Samples, function(d) {
    return d == "7.000000"
  })
  return sample7.length
}

function func4(){
  var countArr = []
  var sampleItems = _.map(items, function(d) {
    count = 0
    var sample3 = _.map(d['Samples'], function(f) {
      if (f == "3.000000") { count++ }
    })
    countArr[countArr.length] = count
  })
  var max = _.max(countArr)
  var index = _.findIndex(countArr, function(d) {
    return d == max
  })
  var string = 'Measurement #314 at Ping_time: ' + items[index].Ping_time + ' has ' + max + ' samples with the value 3.000000'

  return string
}

function func5(){
  return _.filter(items, function(d){
    return _.max(d['Samples']) <= 0
  }).length
}


function func6(){
  return '...'
}

function func7(){

  // this sample code shows how to display a map and put a marker to visualize
  // the location of the first item (i.e., measurement data)
  // you need to adapt this code to answer the question
  var nyc = ['40.7127', '-74.0059']
  var coordnyc = {'latitude': nyc[0], 'longitude': nyc[1]}
  var distances = []
  _.forEach(items, function(d){
    var coord = {'latitude': d.Latitude, 'longitude': d.Longitude}
    var dist = geolib.getDistance(coordnyc, coord)
    distances.push(dist)
  })
  var max = _.max(distances)
  var first = items[0]
  var pos = [first.Latitude, first.Longitude]
  var el = $(this).find('.viz')[0]    // lookup the element that will hold the map
  $(el).height(500) // set the map to the desired height
  var map = createMap(el, pos, 5)
  var time = ''
  _.forEach(items, function(d){
    var coord1 = {'latitude': d.Latitude, 'longitude': d.Longitude}
    if(geolib.getDistance(coordnyc, coord1) == max){
      time = d.Ping_time
      var coord2 = [d.Latitude, d.Longitude]
      var circle = L.circle(coord2, 500, {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.5
      }).addTo(map)
    }
  })
  return time + " with a distance of " + max
}

function func8(){
  var first = items[200]
  var pos = [first.Latitude, first.Longitude]
  var el = $(this).find('.viz')[0]    // lookup the element that will hold the map
  $(el).height(500) // set the map to the desired height
  var map = createMap(el, pos, 9)
  var pairs= _.pairs(items)
  for(var i =0; i < items.length-1; i++){
    var coord1 = [pairs[i][1].Latitude, pairs[i][1].Longitude]
    var circle = L.circle(coord1, 2, {
        color: 'green',
        fillColor: '#f03',
        fillOpacity: 0.5
    }).addTo(map);
  }
}

function func9(){

    var location = items[0]
    var pos = [location.Latitude, location.Longitude]
    var el = $(this).find('.viz')[0]    // lookup the element that will hold the map
    $(el).height(500) // set the map to the desired height
    var map = createMap(el, pos, 7)
    arr = []
    var samples = _.map(items, function(d) {
      var filterData = _.map(d['Samples'], function(f) {
        if (f > 0) { arr[arr.length] = f }
      })
    })
    var groups = _.groupBy(arr)
    var samplevalue = _.mapValues(groups, function(d) {
      return d.length
    })
    var pairs = _.pairs(samplevalue)
    var sortedData = _.sortBy(pairs, function(d) {
      return -d[1]
    })
    var most = sortedData[0][0]

    // Process to detect which locations had samples with the most common sample value and map
    var plotPoints = _.map(items, function(d) {
      var filterData = _.map(d['Samples'], function(f) {
        if (parseFloat(f) == most) {
          var latlng = [parseFloat(d.Latitude), parseFloat(d.Longitude)]
          L.circle(latlng, 50, {color: 'green'
          , fillColor: '#f03'
          ,  fillOpacity: 0.5
          }).addTo(map)
        }
      })
    })

    return 'Most common sample value measured below'
  }

function func10(){
  var location = items[0]
  var pos = [location.Latitude, location.Longitude]
  var el = $(this).find('.viz')[0]    // lookup the element that will hold the map
  $(el).height(500) // set the map to the desired height
  var map = createMap(el, pos, 7)

  maxCount = 0
  var valid = _.map(items, function(d) {
    var valid2 = _.filter(d.Samples, function(f) {
      return f > 0
    }).length
    if (valid2 > maxCount) { maxCount = valid2 }
    return [ d.Latitude, d.Longitude, valid2 ]
  })
  var plotDensity = _.map(valid, function(d) {
    var latlng = [parseFloat(d[0]), parseFloat(d[1])]
    var opacity = d[2]/maxCount
    L.circle(latlng, 50, {color: 'green'
      ,fillColor: '#f03'
      ,fillOpacity: opacity
    }).addTo(map)
  })

  return ;
}

function func11(){
  var first = items[0]
  var pos = [first.Latitude, first.Longitude]

  var el = $(this).find('.viz')[0]    // lookup the element that will hold the map
  $(el).height(500) // set the map to the desired height
  var map = createMap(el, pos, 10)

  _.forEach(items, function(d) {
    if (_.includes(d.Samples, '1.000000')
      || _.includes(d.Samples, '3.000000')
      || _.includes(d.Samples, '4.000000')
      || _.includes(d.Samples, '8.000000')
      || _.includes(d.Samples, '10.000000')
      || _.includes(d.Samples, '30.000000')
      || _.includes(d.Samples, '32.000000')
      || _.includes(d.Samples, '33.000000')
      || _.includes(d.Samples, '37.000000')
      || _.includes(d.Samples, '45.000000')
      || _.includes(d.Samples, '53.000000')) {

      var coord = [d.Latitude, d.Longitude]
      var circle = L.circle(coord, 2, {
          color: 'green',
          fillColor: '#f03',
          fillOpacity: 0.5
        }).addTo(map);
    }
  })
}

function func12(){
  var first = items[0]
  var pos = [first.Latitude, first.Longitude]

  var el = $(this).find('.viz')[0]    // lookup the element that will hold the map
  $(el).height(500) // set the map to the desired height
  var map = createMap(el, pos, 10)

  _.forEach(items, function(d) {
    if (_.includes(d.Samples, '7.000000')
      || _.includes(d.Samples, '8.000000')
      || _.includes(d.Samples, '10.000000')
      || _.includes(d.Samples, '13.000000')
      || _.includes(d.Samples, '20.000000')
      || _.includes(d.Samples, '36.000000')
      || _.includes(d.Samples, '37.000000')
      || _.includes(d.Samples, '40.000000')
      || _.includes(d.Samples, '42.000000')
      || _.includes(d.Samples, '45.000000')
      || _.includes(d.Samples, '49.000000')
      || _.includes(d.Samples, '53.000000')) {

      var coord = [d.Latitude, d.Longitude]
      var circle = L.circle(coord, 2, {
          color: 'green',
          fillColor: '#f03',
          fillOpacity: 0.5
        }).addTo(map);
    }
  })
}
