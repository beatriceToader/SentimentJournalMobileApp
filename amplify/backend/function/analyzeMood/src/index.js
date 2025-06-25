const AWS = require('aws-sdk');
//import AWS from 'aws-sdk';
const comprehend = new AWS.Comprehend();

exports.handler = async (event) => {
  const { text } = JSON.parse(event.body);

  const params = {
    LanguageCode: 'en',
    Text: text,
  };

  try {
    const result = await comprehend.detectSentiment(params).promise();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sentiment: result.Sentiment,
        scores: result.SentimentScore,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
