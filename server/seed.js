const mongoose = require("mongoose");
const Classification = require("./models/classificationModel");

mongoose
  .connect(
    "mongodb+srv://sorayuthjaapanya:ErBzp9NDvv0sWH7t@cluster0.zp0dzoy.mongodb.net/yamleaves_db?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("MongoDB connected!");
    return Classification.insertMany(mockData);
  })
  .then(() => {
    console.log("Mock data inserted successfully.");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error:", err);
    mongoose.connection.close();
  });

const mockData = [
  {
    userId: "680c77e9a70469267a017935",
    imageUrl: "/uploads/image-1746762898542-808995598.jpg",
    allpredicted: ["yam type A", "yam type B", "yam type C"],
    bestpredicted: "yam type A",
    confidenceScore: 92.7,
    latitude: 13.7563,
    longitude: 100.5018,
  },
];

Classification.insertMany(mockData)
  .then(() => {
    console.log("Mock data inserted successfully.");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error inserting mock data:", err);
    mongoose.connection.close();
  });
