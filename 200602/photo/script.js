const fs = require("fs")

const ext = ["jpg", "jpeg", "png", "gif"]

fs.readdir("./", (err, files) => {
  const images = []
  files.forEach((file) => {
    if (ext.includes(file.split(".").pop())) {
      images.push(file)
    }
  })

  fs.readFile("./tpl.html", "utf8", (err, content) => {
    content = content.replace(/'{images}'/, JSON.stringify(images))
    fs.writeFile("./index.html", content, "utf8", () => {
      console.log("生成完毕: ", images.length)
    })
  })
})
