const mongoose = require("mongoose") 
// const client = require('../db.js')

// ----------testing database ---------------------------------------//

    const con = mongoose.connect("mongodb+srv://EV:Mahi123@cluster0.tadgngw.mongodb.net/vendor-register?retryWrites=true&w=majority")

    .then(success => {
        console.log('database connected')
    })
    .catch(error => {
        console.log("error while connecting database", error)
    })

    



    // --------production_database ------------------------//

        // mongoose.connect('mongodb://root:root1234@13.231.133.55:27017/',)

        // .then(success => {
        //     console.log('database connected')
        // })
        // .catch(error => {
        //     console.log("error while connecting database", error)
        // })


  

    
