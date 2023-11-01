const dhlchargemodel = require("../models/dhlcharges.model");
const { getExpressRates } = require("./trade.controller");

let type = "";
let DHLshipmentcharges = {
  elevatedrisk: 0,
  restricteddestination: 0,
  fuelsurcharge: 0,
  nonstackable: 0,
};
let MWLshipmentcharges = {
  elevatedrisk: 0,
  restricteddestination: 0,
  fuelsurcharge: 0,
  nonstackable: 0,
};
// let itemcharges = { overweight: 0, oversize: 0 };
let DHLlastcharges = [];
let MWLlastcharges = [];

const getAllCharges = async (req, res) => {
  try {
    let { tradetype, pickup, dropoff, stackable, items } = req.body;
    const DHLcharges = await dhlchargemodel.find({});
    const MWLcharges = await dhlchargemodel.find({});
    // res.status(200).json(charges);
    type = pickup === dropoff ? "domestic" : "international";

    for (let element of items) {
      if (element.natureOfPackage === false) {
        element.natureOfPackage = 950;
      } else {
        element.natureOfPackage = 0;
      }
    }

    //DHL CHARGES---
    for (let obj of DHLcharges) {
      if (tradetype == 1) {
        //Import
        if (obj.elevatedrisk.countries.includes(pickup)) {
          DHLshipmentcharges.elevatedrisk += parseInt(obj.elevatedrisk.price);
        }
        if (obj.restricteddestination.countries.includes(pickup)) {
          DHLshipmentcharges.restricteddestination += parseInt(
            obj.restricteddestination.price
          );
        }
      } else {
        if (obj.elevatedrisk.countries.includes(dropoff)) {
          DHLshipmentcharges.elevatedrisk = parseInt(obj.elevatedrisk.price);
        }
        if (obj.restricteddestination.countries.includes(dropoff)) {
          DHLshipmentcharges.restricteddestination += parseInt(
            obj.restricteddestination.price
          );
        }
      }

      stackable == false
        ? (DHLshipmentcharges.nonstackable += parseInt(
            obj.nonstackable.price[`${type}`]
          ))
        : (DHLshipmentcharges.nonstackable = 0);

      for (let package of items) {
        let itemcharges = { overweight: 0, oversize: 0 };

        parseInt(package.weight) > 70
          ? (itemcharges.overweight += parseInt(
              obj.overweight.price[`${type}`]
            ))
          : (itemcharges.overweight = 0);

        parseInt(package.length) > 120
          ? (itemcharges.oversize = parseInt(obj.oversize.price[`${type}`]))
          : (itemcharges.oversize += 0);

        parseInt(package.width) > 120
          ? (itemcharges.oversize = parseInt(obj.oversize.price[`${type}`]))
          : (itemcharges.oversize += 0);

        parseInt(package.height) > 120
          ? (itemcharges.oversize = parseInt(obj.oversize.price[`${type}`]))
          : (itemcharges.oversize += 0);

        DHLlastcharges.push(itemcharges);
      }
    }

    // MWL CHARGES
    for (let obj of MWLcharges) {
      if (tradetype == 1) {
        //Import
        if (obj.elevatedrisk.countries.includes(pickup)) {
          MWLshipmentcharges.elevatedrisk += parseInt(obj.elevatedrisk.price);
        }
        if (obj.restricteddestination.countries.includes(pickup)) {
          MWLshipmentcharges.restricteddestination += parseInt(
            obj.restricteddestination.price
          );
        }
      } else {
        if (obj.elevatedrisk.countries.includes(dropoff)) {
          MWLshipmentcharges.elevatedrisk = parseInt(obj.elevatedrisk.price);
        }
        if (obj.restricteddestination.countries.includes(dropoff)) {
          MWLshipmentcharges.restricteddestination += parseInt(
            obj.restricteddestination.price
          );
        }
      }

      stackable == false
        ? (MWLshipmentcharges.nonstackable += parseInt(
            obj.nonstackable.price[`${type}`]
          ))
        : (MWLshipmentcharges.nonstackable = 0);

      for (let package of items) {
        let itemcharges = { overweight: 0, oversize: 0 };

        parseInt(package.weight) > 70
          ? (itemcharges.overweight += parseInt(
              obj.overweight.price[`${type}`]
            ))
          : (itemcharges.overweight = 0);

        parseInt(package.length) > 120
          ? (itemcharges.oversize = parseInt(obj.oversize.price[`${type}`]))
          : (itemcharges.oversize += 0);

        parseInt(package.width) > 120
          ? (itemcharges.oversize = parseInt(obj.oversize.price[`${type}`]))
          : (itemcharges.oversize += 0);

        parseInt(package.height) > 120
          ? (itemcharges.oversize = parseInt(obj.oversize.price[`${type}`]))
          : (itemcharges.oversize += 0);

        MWLlastcharges.push(itemcharges);
      }
    }

    // SENDING RESPONSE
    res.status(200).json({
      messsage: "Data Succesfully Found",
      data: [
        {
          title: "DHL",
          peritemcharges: DHLlastcharges,
          wholeshipmentcharges: DHLshipmentcharges,
        },
        {
          title: "MWL",
          peritemcharges: MWLlastcharges,
          wholeshipmentcharges: MWLshipmentcharges,
        },
      ],
      items: items,
    });
    DHLlastcharges.length = 0;
    DHLshipmentcharges = {
      elevatedrisk: 0,
      restricteddestination: 0,
      fuelsurcharge: 0,
      nonstackable: 0,
    };
    MWLlastcharges.length = 0;
    MWLshipmentcharges = {
      elevatedrisk: 0,
      restricteddestination: 0,
      fuelsurcharge: 0,
      nonstackable: 0,
    };
  } catch (error) {
    console.error("Error while fetching charges:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllCharges,
};
