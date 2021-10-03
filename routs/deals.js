var express = require('express');
var router = express.Router();
let SpecialDeals = require('../models/specialDealIndexes');

router.get('/special', (req, res) => {
   console.log('In special deals');
   SpecialDeals.find({}, (err, sDeals) => {
      if (err) {
         let message =
            'Something went wrong in special deals rout DB function because ' +
            err.message;
         console.error(message);
         res.status(500).json({
            message: message,
            failed: true,
         });
      } else {
         sDeal = sDeals[0];
         console.log(sDeal);
         if (!sDeal) {
            console.log('Failed to create special deal');
            res.status(500).json({
               message: 'Server Error, Nothing was returned in special deal',
               failed: true,
            });
            return;
         }
         console.log('Sending deals');
         res.status(200).json({
            sDeal,
         });
      }
   });
});

module.exports = router;
