const csv = require("csv-express");
const {
  Parser,
  transforms: { unwind },
} = require("json2csv");
const Colourant = require("../models/colourantModel");
const CustomError = require("../utils/customError");

exports.createColourant = async (req, res, next) => {
  try {
    if (req.user.role !== "admin" && req.body.checked) delete req.body.checked;
    const newColourant = await Colourant.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        newColourant,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getColourants = async (req, res, next) => {
  const filters = [{}];
  const sortBy = {};
  let contributorFields;
  const {
    colourants,
    categoryOfFind,
    analyticalTechniques,
    centuryStart,
    centuryEnd,
    checked,
    sortCategory,
    sortOrder,
  } = req.query;

  if (checked && checked !== "" && req.user && req.user.role === "admin") {
    filters.push({ checked: checked === "true" });
  } else if (!req.user || (req.user && req.user.role !== "admin")) {
    filters.push({ checked: true });
  }

  if (colourants) filters.push({ colourants });
  if (categoryOfFind) filters.push({ categoryOfFind });
  if (analyticalTechniques) filters.push({ analyticalTechniques });
  if (centuryStart)
    filters.push({
      "chronology.start": { $gte: +centuryStart },
    });

  if (centuryEnd)
    filters.push({
      "chronology.end": {
        $lte: +centuryEnd,
      },
    });

  if (sortCategory) sortBy[sortCategory] = sortOrder * 1;
  else sortBy["chronology"] = -1;

  const data = await Colourant.aggregate(
    [
      {
        $match: {
          $and: filters,
        },
      },
      { $sort: sortBy },
    ],
    { collation: { locale: "en", strength: 2, alternate: "shifted" } }
  );

  if (req.user && req.user.role === "admin") {
    contributorFields = "username firstName lastName affiliation";
  } else contributorFields = "username";

  await Colourant.populate(data, {
    path: "contributor",
    select: contributorFields,
  });

  res.status(200).json({
    status: "success",
    data,
  });
};

exports.getColourant = async (req, res, next) => {
  try {
    const data = await Colourant.findById(req.params.id);

    if (!data)
      return next(new CustomError("No colourant found with this id."), 404);
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateColourant = async (req, res, next) => {
  try {
    const currentEntryId = req.body.id;
    const userEntriesIds = req.user.entries.map((entry) => entry.id);
    // Allow only to the admin or the user that had created the entry to updated it.
    if (req.user.role !== "admin" && !userEntriesIds.includes(currentEntryId))
      return next(
        new CustomError(
          "Only the user that have created this entry can update it.",
          401
        )
      );

    const data = await Colourant.findOneAndUpdate(
      { _id: req.body.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.exportDataToCsv = async (req, res, next) => {
  try {
    const fileName = "entries.csv";
    const filters = {};
    const fields = [
      { label: "Colourant(s)", value: "colourants" },
      { label: "Chronology start", value: "chronology.start" },
      { label: "Chronology end", value: "chronology.end" },
      { label: "Location address", value: "location.address" },
      { label: "Location coordinates", value: "location.coordinates" },
      { label: "Category of find", value: "categoryOfFind" },
      { label: "Analytical techniques", value: "analyticalTechniques" },
      { label: "Archeological context", value: "archeologicalContext" },
      { label: "Notes", value: "notes" },
      { label: "References", value: "references" },
      { label: "Contributor", value: "contributor.username" },
      { label: "Edited ", value: "edited" },
    ];
    const transforms = [unwind({ paths: ["colourants"] })];
    // flatten({ objects: "true", arrays: "false" })
    if (!req.user || (req.user && req.user.role !== "admin"))
      filters.checked = true;
    const data = await Colourant.find().populate("contributor").lean();
    const json2csvParser = new Parser({ fields, transforms });
    const cvs = json2csvParser.parse(data);
    if (!data) return next(new CustomError("No entries found"), 404);
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.status(200).send(cvs);
  } catch (err) {
    next(err);
  }
};
