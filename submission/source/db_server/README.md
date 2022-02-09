# Off-chain Data Storage Server

- [Design Pattern](#Design-Pattern)
- [Getting Started](#Getting-Started)
- [REST API](#rest-api)
  - [Add User](#Add-User)
  - [Get User by ID](#Get-User-by-ID)
  - [Cancel User certification](#Cancel-User-certification)
  - [Add Beef](#Add-Beef)
  - [Get Beef by ID](#Get-Beef-by-ID)
  - [Add Journey](#Add-Journey)
  - [Get Journeies by IDs](#Get-Journeies-by-IDs)
  - [Finish Journey](#Finish-Journey)

# Design Pattern

![Alt text](https://github.com/God-T/Foodchain_Off-chain_DB---Express_Nodejs/blob/main/er.PNG?raw=true "ER Diagram")

# Getting Started

**_\*Note that cd to source/db_server first_**

**Install:**

```
npm install
```

**Init DB:**

```
npm run db-init
```

**Run server:**

```
npm start
```

# Dev Script

**_\*Use to reset and update the db with lastest server version, ori db data will be wiped out_**

**Reset DB:**

```
npm run db-reset
```

# REST API

Off-chain data storage APIs, DB server running on http://localhost:5000

## **Add User**

add a single user data registered by given certifier.

- **`POST` /api/user**

- **Request Body:**
  ```json
  {
    "id_address": "0x00000000000001",
    "name": "RanchFarm AU",
    "type": "Producer",
    "location": "Sydney, NSW",
    "certifier": "some certifier",
    "document_hash": "LS913278DHAS8DH78..."
  }
  ```
- **Success Response:**

  - **Code:** 200 <br />
  - **Content:**
    ```json
    {
      "Message": "Add user 0x00000000000001 successfully"
    }
    ```

- **Error Response:**

  - **Code:** 500 <br />
  - **Content:**
    ```json
    {
      "Message": "Add user failed",
      "Error": "...some errors..."
    }
    ```

## **Get User by ID**

get a single user data by given user id_address.

- **`GET` /api/user/:id_address**

- **URL Params:**

  - **Required:** `id_address=[text]`
  - **Example:** `id_address = "0x00000000000001"`

- **Success Response:**

  - **Code:** 200 <br />
  - **Content:**
    ```json
    {
      "id_address": "0x00000000000001",
      "name": "RanchFarm AU",
      "type": "Producer",
      "location": "Sydney, NSW",
      "certifier": "some certifier",
      "document_hash": "LS913278DHAS8DH78..."
    }
    ```

- **Error Response:**

  - **Code:** 500 <br />
  - **Content:**
    ```json
    {
      "Message": "Unable to get user 0x00000000000001",
      "Error": "...some errors..."
    }
    ```

  OR

  - **Code:** 404 <br />
  - **Content:**
    ```json
    {
      "Message": "No record of user 0x00000000000001"
    }
    ```

## **Cancel User certification**

Cancel user certification.

- **`PTCH` /api/user/:id_address**

- **URL Params:**

  - **Required:** `id_address=[text]`
  - **Example:** `id_address = "0x00000000000001"`

- **Success Response:**

  - **Code:** 200 <br />
  - **Content:**
    ```json
    {
      "Message": "Drop user 0x00000000000001 certification successfully"
    }
    ```

- **Error Response:**

  - **Code:** 500 <br />
  - **Content:**
    ```json
    {
      "Message": "Unable to cancel user 0x00000000000001 certification",
      "Error": "...some errors..."
    }
    ```

  OR

  - **Code:** 404 <br />
  - **Content:**
    ```json
    {
      "Message": "No record of user 0x00000000000001"
    }
    ```

## **Add Beef**

add a single beef data by farm user.

- **`POST` /api/beef**

- **Request Body:**
  ```json
  {
    "product_id": "0x00000000000001:beef",
    "farmer_id": "0x00000000000001:user",
    "price": "1.00",
    "tier": "M5",
    "expiry_date": "24-07-2021"
  }
  ```
- **Success Response:**

  - **Code:** 200 <br />
  - **Content:**
    ```json
    {
      "Message": "Add beef 0x00000000000001 successfully"
    }
    ```

- **Error Response:**

  - **Code:** 500 <br />
  - **Content:**
    ```json
    {
      "Message": "Add beef failed",
      "Error": "...some errors..."
    }
    ```

## **Get Beef by ID**

get a single beef data by given beef id.

- **`GET` /api/beef/:product_id**

- **URL Params:**

  - **Required:** `product_id=[text]`
  - **Example:** `product_id = "0x00000000000001"`

- **Success Response:**

  - **Code:** 200 <br />
  - **Content:**
    ```json
    {
      "product_id": "0x00000000000001:beef",
      "farmer_id": "0x00000000000001:user",
      "price": "1.00",
      "tier": "M5",
      "expiry_date": "24-07-2021"
    }
    ```

- **Error Response:**

  - **Code:** 500 <br />
  - **Content:**
    ```json
    {
      "Message": "Unable to get beef 0x00000000000001",
      "Error": "...some errors..."
    }
    ```

  OR

  - **Code:** 404 <br />
  - **Content:**
    ```json
    {
      "Message": "No record of beef 0x00000000000001"
    }
    ```

## **Add Journey**

add a single journey data by farm user.

- **`POST` /api/journey**

- **Request Body:**
  ```json
  {
    "product_id": "0x00000000000001:beef",
    "user_id": "0x00000000000001:user",
    "start_date": "24-07-2021 00:01",
    "produce_info": "...some info..."
  }
  ```
- **Success Response:**

  - **Code:** 200 <br />
  - **Content:**
    ```json
    {
      "Message": "Add journey successfully"
    }
    ```

- **Error Response:**

  - **Code:** 500 <br />
  - **Content:**
    ```json
    {
      "Message": "Add journey failed",
      "Error": "...some errors..."
    }
    ```

## **Get Journeies by ID**

get all journeies data by given beef id.

- **`GET` /api/journey/:product_id**

- **URL Params:**

  - **Required:** `product_id=[text]`
  - **Example:** `product_id = "0x00000000000001"`

- **Success Response:**

  - **Code:** 200 <br />
  - **Content:**
    ```json
    [
      {
        "product_id": "0x00000000000001:beef",
        "user_id": "0x00000000000001:user",
        "start_date": "24-07-2021 00:01",
        "end_date": "24-07-2021 00:02",
        "produce_info": "...some info..."
      },
      {
        "product_id": "0x00000000000001:beef",
        "user_id": "0x00000000000002:user",
        "start_date": "24-07-2021 00:03",
        "end_date": "",
        "produce_info": "...some info..."
      }
    ]
    ```

- **Error Response:**

  - **Code:** 500 <br />
  - **Content:**
    ```json
    {
      "Message": "Unable to get journey",
      "Error": "...some errors..."
    }
    ```

  OR

  - **Code:** 404 <br />
  - **Content:**
    ```json
    {
      "Message": "No record of journeies"
    }
    ```

## **Finish Journey**

set journey status with end.

- **`PTCH` /api/journey**

- **Request Body:**

  ```json
  {
    "product_id": "0x00000000000001:beef",
    "user_id": "0x00000000000001:user",
    "end_date": "24-07-2021 00:02"
  }
  ```

- **Success Response:**

  - **Code:** 200 <br />
  - **Content:**
    ```json
    {
      "Message": "Journey was end"
    }
    ```

- **Error Response:**

  - **Code:** 500 <br />
  - **Content:**
    ```json
    {
      "Message": "Unable to end journey",
      "Error": "...some errors..."
    }
    ```

  OR

  - **Code:** 404 <br />
  - **Content:**
    ```json
    {
      "Message": "No record of journey"
    }
    ```
