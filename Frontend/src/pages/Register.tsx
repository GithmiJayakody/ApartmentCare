import "../styles/Register.css";
import { Link } from "react-router-dom";


function Register() {

  return (

    <div className="register-page">


      <div className="register-overlay">


        <div className="register-card">


          <img
            src="/livoralogo.png"
            className="logo"
            alt="Livora"
          />


          <h1>
            Create Account
          </h1>


          <p className="subtitle">
            Join Livora today and manage your home
          </p>



          <input
            type="text"
            placeholder="Full Name"
          />


          <input
            type="email"
            placeholder="Email address"
          />



          <label>
            Register as
          </label>


          <select>

            <option>
              Resident
            </option>

            <option>
              Technician
            </option>

            <option>
              Manager
            </option>

          </select>



          <input
            type="text"
            placeholder="Unit Number"
          />



          <input
            type="password"
            placeholder="Password"
          />



          <input
            type="password"
            placeholder="Confirm Password"
          />



          <button>
            Create Account →
          </button>




          <p className="login-text">

            Already have an account?

            <Link to="/login">
              Login
            </Link>

          </p>




          <div className="footer">

            <span>
              © 2026 Livora Inc.
            </span>


            <span>
              Help Center
            </span>


            <span>
              English (US)
            </span>


          </div>



        </div>



      </div>


    </div>

  );
}


export default Register;