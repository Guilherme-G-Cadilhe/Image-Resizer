const resizeImg = require("resize-img");
const fs = require('fs');
const path = require('path');

exports.resizeImage = async ({ imgPath, width, height, destination, fileName }) => {
  try {
    const newImage = await resizeImg(fs.readFileSync(imgPath), {
      width: +width, // + sign converts into number
      height: +height
    });

    // Create Destination folder if not exists
    if (!fs.existsSync(destination)) fs.mkdirSync(destination);

    // Write file to destination
    fs.writeFileSync(path.join(destination, fileName), newImage)


  } catch (error) {
    console.log('error :>> ', error);
  }
}

