const { Router } = require("express");
const router = Router();

//Raiz
router.get("/", (req, res) => {
  res.json({
    Title: "Wellcome to Generic!",
    Version: "1.0.0",
    Routes: [
      {
        name: "profiles",
        methodsAndPaths: [
          {
            Method: "GET",
            Path: "/profiles",
          },
          {
            Method: "GET",
            Path: "/profiles/:id",
          },
          {
            Method: "POST",
            Path: "/profiles",
          },
          {
            Method: "PUT",
            Path: "/profiles/:id",
          },
          {
            Method: "DELETE",
            Path: "/profiles/:id",
          },
        ],
      },
    ],
  });
});

module.exports = router;
