var express = require('express');
var Task = require('../models/task');
var Note = require('../models/note');

var router = express.Router();

const axios = require('axios');
const task = require('../models/task');
const apiToken = process.env.MIRO_API_TOKEN;
var miroResponse;




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

/*router.post('/completeTask', function(req, res, next) {
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
});*/


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

//axios.get('https://api.miro.com/v2/boards/uXjVM8y1wMw=/items', {  
  axios.get('https://api.miro.com/v2/boards/uXjVM8y1wMw%3D/items?parent_item_id=3458764557648715202&limit=50', {  
  headers: {
    Authorization: `Bearer ${apiToken}`

  }
})
.then(response => {
  // Handle the API response
  miroResponse = response;
})
.catch(error => {
  // Handle the API error
  console.error(error);
});

router.post('/completeTask', function(req, res, next) {
  console.log(`entré al post`);
  for(let step = 0; step < miroResponse.data.data.length; step++)
  {
    var note = new Note({
      positionX: miroResponse.data.data[step].position.x,
      positionY: miroResponse.data.data[step].position.y,
      content: miroResponse.data.data[step].data.content,
      color: miroResponse.data.data[step].style.fillColor,
      width: miroResponse.data.data[step].geometry.width,
      height: miroResponse.data.data[step].geometry.height,
      type: miroResponse.data.data[step].type
    });
    console.log(`Adding a new note`)

    note.save()
        .then(() => { 
          console.log(`Added new note`) 
          if(step == 1)       
            res.redirect('/'); })
        .catch((err) => {
            console.log(err);
            res.send('Sorry! Something went wrong.');
        });
  }      
});

router.get('/unityTestGet', function(req, res, next) {
  console.log(`entré a la función de unity`);
  Note.find()
  .then((notes) => {      
    console.log(`notes: ${notes}`);
    console.log(typeof(notes));
    res.send(notes);
  })
  .catch((err) => {
    console.log(err);
    res.send('Sorry! Something went wrong.');
  });
});

router.post('/unityTest', function(req, res, next) {
  console.log(`entré a la función de unity`);
  
});