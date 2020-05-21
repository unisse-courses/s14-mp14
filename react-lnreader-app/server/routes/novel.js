const express = require('express');
const router = express.Router();
const { Novel } = require("../models/Novel");
const multer = require('multer');

const { auth } = require("../middleware/auth");

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.jpg' || ext !== '.png') {
            return cb(res.status(400).end('only jpg, png are allowed'), false);
        }
        cb(null, true)
    }
})

var upload = multer({ storage: storage }).single("file")


//=================================
//             Novel
//=================================

router.post("/uploadImage", auth, (req, res) => {

    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, image: res.req.file.path, fileName: res.req.file.filename, file: res.req.file })
    })

});

router.post("/uploadNovel", auth, (req, res) => {

    //save all the data we got from the client into the DB
    const novel = new Novel(req.body)

    novel.save((err) => {
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).json({ success: true })
    })

});

router.post("/getNovels/", (req, res) => {   //no auth so anyone can access

    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);

    let findArgs = {};
    let term = req.body.searchTerm

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {//not empty
            //if (key === "genres") { //no need for else since there is only one filter for now
            //console.log(key)
            //console.log(req.body.filters)
            findArgs[key] = req.body.filters[key];
            // console.log(findArgs[key]); //tells the genre id
                
            console.log("----------------");
        }
    }    

    // console.log(findArgs)   //tells the chosen genres [genre:123]
    // console.log(term) //gives u the search term in the search box

   if (term){
        Novel.find(findArgs[key])
        // console.log(Novel.find(findArgs))
           .find({ $text: { $search: term } })
            .populate("writer")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, novels) => {
                if (err) return res.status(400).json({ success: false, err })
                    res.status(200).json({ success: true, novels, postSize: novels.length })
        })

    } else {
        Novel.find(findArgs)
            .populate("writer")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, novels) => {
                if (err) return res.status(400).json({ success: false, err })
                    res.status(200).json({ success: true, novels, postSize: novels.length })
        })

    }
    
});

//Axios.get(`/api/novel/novels_by_id?id=${novelId}&type=single`)

router.get("/novels_by_id", (req, res) => {
    let type = req.query.type
    let novelIds = req.query.id

    // console.log("req.query.id", req.query.id)

    if (type === "array") {
        
        let ids = req.query.id.split(',');
        novelIds = [];
        novelIds = ids.map(item => {
            return item
        })
        
    }

    //console.log("productIds", productIds)


    //we need to find the product information that belong to product Id 
    Novel.find({ '_id': { $in: novelIds } })
        .populate('writer')
        .exec((err, novel) => {
            if (err) return res.status(400).send(err)
            return res.status(200).send(novel)
        })
});

module.exports = router;
