/**
检测扫描某外网视频内容平台的脚本
因为有些平台视频无法直接下载或者文件被分片下载了，
于是我弄了个小脚本扫描检测文件分片块数，用于支持某bt下载器的批量下载

代码很多地方不是很严谨且链接不经校验，可酌情参考
支持链接参考：
https://xxx.xxx.xx/xxx/xxxx/xxxx/asdsadsa_00001.xxx
**/ export async function checkServe(link, suffix = ".ts") {
  if (!link || typeof link !== "string") {
    return;
  }
  const [sourceLink] = link.split(suffix)[0].split("_");

  let urls = [];
  let number = 1;
  let increment = 100;
  let prevIncrement = 0;
  let hasError = false;
  let flag = true;
  let successIndex = 0;
  let failIndex = 0;
  while (increment >= 1 && flag && failIndex - successIndex !== 1) {
    const currentNumber = (number + "").padStart(3, "0");
    const currentURL = `${sourceLink}_00${currentNumber}${suffix}`;
    try {
      const response = await fetch(currentURL);
      if (response.ok) {
        if (hasError) {
          let addN = Math.ceil(prevIncrement / 2);
          if (addN <= 0) {
            addN = 1;
          }
          number += addN;
        } else {
          if (number > 1) {
            let now_increment = Math.ceil(increment / 2);
            if (now_increment <= 0) {
              now_increment = 1;
            }
            if (number <= 0) {
              number = 1;
            } else {
              number += now_increment;
            }
            prevIncrement = increment;
            increment = now_increment;
          } else {
            number += increment;
          }
        }
        failIndex = number;
      } else {
        let now_increment = Math.ceil(increment / 2);
        if (number > now_increment) {
          if (now_increment <= 0) {
            now_increment = 1;
          }
          if (number <= 0) {
            number = 1;
          } else {
            number -= now_increment;
          }
          prevIncrement = increment;
          increment = now_increment;
          hasError = true;
        } else {
          flag = false;
        }
        successIndex = number;
      }
    } catch (error) {
      return error;
    }
  }
  for (let i = 1; i <= successIndex; i += 1) {
    const cn = (i + "").padStart(3, "0");
    const uri = `${sourceLink}_00${cn}${suffix}`;
    urls.push(uri);
  }

  console.log(urls.join("\n"));
}
