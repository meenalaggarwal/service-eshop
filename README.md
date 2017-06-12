# service-eshop

This is basic version eshopping web API. Whole system is designed based on micro-service architecture and have RESTful API for an online store. It supports addition, deletion, editing and searching a product with authentication.
Only authenticated users can add / view / edit / delete items. Database used is mongodb.

## Setup locally

1. Prerequisites

  * Setup mongodb locally
  * Update config file with mongodb host and port
  
2. Install Dependencies  

  ```
    npm install  
  ```
  
3. Run test cases

  ```
    mocha
  ```
  
4. Start Server
  
  ```
    npm start
  ```