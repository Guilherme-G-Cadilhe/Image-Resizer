import { IsFileImage, alertError, alertSuccess } from "./helper.js";

const form = document.querySelector('#img-form');
const imgInput = document.querySelector('#imgInput');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');

function loadImage(e) {
  const file = e.target.files[0];

  if (!IsFileImage(file)) return alertError('Please select an image')

  // Get Width and Height from File
  const image = new Image();
  image.src = URL.createObjectURL(file)
  image.onload = () => {
    widthInput.value = image.naturalWidth;
    heightInput.value = image.naturalHeight;
  }

  form.style.display = 'block';
  filename.innerText = file?.name
  outputPath.innerText = path.join(os.homedir(), 'imageResizer')

}

// Send Image Data to Main
function sendImage(e) {
  e.preventDefault();
  if (!imgInput.files[0]) return alertError('Please upload an image')

  const width = widthInput.value;
  const height = heightInput.value;
  const imgPath = imgInput.files[0].path;


  if (width === '' || height === '') return alertError('Please fill in height and width')

  // Comunicate back to Main Process from the Renderer
  ipcRenderer.send('image:resize', {
    imgPath,
    width,
    height,
  })
}

// Catch the image:done event
ipcRenderer.on('image:done', () => {
  alertSuccess(`Image Resized to ${widthInput.value}x${heightInput.value}`)
})


imgInput.addEventListener('change', loadImage)
form.addEventListener('submit', sendImage)

