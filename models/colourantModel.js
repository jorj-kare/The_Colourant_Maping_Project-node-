const mongoose = require("mongoose");
const User = require("./userModel");
const colourantSchema = new mongoose.Schema(
  {
    colourants: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "This field is required.",
      },
    },
    chronology: {
      start: { type: Number },
      end: { type: Number },
    },
    location: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      certainProvenance: Boolean,
    },
    analyticalTechniques: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "This field is required.",
      },
    },
    categoryOfFind: {
      type: String,
      required: [true, "This field is required."],
    },
    archeologicalContext: {
      type: String,
    },
    references: {
      type: String,
    },
    notes: {
      type: String,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    contributor: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    edited: [{ at: Date, from: String, log: String }],
  },
  { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);
colourantSchema.pre("save", async function (next) {
  if (!this.isNew) return next();
  await User.findByIdAndUpdate(this.contributor._id, {
    $push: { entries: this._id },
  });

  next();
});
colourantSchema.index(
  { colourants: 1, categoryOfFind: 1, analyticalTechniques: 1 },
  { collation: { locale: "en", strength: 1, alternate: "shifted" } }
);

// When an entry is deleted delete  it also from the user entries array
colourantSchema.post("findOneAndRemove", async function (doc) {
  const user = await User.findById(doc.contributor.toString());
  user.entries.forEach((entry, i) => {
    if (entry.toString() === doc._id.toString()) user.entries.splice(i, 1);
  });
  await user.save({ validateBeforeSave: false });
});

const Colourant = mongoose.model("Colourant", colourantSchema);
module.exports = Colourant;
