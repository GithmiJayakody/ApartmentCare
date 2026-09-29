import "../styles/Login.css";

import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";


function Login(){


    const navigate = useNavigate();


    const [email,setEmail] = useState("");

    const [password,setPassword] = useState("");




    const handleLogin = (e:any)=>{


        e.preventDefault();


        // temporary frontend login
        // backend connection will be added later


        if(email && password){


            navigate("/");


        }

        else{


            alert("Please enter email and password");


        }


    };





    return(


        <div className="login-page">



            <div className="login-overlay">





                <form 
                className="login-card"
                onSubmit={handleLogin}
                >



                    <img

                    src="/livoralogo.png"

                    className="logo"

                    alt="Livora"

                    />





                    <h1>

                    Welcome Back

                    </h1>





                    <p>

                    Login to continue

                    </p>






                    <input

                    type="email"

                    placeholder="Email address"

                    value={email}

                    onChange={(e)=>
                    setEmail(e.target.value)
                    }

                    />






                    <input

                    type="password"

                    placeholder="Password"

                    value={password}

                    onChange={(e)=>
                    setPassword(e.target.value)
                    }

                    />








                    <label className="login-as">

                    Login as

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








                    <div className="options">


                        <label>

                        <input type="checkbox"/>

                        Remember me

                        </label>




                        <a>

                        Forgot Password?

                        </a>



                    </div>








                    <button type="submit">

                    Sign In →

                    </button>








                    <div className="register-link">


                    Don't have an account?


                    <Link to="/register">

                    Create Account

                    </Link>


                    </div>








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





                </form>





            </div>




        </div>



    );


}


export default Login;