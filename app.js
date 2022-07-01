const express = require("express");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const viewsRoutes = require("./routes/viewsRoutes");
const usersRoutes = require("./routes/usersRoutes");
const colourantsRoutes = require("./routes/colourantsRoutes");
const CustomError = require("./utils/customError");
const globalErrorHandler = require("./controllers/errorController");
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.json({ limit: "10kb" }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const scriptSrcUrls = [
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://events.mapbox.com/",
  "https://api.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v1.0.0/leaflet.markercluster.js",
];
const styleSrcUrls = [
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
  "https://api.geoapify.com/",
];
const fontSrcUrls = ["fonts.googleapis.com", "fonts.gstatic.com"];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: ["'self'", "blob:", "data:"],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use("/", viewsRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/colourants", colourantsRoutes);

// Handle unexpected routes for all kind of requests.
app.all("*", (req, res, next) => {
  const error = new CustomError(
    `Can't find ${req.originalUrl} on this server.`,
    404
  );
  next(error);
});
// Error handling middleware.
app.use(globalErrorHandler);
module.exports = app;
