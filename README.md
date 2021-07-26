# An Electronic medical record web app 
This application helps make data collection for medical practitioners easy as breeze.
The application allow practitioners to collect medical record from patients, and in turn patient 
can view collected information about them on their own dashboard.
If the patient want to talk to a medical practictioner, he can have a live chart with a practitioner.
The medical practitioner can filter the patients he/she is interested based on a criteria, e.g age,bmi,gender.
Also, this application will show the statistics of registered patients in the system, that is also live, i.e., anytime a patient data is added or modified, the generated charts will change in accord.

The application follows modern application-design standards of having a centralized back-end
with separate clients. At the back-end I used Nodejs in conjunction with Expressjs to create RESTAPI endpoints.
While at the frontend, I use React to create a fluid UI, which make the web app as though is a native app. Since no reloading is done, which connect to our RESTAPI behind the scene.
## To install locally
1. clone this repository by running :
``` clone https://github.com/jephterSmart/hayok-ecr ```
    on your terminal in the directory you want it installed.

2. change to the directory and ensure there is network, i used an online database.
```cd <Your directory>/backend```
    and run:
```npm install``` to install all the backend dependencies
3. Then you will need some of the environment variable I set at the backend. 
Create a `nodemon.json` file, in that file, put your own custom values where you see the angle brackets(<>)
```
    {
        "env":{
            "PORT":<Port number different from what you use on frontend, i used 8080>,
            "MONGO_URI":<Your Mongo-db uri connect string>,
            "SECRET": <Your personalized secret string key for generating your webtoken>
        }
    }
```
4. Then run: 
``` npm run startDev ```
5. Open another terminal in that same directory you cloned the application, then change directory to:
```cd <Your directory>/clients```
6. In this clients directory, run:
```npm install``` to also all frontend dependencies.
7. Finally, run:
```npm start```

##### disclaimer: This whole application was worked on in six(6) days, so some bug may be lurking around, but I have thoroughly tested it for desktop devices and it is working well. If any issue found, please raise an issue.

### Thank you