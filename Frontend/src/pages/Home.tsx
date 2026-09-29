import "../styles/Home.css";
import { Link } from "react-router-dom";


function Home(){


return(


<div className="home-page">


{/* ================= NAVBAR ================= */}


<nav className="navbar">


<div className="nav-logo">

<img src="/livoralogo.png" />

</div>



<div className="nav-links">

<a href="#">Home</a>
<a href="#">Features</a>
<a href="#">About</a>
<a href="#">Contact</a>

</div>



<div className="nav-buttons">


<Link to="/login">

<button className="login-btn">

Login

</button>

</Link>



<Link to="/login">

<button className="start-btn">

Get Started →

</button>

</Link>


</div>


</nav>





{/* ================= HERO ================= */}


<section className="hero">


<div className="hero-content">


<h1>

More than a home,

<br/>

a <span>better living</span> experience


</h1>



<p>

Manage your apartment maintenance, communicate 
with your community, and make your living easier 
with Livora.

</p>




<div className="hero-buttons">


<Link to="/login">

<button className="primary">

Get Started →

</button>

</Link>



<Link to="/login">

<button className="secondary">

▶ Learn More

</button>

</Link>



</div>



</div>


</section>







{/* ================= FEATURES ================= */}



<section className="features">



<Link to="/login" className="feature-link">


<div className="feature-card">


<div className="icon">

🏠

</div>


<h3>

For Residents

</h3>


<p>

Submit maintenance requests and track their status easily.

</p>


<span className="arrow">

→

</span>


</div>


</Link>







<Link to="/login" className="feature-link">


<div className="feature-card">


<div className="icon">

🔧

</div>


<h3>

For Technicians

</h3>


<p>

View assigned tasks, update progress and manage your work.

</p>


<span className="arrow">

→

</span>


</div>


</Link>








<Link to="/login" className="feature-link">


<div className="feature-card">


<div className="icon">

👥

</div>


<h3>

For Managers

</h3>


<p>

Manage residents, assign technicians and monitor activities.

</p>


<span className="arrow">

→

</span>


</div>


</Link>








<Link to="/login" className="feature-link">


<div className="icon">

🛡

</div>


<div className="feature-card">


<h3>

Secure & Reliable

</h3>


<p>

Safe and organized apartment management with role-based access.

</p>


<span className="arrow">

→

</span>


</div>


</Link>





</section>







{/* ================= ABOUT ================= */}



<section className="about">



<div className="about-text">


<small>

ABOUT LIVORA

</small>



<h2>

Building better

<br/>

communities together

</h2>




<p>

Livora is a modern apartment maintenance management 
system designed to simplify communication between 
residents, maintenance staff and managers.

</p>



<p>

Our goal is to create a cleaner, safer and more comfortable 
living environment for everyone.

</p>



</div>







<div className="stats">



<div className="stat-box">

<h2>

500+

</h2>

<p>

Happy Residents

</p>

</div>





<div className="stat-box">

<h2>

1200+

</h2>

<p>

Maintenance Tasks

</p>

</div>





<div className="stat-box">

<h2>

15+

</h2>

<p>

Apartment Complexes

</p>

</div>





<div className="stat-box">

<h2>

98%

</h2>

<p>

Satisfaction Rate

</p>

</div>




</div>



</section>





{/* ================= ROOM GALLERY ================= */}



<section className="room-gallery">



<div className="room-card">


<img src="/livingroom.png"/>

<h3>

Living Room

</h3>


</div>





<div className="room-card">


<img src="/bedroom.png"/>

<h3>

Bedroom

</h3>


</div>






<div className="room-card">


<img src="/kitchen.png"/>

<h3>

Kitchen

</h3>


</div>






<div className="room-card">


<img src="/washroom.png"/>

<h3>

Washroom

</h3>


</div>





</section>




</div>


);


}


export default Home;