const express = require('express');
const axios = require('axios');

//storing all the express methods in a variable named app
const app = express();

//Defining the default provided values 
const PORT = 9876;
const WINDOW_SIZE = 10;
const THIRD_PARTY_API_BASE = 'http://20.244.56.144/test';

let window = [];


//function to fetching the numbers from the provided API
const fetchNumbers = async (numberId) => {
    try {
        const url = `${THIRD_PARTY_API_BASE}/${numberId}`;
        console.log('Fetching numbers from:', url);
        const response = await axios.get(url);
        return response.data.numbers || [];
    } catch (error) {
        console.error('Error fetching numbers:', error.message);
        return [];
    }
};


//function to calculate the Average
const calculateAverage = (numbers) => {
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    return sum / numbers.length || 0;
};


//Getting the request and providing the response
app.get('/numbers/:numberId', async (req, res) => {
    const { numberId } = req.params;
    if (!['p', 'f', 'e', 'r'].includes(numberId)) {
        return res.status(400).json({ error: 'Invalid number ID' });
    }

    const prevWindow = [...window];

    const fetchedNumbers = await fetchNumbers(numberId);
    const uniqueNumbers = fetchedNumbers.filter(num => !window.includes(num));

    window.push(...uniqueNumbers);
    if (window.length > WINDOW_SIZE) {
        window = window.slice(-WINDOW_SIZE);
    }

    

    const currWindow = [...window];
    const avg = calculateAverage(window);

    res.json({ windowPrevState: prevWindow, windowCurrState: currWindow, numbers: uniqueNumbers, avg });
});


//Running The Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});7