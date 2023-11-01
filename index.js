require("dotenv").config();
require("./config/db");
const express = require("express");
const cors = require("cors");
const users = require("./routes/users");
const trade = require("./routes/trade");
const morgan = require("morgan");
const app = express();
const yaml = require("yamljs");
const swaggerJsdoc = yaml.load("./config/swagger.yaml");
const swaggerUI = require("swagger-ui-express");
const { errorHandler } = require("./handler/errorHandler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);
const Trade = require("./models/trade.model");
const emergencycharges = require("./routes/emegency");
const dhlcharges = require("./routes/dhlcharges");

const { MongoClient } = require("mongodb");

const uri = process.env.DATABASE;
const client = new MongoClient(uri);

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerJsdoc));
app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use("/users", users);
app.use("/trade", trade);
app.use("/charges", emergencycharges);
app.use("/", dhlcharges);
app.get("/test", (req, res) => {
  res.send("hello");
});
app.use(errorHandler);

async function insertData(session, tradeId) {
  try {
    const db = client.db("test"); // Replace with your actual database name
    const existingTrade = await Trade.findByIdAndUpdate(tradeId, {
      sessionId: session,
    });
    if (existingTrade) {
      console.log("Data updated successfully");
    }
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}

// app.post("/api/stripe/charge", async (req, res) => {
//   console.log("hello")
//   const {userId}=req?.body;
//     try {

//     const charge = await stripe.charges.create({
//       amount: req?.body?.price,
//       currency: req?.body?.currency,
//       source: req?.body?.token,
//       //customer: req.body.custom_id

//     });
// insertData(userId,charge.id)
//     console.log('90909909', charge)

//     res.send({message: 'Success'})
//     if (!charge) throw new Error("charge unsuccessful");
//     } catch (error) {
//         console.log('mmmmmmmm', error)
//         return res.send({ message: error})
//     }
//   });

app.get("/api/getPaymentDetails", async (req, res) => {
  const { sessionId } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid") {
      const paymentIntentId = session.payment_intent;
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );
      // Use paymentIntentId as your transaction ID
      // console.log('Transaction ID:', paymentIntentId);
      console.log(paymentIntent);
    } else {
      console.log("Payment not yet completed.");
    }
  } catch (error) {
    console.error("Error retrieving session:", error.message);
  }
});

app.post("/api/create-checkout-session", async (req, res) => {
  const { product, customerId, tradeId } = req.body;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer: customerId,
    line_items: [
      {
        price_data: {
          currency: "AED",
          product_data: {
            name: product.name,
          },
          unit_amount: product.price * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:3000/quote",
    cancel_url: "http://localhost:3000/quote",
  });
  res.json({ id: session.id });
  insertData(session.id, tradeId);
  //console.log(product,userId)
});

// Call the function with the Checkout Session ID
//getTransactionId(session.id);
// });

console.log(process.env.WEBSITE_LINK);
const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Server running on port ${port}`));
