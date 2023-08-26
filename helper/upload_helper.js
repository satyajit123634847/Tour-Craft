const multer = require('multer')

exports.project_banner = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `./media/images/project_banner/`)
        },
        filename: function (req, file, cb) {
            cb(null, `project_banner_` + `${Date.now()}` + `_` + file.originalname)
        }
    }),
}).any('project_banner')


exports.upload_files = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `./media/files/`)
        },
        filename: function (req, file, cb) {
            cb(null,file.originalname)
        }
    }),
}).any('files')


exports.brochure = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `./media/pdfs/brochure/`)
        },
        filename: function (req, file, cb) {
            cb(null, `project_brochure_` + `${Date.now()}` + `_` + file.originalname)
        }
    }),
}).any('project_broacher')


exports.videos = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `./media/videos/project/`)
        },
        filename: function (req, file, cb) {
            cb(null, `videos_` + `${Date.now()}` + `_` + file.originalname)
        }
    }),
}).any('project_videos')

exports.answer_images = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `./media/images/answer_images/`)
        },
        filename: function (req, file, cb) {
            cb(null, `answer_images` + `${Date.now()}` + `_` + file.originalname)
        }
    }),
}).any('answer_images')


exports.question_images = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `./media/images/question_images/`)
        },
        filename: function (req, file, cb) {
            cb(null, `question_images` + `${Date.now()}` + `_` + file.originalname)
        }
    }),
}).any('question_images')




// upload videos
// exports.upload_video = multer({
//     storage: multer.diskStorage({
//         destination: function (req, file, cb) {
//             cb(null, `./public/videos/`)
//         },
//         filename: function (req, file, cb) {
//             cb(null, `video_` + `${Date.now()}` + `_` + file.originalname)
//         }
//     }),
// }).single('lesson_video')



//upload pdf's
// exports.upload_pdf = multer({
//     storage: multer.diskStorage({
//         destination: function (req, file, cb) {
//             cb(null, `./public/pdfs/`)
//         },
//         filename: function (req, file, cb) {
//             cb(null, `pdf_` + `${Date.now()}` + `_` + file.originalname)
//         }
//     }),
// }).single('lesson_pdf')