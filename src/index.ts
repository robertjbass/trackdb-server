import 'dotenv/config';
import 'module-alias/register';

import express from 'express';
import { initMigrations } from '@/db';
import { expressSession } from '@/middleware/auth';
import { initRoutes } from '@/router';

const PORT = process.env.PORT || 3000;
const app = express();

initMigrations();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressSession);

initRoutes(app);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
