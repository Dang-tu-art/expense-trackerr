const http = require('http');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ0ZXN0dXNlcmJvdCIsImVtYWlsIjoidGVzdHVzZXJib3RAZXhhbXBsZS5jb20iLCJpYXQiOjE3ODAyODUyNTIsImV4cCI6MTc4MDMxNDA1Mn0.eP1i2dt-wN0CLdK_UWx1GXqdXUgAj4JbptOcP34Q6jY';
const data = JSON.stringify({ amount: 20000, description: 'Test update expense', category: 'Test', date: '2026-06-01' });
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/expenses',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
    'Authorization': 'Bearer ' + token
  }
};
const req = http.request(options, res => {
  let body='';
  res.on('data', c=>body+=c);
  res.on('end', async ()=>{
    console.log('create status', res.statusCode, body);
    if (res.statusCode===201) {
      const expense = JSON.parse(body);
      const updateData = JSON.stringify({ amount: 25000, description: 'Updated test expense', category: 'Test updated', date: '2026-06-02' });
      const opt2 = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/expenses/' + expense.id,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(updateData),
          'Authorization': 'Bearer ' + token
        }
      };
      const req2 = http.request(opt2, res2 => {
        let body2='';
        res2.on('data', c=>body2+=c);
        res2.on('end', ()=>{
          console.log('update status', res2.statusCode, body2);
        });
      });
      req2.on('error', e=>console.error('update error', e));
      req2.write(updateData);
      req2.end();
    }
  });
});
req.on('error', e=>console.error('create error', e));
req.write(data);
req.end();
