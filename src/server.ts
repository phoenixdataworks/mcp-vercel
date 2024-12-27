import express, { Request, Response } from 'express';
import { createClient } from '@vercel/client';

interface DeployRequest {
  name: string;
  files: {
    file: string;
    data: Buffer | string;
  }[];
}

interface ProjectResponse {
  id: string;
  name: string;
  framework: string;
}

const app = express();
app.use(express.json());

const vercel = createClient({
  token: process.env.VERCEL_TOKEN || ''
});

app.post('/api/deploy', async (req: Request<{}, {}, DeployRequest>, res: Response) => {
  const { name, files } = req.body;
  try {
    const deployment = await vercel.createDeployment({
      name,
      files,
      projectSettings: {
        framework: 'node'
      }
    });
    res.json(deployment);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get('/api/projects', async (_req: Request, res: Response<ProjectResponse[]>) => {
  try {
    const projects = await vercel.getProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get('/api/deployments/:projectId', async (req: Request<{projectId: string}>, res: Response) => {
  try {
    const deployments = await vercel.getDeployments({
      projectId: req.params.projectId
    });
    res.json(deployments);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));