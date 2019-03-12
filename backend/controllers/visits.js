const Visit = require('../models/visit');
const PlanVisit = require('../models/planvisit');
var mongoose = require('mongoose');


exports.CreateVisit = (req, res, next) => {
  const visit = new Visit({
    customer: req.body.customer,
    contact_no: req.body.contact_no,
    remarks: req.body.remarks,
    lat: req.body.lat ? req.body.lat : '0',
    lng: req.body.lng ? req.body.lng : '0',
    creator: req.userData.userId,
    creator_name: req.body.creator_name
  });
  visit.save().then(createdVisit => {
    res.status(201).json({
      message: "Vist added successfully",
      visitId: createdVisit._id
    });
  })
    .catch(error => {
      console.log(error);
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
    creator: req.userData.userId,
    creator_name: req.body.creator_name
  });
  Visit.updateOne({ _id: req.params.id, creator: req.userData.userId }, visit).then(result => {
    if (result.n > 0) {
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

exports.createPlanVisit = (req, res, next) => {
  const visit = new PlanVisit({
    userId: req.body.userId,
    title: req.body.title,
    start: req.body.start,
    end: req.body.end,
    pcolor: req.body.pcolor,
    scolor: req.body.scolor,
    draggable: req.body.draggable,
    resizable: {
      beforeStart: true,
      afterEnd: true,
    }
  });
  visit.save().then(createdVisit => {
    res.status(201).json({
      message: "Plan Vist added successfully",
      visitId: createdVisit._id
    });
  })
    .catch(error => {
      res.status(500).json({
        message: "Creating Plan Visit Failed!"
      });
    });
};

exports.updatePlanVisit = (req, res, next) => {
  const visit = new PlanVisit({
    _id: req.body.id,
    userId: req.body.userId,
    title: req.body.title,
    start: req.body.start,
    end: req.body.end,
    pcolor: req.body.pcolor,
    scolor: req.body.scolor,
    draggable: req.body.draggable,
    resizable: {
      beforeStart: true,
      afterEnd: true,
    }
  });
  PlanVisit.updateOne({ _id: req.params.id, creator: req.userData.userId }, visit).then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: "Plan Visit Update Successfull!" });
    } else {
      res.status(401).json({ message: "Not Authorized!" });
    }
  })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't update the plan visit"
      });
    });
};




exports.getVisits = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const searchValue = req.query.searchValue;
  const period = req.query.period;
  const userId = req.query.userId;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  let postQuery = null;

  if (searchValue && searchValue != 'undefined') {
    console.log('user search');
    postQuery = Visit.find({ customer: new RegExp(searchValue, 'i') });
  } else if (period && period != 'undefined') {
    let date = new Date();
    let firstDay = null;
    let lastDay = null;
    if (period == 'Daily') {

      firstDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      lastDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

    }
    if (period == 'Monthly') {

      firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    }
    if (period == 'Yearly') {
      firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      lastDay = new Date(date.getFullYear(), date.getMonth() + 12, 0);
    }
    console.log('date search')
    /* if (userId != 'undefined') {
      console.log('I am called 2');
      postQuery = Visit.find({ "created_on": { "$gte": firstDay, "$lt": lastDay }, 'creator':  mongoose.Types.ObjectId(userId) });
    }else{
      console.log('I am called 3');
      postQuery = Visit.find({ "created_on": { "$gte": firstDay, "$lt": lastDay } });
    } */
    postQuery = Visit.find({ "created_on": { "$gte": firstDay, "$lt": lastDay } });
  } else if (startDate && endDate && startDate != 'undefined' && endDate != 'undefined') {
    console.log('date search 2')
    postQuery = Visit.find({ "created_on": { "$gte": startDate, "$lt": endDate } });
  }
  else {
    console.log('normal search')
    postQuery = Visit.find();
  }

  let fetchedVisits;
  if (pageSize && currentPage && pageSize != 'undefined' && currentPage != 'undefined') {
    console.log('page search')
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
  }

  postQuery
    .then(documents => {
      console.log(documents)
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
      console.log(error);
      res.status(500).json({
        message: "Fetching Visits Failed!"
      });
    });
};


exports.getPlanVisits = (req, res, next) => {
  const userId = req.query.userId;
  const period = req.query.period;
  let postQuery = null;

  if (userId) {
    postQuery = PlanVisit.find({ customer: new RegExp(searchValue, 'i') });
  } else if (period) {
    let date = new Date();
    let firstDay = null;
    let lastDay = null;
    if (period == 'Monthly') {

      firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    }
    if (period == 'Yearly') {
      firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      lastDay = new Date(date.getFullYear(), date.getMonth() + 12, 0);
    }
    postQuery = PlanVisit.find({ "created_on": { "$gte": firstDay, "$lt": lastDay } });
  }
  else {
    postQuery = PlanVisit.find();
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
      return PlanVisit.count();
    }).then(count => {
      res.status(200).json({
        message: "Visits fetched successfully",
        planVisits: fetchedVisits,
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
      res.status(404).json({ message: 'Visit not found!' });
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
    if (result.n > 0) {
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
