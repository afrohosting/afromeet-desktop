/* eslint-env node */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const projectDir = path.resolve(__dirname, '..');
const distDir = path.join(projectDir, 'dist');
const { version } = require(path.join(projectDir, 'package.json'));
const artifactNames = {
    dmg: `afro-meet-${version}.dmg`,
    zip: `afro-meet-${version}.zip`
};

/**
 * Returns the update metadata for an artifact.
 *
 * @param {string} name - Artifact file name.
 * @returns {{ name: string, sha512: string, size: number }}
 */
function getArtifactMetadata(name) {
    const artifactPath = path.join(distDir, name);

    if (!fs.existsSync(artifactPath)) {
        throw new Error(`Missing update artifact: ${artifactPath}`);
    }

    const contents = fs.readFileSync(artifactPath);

    return {
        name,
        sha512: crypto.createHash('sha512')
            .update(contents)
            .digest('base64'),
        size: contents.length
    };
}

const zip = getArtifactMetadata(artifactNames.zip);
const dmg = getArtifactMetadata(artifactNames.dmg);
const manifest = [
    `version: ${version}`,
    'files:',
    `  - url: ${zip.name}`,
    `    sha512: ${zip.sha512}`,
    `    size: ${zip.size}`,
    `  - url: ${dmg.name}`,
    `    sha512: ${dmg.sha512}`,
    `    size: ${dmg.size}`,
    `path: ${zip.name}`,
    `sha512: ${zip.sha512}`,
    `releaseDate: '${new Date().toISOString()}'`,
    ''
].join('\n');

fs.writeFileSync(path.join(distDir, 'latest-mac.yml'), manifest);
console.log(`Updated ${path.join(distDir, 'latest-mac.yml')}`);
