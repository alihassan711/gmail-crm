const  { Case }  = require('../models')
const  express = require('express')
const { Email }  = require('../models')

const router = express.Router()

router.get ('/all', async (req, res) => {
  try {
    
     const data = await Case.findAll({});
    if (data.length) {
      return res.json({
        status: "success",
        message: "Case found Successfully",
        data,
      });
    } else {
      throw new Error("No data Found");
    }
  } catch (error) {
    return res.json({
      status: "error",
      message: error.message
    })
    
  }
})

router.post ('/', async (req, res) => {
    try {
         
      const data = await Case.create({...req.body});
      if (data) {
      return res.status(201).json({
        status: "success",
        message: "Case created successfully",
        data,
      });
    } else {
      throw new Error("No data Created");
    }
    } catch (error) {
       return  res.json({
        status: "error",
        error: error.message
      }) 
        
    }
})

module.exports = router;