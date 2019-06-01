const yml = require('js-yaml');
const fs = require('fs');
const path = require('path');

const config = yml.load(
  fs.readFileSync(path.join(__dirname, '../_config.yml')),
);
const sourceDir = path.join(__dirname, '../source/_posts');
const outputDir = path.join(__dirname, '../markdown');
const baseUrl = config.url;

const files = fs.readdirSync(sourceDir).filter(i => i.endsWith('.md'));

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const MD_IMG = /!\[.*\]\(([^()]*)\)/g;
const HTML_IMG = /\<img .*src="([^"]*)" /gi;

files.forEach(async file => {
  const data = (await fs.promises.readFile(
    path.join(sourceDir, file),
  )).toString();
  let out = data.replace(MD_IMG, (match, p1) => {
    if (path.isAbsolute(p1)) {
      return match.replace(p1, baseUrl + p1);
    }
    return match
  });

  out = out.replace(HTML_IMG, (match, p1) => {
    if (path.isAbsolute(p1)) {
      return match.replace(p1, baseUrl + p1);
    }
    return match
  });

  fs.promises.writeFile(path.join(outputDir, file), out);
});
