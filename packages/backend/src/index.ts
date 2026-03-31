import app from './app';
import { env } from './config/env';
import { startRecurringProcessor } from './jobs/recurringProcessor';

app.listen(env.PORT, () => {
  console.log(`Obolus API running on http://localhost:${env.PORT}`);
  startRecurringProcessor();
});
