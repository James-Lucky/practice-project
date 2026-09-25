import Link from "next/link";
import Head from "next/head";
import Swiper from 'swiper';
import 'swiper/css';
import EmbidlyChat from "../../components/EmbidlyChat";

export default function Home() {
  return (
    <>
    <EmbidlyChat/>
      <Head>
        <title>Geek Set Web | Premium Tech Education</title>
        <meta name="description" content="Master full stack development with Geek Set Web." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/tab-icon.png" />
      </Head>

      {/* --- NAVBAR --- */}
      <nav className="navbar navbar-expand-lg main-navbar">
        <div className="container">
          <Link href={'/'} className="navbar-brand d-flex align-items-center">
            <img className='me-2' style={{width: '40px'}} src="tab-icon.png" alt="Logo" />
            <span className="logo-text">Geek Set Web</span>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
            <ul className="navbar-nav me-4 mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" href="#home">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#courses">Courses</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">Contact Us</a>
              </li>
            </ul>
            <a className="btn-primary-custom" href="#signin">Sign In</a>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="hero-section" id="home">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <h1 className="hero-title">Elevate Your Tech Career to New Heights</h1>
              <p className="hero-subtitle">
                Join our immersive Full Stack Development Professional Program. Equip yourself with the expertise needed to thrive in today's fast-paced, high-demand tech industry.
              </p>
              <div className="d-flex gap-3">
                <a className="btn-primary-custom" href="#courses">Explore Courses</a>
                <a className="btn-outline-custom" href="#about">Learn More</a>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="hero-image-wrapper">
                <img className="hero-img" src="hero-img.svg" alt="Tech Education" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section className="about-section glass-panel mx-3 mx-lg-5 my-5" id="about">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5 mb-4 mb-lg-0">
              <img className="img-fluid rounded-4 shadow-lg border border-secondary" src="about-img.jpg" alt="About Us" />
            </div>
            <div className="col-lg-7">
              <div className="about-content">
                <h3 className="section-title">About the Program <iconify-icon icon="material-symbols:bolt-outline" style={{color: "var(--secondary)"}}></iconify-icon></h3>
                <p>
                  Our curriculum is designed to transform beginners into industry-ready full-stack developers. Master front-end magic with HTML, CSS, React, and modern JavaScript, then dive deep into robust back-end architectures using Node.js and MongoDB.
                </p>
                <p>
                  Learning goes beyond the classroom. Successful graduates unlock exclusive internship opportunities to work on live projects alongside seasoned professionals. Build a stellar portfolio, gain real-world workflow insights, and kickstart your dream career.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TECHNOLOGIES SECTION --- */}
      <section className="tech-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Emerging Tech</span>
            <h2 className="section-title">Master the Modern Stack</h2>
            <p className="text-muted">Learn the tools that power today's top tech companies.</p>
          </div>
          
          <div className="tech-grid">
            <div className="tech-card glass-panel">
              <img className="tech-icon" src="html.png" alt="HTML" />
              <span className="tech-name">HTML5</span>
            </div>
            <div className="tech-card glass-panel">
              <img className="tech-icon" src="css.png" alt="CSS" />
              <span className="tech-name">CSS3</span>
            </div>
            <div className="tech-card glass-panel">
              <img className="tech-icon" src="js.png" alt="JavaScript" />
              <span className="tech-name">JavaScript</span>
            </div>
            <div className="tech-card glass-panel">
              <img className="tech-icon" src="react.png" alt="React" />
              <span className="tech-name">React</span>
            </div>
            <div className="tech-card glass-panel">
              <img className="tech-icon" src="vue js.png" alt="Vue" />
              <span className="tech-name">Vue.js</span>
            </div>
            <div className="tech-card glass-panel">
              <img className="tech-icon" src="python.png" alt="Python" />
              <span className="tech-name">Python</span>
            </div>
            <div className="tech-card glass-panel">
              <img className="tech-icon" src="node-js.png" alt="Node" />
              <span className="tech-name">Node.js</span>
            </div>
            <div className="tech-card glass-panel">
              <img className="tech-icon" src="java.png" alt="Java" />
              <span className="tech-name">Java</span>
            </div>
            <div className="tech-card glass-panel">
              <img className="tech-icon" src="git.png" alt="Git" />
              <span className="tech-name">Git & GitHub</span>
            </div>
            <div className="tech-card glass-panel">
              <img className="tech-icon" src="docker.png" alt="Docker" />
              <span className="tech-name">Docker</span>
            </div>
            <div className="tech-card glass-panel">
              <img className="tech-icon" src="typescript.png" alt="TypeScript" />
              <span className="tech-name">TypeScript</span>
            </div>
            <div className="tech-card glass-panel">
              <img className="tech-icon" src="bootstrap.png" alt="Bootstrap" />
              <span className="tech-name">Bootstrap</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- COURSES SECTION --- */}
      <section className="courses-section" id="courses">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Curriculum</span>
            <h2 className="section-title">Web Development Training</h2>
            <p className="text-muted mx-auto" style={{maxWidth: '700px'}}>
              <strong>Prerequisites:</strong> Hands-on with any programming language, basic HTML/CSS, and OOP concepts. (We also cover fundamentals to ensure no one is left behind!)
            </p>
          </div>

          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="course-card glass-panel">
                <div className="course-img-wrapper">
                  <img className="course-image" src="git.jpg" alt="Course 0" />
                </div>
                <div className="course-content">
                  <h3 className="course-title">Module 00: Overview</h3>
                  <div className="course-list">
                    <div className="course-list-item"><iconify-icon icon="ph:check-circle-fill"></iconify-icon>Course Overview</div>
                    <div className="course-list-item"><iconify-icon icon="ph:check-circle-fill"></iconify-icon>Agile Methodologies</div>
                    <div className="course-list-item"><iconify-icon icon="ph:check-circle-fill"></iconify-icon>Git & Github Intro</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="course-card glass-panel">
                <div className="course-img-wrapper">
                  <img className="course-image" src="frontend.jpg" alt="Course 1" />
                </div>
                <div className="course-content">
                  <h3 className="course-title">Module 01: Frontend</h3>
                  <div className="course-list">
                    <div className="course-list-item"><iconify-icon icon="ph:check-circle-fill"></iconify-icon>HTML5, CSS3, Bootstrap, Figma</div>
                    <div className="course-list-item"><iconify-icon icon="ph:check-circle-fill"></iconify-icon>Vanilla JS, DOM, Events</div>
                    <div className="course-list-item"><iconify-icon icon="ph:check-circle-fill"></iconify-icon>Advanced JS (ES6), AJAX</div>
                    <div className="course-list-item"><iconify-icon icon="ph:check-circle-fill"></iconify-icon>Angular / Frameworks</div>
                    <div className="course-list-item"><iconify-icon icon="ph:check-circle-fill"></iconify-icon>Frontend E-commerce Project</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="course-card glass-panel">
                <div className="course-img-wrapper">
                  <img className="course-image" src="backend.jpg" alt="Course 2" />
                </div>
                <div className="course-content">
                  <h3 className="course-title">Module 02: Backend</h3>
                  <div className="course-list">
                    <div className="course-list-item"><iconify-icon icon="ph:check-circle-fill"></iconify-icon>Node.js, Express, NPM</div>
                    <div className="course-list-item"><iconify-icon icon="ph:check-circle-fill"></iconify-icon>Event Loops, Routing</div>
                    <div className="course-list-item"><iconify-icon icon="ph:check-circle-fill"></iconify-icon>MVC Architecture</div>
                    <div className="course-list-item"><iconify-icon icon="ph:check-circle-fill"></iconify-icon>File Systems & Middlewares</div>
                    <div className="course-list-item"><iconify-icon icon="ph:check-circle-fill"></iconify-icon>Backend App Master Project</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="course-card glass-panel">
                <div className="course-img-wrapper">
                  <img className="course-image" src="database.jpg" alt="Course 3" />
                </div>
                <div className="course-content">
                  <h3 className="course-title">Module 03: Databases</h3>
                  <div className="course-list">
                    <div className="course-list-item"><iconify-icon icon="ph:check-circle-fill"></iconify-icon>Intro to DBMS</div>
                    <div className="course-list-item"><iconify-icon icon="ph:check-circle-fill"></iconify-icon>MySQL (DDL, DML)</div>
                    <div className="course-list-item"><iconify-icon icon="ph:check-circle-fill"></iconify-icon>NoSQL / MongoDB Intro</div>
                    <div className="course-list-item"><iconify-icon icon="ph:check-circle-fill"></iconify-icon>Mongoose with Node</div>
                    <div className="course-list-item"><iconify-icon icon="ph:check-circle-fill"></iconify-icon>CRUD Operations</div>
                  </div>
                </div>
              </div>
            </div>

    
            <div className="col-lg-4 col-md-6">
              <div className="course-card glass-panel">
                <div className="course-img-wrapper">
                  <img className="course-image" src="industrial.jpg" alt="Course 4" />
                </div>
                <div className="course-content">
                  <h3 className="course-title">Module 04: Industry Uses</h3>
                  <div className="course-list">
                    <div className="course-list-item"><iconify-icon icon="ph:check-circle-fill"></iconify-icon>Auth & Session Cookies</div>
                    <div className="course-list-item"><iconify-icon icon="ph:check-circle-fill"></iconify-icon>Emails, OTP, Payments</div>
                    <div className="course-list-item"><iconify-icon icon="ph:check-circle-fill"></iconify-icon>RESTful APIs & WebSockets</div>
                    <div className="course-list-item"><iconify-icon icon="ph:check-circle-fill"></iconify-icon>File/Image Uploads</div>
                    <div className="course-list-item"><iconify-icon icon="ph:check-circle-fill"></iconify-icon>All Services Master Project</div>
                  </div>
                </div>
              </div>
            </div>


            <div className="col-lg-4 col-md-6">
              <div className="course-card glass-panel">
                <div className="course-img-wrapper">
                  <img className="course-image" src="Devops.jpg" alt="Course 5" />
                </div>
                <div className="course-content">
                  <h3 className="course-title">Module 05: DevOps</h3>
                  <div className="course-list">
                    <div className="course-list-item"><iconify-icon icon="ph:check-circle-fill"></iconify-icon>AWS, Digital Ocean, Heroku</div>
                    <div className="course-list-item"><iconify-icon icon="ph:check-circle-fill"></iconify-icon>Backend Cloud Deployment</div>
                    <div className="course-list-item"><iconify-icon icon="ph:check-circle-fill"></iconify-icon>Angular App Deployment</div>
                    <div className="course-list-item"><iconify-icon icon="ph:check-circle-fill"></iconify-icon>Docker Fundamentals</div>
                    <div className="course-list-item"><iconify-icon icon="ph:check-circle-fill"></iconify-icon>DevOps Tooling</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

  
      <section className="benefits-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Why Us</span>
            <h2 className="section-title">Benefits of our Classes</h2>
          </div>
          
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="glass-panel p-4 h-100">
                <div className="benefit-item">
                  <div className="benefit-icon-wrapper"><iconify-icon icon="mdi:video-user"></iconify-icon></div>
                  <div className="benefit-text">110+ hours of Instructor Led Training</div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon-wrapper"><iconify-icon icon="mdi:laptop"></iconify-icon></div>
                  <div className="benefit-text">Online live virtual classroom</div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon-wrapper"><iconify-icon icon="mdi:chat-question"></iconify-icon></div>
                  <div className="benefit-text">1 Year Free Doubt Resolving Access</div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon-wrapper"><iconify-icon icon="mdi:briefcase"></iconify-icon></div>
                  <div className="benefit-text">3 industry-based course-end projects</div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon-wrapper"><iconify-icon icon="mdi:server"></iconify-icon></div>
                  <div className="benefit-text">1 Year Free Server Space & Domain</div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="glass-panel p-4 h-100">
                <div className="benefit-item">
                  <div className="benefit-icon-wrapper"><iconify-icon icon="mdi:account-tie"></iconify-icon></div>
                  <div className="benefit-text">Interactions with top notch MNCs Leaders</div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon-wrapper"><iconify-icon icon="mdi:certificate"></iconify-icon></div>
                  <div className="benefit-text">Internships and Career Consultancy</div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon-wrapper"><iconify-icon icon="mdi:code-braces"></iconify-icon></div>
                  <div className="benefit-text">Build end-to-end applications from scratch</div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon-wrapper"><iconify-icon icon="mdi:rocket-launch"></iconify-icon></div>
                  <div className="benefit-text">Test and deploy features to production</div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon-wrapper"><iconify-icon icon="mdi:star"></iconify-icon></div>
                  <div className="benefit-text">Mastery in React, Node, Databases</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* --- CONTACT SECTION --- */}
      <section className="contact-section" id="contact">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-7">
              <div className="glass-panel p-5">
                <h3 className="section-title mb-4">Send us a Message</h3>
                <form className="contact-form">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label>Name</label>
                      <input type="text" className="form-control" placeholder="John Doe" required />
                    </div>
                    <div className="col-md-6">
                      <label>Phone</label>
                      <input type="tel" className="form-control" placeholder="+1 234 567 890" required />
                    </div>
                    <div className="col-12">
                      <label>Email</label>
                      <input type="email" className="form-control" placeholder="john@example.com" required />
                    </div>
                    <div className="col-12">
                      <label>Subject</label>
                      <input type="text" className="form-control" placeholder="Course Inquiry" required />
                    </div>
                    <div className="col-12">
                      <label>Message</label>
                      <textarea className="form-control" rows="4" placeholder="How can we help you?" required></textarea>
                    </div>
                    <div className="col-12 mt-4">
                      <button type="submit" className="btn-primary-custom w-100">Send Message</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="glass-panel p-5 h-100 d-flex flex-column justify-content-center">
                <h3 className="section-title mb-4">Contact Info</h3>
                <div className="contact-info-item">
                  <div className="contact-info-icon"><iconify-icon icon="mdi:map-marker"></iconify-icon></div>
                  <div>
                    <h5 className="mb-1 text-white">Address</h5>
                    <p className="text-muted mb-0">Tech Hub, Silicon Valley, CA</p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon"><iconify-icon icon="mdi:phone"></iconify-icon></div>
                  <div>
                    <h5 className="mb-1 text-white">Phone</h5>
                    <p className="text-muted mb-0">+1 (800) 123-4567</p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon"><iconify-icon icon="mdi:email"></iconify-icon></div>
                  <div>
                    <h5 className="mb-1 text-white">Email</h5>
                    <p className="text-muted mb-0">hello@geeksetweb.com</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h5 className="mb-3 text-white">Follow Us</h5>
                  <div className="d-flex gap-3">
                    <a href="#" className="contact-info-icon" style={{width: '40px', height: '40px', fontSize: '1.2rem'}}><iconify-icon icon="mdi:facebook"></iconify-icon></a>
                    <a href="#" className="contact-info-icon" style={{width: '40px', height: '40px', fontSize: '1.2rem'}}><iconify-icon icon="mdi:twitter"></iconify-icon></a>
                    <a href="#" className="contact-info-icon" style={{width: '40px', height: '40px', fontSize: '1.2rem'}}><iconify-icon icon="mdi:instagram"></iconify-icon></a>
                    <a href="#" className="contact-info-icon" style={{width: '40px', height: '40px', fontSize: '1.2rem'}}><iconify-icon icon="mdi:linkedin"></iconify-icon></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer>
        <div className="container">
          <p className="mb-0">© 2026 Geek Set Web. All Rights Reserved. Master the Future.</p>
        </div>
      </footer>
    </>
  );
}
