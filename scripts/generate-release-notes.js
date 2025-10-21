#!/usr/bin/env node
/*
Generates RELEASE_NOTES.md from docs/releases.json
*/
const fs = require('fs');
const path = require('path');

function readJson(jsonPath) {
    return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
}

function escapeCode(str) {
    return String(str).replace(/`/g, '\\`');
}

function renderRelease(release) {
    const lines = [];
    const titlePart = release.title ? ` - ${release.title}` : '';
    lines.push(`## Version ${release.version}${titlePart}`);
    if (release.date) {
        lines.push('', `**Release Date:** ${release.date}`, '');
    } else {
        lines.push('');
    }
    (release.sections || []).forEach(section => {
        if (!section) return;
        const heading = section.heading || '';
        if (heading) lines.push(`### ${heading}`);
        lines.push('');
        (section.items || []).forEach(item => {
            if (typeof item === 'string') {
                lines.push(`- ${escapeCode(item)}`);
            } else if (item && typeof item === 'object' && item.text) {
                lines.push(`- **${escapeCode(item.text)}**`);
                if (Array.isArray(item.items)) {
                    item.items.forEach(sub => {
                        lines.push(`  - ${escapeCode(sub)}`);
                    });
                }
            }
        });
        lines.push('');
    });
    lines.push('---', '');
    return lines.join('\n');
}

function main() {
    const repoRoot = path.resolve(__dirname, '..');
    const jsonPath = path.join(repoRoot, 'docs', 'releases.json');
    const outPath = path.join(repoRoot, 'RELEASE_NOTES.md');
    const data = readJson(jsonPath);

    const header = [
        '# GoTo Extension - Release Notes',
        '',
    ];

    const body = (data.releases || []).map(renderRelease).join('\n');

    const footer = [
        '---',
        '',
        '**Installation:** [Chrome Web Store](https://chrome.google.com/webstore/detail/goto/iabecofjidglogmhkccmgihafpoaccmd)',
        '',
        `**Support:** For issues or feature requests, please visit our [GitHub repository](${(data.links && data.links.github) || 'https://github.com/tusharv/GoTo'})`,
        '',
        `**License:** ${data.license || 'GNU General Public License v3.0'}`,
        '',
    ];

    const md = header.join('\n') + body + footer.join('\n');
    fs.writeFileSync(outPath, md);
    // eslint-disable-next-line no-console
    console.log(`Generated ${path.relative(repoRoot, outPath)} from docs/releases.json`);
}

main();


