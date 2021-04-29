import bcrypt from "bcrypt";
import User from "../../server/models/User";
import connectDB from "../../server/mongodb";

const register = async (req, res) => {
  if (req.method === "POST") {
    // Check if name, email or password is provided
    const { name, email, password } = req.body;
    if (name && email && password) {
      try {
        const existing = await User.findOne({ email });
        if (existing) {
          return res.json({ success: false, error: "existing_user", existing });
        }
        // Hash password to store it in DB
        var passwordhash = await bcrypt.hash(password, 10);
        var user = new User({
          name,
          email,
          password: passwordhash,
        });
        // Create new user
        var usercreated = await user.save();
        return res.status(200).json({ success: true, user: usercreated });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    } else {
      res.status(422).json({ error: "data_incomplete" });
    }
  } else {
    res.status(422).json({ error: "req_method_not_supported" });
  }
};

export default connectDB(register);
