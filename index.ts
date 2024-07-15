import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const SYNCED_LOG_PATH = join(process.cwd(), 'synced.log');
const WEBHOOK_URL_PATH = join(process.cwd(), 'WEBHOOK_URL.secret');

// Read the webhook URL from the secret file
const getWebhookUrl = (): string => {
  try {
    return readFileSync(WEBHOOK_URL_PATH, 'utf-8').trim();
  } catch (error) {
    console.error('Error reading WEBHOOK_URL.secret:', error);
    process.exit(1);
  }
};

const WEBHOOK_URL = getWebhookUrl();

// Execute the Things CLI command and get the JSON output
const getThingsData = (): any[] => {
  try {
    const output = Bun.spawnSync(['things-cli', '--json', '-t', 'Sunsama', 'todos'], {
      stdout: 'pipe',
    });
    return JSON.parse(output.stdout.toString());
  } catch (error) {
    console.error('Error executing Things CLI command:', error);
    process.exit(1);
  }
};

// Read synced UUIDs from the log file
const getSyncedUUIDs = (): Set<string> => {
  if (!existsSync(SYNCED_LOG_PATH)) {
    return new Set();
  }
  try {
    const content = readFileSync(SYNCED_LOG_PATH, 'utf-8');
    return new Set(content.split('\n').filter(Boolean));
  } catch (error) {
    console.error('Error reading synced.log:', error);
    return new Set();
  }
};

// Write synced UUIDs to the log file
const writeSyncedUUIDs = (uuids: Set<string>): void => {
  try {
    writeFileSync(SYNCED_LOG_PATH, Array.from(uuids).join('\n') + '\n');
  } catch (error) {
    console.error('Error writing to synced.log:', error);
  }
};

// Filter out already synced todos and prepare data for submission
const prepareDataForSubmission = (thingsData: any[], syncedUUIDs: Set<string>): { data: any[], newUUIDs: Set<string> } => {
  const newUUIDs = new Set<string>();
  const filteredData = thingsData.filter((todo: any) => {
    if (!syncedUUIDs.has(todo.uuid)) {
      newUUIDs.add(todo.uuid);
      return true;
    }
    return false;
  });
  return { data: filteredData, newUUIDs };
};

// Submit the data to the webhook
const submitToWebhook = async (data: any[]) => {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('Data successfully submitted to webhook');
    const responseBody = await response.text();
    console.log('Response:', responseBody);
  } catch (error) {
    console.error('Error submitting data to webhook:', error);
  }
};

// Main function
const main = async () => {
  const thingsData = getThingsData();
  const syncedUUIDs = getSyncedUUIDs();
  const { data: filteredData, newUUIDs } = prepareDataForSubmission(thingsData, syncedUUIDs);

  if (filteredData.length > 0) {
    await submitToWebhook(filteredData);
    const updatedSyncedUUIDs = new Set([...syncedUUIDs, ...newUUIDs]);
    writeSyncedUUIDs(updatedSyncedUUIDs);
    console.log(`Synced ${filteredData.length} new todos`);
  } else {
    console.log('No new todos to sync');
  }
};

main();
