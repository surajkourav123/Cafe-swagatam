const http = require('http');

http.get('http://localhost:3000/admin/login', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (data.includes('Rendered more hooks')) {
      console.log('HOOK ERROR FOUND IN SSR HTML!');
    } else {
      console.log('No hook error in SSR. Response length:', data.length);
    }
  });
}).on('error', err => {
  console.log('Error fetching:', err.message);
});
