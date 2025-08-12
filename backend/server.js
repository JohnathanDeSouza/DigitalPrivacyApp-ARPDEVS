const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const dataRoutes = require('./routes/dataAnalysis');
const alertsRoutes = require('./routes/alerts');
const checklistsRoutes = require('./routes/checklists');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'BridgeAura API',
    version: '1.0.0',
    description: 'Backend API for BridgeAura assignment'
  },
  servers: [{ url: 'http://localhost:' + PORT }]
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/data-analysis', dataRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/checklists', checklistsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});