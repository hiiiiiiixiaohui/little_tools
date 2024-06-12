// renameFiles.js

const fs = require("fs");
const path = require("path");

// 获取命令行参数，去掉前两个默认参数
const args = process.argv.slice(2);

// 检查是否传入前缀参数
if (args.length === 0) {
  console.log("请传入前缀参数");
  process.exit(1);
}

const prefix = args[0];
const fileExtension = args[1];
const cwd = process.cwd();

// 读取当前目录中的所有文件
fs.readdir(cwd, (err, files) => {
  if (err) {
    console.error("无法读取目录内容", err);
    process.exit(1);
  }
  let filteredFiles = null;
  if (fileExtension) {
    filteredFiles = files.filter(
      (file) => path.extname(file) === `.${fileExtension}`,
    );
  } else {
    const currentFilePath = __filename;
    const currentFileName = path.basename(currentFilePath);
    filteredFiles = files.filter((file) => !file.includes(currentFileName));
  }

  filteredFiles.sort((a, b) => {
    const nameA = path.basename(a, `.${fileExtension}`);
    const nameB = path.basename(b, `.${fileExtension}`);
    return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: 'base' });
  });

  // 遍历每个文件并重命名
  filteredFiles.forEach((file, index) => {
    let suffix = fileExtension;
    let idx = index;
    idx += 1;
    if (idx < 10) {
      idx = String(idx).padStart(2, '0');
    }
    if (!suffix) {
      suffix = path.extname(file)
    }
    const newPath = `${prefix}${idx}${suffix}`

    fs.rename(file, newPath, (err) => {
      if (err) {
        console.error(`无法重命名文件 ${file}`, err);
      } else {
        console.log(`文件 ${file} 已重命名为 ${newPath}`);
      }
    });
  });
});
