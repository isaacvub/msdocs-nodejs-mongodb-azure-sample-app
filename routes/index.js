var express = require('express');
var Task = require('../models/task');
var Note = require('../models/note');

var router = express.Router();

const axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  Task.find()
    .then((tasks) => {      
      const currentTasks = tasks.filter(task => !task.completed);
      const completedTasks = tasks.filter(task => task.completed === true);

      console.log(`Total tasks: ${tasks.length}   Current tasks: ${currentTasks.length}    Completed tasks:  ${completedTasks.length}`)
      res.render('index', { currentTasks: currentTasks, completedTasks: completedTasks });
    })
    .catch((err) => {
      console.log(err);
      res.send('Sorry! Something went wrong.');
    });
});


router.post('/addTask', function(req, res, next) {
  const taskName = req.body.taskName;
  const createDate = Date.now();
  
  var task = new Task({
    taskName: taskName,
    createDate: createDate
  });
  console.log(`Adding a new task ${taskName} - createDate ${createDate}`)

  task.save()
      .then(() => { 
        console.log(`Added new task ${taskName} - createDate ${createDate}`)        
        res.redirect('/'); })
      .catch((err) => {
          console.log(err);
          res.send('Sorry! Something went wrong.');
      });
});

router.post('/completeTask', function(req, res, next) {
  console.log("I am in the PUT method")
  const taskId = req.body._id;
  const completedDate = Date.now();

  Task.findByIdAndUpdate(taskId, { completed: true, completedDate: Date.now()})
    .then(() => { 
      console.log(`Completed task ${taskId}`)
      res.redirect('/'); }  )
    .catch((err) => {
      console.log(err);
      res.send('Sorry! Something went wrong.');
    });
});


router.post('/deleteTask', function(req, res, next) {
  const taskId = req.body._id;
  const completedDate = Date.now();
  Task.findByIdAndDelete(taskId)
    .then(() => { 
      console.log(`Deleted task $(taskId)`)      
      res.redirect('/'); }  )
    .catch((err) => {
      console.log(err);
      res.send('Sorry! Something went wrong.');
    });
});


module.exports = router;

axios.get('https://api.miro.com/v2/boards/uXjVM8y1wMw=/items', {  
  headers: {
    Authorization: `Bearer ${apiToken}`

  }
})
.then(response => {
  // Handle the API response
  //console.log(response.data);
  console.log(response.data.data[0].position);
  router.post('/addNotes', function(req, res, next) {
    const taskName = req.body.taskName;
    const createDate = Date.now();
    
    var note = new Note({
      notePosition: {
        positionX: response.data.data[0].position.x,
        positionY: response.data.data[0].position,y,
      },
      content: response.data.data[0].data.title,
      type: response.data.data[0].type
    });
    console.log(`Adding a new note`)
  
    note.save()
        .then(() => { 
          console.log(`Added new note`)        
          res.redirect('/'); })
        .catch((err) => {
            console.log(err);
            res.send('Sorry! Something went wrong.');
        });
  });

})
.catch(error => {
  // Handle the API error
  console.error(error);
});
