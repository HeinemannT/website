const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const EXCLUDED_DIRS = new Set([
    '.git',
    'node_modules',
    'dist',
    'build',
    '_site',
    '.gemini',
    '.next',
    '.agent',
]);

const BINARY_EXTENSIONS = new Set([
    '.png', '.jpg', '.jpeg', '.gif', '.ico',
    '.pdf', '.woff', '.woff2', '.ttf', '.eot',
    '.mp4', '.webm', '.webp', '.zip', '.tar', '.gz',
    '.7z', '.exe', '.dll', '.so', '.dylib', '.class'
]);

function isBinary(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return BINARY_EXTENSIONS.has(ext);
}

function processDirectory(directory) {
    const files = fs.readdirSync(directory, { withFileTypes: true });

    for (const dirent of files) {
        const fullPath = path.join(directory, dirent.name);

        if (dirent.isDirectory()) {
            if (EXCLUDED_DIRS.has(dirent.name)) {
                continue;
            }
            processDirectory(fullPath);
        } else if (dirent.isFile()) {
            if (isBinary(fullPath)) {
                continue;
            }

            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                // Check if file has CRLF
                if (content.includes('\r\n')) {
                    const newContent = content.replace(/\r\n/g, '\n');
                    fs.writeFileSync(fullPath, newContent, 'utf8');
                    console.log(`Converted: ${path.relative(rootDir, fullPath)}`);
                }
            } catch (err) {
                console.error(`Error processing ${fullPath}:`, err);
            }
        }
    }
}

console.log('Starting CRLF to LF conversion...');
processDirectory(rootDir);
console.log('Conversion complete.');
