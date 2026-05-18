import https from 'https';
https.get('https://api.microlink.io/?url=' + encodeURIComponent('https://postimg.cc/Sjk2wryn') + '&meta=false&embed=image.url', (res) => {
  console.log(res.statusCode, res.headers.location);
});
