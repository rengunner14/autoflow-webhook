// Vercel Serverless Function for Meta Webhook

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'autoflow_verify_12345';

export default async function handler(req, res) {
  // Handle GET request (Meta verification)
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verified!');
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send('Forbidden');
    }
  }

  // Handle POST request (incoming events)
  if (req.method === 'POST') {
    const body = req.body;
    console.log('Received webhook:', JSON.stringify(body, null, 2));

    // Instagram events
    if (body.object === 'instagram') {
      body.entry?.forEach((entry) => {
        // Handle comments
        entry.changes?.forEach((change) => {
          if (change.field === 'comments') {
            console.log('New comment:', change.value);
            // TODO: Process comment and trigger automation
          }
          if (change.field === 'messages') {
            console.log('New message:', change.value);
            // TODO: Process DM and trigger automation
          }
        });

        // Handle messaging
        entry.messaging?.forEach((event) => {
          if (event.message) {
            console.log('DM received:', event.message.text);
            // TODO: Auto-reply logic here
          }
        });
      });
    }

    // Facebook/Messenger events
    if (body.object === 'page') {
      body.entry?.forEach((entry) => {
        entry.messaging?.forEach((event) => {
          if (event.message) {
            console.log('Messenger message:', event.message.text);
            // TODO: Process and auto-reply
          }
        });
      });
    }

    return res.status(200).send('EVENT_RECEIVED');
  }

  return res.status(405).send('Method not allowed');
}