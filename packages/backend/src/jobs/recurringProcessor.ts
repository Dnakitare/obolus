import cron from 'node-cron';
import { processRecurringRules } from '../services/recurring.service';

export function startRecurringProcessor() {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    try {
      const result = await processRecurringRules();
      if (result.created > 0) {
        console.log(`[recurring-processor] Created ${result.created} transactions`);
      }
    } catch (err) {
      console.error('[recurring-processor] Error:', err);
    }
  });

  console.log('[recurring-processor] Scheduled (hourly)');
}
