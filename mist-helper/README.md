# Maestro

Utility Chrome extension for repetitive tasks.

## Testing Locally

Chrome injects the extension only on the sites listed in `manifest.json`. That file stays on your machine and is not committed.

1. Copy `manifest.template.json` to `manifest.json` if you do not already have one.
2. Replace every `https://CHANGE_ME.example/*` with the site you use, including the path wildcard. The same pattern belongs in `host_permissions`, `content_scripts`, and `web_accessible_resources`.
3. Go to `chrome://extensions/`.
4. Enable "Developer mode" (top-right).
5. Click "Load unpacked".
6. Select this folder.

## Dragons

The Battle tab lists dragons from `config.js`. That file stays on your machine. Chrome loads it as a content script, before the panel script.

1. Copy `config.example.js` to `config.js` if you do not already have one.
2. Put one visible dragon name in each string of `MAESTRO_DRAGONS`.
3. Reload the extension.

## Development

- Modify files in `src/` folder
- Click refresh icon next to extension in `chrome://extensions/` to reload
- If you modify `manifest.json`, reload the extension or page
