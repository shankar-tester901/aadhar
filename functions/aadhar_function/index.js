const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const app = express();
const catalyst = require('zcatalyst-sdk-node');

// default options
app.use(fileUpload());

app.post('/upload', async function(req, res) {
    console.log('upload invoked  rrrrrrrrr');
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    frontFile = req.files.front;
    // console.log(sampleFile);
    front_uploadPath = __dirname + '/uploads/' + frontFile.name;
    console.log(front_uploadPath);
    // Use the mv() method to place the file somewhere on your server
    frontFile.mv(front_uploadPath, function(err) {
        if (err)
            return res.status(500).send(err);
    });

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    backFile = req.files.back;
    // console.log(sampleFile);
    back_uploadPath = __dirname + '/uploads/' + backFile.name;
    console.log(back_uploadPath);
    // Use the mv() method to place the file somewhere on your server
    backFile.mv(back_uploadPath, function(err) {
        if (err)
            return res.status(500).send(err);
    });

    const catalystApp = catalyst.initialize(req);
    // console.log('got catalystApp ' + uploadPath);
    let panDetails = await getOCRDetails(front_uploadPath, back_uploadPath, catalystApp);
    console.log(panDetails);
    res.send(panDetails);
});





function getOCRDetails(front, back, catalystApp) {
    return new Promise((resolve, reject) => {
        console.log('in getDetails2   ');

        var zia = catalystApp.zia();



        zia.extractAadhaarCharacters(fs.createReadStream(front), fs.createReadStream(back), 'eng,hin')
            .then((result) => {
                console.log(result);
                resolve(result);
            })
            .catch((err) => {
                console.log(err.toString());
                reject(err);
            });

    });
}


module.exports = app;