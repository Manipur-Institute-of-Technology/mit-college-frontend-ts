# MongoDB TTL (Time To Live)

## In Mongosh

Say, we we have a database: `test`, with collection: `[log, c_log]`

```
DB Fields:
---------
log
    rand: number
    createdAt: time

c_log
    rand: number
    createdAt: time
    expireAt: time
```

```js
// Insert Data
db.log.insertMany([
	{ rand: 123, createdAt: new Date() },
	{ rand: 123, createdAt: new Date() },
	{ rand: 123, createdAt: new Date() },
]); // all be expire after 3 secs from createdAt time stamp

db.c_log.insertMany([
	{
		rand: 123,
		createdAt: new Date(),
		expireAt: new Date(new Date().getTime() * 1000 * 3),
	}, // expire after 3 secs
	{
		rand: 123,
		createdAt: new Date(),
		expireAt: new Date(new Date().getTime() * 1000 * 31),
	}, // expire after 31 secs
	{
		rand: 123,
		createdAt: new Date(),
		expireAt: new Date(new Date().getTime() * 1000 * 13),
	}, // expire after 13 secs
]);
```

### Same Expiration After for each collection

To set collection log's document to expire at `3` seconds after `createdAt`

1. Create TTL index: `db.log.createIndex({createdAt: 1}, {expireAfterSeconds: 3})`

### Custom Expiration for each document

To set collection c_log's document to expire at `expireAt` field

1. Create TTL index: `db.c_log.createIndex({expireAt: 1}, {expireAfterSeconds: 0})`

## In Mongoose

- Same TTL

    ```js
    let currentSchema = mongoose.Schema(
    	{
    		id: String,
    		name: String,
    	},
    	{ timestamps: true },
    );

    currentSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });
    ```

- Custom TTL (i.e. according to `expireAt` field)

    ```js
    let currentSchema = mongoose.Schema(
    	{
    		id: String,
    		name: String,
    		expireAt: Date,
    	},
    	{ timestamps: true },
    );

    currentSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
    ```

Test Script

- insert data script

```js
// Create Scheme
const mongoose = require("mongoose");

// ⚠️ Connect to MongoDB
mongoose
	.connect("mongodb://localhost:27017/your_database", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("Failed to connect to MongoDB", err));

// Define the OTP schema
const otpSchema = new mongoose.Schema(
	{
		id: { type: String, required: true },
		name: { type: String, required: true },
		expireAt: { type: Date, required: true },
	},
	{ timestamps: true },
);

// Create a TTL index for expireAt field to automatically delete expired documents
otpSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.model("Otp", otpSchema);

async function createOtp() {
	// Create 5 OTPs with different expiration times
	const otps = [];
	for (let i = 0; i < 5; i++) {
		const otp = new Otp({
			id: `otp-${i + 1}`,
			name: `Test OTP ${i + 1}`,
			expireAt: new Date(Date.now() + (i + 1) * 5 * 1000),
		});
		otps.push(otp);
	}

	await Otp.insertMany(otps);
	console.log("Multiple OTPs created:", otps);
}

// Run the example functions
async function run() {
	await createOtp();
}

run()
	.catch((err) => console.error("Error in script execution:", err))
	.finally(() => mongoose.connection.close());
```

- query data script

```js
const opts = await Otp.find({});
console.log(otps);
```
