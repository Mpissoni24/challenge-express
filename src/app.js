var express = require("express");
var server = express();
/* var bodyParser = require("body-parser"); */

var model = {
  clients: {},
  reset: function () {
    model.clients = {};
  },
  addAppointment: function (prop, value) {
    if (model.clients.hasOwnProperty(prop)) {
      value.status = "pending";
      model.clients[prop].push(value);
    } else {
      value.status = "pending";
      model.clients[prop] = [value];
      
    }
  },

  attend: function (name, date) {
    const obj = model.clients[name];
    /* console.log(obj) */
    obj.map((data) => {
      /* console.log(data) */
      if (data.date.includes(date)) {
        data.status = "attended";
      }
    });
  },

  expire: function (name, date) {
    const obj = model.clients[name];
    /* console.log(obj) */
    obj.map((data) => {
      /* console.log(data) */
      if (data.date.includes(date)) {
        data.status = "expired";
      }
    });
  },

  cancel: function (name, date) {
    const obj = model.clients[name];
    /* console.log(obj) */
    obj.map((data) => {
      /* console.log(data) */
      if (data.date.includes(date)) {
        data.status = "cancelled";
      }
    });
  },

  erase: function (name, data) {
    const obj = model.clients[name];
    /* const { date, status } = obj; */
    /* console.log(date) */
    

    for (let i = 0; i < obj.length; i++) {
        if(obj[i].date.includes(data)){
            let objFilter = model.clients[name].filter(value => value.date === data)
            model.clients[name] = model.clients[name].filter(value => value.date !== data)
            return objFilter
        }

        if(obj[i].status.includes(data)){
            let objFilter = model.clients[name].filter(value => value.status === data)
            model.clients[name] = model.clients[name].filter(value => value.status !== data)
            return objFilter
        }
        
    }
  },

  getAppointments: function(name,status){
      
      if(!status){
          return model.clients[name]
      }else{
          return (model.clients[name].filter(data => data.status === status))
          
      }
  },

  getClients: function (){
    return Object.keys(model.clients)
  },
  
};

server.use(express.json());

server.get('/api', (req,res) => {
    res.send(model.clients)
})

server.post('/api/Appointments', (req,res) => {
    if(!req.body.client){
        res.status(400).send('the body must have a client property')
    }

    if(typeof req.body.client !== 'string'){
        res.status(400).send('client must be a string')
    }
    const client = req.body.client
    const data = req.body.appointment

    model.addAppointment(client,data)
    

    const obj = model.clients[client].map (date => {
        
        if(date.date === data.date){
            return date
        }
    }) 

    console.log(obj[0])
    res.send(obj[0])
    


})

server.get('/api/Appointments/clients', (req,res) =>{
    res.send(model.getClients())
})

server.get('/api/Appointments/:name', (req,res) => {
    console.log(req.query)
    console.log(req.params)
    const clients = model.getClients()
    /* console.log(clients) */
    let appointments = model.getAppointments(req.params.name)
    console.log(appointments)
    let i = 0
    
    

    if(!(clients.includes(req.params.name))){
        res.status(400).send('the client does not exist')
    }

    appointments.map (appointment => {
        if(appointment.date === req.query.date){
            i++
        }
    })

    if(i === 0){
        res.status(400).send('the client does not have a appointment for that date')
    }

    if(req.query.option !== 'attend' && req.query.option !== 'expire' && req.query.option !== 'cancel' ){
        console.log("Entro")
        res.status(400).send('the option must be attend, expire or cancel')
    }
    if(i === 1){
        model[req.query.option](req.params.name,req.query.date)

        const obj = model.clients[req.params.name].map (date => {
        
            if(date.date === req.query.date){
                return date
            }
        }) 

        res.send(obj[0])
    }
         

})

server.get('/api/Appointments/:name/erase', (req, res) => {
    const clients = model.getClients()

    if(!(clients.includes(req.params.name))){
        res.status(400).send('the client does not exist')
    }

    const obj = model.erase(req.params.name, req.query.date)


    res.send(obj)

})

server.get('/api/Appointments/getAppointments/:name', (req,res) =>{
    res.send(model.getAppointments(req.params.name, req.query.status))
})





server.listen(3001);
module.exports = { model, server };
