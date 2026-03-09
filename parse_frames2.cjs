const fs = require('fs');
const data = JSON.parse(fs.readFileSync('c:/Users/hosty/AppData/Roaming/Code/User/workspaceStorage/9e719d8e029a5548f1870f5d4ee9b577/GitHub.copilot-chat/chat-session-resources/160535d5-0550-4c85-9215-28f42dfbc078/call_MHxyUmxSanc4cURTaVZlQmhycGc__vscode-1773049925023/content.json', 'utf8'));
const xml = data.result;

// Find canvas top level
const canvasMatch = xml.match(/<canvas id="[^"]+">([\s\S]+?)<\/canvas>/);
if (canvasMatch) {
    const inner = canvasMatch[1];
    // Just find all <frame id="..." name="..."
    // Note that sub-frames also match, but top-level usually have width=390
    let match;
    const layerRegex = /<frame id="([^"]+)" name="([^"]+)" matrix="[^"]+" width="(390|391)" /g;
    while ((match = layerRegex.exec(inner)) !== null) {
        console.log(match[1] + ' - ' + match[2]);
    }
}
