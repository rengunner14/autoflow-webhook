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
    }
    return res.status(403).send('Forbidden');
  }

  // Handle POST request (incoming events from Meta)
  if (req.method === 'POST') {
    const body = req.body;
    console.log('Received webhook:', JSON.stringify(body, null, 2));

    // Instagram events
    if (body.object === 'instagram') {
      body.entry?.forEach((entry) => {
        entry.changes?.forEach((change) => {
          if (change.field === 'comments') {
            console.log('New comment:', change.value);
          }
          if (change.field === 'messages') {
            console.log('New message:', change.value);
          }
        });

        entry.messaging?.forEach((event) => {
          if (event.message) {
            console.log('DM received:', event.message.text);
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
          }
        });
      });
    }

    return res.status(200).send('EVENT_RECEIVED');
  }

  // Default response for other methods (like browser visit)
  return res.status(200).send('AutoFlow Webhook Server is running');
}