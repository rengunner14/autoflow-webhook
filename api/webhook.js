export default function handler(req, res) {
  const VERIFY_TOKEN = 'autoflow_verify_12345';

  // GET request - Meta verification
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

  // POST request - Incoming events
  if (req.method === 'POST') {
    console.log('Received webhook:', JSON.stringify(req.body, null, 2));
    return res.status(200).send('EVENT_RECEIVED');
  }

  // Default response
  return res.status(200).send('AutoFlow Webhook is running');
}
