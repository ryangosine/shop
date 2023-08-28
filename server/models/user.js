const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: String,
  email: String,
  password: String,
});

userSchema.methods.compareHashedPassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error(error);
    return false;
  }
};

const User = mongoose.model("User", userSchema);

const testPasswordComparison = async () => {
  const password = "password";
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

  try {
    const result = await bcrypt.compare(password, hashedPassword);
    console.log("Password comparison result:", result);
  } catch (error) {
    console.error("Error:", error);
  }
};

testPasswordComparison();

module.exports = User;
