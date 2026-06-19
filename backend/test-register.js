const http = require('http');
const data = JSON.stringify({ username: 'testuserbot', email: 'testuserbot@example.com', password: 'Password123!' });
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};
const req = http.request(options, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('status', res.statusCode);
    console.log(body);
  });
});
req.on('error', e => console.error('request error', e));
req.write(data);
req.end();
