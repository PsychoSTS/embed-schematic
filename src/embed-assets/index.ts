import { Rule, SchematicContext, Tree, FileEntry } from '@angular-devkit/schematics';
import { Path } from '@angular-devkit/core';
// import * as fs from 'fs';
// import * as path from 'path';

const regex = /(url\()(.*)(\))/gm;

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function embedAssets(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {

    console.log(`Current DIR: ${__dirname}`);

    tree.visit((path: Path, entry?: Readonly<FileEntry> | null) => {
      
      if (!path.endsWith('.scss') || !entry) {
        return;
      }

      console.log(`Current file to look at path: ${path}`);

      // const content = tree.read(path);
      // if (!content) {
      //   return;
      // }
      
      let content = entry.content.toString()

      console.log(`Contents length: ${content.length}`);

      const result: RegExpMatchArray | null = content.match(regex);// regex.exec(content.toString());
      if (result) {
        result.forEach(exec => {
          const r = exec.split(regex)[2];// regex.exec(exec.toString());
          if (r) {

              tree.visit(filePath1 => {
                if (filePath1.includes(r)) {
                  console.log(`Path to asset: ${filePath1}`);
                  const data = tree.read(filePath1);
                  if (data) {
                    // const data = fs.readFileSync(r);
                    const base64 = data.toString('base64');
                    console.log(`Asset contents length in Base64: ${base64.length}`);
                    content = content.replace(r, `data:image/png;base64,${base64}`);
                  }                  
                }
              });

              // let pathToAsset: string = '';
              // if (r.charAt(0) == '.') { // Relative
              //   const dir = path.dirname(`${__dirname}${filePath}`);
              //   pathToAsset = path.resolve(dir, r);
              // } else if (r.charAt(0) == '/') { // Root?
              //   pathToAsset = path.resolve(`${__dirname}${r}`);
              // }

              // console.log(`Path to asset: ${pathToAsset}`);
              // const data = fs.readFileSync(r);
              // console.log(`Asset contents in Base64: ${data.toString('base64').length}`);
          }
        });

        tree.create(entry.path + '_edit', content);
        console.log(`Contents with assets length: ${content.length}`);
      }

      // const index = content.indexOf('url(') + 4;
      // const index2 = content.indexOf(')', index) + 4;
      // console.log(index2);

    })

    // tree.create(_options.name || 'hello', 'World!');
    return tree;
  };
}
