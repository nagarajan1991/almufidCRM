const Visit = require('../models/visit');

exports.CreateVisit = (req, res, next) => {
  const visit = new Visit({
    customer: req.body.customer,
    contact_no: req.body.contact_no,
    remarks: req.body.remarks,
    lat: req.body.lat,
    lng: req.body.lng,
    creator: req.userData.userId
  });
  visit.save().then(createdVisit => {
    res.status(201).json({
      message: "Vist added successfully",
      visitId: createdVisit._id
    });
  })
  .catch( error => {
    res.status(500).json({
      message: "Creating Visit Failed!"
    });
  });
};

exports.updateVisit = (req, res, next) => {
  const visit = new Visit({
    _id: req.body.id,
    customer: req.body.customer,
    contact_no: req.body.contact_no,
    remarks: req.body.remarks,
    creator: req.userData.userId
  });
  Visit.updateOne({_id: req.params.id, creator: req.userData.userId}, visit).then(result => {
    if(result.n > 0 ) {
      res.status(200).json({ message: "Update Successfull!" });
    } else {
      res.status(401).json({ message: "Not Authorized!" });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Couldn't update the post"
    });
  });
};


exports.getVisits = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const searchValue = req.query.searchValue;
  let postQuery=null;

  if(searchValue){
    postQuery = Visit.find({customer: new RegExp(searchValue, 'i')});
  }else{
     postQuery = Visit.find();
  }
  
  let fetchedVisits;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
  }
  
  postQuery
  .then(documents => {
    fetchedVisits = documents;
    return Visit.count();
  }).then(count => {
      res.status(200).json({
        message: "Visits fetched successfully",
        visits: fetchedVisits,
        maxVisits: count
      });
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching Visits Failed!"
    });
  });
};



exports.getVisit = (req, res, next) => {
  Visit.findById(req.params.id).then(visit => {
    if (visit) {
      res.status(200).json(visit);
    } else {
      res.status(404).json({message: 'Visit not found!'});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching Visit Failed!"
    });
});
};


exports.deleteVisit = (req, res, next) => {
  Visit.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    if(result.n > 0 ) {
      res.status(200).json({ message: "Deletion Successfull!" });
    } else {
      res.status(401).json({ message: "Not Authorized!" });
    }
    res.status(200).json({ message: "Visit deleted!" });
  }).catch(error => {
    res.status(500).json({
      message: "Fetching Visits Failed!"
    });
});
};
