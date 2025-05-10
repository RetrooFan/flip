# flip-recruitment-job

## Table of contents

- [Services](#services)
- [How to run it](#how-to-run-it)

## Services

The project contains of 3 microservices in 3 separate docker containers.
1. [s0DataProvider](#s0DataProvider)
2. [s1DataAnalyzer](#s1DataAnalyzer)
3. [s2MetricsProvider](#s2MetricsProvider)

### s0DataProvider

This service acts as a data provider.</br>
In real life we would receive new orders in a chronological order,
so i decided to create a service responsible for providing data,
because data from [DataSource API](https://recruitment-api.dev.flipfit.io/orders?_page=1&_limit=100) are not sorted.</br>
The purpose of this service is to load all data from DataSource API, sort it and then serve it in a controllable way (described below).</br>
This service uses only `flipS0DataProvider` MongoDB database.

### s1DataAnalyzer

This service's job is analyzing all currently available data.</br>
It queries each 20 seconds for new data and updates statistics of each product.</br>
This service uses only `flipS1DataAnalyzer` MongoDB database.

### s2MetricsProvider

This service is responsible only for providing endpoints for checking statistics.</br>
They are described below.</br>
This service uses only `flipS1DataAnalyzer` MongoDB database, so the same one as `s1DataAnalyzer` service.

## How to run it

1. Just simply run file `RUNME-dev.sh` for development environment, or if you want, `RUNME-prod.sh` for production environment.</br>
3 containers mentioned above will rise up.</br>

2. To start analyzing data, firstly you need to load all data from DataSource API:

- [Load pages 1 - 10](http://localhost:3000/load?startPage=1&endPage=10)
- [Load pages 11 - 20](http://localhost:3000/load?startPage=11&endPage=20)
- [Load pages 21 - 30](http://localhost:3000/load?startPage=21&endPage=30)
- [Load pages 31 - 40](http://localhost:3000/load?startPage=31&endPage=40)
- [Load pages 41 - 41](http://localhost:3000/load?startPage=41&endPage=41)

If you want, you can load only some of this data.</br>
Don't try to run these in parallel, there is a protection against that. :smile:</br>
Limit for page was set for 500 items, so there is 41 pages for 20001 items in DataSource API.

3. Go to MongoDB `dateofvisibleorders` collection in `flipS0DataProvider` database,
and change the `value` property to desired date (this controls how many orders are served by `s0DataProvider` service).</br>
This was implemented to test `s1DataAnalyzer` easily.</br>
You can set for example `2023-01-01T00:00:00.000+00:00` to serve all gathered data.</br>

4. Now `s1DataAnalyzer` service started receiving data from `s0DataProvider` (it's querying it each 20 seconds).</br>
Each time `s1DataAnalyzer` receives any data, it updates statistics of each product.</br>
You can also provide unsorted data to this service, but in such case `orderCountToday` and `orderCountYesterday` will not contain valid data.

5. You can check current statistics under following endpoints:
- [top10SalesValue](http://localhost:3002/top10SalesValue)
- [top10OrderCount](http://localhost:3002/top10OrderCount)
- [top10OrderCountYesterday](http://localhost:3002/top10OrderCountYesterday)
