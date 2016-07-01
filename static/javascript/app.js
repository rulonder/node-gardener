var request = require('superagent')

console.log("test")

var token = ""

function login() {
  // get login parameters
  var user_name = document.getElementById("user").value
  var password = document.getElementById("password").value
request
  .post('/users/login')
  .send({
    username: user_name,
    password: password
  })
  .end(function(err, res) {
    if (err ) console.log(err)
    show_all()
    token = res.body.token
    request
      .get('/api//measurements/humidity')
      .set('x-access-token', token)
      .end(function(err, res) {
        var results = res.body
        console.log(results)
        var dataset = results.values;
        //Create SVG element
        generateplot(dataset, "#chart")
      })
    request
      .get('/api//measurements/temperature')
      .set('x-access-token', token)
      .end(function(err, res) {
        var results = res.body
        console.log(results)
        var dataset = results.values;
        generateplot(dataset, "#chart2")
      })
      request
        .get('/api//measurements/soil_humidity')
        .set('x-access-token', token)
        .end(function(err, res) {
          var results = res.body
          console.log(results)
          var dataset = results.values;
          generateplot(dataset, "#chart3")
        })
  })

}

function logout(){
    to_be_hidden_nodes = document.querySelectorAll('.logged_in')
    to_be_hidden_nodes.forEach(function(element) {
      if (!element.classList.contains("hide")) {
        element.classList.add('hide')
      }
    })
    to_be_shown_nodes = document.querySelectorAll('.logged_out')
    to_be_shown_nodes.forEach(function(element) {
      if (element.classList.contains("hide")) {
        element.classList.remove('hide')
      }
    })    
}

function show_all(){
    to_be_shown_nodes = document.querySelectorAll('.logged_in')
    to_be_shown_nodes.forEach(function(element) {
      if (element.classList.contains("hide")) {
        element.classList.remove('hide')
      }
    })
    to_be_hidden_nodes = document.querySelectorAll('.logged_out')
    to_be_hidden_nodes.forEach(function(element) {
      if (!element.classList.contains("hide")) {
        element.classList.add('hide')
      }
    })    
}


function generateplot(data, id) {
  //Create SVG element
  var w = 600;
  var h = 400;
  var padding = 40;
  var svg = d3.select(id)
    .append("svg")
    .attr("width", w)
    .attr("height", h);
  var yScale = d3.scale.linear()
    .domain([d3.min(data, function(d) {
      return d.value
    }), d3.max(data, function(d) {
      return d.value
    })])
    .range([h - padding, padding]);
  var xScale = d3.time.scale()
    .domain([d3.min(data, function(d) {
      return new Date(d.created)
    }), d3.max(data, function(d) {
      return new Date(d.created)
    })])
    .range([padding, w - padding]);
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(2)
    .tickFormat(d3.time.format('%Y/%m/%d %H'));
  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(5);
  var lineFunction = d3.svg.line()
    .x(function(d) {
      return xScale(new Date(d.created));
    })
    .y(function(d) {
      return yScale(d.value);
    })

  svg.append("path")
    .datum(data)
    .attr("class", "linePath")
    .attr("d", lineFunction);
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis);
  //Create Y axis
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);
}

function openValve() {
  request
    .get('/api/valve/open')
    .set('x-access-token', token)
    .end(function(err, res) {
      var results = res.body
      console.log(results)
    })
}

function closeValve() {
  request
    .get('/api/valve/close')
    .set('x-access-token', token)
    .end(function(err, res) {
      var results = res.body
      console.log(results)
    })
}

// assign on click events to buttons

login_button = document.getElementById("login")
login_button.addEventListener('click', login ) 
openValve_button = document.getElementById("openValve")
openValve_button.addEventListener('click', openValve ) 
closeValve_button = document.getElementById("closeValve")
closeValve_button.addEventListener('click', closeValve ) 
// hide elements
logout()