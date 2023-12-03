import http from "k6/http";
import { check, sleep } from "k6";

const ENDPOINT = "http://dijo-2107789793.us-east-1.elb.amazonaws.com/api/v1";
const AUTH_KEY = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY4NTkzMzU0NCwianRpIjoiOGNlY2M5MTItY2E3Mi00YjVkLTg5OWItMmJiMTg4ZWUwODlkIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjFhNTk4NTc5LTMyYTctNGVhMC05YjZkLTcyMjFhZWYyMTIwOCIsIm5iZiI6MTY4NTkzMzU0NCwiZXhwIjoxNjg1OTUxNTQ0fQ.Pk6UyQfytFs7YmrInu8rqxXXegN-Y_b8-25Tiy8qdHY"
const PAGE_CONTENT = `[{"id":1,"type":"Image","src":"https://hips.hearstapps.com/hmg-prod/images/small-fuffy-dog-breeds-1623362663.jpg","container":{"top":297,"left":37,"width":500,"height":300,"rotation":346.67647301403485}},{"id":2,"type":"Text","text":"Wow this is some amazing content","colour":"black","size":40,"focus":false,"container":{"top":53,"left":45,"width":850.2249908447266,"height":158.99999618530273,"rotation":0}},{"id":3,"type":"Rectangle","colour":"#AF69ED","container":{"top":32,"left":13,"width":804.2249908447266,"height":126.99999618530273,"rotation":0}},{"id":5,"type":"Video","src":"https://crichdplayer.xyz/embed2.php?id=osncric","container":{"top":168,"left":726,"width":282.22499084472656,"height":202.99999618530273,"rotation":34.87597782549215}},{"id":10,"type":"Text","text":"Welcome to DIJO","colour":"black","size":100,"focus":false,"container":{"top":-61,"left":26,"width":1000,"height":300,"rotation":0}},{"id":13,"type":"Text","text":"Wow this is really cool!","colour":"black","size":40,"focus":true,"container":{"top":146.99999618530273,"left":43.22499084472656,"width":500,"height":100,"rotation":0}}]`
const PAGE_CONTENT_2 = `[{"id":2,"type":"Image","src":"https://hips.hearstapps.com/hmg-prod/images/small-fuffy-dog-breeds-1623362663.jpg","container":{"top":297,"left":37,"width":500,"height":300,"rotation":346.67647301403485}},{"id":2,"type":"Text","text":"Wow this is some amazing content","colour":"black","size":40,"focus":false,"container":{"top":53,"left":45,"width":850.2249908447266,"height":158.99999618530273,"rotation":0}},{"id":3,"type":"Rectangle","colour":"#AF69ED","container":{"top":32,"left":13,"width":804.2249908447266,"height":126.99999618530273,"rotation":0}},{"id":5,"type":"Video","src":"https://crichdplayer.xyz/embed2.php?id=osncric","container":{"top":168,"left":726,"width":282.22499084472656,"height":202.99999618530273,"rotation":34.87597782549215}},{"id":10,"type":"Text","text":"Welcome to DIJO","colour":"black","size":100,"focus":false,"container":{"top":-61,"left":26,"width":1000,"height":300,"rotation":0}},{"id":13,"type":"Text","text":"Wow this is really cool!","colour":"black","size":40,"focus":true,"container":{"top":146.99999618530273,"left":43.22499084472656,"width":500,"height":100,"rotation":0}}]`
const NOTEBOOK = "8271cd31-283e-4cc6-a89e-73e5e1969688"

export function ticketPurchaser() {
   let url = `${ENDPOINT}/notebooks`;

   const payload = JSON.stringify({
      "title": "Title",
      "content": PAGE_CONTENT
   });

   const payload2 = JSON.stringify({
      "title": "Title",
      "content": PAGE_CONTENT_2
   });

   const params = {
      headers: {
         'Content-Type': 'application/json',
         'Authorization': AUTH_KEY
      },
   };

   const params2 = {
      headers: {
         'Authorization': AUTH_KEY
      },
   };

   let request = http.put(`${url}/${NOTEBOOK}/0`, payload, params);
   check(request, {
      'is status 201': (r) => r.status === 201,
   });

   request = http.get(`${url}/${NOTEBOOK}/0`, params2);
   check(request, {
      'is status 200': (r) => r.status === 200,
   });

   console.log(JSON.parse(request.body).content === PAGE_CONTENT)

   check(JSON.parse(request.body).content, {
      'is content correct': (c) => c === PAGE_CONTENT
   })

   //  let request = http.post(`${url}/${NOTEBOOK}`, payload, params); 
   //  check(request, { 
   //     'is status 201': (r) => r.status === 201, 
   //  }); 

   //  console.log(request)

   // request = http.get(`${url}/${NOTEBOOK}`, params2);

   // //  console.log(request)
   // // // console.log(request.body)
   // const pages = JSON.parse(request.body).pages
   // console.log(pages.length)

   //  console.log(JSON.parse(request.body).pages.length)

   //  request = http.get(`${url}/${NOTEBOOK}/0`, params2); 
   //  check(request, { 
   //      'is status 200': (r) => r.status === 200, 
   //   }); 

   //  check(JSON.parse(request.body).content, {
   //      'is content correct': (c) => c === PAGE_CONTENT
   //  })
   //  console.log(JSON.parse(request.body).content === PAGE_CONTENT)

   const firstSleep = Math.floor(Math.random() * (20 - 10 + 1) + 10)

   sleep(firstSleep);

   request = http.put(`${url}/${NOTEBOOK}/0`, payload2, params);
   check(request, {
      'is status 201': (r) => r.status === 201,
   });

   request = http.get(`${url}/${NOTEBOOK}/0`, params2);
   check(request, {
      'is status 200': (r) => r.status === 200,
   });

   console.log(JSON.parse(request.body).content === PAGE_CONTENT_2)

   check(JSON.parse(request.body).content, {
      'is content correct': (c) => c === PAGE_CONTENT_2
   })

   const secondSleep = Math.floor(Math.random() * (20 - 10 + 1) + 10)
   sleep(secondSleep);
}

export const options = {
   scenarios: {
      studier: {
         exec: 'ticketPurchaser',
         executor: "ramping-vus",
         stages: [
            { duration: "1m", target: 10 },
            { duration: "20m", target: 10 }
         ],
      }
   },
};