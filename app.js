require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")

main().catch(err=> console.log(err))

async function main() {
    await mongoose.connect(process.env.CONNECTION_STRING)
}