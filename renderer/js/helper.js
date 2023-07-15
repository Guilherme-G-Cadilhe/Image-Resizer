
export const IsFileImage = (file) => {
  const accepetedImageTypes = ['image/jpeg', 'image/png', 'image/gif']
  return file && accepetedImageTypes.includes(file?.type)
}

export const alertError = (message) => {
  Toastify.toast({
    text: `${message}`,
    duration: 3000,
    close: false,
    style: {
      width: '50%',
      margin: '0 auto',
      marginTop: "10px",
      border: '1px solid black',
      borderRadius: '5px',
      background: 'red',
      color: 'white',
      textAlign: 'center',
    }
  })
}


export const alertSuccess = (message) => {
  Toastify.toast({
    text: `${message}`,
    duration: 5000,
    close: false,
    style: {
      width: '50%',
      margin: '0 auto',
      marginTop: "10px",
      border: '1px solid black',
      borderRadius: '5px',
      background: 'green',
      color: 'white',
      textAlign: 'center',
    }
  })
}