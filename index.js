const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const async = require("async");
const util = require("util");

const srcDir = path.resolve(process.argv[2]);
const destDir = path.resolve(process.argv[3]);

const eachSeries = util.promisify(async.eachSeries);
const _exec = util.promisify(exec);

const main = async () => {
  console.log(srcDir);
  console.log(destDir);

  const srcFiles = fs.readdirSync(srcDir);
  await eachSeries(srcFiles, async src => {
    const ext = path.extname(src);
    if (ext !== ".xlsx") return;

    const srcFile = `${srcDir}/${src}`;
    const destFile = `${destDir}/${path.basename(src, ext)}.csv`;

    console.log("开始转换 %s", srcFile);
    await _exec(`./bin/excel2csv ${srcFile} ${destFile}`);
    console.log("完成转换 %s => %s", srcFile, destFile);
  });
};

main();
