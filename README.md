# Backend Project

## Descripción
This backend project was conceived with the main objective of learning and applying key concepts of clean architecture, with an emphasis on Domain-Driven Design (DDD) implementation. In this development process, we explored and used various technologies to create a robust and modular environment.

## Technologies Used

In this project, we have applied Clean Architecture and Domain-Driven Design (DDD) principles, together with the following technologies:

- **Cloudinary:** Cloud storage service for image management.

- **TypeScript:** A typed superset of JavaScript that compiles to standard JavaScript.

- **Express:** Web application framework for Node.js.

- **Node.js:** Execution environment for server-side JavaScript.

- **MercadoPago API:** MercadoPago API for payment management.

- **MongoDB:** NoSQL database used to store data.

These technologies are integrated in a Clean Architecture that follows the principles of separation of concerns and the application of Domain-Driven Design (DDD) to structure our code in a modular and domain-centric way.

## Configuración

To run this project, you will need to set the following environment variables:

- `PORT=`: Port on which the server will run. Example: `PORT=8080`.

- `PUBLIC_PATH=`: Public directory path. Example: `PUBLIC_PATH=public`.

- `MONGO_URL=`: URL of the MongoDB database. Example: `MONGO_URL=mongodb://127.0.0.1:27017/ecommerce`.

- `DB_NAME=`: Name of the MongoDB database. Example: `DB_NAME=ecommerceV2`.

- `JWT_SECRET=`: Secret key for JWT token generation. Example: `JWT_SECRET=saasdon9efniwn9u4hnnjni`

- `WEBSERVICE_URL=`: URL of the web service. Example: `WEBSERVICE_URL=http://localhost:8080/api/v1`

- `MAILER_SERVICE=`: E-mail service to be used (smtp, gmail, sendgrid, mailgun, etc.). Example: `MAILER_SERVICE=gmail`

- `MAILER_EMAIL=`: E-mail address for the mail service. Example: `MAILER_EMAIL=danitherev98@gmail.com`

- `MAILER_SECRET_KEY=`: Secret key for the mail service (application password for gmail, API key for sendgrid, API key for mailgun, etc.). Example: `MAILER_SECRET_KEY=abcde4dffd435`

- `ACCESS_TOKEN=`: Access token for Mercado Pago. Example: `ACCESS_TOKEN=TEST-23234234234344556-011615-ab896cb202bce7d3902449c04cdcb736-1640035341`

- `CLOUD_NAME=`: Your Cloudinary account's cloud name.

- `API_KEY=`: Your Cloudinary account's API key.

- `API_SECRET=`: Your Cloudinary account's API secret.

## Prerequisites
Make sure you have PNPM installed. If you don't have it, you can install it by running the following command:

```bash
npm install -g pnpm
```
## If you already have everything set up, then run the commands
```bash
pnpm install
```
```bash
pnpm run dev
```

---

¡Gracias por visitar nuestro proyecto! 😊
