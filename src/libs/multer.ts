import multer from "multer"

const myStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(!file){
            console.log("no file sent")
        }
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        if(!file){
            console.log("no file sent")
        }
        console.log(file)
        const filename = `${file.originalname}`
        cb(null, filename);
    }
})

const uploadStorage = multer({ storage: myStorage })
const upload=uploadStorage.single('myFile')

export {upload};
