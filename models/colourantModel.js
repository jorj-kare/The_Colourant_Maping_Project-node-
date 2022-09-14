const mongoose = require("mongoose");
const User = require("./userModel");
const colourantSchema = new mongoose.Schema(
  {
    pigment: {
      type: [String],
      required: [true, "This field is required."],
    },
    chronology: {
      start: { type: Number, required: [true, "This field is required."] },
      end: { type: Number, required: [true, "This field is required."] },
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
      required: [true, "This field is required."],
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
  { pigment: 1, categoryOfFind: 1, analyticalTechniques: 1 },
  { collation: { locale: "en", strength: 1, alternate: "shifted" } }
);

// colourantSchema.pre(/^delete/, async function (next) {
//   //TODO: if delete an entry to deleted also from the user entries array
// });

const Colourant = mongoose.model("Colourant", colourantSchema);
module.exports = Colourant;
