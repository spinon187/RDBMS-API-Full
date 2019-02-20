const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const server = express();

server.use(express.json());
server.use(helmet());
const knexConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: './data/lambda.sqlite3'
  },
}

const db = knex(knexConfig);

const errors = {
  '19': 'Another record with that value exists',
};

server.get('/api/cohorts', async (req, res) => {
  try {
    const cohorts = await db('cohorts');
    res.status(200).json(cohorts);
  }
  catch(error) {
    res.status(500).json(error);
  }
})

server.post('/api/cohorts', async (req, res) => {
  try {
    const id = await db('cohorts').insert(req.body);

    const cohort = await db('cohorts')
      .where({id})
      .first();
    res.status(201).json(cohort);
  }
  catch(error){
    const message = errors[error.errorno] || 'Error';
    res.status(500).json({message, error});
  }
})

server.get('/api/cohorts/:name', async (req, res) => {
  const name = req.params.name

  try {
    const cohort = await db('cohorts')
      .where({name})
      .first();
    res.status(200).json(cohort);
  }
  catch {
    res.status(500).json(error);
  }
})

server.put('/api/cohorts/:name', async (req, res) => {
  const name = req.params.name;

  try {
    const count = await db('cohorts')
      .where({name})
      .update(req.body);
    if (count > 0) {
      const cohort = await db('cohorts')
        .where({name})
        .first();
      res.status(200).json(cohort);
    }
    else {
      res.status(404).json({message: 'not found'});
    }
  } 
  catch(error){}
});

server.delete('/api/cohorts/:name', async (req, res) => {
  const name = req.params.name;
  
  try {
    const count = await db('cohorts')
      .where({name})
      .del();

    if (count > 0) {
      res.status(204).end();
    }
    else {
      res.status(404).json({message: 'not found'});
    }
  }
  catch (error){}
});


server.get('/api/cohorts/:cohort_name/students', async (req, res) => {
  const name = req.params.cohort_name;

  try {
    const students = await db('students')
    .where({cohort_name: name});
    res.status(200).json(students);
  }
  catch(error) {
    res.status(500).json(error);
  }
})

server.post('/api/cohorts/:cohort_name/students', async (req, res) => {
    const cohortName = req.params.cohort_name;
    const studentObj = {name: req.body.name, cohort_name: cohortName}
    try {
      const id = await db('students').insert(studentObj);
  
      const student = await db('students')
        .where({id})
        .first();
      res.status(201).json(student);
    }
    catch(error){
      const message = errors[error.errorno] || 'Error';
      res.status(500).json({message, error});
    }
  })

  server.get('/api/cohorts/:cohort_name/students/:id', async (req, res) => {
    const id = req.params.id;
  
    try {
      const student = await db('students')
      .where({id});
      res.status(200).json(student);
    }
    catch(error) {
      res.status(500).json(error);
    }
  })

  server.put('/api/cohorts/:cohort_name/students/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const count = await db('students')
        .where({id})
        .update(req.body);
      if (count > 0) {
        const student = await db('students')
          .where({id})
          .first();
        res.status(200).json(student);
      }
      else {
        res.status(404).json({message: 'not found'});
      }
    } 
    catch(error){}
  });

  server.delete('/api/cohorts/:cohort_name/students/:id', async (req, res) => {
    const id = req.params.id;
    
    try {
      const count = await db('students')
        .where({id})
        .del();
  
      if (count > 0) {
        res.status(204).end();
      }
      else {
        res.status(404).json({message: 'not found'});
      }
    }
    catch (error){}
  });

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
