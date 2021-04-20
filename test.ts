import {outputFileSync, readdirSync} from 'fs-extra';
import {readFileSync} from "fs";
import artTemplate from "art-template";
import {join} from 'path';

try {
  const pagePath = join(__dirname, './src/pages');
  const sectionPath = join(__dirname, './src/sections');
  const pageFiles = readdirSync(pagePath);
  const sectionsFiles = readdirSync(sectionPath);

  const sectionsContent: { [key: string]: string } = {};
  sectionsFiles.forEach(item => {
    const content = artTemplate(join(sectionPath, item),{});
    const name = item.split('.')[0];
    sectionsContent[name] = content;
  });
  // console.log(sectionsContent)
  pageFiles.forEach((item) => {
    const dest = join(pagePath, item, 'index.ejs');
    const content = artTemplate(
      dest,
      {header: `${sectionsContent['header']}` }
    );
    console.log(content);
    outputFileSync(dest, content, {encoding: 'utf8'});
  })

} catch (e) {
  console.error('获取文件失败！')
}
