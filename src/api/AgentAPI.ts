import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3001;

app.use(bodyParser.json());

// In-memory storage for agents and tasks
const agents: Record<string, any> = {};
const tasks: Record<string, any> = {};

// Register a new agent
app.post('/agents', (req, res) => {
    const { id, name, capabilities } = req.body;
    if (!id || !name || !capabilities) {
        return res.status(400).send('Missing required fields: id, name, capabilities');
    }
    agents[id] = { name, capabilities, tasks: [] };
    res.status(201).send({ message: 'Agent registered', agent: agents[id] });
});

// Get all agents
app.get('/agents', (req, res) => {
    res.send(Object.values(agents));
});

// Assign a task to an agent
app.post('/agents/:id/tasks', (req, res) => {
    const agentId = req.params.id;
    const { taskId, taskDetails } = req.body;
    if (!agents[agentId]) {
        return res.status(404).send('Agent not found');
    }
    if (!taskId || !taskDetails) {
        return res.status(400).send('Missing required fields: taskId, taskDetails');
    }
    tasks[taskId] = { agentId, taskDetails, status: 'pending' };
    agents[agentId].tasks.push(taskId);
    res.status(201).send({ message: 'Task assigned', task: tasks[taskId] });
});

// Get tasks for an agent
app.get('/agents/:id/tasks', (req, res) => {
    const agentId = req.params.id;
    if (!agents[agentId]) {
        return res.status(404).send('Agent not found');
    }
    const agentTasks = agents[agentId].tasks.map((taskId: string) => tasks[taskId]);
    res.send(agentTasks);
});

// Start the API server
app.listen(port, () => {
    console.log(`Agent API running on http://localhost:${port}`);
});