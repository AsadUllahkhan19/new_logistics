const seaport = require("../models/seaport.model")

const getPortsByCountry = async (req, res) => {
    try {
        const country = req.params.country;
        console.log(country);

        if (!country) {
            return res.status(400).json({ message: "Country name is a required field" });
        }

        // Create a regex pattern for case-insensitive search
        const regexPattern = new RegExp(`^${country}$`, 'i');

        const data = await seaport.find({ country: regexPattern });

        if (data.length === 0) {
            return res.status(404).json({ error: "No seaport found for this country" });
        }

        res.status(200).json({ data: data });
    }
     catch (error) {
        res.status(400).json({ error: error.message });
    }
};



const getAllCountries = async (req, res) => {
    try {

        const countries = await seaport.aggregate([
            {
                $group: {
                    _id: '$country',
                },
            },
            {
                $sort: {
                    _id: 1,
                },
            },
        ])
        if (countries.length === 0) {
            return res.status(404).json({ error: "no country found in the database" })
        }

        const countriesName = countries.map((country) => country._id)
        res.status(200).json({ data: countriesName })
    }


    catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }

}



const searchCountry = async (req, res) => {
    try {
        const searchText = req.params.query;
        const regex = new RegExp(`^${searchText}`, 'i');
        const results = await seaport.find({"country": regex});

        console.log(results,"results")


         res.json({ results });


    }
    catch (error) {
        res.status(500).json({ error: 'An error occured while fetching the data' })
    }

}


const getPorts = async (req,res) => {
	try{
		const city = req?.params?.city
		console.log(city)
		const results = await seaport.find({city})
		console.log(results)
		res.json({
			results
		}).status(200).end()
	}
	catch(e){
        res.status(500).json({ error: 'An error occured while fetching the data' })
	}
}




module.exports = { getPortsByCountry, getAllCountries, searchCountry, getPorts}
