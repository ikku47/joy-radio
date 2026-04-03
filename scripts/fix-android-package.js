const fs = require('fs');
const path = require('path');

const oldPackage = 'com.anonymous.joyradio';
const newPackage = 'com.eq.joyradio';

const filesToPatch = [
  path.join(__dirname, '..', 'android', 'build', 'generated', 'autolinking', 'autolinking.json'),
  path.join(
    __dirname,
    '..',
    'android',
    'app',
    'build',
    'generated',
    'autolinking',
    'src',
    'main',
    'java',
    'com',
    'facebook',
    'react',
    'ReactNativeApplicationEntryPoint.java'
  ),
];

for (const filePath of filesToPatch) {
  if (!fs.existsSync(filePath)) {
    continue;
  }

  const current = fs.readFileSync(filePath, 'utf8');

  if (!current.includes(oldPackage)) {
    continue;
  }

  fs.writeFileSync(filePath, current.replaceAll(oldPackage, newPackage));
  console.log(`Patched ${path.relative(process.cwd(), filePath)}`);
}
