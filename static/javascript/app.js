var request = require('superagent')
var KalmanFilter = require('kalmanjs').default



console.log("test")

var token = localStorage.getItem("token")||""

function getvalues(){
      show_all()
    request
      .get('/api//measurements/humidity')
      .set('x-access-token', token)
      .end(function(err, res) {
        var results = res.body
        var dataset = results.values;
        //Create SVG element
        var kf = new KalmanFilter({R: 0.01, Q: 3});
        var dataConstantKalman = dataset.map(function(v) {
          var value =  kf.filter(v.value);
          return {value:value, created:v.created}
        });        
        generateplot(dataConstantKalman, "#chart")
      })
    request
      .get('/api//measurements/temperature')
      .set('x-access-token', token)
      .end(function(err, res) {
        var results = res.body
        var dataset = results.values;
        var kf = new KalmanFilter({R: 0.01, Q: 3});
        var dataConstantKalman = dataset.map(function(v) {
          var value =  kf.filter(v.value);
          return {value:value, created:v.created}
        });        
        generateplot(dataConstantKalman, "#chart2")
      })
      request
        .get('/api//measurements/soil')
        .set('x-access-token', token)
        .end(function(err, res) {
          var results = res.body
          var dataset = results.values;
          generateplot(dataset, "#chart3")
        })
      request
        .get('/api//measurements/tank')
        .set('x-access-token', token)
        .end(function(err, res) {
          var results = res.body
          var dataset = results.values;
          generateplot(dataset, "#chart4")
        })  
      request
        .get('/api//measurements/pump')
        .set('x-access-token', token)
        .end(function(err, res) {
          var results = res.body
          var dataset = results.values;
          generateplot(dataset, "#chart5")
        })                   
      // get list of ports  
      request
        .get('/api/ports')
        .set('x-access-token', token)
        .end(function(err, res) {
          var results = res.body
          console.log(results)
          var ports = results.ports;
          listports(ports, "#portslist")
        })

}

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
    if (err ) {
      console.log(err)
      logout()
    }

    token = res.body.token
    localStorage.setItem("token",token)
    getvalues()

  })

}

function createListRecord (text){
  var li = document.createElement("li")
  //li.className="mdl-menu__item"
  var span = document.createElement("span")
  span.className="mdl-list__item-primary-content"
  span.textContent = text
  li.appendChild(span)
  var icon = document.createElement("i")
  // <i class="material-icons mdl-list__item-icon">person</i>
  icon.className="material-icons mdl-list__item-icon"
  icon.textContent = "memory"
  li.appendChild(icon)  
  return li
}

function listports(ports, id){
  var target = document.querySelector(id)
  while(target.lastChild){
    target.removeChild(target.lastChild)
  } 
  ports.forEach((port)=>{
    console.log(port.comName)
  var child = createListRecord(port.comName)
  target.appendChild(child)
  child.onclick=(ev)=>{setPort(ev)}
})

}

function setPort(ev){
  target_port = ev.toElement.innerHTML
  console.log(target_port)
      request  
      .post("/api/ports/main")
      .set("x-access-token", token)
      .send({port:target_port})
        .end(function(err, res) {
          var results = res.body
        })
}

function logout(){
   localStorage.removeItem("token")
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
  var width = parseInt(d3.select(id).style('width'), 10);
  var h = 400;
  var padding = 40;
  var svg = d3.select(id)
    .append("svg")
    .attr("width", "100%")
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
    .range([padding, width - padding]);
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(4)
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
    })
}

// assign on click events to buttons

login_button = document.getElementById("login")
login_button.addEventListener('click', login ) 
login_button = document.getElementById("logout")
login_button.addEventListener('click', logout ) 
openValve_button = document.getElementById("openValve")
openValve_button.addEventListener('click', openValve ) 
// hide elements
if (!token) {
  logout()
} else {
  getvalues()
}