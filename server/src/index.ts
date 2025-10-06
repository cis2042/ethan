import express from 'express';
import cors from 'cors';
import db from './db';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Initialize database
db.serialize(() => {
  const fs = require('fs');
  const sql = fs.readFileSync('./init.sql').toString();
  db.exec(sql, (err) => {
    if (err) {
      return console.error('Error initializing database:', err);
    }
    console.log('Database initialized successfully.');
    // Check if tasks table is empty
    db.get("SELECT COUNT(*) as count FROM tasks", (err, row: { count: number }) => {
      if (err) {
        console.error('Error checking tasks table:', err);
        return;
      }
      if (row && row.count === 0) {
        // Insert mock data
        const insert = db.prepare("INSERT INTO tasks (title, description, category, reward_type, reward_amount) VALUES (?, ?, ?, ?, ?)");
        insert.run("Write a tweet about AI", "Draft a compelling tweet about the future of AI.", "Social Media", "crypto", 10);
        insert.run("Create a meme", "Create a funny meme about web3 development.", "Content Creation", "crypto", 5);
        insert.run("Translate a document", "Translate a short document from English to Spanish.", "Translation", "crypto", 20);
        insert.finalize();
        console.log('Mock tasks inserted.');
      }
    });
  });
});

app.get('/tasks', (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ tasks: rows });
  });
});

app.get('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM tasks WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json({ task: row });
  });
});

app.patch('/tasks/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  if (status === 'in_progress') {
    const sql = 'UPDATE tasks SET status = ? WHERE id = ?';
    db.run(sql, [status, id], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const assignStmt = db.prepare('INSERT INTO task_assignments (task_id, user_id) VALUES (?, ?)');
      assignStmt.run(id, 2); // Hardcoded user ID for now
      assignStmt.finalize();

      res.json({ message: 'Task status updated successfully' });
    });
  } else if (status === 'completed') {
    const sql = 'UPDATE tasks SET status = ? WHERE id = ?';
    db.run(sql, [status, id], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json({ message: 'Task status updated to completed' });
    });
  } else {
    return res.status(400).json({ error: 'Invalid status update' });
  }
});

app.post('/tasks', (req, res) => {
  const { title, description, category, reward_type, reward_amount, creator_id } = req.body;

  const stmt = db.prepare('INSERT INTO tasks (title, description, category, reward_type, reward_amount, status, creator_id) VALUES (?, ?, ?, ?, ?, ?, ?)');
  stmt.run(title, description, category, reward_type, reward_amount, 'open', creator_id, function(this: any, err: Error | null) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Task created successfully', taskId: this.lastID });
  });
  stmt.finalize();
});

app.get('/users/:id/tasks', (req, res) => {
  const { id } = req.params;
  db.all("SELECT * FROM tasks WHERE creator_id = ?", [id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ tasks: rows });
  });
});

app.get('/tasks/:id/applicants', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT u.id, u.wallet_address
    FROM users u
    JOIN task_assignments ta ON u.id = ta.user_id
    WHERE ta.task_id = ?
  `;
  db.all(sql, [id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ applicants: rows });
  });
});

interface User {
  id: number;
  wallet_address: string;
}

app.post('/agents', (req, res) => {
  const { agentName, account } = req.body;

  if (!agentName || !account) {
    return res.status(400).json({ error: 'agentName and account are required' });
  }

  const findUserSql = 'SELECT * FROM users WHERE wallet_address = ?';
  db.get(findUserSql, [account], (err, user: User) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (user) {
      createAgent(user.id, agentName, res);
    } else {
      const createUserSql = 'INSERT INTO users (wallet_address) VALUES (?)';
      db.run(createUserSql, [account], function (err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal server error' });
        }
        createAgent(this.lastID, agentName, res);
      });
    }
  });
});

function createAgent(userId: number, agentName: string, res: express.Response) {
  const createAgentSql = 'INSERT INTO human_agents (user_id, name) VALUES (?, ?)';
  db.run(createAgentSql, [userId, agentName], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ id: this.lastID, user_id: userId, name: agentName });
  });
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});