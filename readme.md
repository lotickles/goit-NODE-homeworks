## GoIT Node.js Course Template Homework

Please fork this repository to complete your homework assignments (2-6).
Forking will create a repository on your http://github.com account.

## Expalanation Recording to hanle homeworks in the Node.js Block

[Watch the video](https://www.loom.com/share/007c97d271604e02ae61adbb5b69edd3)

### Commands:

- `npm start` &mdash; starts the server in production mode.
- `npm run start:dev` &mdash; starts the server in development mode.
- `npm run lint` &mdash; runs eslint to check the code. Make sure to execute this before each PR and fix all linting errors.
- `npm lint:fix` &mdash; same as the previous command but fixes simple linting errors automatically.

//
Where:
app - an express application instance.
METHOD -— an HTTP request method (GET, POST, PUT, PATCH, DELETE).
PATH —- a path to the server, in our case it is the site root '/'.
HANDLER —- a function to be executed when the route is matched.

Let's briefly define what each of the HTTP verbs are used for:

GET requests a representation of a resource. Queries using this method can only retrieve data.
POST is used to send entities to a specific resource. It often causes a state change or some side effects on the server.
PUT replaces all current representations of the resource with the request data.
DELETE deletes the specified resource.
PATCH is used to partially change a resource.

//original JSON
[
{
"id": "AeHIrLTr6JkxGE6SN-0Rw",
"name": "Allen Raymond",
"email": "nulla.ante@vestibul.co.uk",
"phone": "(992) 914-3792"
},
{
"id": "qdggE76Jtbfd9eWJHrssH",
"name": "Chaim Lewis",
"email": "dui.in@egetlacus.ca",
"phone": "(294) 840-6685"
},
{
"id": "drsAJ4SHPYqZeG-83QTVW",
"name": "Kennedy Lane",
"email": "mattis.Cras@nonenimMauris.net",
"phone": "(542) 451-7038"
},
{
"id": "vza2RIzNGIwutCVCs4mCL",
"name": "Wylie Pope",
"email": "est@utquamvel.net",
"phone": "(692) 802-2949"
},
{
"id": "05olLMgyVQdWRwgKfg5J6",
"name": "Cyrus Jackson",
"email": "nibh@semsempererat.com",
"phone": "(501) 472-5218"
},
{
"id": "1DEXoP8AuCGYc1YgoQ6hw",
"name": "Abbot Franks",
"email": "scelerisque@magnis.org",
"phone": "(186) 568-3720"
},
{
"id": "Z5sbDlS7pCzNsnAHLtDJd",
"name": "Reuben Henry",
"email": "pharetra.ut@dictum.co.uk",
"phone": "(715) 598-5792"
},
{
"id": "C9sjBfCo4UJCWjzBnOtxl",
"name": "Simon Morton",
"email": "dui.Fusce.diam@Donec.com",
"phone": "(233) 738-2360"
},
{
"id": "e6ywwRe4jcqxXfCZOj_1e",
"name": "Thomas Lucas",
"email": "nec@Nulla.com",
"phone": "(704) 398-7993"
},
{
"id": "rsKkOQUi80UsgVPCcLZZW",
"name": "Alec Howard",
"email": "Donec.elementum@scelerisquescelerisquedui.net",
"phone": "(748) 206-2688"
}
]
