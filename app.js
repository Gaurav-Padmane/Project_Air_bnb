const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");



const port = 8080;
mongo_url = 'mongodb://127.0.0.1:27017/wanderlust';

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err)
    });

async function main() {
    await mongoose.connect(mongo_url);
}

// set view engine && joint the path 

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Home root 

app.get("/", (req, res) => {
    res.send("Hello World");
});

// show all listings && and add btn

app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

// Create route btn
app.get("/listings/new" ,(req ,res ) => {
res.render("listings/new.ejs");
});

//  show listing detail. 

app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

// create new listings

app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

// Render the edit form

app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit", { listing }); 
});


// Change in Data base name and edit

app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

// Delete Route

app.delete("listings/:id", async (req , res) => {
    let { id } = req.params
 let deleteList = await Listing.findByIdAndDelete(id);
 console.log(deleteList);
  res.redirect("/listings");
});












































// app.get("/testing", async (req, res) => {
//     let sampleLesting = new Listing({
//         title: "My villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });
//     await sampleLesting.save();
//     console.log("data saved");
//     res.send("Successful testing");
// });


// server is on or not 
app.listen(port, () => {
    console.log(`app listen to ${port}`);
});
