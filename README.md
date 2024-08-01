# Hadith and Ravis Analysis Project

![dashboard](public/mock1.png)
![dashboard](public/mock2.png)
![dashboard](public/mock3.png)  
![dashboard](public/mock4.png)  
![dashboard](public/mock6.png)  

This project involves scraping and analyzing hadiths and their narrators (ravis) from [Hadis Veritabanı](https://www.hadisveritabani.info/).

  

## Data Overview

  

-  **Hadith Count:** 284,363

-  **Ravis Count:** 13,595

  

#### Hadith Example

  

```text
id,arabic,turkish,musannif,book,topic,chain,page_index
6b6be2db-2159-49d1-b8b5-886f25724268, حَدَّثَنَا أَبُو بَكْرِ بْنُ أَبِى شَيْبَةَ حَدَّثَنَا عَبْدُ اللَّهِ بْنُ إِدْرِيسَ عَنْ إِسْمَاعِيلَ بْنِ أَبِى خَالِدٍ عَنْ قَيْسِ بْنِ أَبِى حَازِمٍ قَالَ دَخَلْنَا عَلَى خَبَّابٍ وَقَدِ اكْتَوَى سَبْعَ كَيَّاتٍ فِى بَطْنِهِ فَقَالَ لَوْمَا أَنَّ رَسُولَ اللَّهِ صلى الله عليه وسلم نَهَانَا أَنْ نَدْعُوَ بِالْمَوْتِ لَدَعَوْتُ بِهِ ., Müslim, Sahîh-i Müslim, "KTB, ÖLÜM", 136; 778; 85; 688; 52, 6.4

```

#### Ravi Example

  

```text

ravi_id, narrator_name, tribe, nisbesi, degree, reliability

1,Süfyân b. Uyeyne b. Meymûn,Âmir b. Sa'sa',"el-Hilâlî, el-Kûfî, el-Mekkî",Etbau'-Tabiîn,"Sika, hafız, hüccet"

```

  

## Aim

  

The goal of this project is to analyze hadiths by grouping them based on the ravis' tribe, degree of confidence, and other attributes.

  

## Tech Stack

  

-  **Data Scraping:** Python with BeautifulSoup

-  **Database:** PostgreSQL

-  **Frontend:** React

-  **Backend:** .NET V8.0

-  **Data Visualization:** Chart.js, Leaflet

-  **Other Tools:** Axios

  

## Setup and Usage

  

### Prerequisites

  

- .NET V8.0

- PostgreSQL

- Python

- React
  

### Installation

  

1.  **Clone the repository:**

  

```sh

git clone https://github.com/ahmethedev/hadith_analysis.git

cd hadith_analysis

```


  

2.  **Install frontend dependencies:**

  

```sh

cd ../frontend

npm install

```

 3.  **Backend Startup :**

  

```sh

cd ../backend_dotnet


```
 
 You need to create appsetting.cs inorder to create connection string for db.


4.  **Set up the database:**

  

- Create a PostgreSQL database and update the connection details in your backend configuration.

  

5.  **Run the backend server:**

  

```sh

run program.cs
```

  

6.  **Run the frontend server:**

  

```sh

cd ../frontend

npm start

```

  

### Data Scraping

  

- The data scraping scripts are written in Python using BeautifulSoup. Ensure you have Python installed, then run the scraping scripts to gather data from the source website.

- You can access to the scraper and the zipped data in /scraping_and_data 

  

### Data Analysis and Visualization

  

- Data analysis and visualization are done using Chart.js integrated with the React frontend. The backend handles the data fetching and serves the API endpoints.

  

  

## Contributing

  

Feel free to submit issues, fork the repository, and send pull requests. For major changes, please open an issue first to discuss what you would like to change.

  

## License

  

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
