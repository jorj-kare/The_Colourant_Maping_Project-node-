const csv = require("csv-express");
const {
  Parser,
  transforms: { unwind },
} = require("json2csv");
const Colourant = require("../models/colourantModel");
const CustomError = require("../utils/customError");
const { customAlphabet } = require("nanoid");
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
    contributorFields = "username firstName lastName affiliation email";
  } else contributorFields = "username firstName lastName affiliation ";

  await Colourant.populate(data, {
    path: "contributor",
    select: contributorFields,
  });

  res.status(200).json({
    status: "success",
    data,
  });
};

// exports.getColourant = async (req, res, next) => {
//   try {
//     const data = await Colourant.findById(req.params.id);

//     if (!data)
//       return next(new CustomError("No colourant found with this ID."), 404);
//     res.status(200).json({
//       status: "success",
//       data,
//     });
//   } catch (err) {
//     next(err);
//   }
// };
exports.getColourant = async (req, res, next) => {
  try {
    let contributorFields;

    const data = await Colourant.findOne({ uniqueId: req.params.id });
    if (req.user && req.user.role === "admin") {
      contributorFields = "username firstName lastName affiliation email";
    } else contributorFields = "username firstName lastName affiliation ";

    await Colourant.populate(data, {
      path: "contributor",
      select: contributorFields,
    });

    if (!data)
      return next(new CustomError("No colourant found with this ID."), 404);
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
    const currentEntryId = req.body.uniqueId;

    const userEntriesIds = req.user.entries.map((entry) => entry.uniqueId);

    // Allow only to the admin or the user that had created the entry to updated it.
    if (req.user.role !== "admin" && !userEntriesIds.includes(currentEntryId))
      return next(
        new CustomError(
          "Only the user that created this entry can edit it.",
          401
        )
      );

    const data = await Colourant.findOneAndUpdate(
      { uniqueId: req.body.uniqueId },
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

exports.deleteColourant = async (req, res, next) => {
  try {
    const colourant = await Colourant.findOneAndDelete({
      uniqueId: req.params.id,
    });
    if (!colourant)
      return next(new CustomError("No colourant found with this ID"));

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.exportDataToCsv = async (req, res, next) => {
  try {
    const d = new Date();

    const day = d.toLocaleString("en-CA", { day: "2-digit" });
    const month = d.toLocaleString("en-CA", { month: "2-digit" });
    const year = d.toLocaleString("en-CA", { year: "numeric" });

    const date = year + month + day;
    const fileName = `CMP_data_${date}.csv`;
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
    const data = await Colourant.find(filters).populate("contributor").lean();
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
