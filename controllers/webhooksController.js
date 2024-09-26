const { Webhook } = require("svix");
const users = require("../models/users");
const asyncHandler = require("express-async-handler");
const {exec} = require("node:child_process")
const path = require("node:path")

exports.userPost = asyncHandler(async (req, res) => {
  try {
    const payloadString = JSON.stringify(req.body); // Convert payload to string
    const headers = req.headers;

    const svix_id = headers["svix-id"];
    const svix_timestamp = headers["svix-timestamp"];
    const svix_signature = headers["svix-signature"];

    if (!svix_id || !svix_timestamp || !svix_signature) {
      throw new Error("Missing required headers for webhook verification");
    }

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET); // Use environment variable for secret
    const evt = wh.verify(payloadString, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });

    const { id, first_name, last_name, email_addresses } = evt.data;
    const eventType = evt.type;

    if (eventType === "user.created") {
      const clerkUser = new users({
        _id: id,
        firstname: first_name,
        lastname: last_name,
        email: email_addresses[0].email_address,
      });
      await clerkUser.save()
      const pathToScript = path.join(__dirname,"../bash_scripts/create_user_directory.sh")
      const pathToUser = path.join(__dirname,"../users")
      exec(`${pathToScript} ${id} ${pathToUser}`,(error, stdout, stderr)=>{
        if(error){
          console.error(`Error creating directory: ${error.message}`)
        }
        if(stderr){
          console.error(`stderr: ${stderr}`)
          return
        }
        console.log(`stdout: ${stdout}`)
      })
    }

    res.status(200).send({ message: "Webhook received successfully" });
  } catch (error) {
    console.error("Webhook verification failed:", error.message);
    res.status(400).send({ message: "Webhook verification failed" });
  }
});
