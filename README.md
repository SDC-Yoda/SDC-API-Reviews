# Ratings and Reviews API for AMAZAM

This project entailed optimizing the back-end infrastructure of the e-commerce website, AMAZAM, in order to handle the increased web traffic that could no longer be supported by their previous architecture. This was for the ratings and reviews section of the AMAZAM page.

### 📈 Server Optimization
I re-designed the architecture from the single server model to the following:
- one Nginx load balancer server
- three web-servers
- one dedicated database server

<p align="center"><img width="750" alt="AMAZAM-SDC Architecture Diagram" src="https://user-images.githubusercontent.com/104800030/217927885-bb589741-93bb-4ac9-9528-d4a31da715dc.png"></p>

### 🐘 Database Optimization
After completing the ETL (extract, transfer, and load) process from CSV files by loading the data onto a Postgres relational database, I implemented indexing techniques on key columns to improve query performance.

The most robust query consisted of retrieving product review meta data. The initial search time prior to indexing was 9.5 seconds and was decreased to 720ms.
> **Resulted in 92% faster retrieval time.**

In addition to indexing, I also modified the queries to be more efficient by writing larger query using Postgres’ object builder and aggregate functions rather than multiple smaller queries and doing the aggregation as part of the server-side logic.

<p align="center"><em>Querying review metadata pre-indexing</em></p>
<p align="center"><img width="750" src="https://user-images.githubusercontent.com/104800030/217942828-af11a51b-53e1-4624-8508-d7e6bfab19e2.png" alt="Querying review metadata pre-indexing"/></p>

<br></br>

<p align="center"><em>Querying review metadata post-indexing</em></p>
<p align="center"><img width="750" src="https://user-images.githubusercontent.com/104800030/217942842-094e6871-4f19-4b3d-bba9-80dca1636a95.png" alt="getReviewMeta pre-indexing" alt="Querying review metadata post-indexing"/></p>

### Results
After implementing the database and server-side performance optimization techniques, I logged the following metrics:
#### Response Times Pre Load-Balancing
| Route 	| Throughput (RPS over 30 secs) 	| Latency (Avg. response time) 	| Error Rate 	|
|---	|---	|---	|---	|
| GET reviews 	| 100 	| 18 ms 	| 2% 	|
| GET reviews 	| 1000 	| 2189 ms 	| 30% 	|
| GET reviews/meta 	| 100 	| 21 ms 	| 0% 	|
| GET reviews/meta 	| 1000 	| 6025 ms 	| 73% 	|
| POST reviews 	| 100 	| 28 ms 	| 2% 	|
| POST reviews 	| 1000 	| 5707 ms 	| 75% 	|

#### Response Times Post Load-Balancing
| Route 	| Throughput (RPS over 30 secs) 	| Latency (Avg. response time) 	| Error Rate 	|
|---	|---	|---	|---	|
| GET reviews 	| 1000 	| 13 ms 	| 0% 	|
| GET reviews 	| 2250 	| 23 ms 	| < .001 % 	|
| GET reviews/meta 	| 100 	| 17 ms 	| 2% 	|
| GET reviews/meta 	| 500 	| 755 ms 	| 20% 	|
| POST reviews 	| 100  	| 23 ms 	| 0% 	|
| POST reviews 	| 500 	| 188 ms 	| 37% 	|

