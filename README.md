# Things to Sunsama Sync

This script synchronizes todos from Things 3 to Sunsama using a Relay.app webhook. It works by checking for todos with the the `sunsama`.

## Prerequisites

-   [Bun](https://bun.sh/) installed on your system
-   [Things 3](https://culturedcode.com/things/) installed on your Mac
-   [Things CLI](https://github.com/thingsapi/things-cli) installed and configured
-   A Sunsama account
-   A Relay.app account with a configured webhook

## Setup

1. Clone this repository:

```

git clone https://github.com/yourusername/things-sunsama-sync.git cd things-sunsama-sync

```

2. Install dependencies:

```

bun install

```

3. Obtain the webhook URL from Relay.app:

-   Log in to your Relay.app account
-   Create a new playbook or use an existing one
-   Add a webhook trigger to your playbook
-   Copy the generated webhook URL

4. Update the `WEBHOOK_URL` in `sync.ts` with your Relay.app webhook URL:

```typescript
const WEBHOOK_URL = 'your-relay-app-webhook-url-here';
```

## Usage

To sync your Things todos with Sunsama:

```
bun run sync
```

This command will:

1. Fetch todos from Things 3 using the Things CLI
2. Check which todos have not been synced yet
3. Send new todos to Sunsama via the Relay.app webhook
4. Update the local sync log to avoid duplicate syncing

## How it works

-   The script uses the Things CLI to fetch todos tagged with "sunsama"
-   It maintains a `synced.log` file to keep track of which todos have been synced
-   Only new, unsynced todos are sent to the webhook
-   The Relay.app webhook then handles the integration with Sunsama

## Customization

-   To change which todos are synced, modify the Things CLI command in the `getThingsData` function
-   To adjust the sync behavior, edit the filtering logic in the `prepareDataForSubmission` function

## Troubleshooting

-   Ensure the Things CLI is properly installed and configured
-   Check that your Relay.app webhook URL is correct
-   Verify that you have the necessary permissions to create and modify files in the project directory

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [ISC License](LICENSE).

```

This README provides:

1. An overview of the project
2. Prerequisites for using the script
3. Setup instructions, including how to obtain the webhook URL from Relay.app
4. Usage instructions
5. An explanation of how the script works
6. Customization options
7. Troubleshooting tips
8. Information about contributing and licensing

You can adjust any part of this README to better fit your project's specific details or requirements. Make sure to replace "yourusername" in the git clone URL with your actual GitHub username if you're hosting this on GitHub.
```
