module.exports = function(req, res, next) {
    const { email, name, password } = req.body;
  
    function validEmail(userEmail) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }
  
    if (req.path === "/register") {
      console.log(!email.length); 
      
      if (!validEmail(email)) {
        return res.status(401).json("Invalid Email");
      }
    } else if (req.path === "/login") {
         if (!validEmail(email)) {
        return res.status(401).json("Invalid Email");
      }
    }
  
    next();
  };