# IronLog
# Marcel Gabriel Janzer
Mobile first web app for tracking gym workouts.

I managed to introduce a bug in the charts, so they are not wokring properly 
right now. The rest should work and I introduced some additional features that 
I did not plan beforehand. For example, the ability to change the profile picture.

Note: this is tested on chrome with a screen sice of an iphone 12 pro
You can achieve this by opneing the developer console and at the bottom left 
corner change the screen size and choose different phones.

Another Note: I downgraded to Express 4.21.2, since I had some issues with version 5.1.0.
This will be fixed in the future though. 

**Stack:** Express + MongoDB + plain HTML/CSS/JS

**Dependencies:**
 bcrypt,cors,dotenv,express,jsonwebtoken,mongoose,multer

See full documentation in the proposal.

## Quick start

Before you start you need to update the .env in order to point to the right mongoDB 
and also maybe the googleId, I am actually not so sure about this though. Should work 
with my clientid. I used a seed js instead of a init_mongodb to fill the database with 
some dummy data.

```bash
npm install
cp .env.example .env                 
docker-compose up 
node seed_exercises.js                
npm run dev
```

Frontend served at `http://localhost:3000`.


I used to Google Gemini 2.5 Experimental to help out with some css. I had no experiece with touchscreens and 
since we did not cover it in the course, I used AI to help me with the styling. Especially the first part of the 
style.css. Other than that I used many docs and also existing code from other projects I did in the past. 
(routes are usually pretty similar in regards of the structure etc.)



