
  import {
    initializeApp
  } from
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";


  import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
  } from
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";


  import {
    getFirestore,
    collection,
    addDoc,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    serverTimestamp
  } from
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";



  const firebaseConfig = {

    apiKey:
      "AIzaSyDUQHgHRtszZdFOd9_tSfQlxO7JN8nyj4k",

    authDomain:
      "my-project-2783e.firebaseapp.com",

    databaseURL:
      "https://my-project-2783e-default-rtdb.firebaseio.com",

    projectId:
      "my-project-2783e",

    storageBucket:
      "my-project-2783e.firebasestorage.app",

    messagingSenderId:
      "644915525167",

    appId:
      "1:644915525167:web:16a7826a3dfef10e90f8da",

    measurementId:
      "G-9TJ2EHV9E9"

  };

  const app =
    initializeApp(firebaseConfig);


  const auth =
    getAuth(app);


  const db =
    getFirestore(app);


  console.log(
    "Firebase initialized:",
    firebaseConfig.projectId
  );



  let currentUser = null;

  let currentUserData = null;

  let allCourses = [];

  let enrolledCourseIds = [];




  const authScreen =
    document.getElementById("authScreen");

  const appScreen =
    document.getElementById("appScreen");

  const loginCard =
    document.getElementById("loginCard");

  const registerCard =
    document.getElementById("registerCard");

  const instructorDashboard =
    document.getElementById(
      "instructorDashboard"
    );

  const studentDashboard =
    document.getElementById(
      "studentDashboard"
    );




  function updateConnectionStatus() {

    const status =
      document.getElementById(
        "connectionStatus"
      );


    if (navigator.onLine) {

      status.textContent = "Online";

      status.className =
        "connection-status online";

    } else {

      status.textContent =
        "Offline";

      status.className =
        "connection-status offline";

    }

  }


  window.addEventListener(
    "online",
    updateConnectionStatus
  );


  window.addEventListener(
    "offline",
    updateConnectionStatus
  );


  updateConnectionStatus();



  function showLoginScreen(message = "") {

    registerCard.classList.add(
      "hidden"
    );

    loginCard.classList.remove(
      "hidden"
    );


    document.getElementById(
      "registerMessage"
    ).innerHTML = "";


    document.getElementById(
      "loginMessage"
    ).innerHTML = message;


    document.getElementById(
      "loginEmail"
    ).focus();

  }



  function showRegisterScreen() {

    loginCard.classList.add(
      "hidden"
    );

    registerCard.classList.remove(
      "hidden"
    );


    document.getElementById(
      "loginMessage"
    ).innerHTML = "";


    document.getElementById(
      "registerMessage"
    ).innerHTML = "";


    document.getElementById(
      "registerName"
    ).focus();

  }


  document
    .getElementById("showRegister")
    .addEventListener(
      "click",
      showRegisterScreen
    );


  document
    .getElementById("showLogin")
    .addEventListener(
      "click",
      showLoginScreen
    );


  
  document
    .getElementById("registerForm")
    .addEventListener(
      "submit",
      async function(event) {

        event.preventDefault();


        const name =
          document
            .getElementById("registerName")
            .value
            .trim();


        const email =
          document
            .getElementById("registerEmail")
            .value
            .trim()
            .toLowerCase();


        const password =
          document
            .getElementById("registerPassword")
            .value;


        const role =
          document
            .getElementById("registerRole")
            .value;


        const message =
          document.getElementById(
            "registerMessage"
          );


        const button =
          document.getElementById(
            "registerButton"
          );


        message.innerHTML = "";


        if (
          !name ||
          !email ||
          !password ||
          !role
        ) {

          message.innerHTML =
            `
              <div class="error">
                Please fill in all fields.
              </div>
            `;

          return;

        }


        if (password.length < 6) {

          message.innerHTML =
            `
              <div class="error">
                Password must contain at least 6 characters.
              </div>
            `;

          return;

        }


        button.disabled = true;

        button.textContent =
          "Creating account...";


        try {

       

          const credential =
            await createUserWithEmailAndPassword(
              auth,
              email,
              password
            );


          const user =
            credential.user;


         

          await setDoc(
            doc(
              db,
              "users",
              user.uid
            ),
            {

              name: name,

              email: email,

              role: role,

              createdAt:
                serverTimestamp()

            }
          );


    

          await signOut(auth);


      

          document
            .getElementById(
              "registerForm"
            )
            .reset();


        

          showLoginScreen(
            `
              <div class="success">
                Account created successfully!
                You can now log in with your email and password.
              </div>
            `
          );


        

          document.getElementById(
            "loginEmail"
          ).value = email;


        } catch (error) {

          console.error(
            "Registration error:",
            error
          );


          message.innerHTML =
            `
              <div class="error">
                ${firebaseErrorMessage(error)}
              </div>
            `;

        } finally {

          button.disabled = false;

          button.textContent =
            "Create Account";

        }

      }
    );


  document
    .getElementById("loginForm")
    .addEventListener(
      "submit",
      async function(event) {

        event.preventDefault();


        const email =
          document
            .getElementById("loginEmail")
            .value
            .trim()
            .toLowerCase();


        const password =
          document
            .getElementById("loginPassword")
            .value;


        const message =
          document.getElementById(
            "loginMessage"
          );


        const button =
          document.getElementById(
            "loginButton"
          );


        message.innerHTML = "";


        if (!navigator.onLine) {

          message.innerHTML =
            `
              <div class="error">
                You appear to be offline.
                Please connect to the internet and try again.
              </div>
            `;

          return;

        }


        button.disabled = true;

        button.textContent =
          "Logging in...";


        try {

          await signInWithEmailAndPassword(
            auth,
            email,
            password
          );



        } catch (error) {

          console.error(
            "Login error:",
            error
          );


          message.innerHTML =
            `
              <div class="error">
                ${firebaseErrorMessage(error)}
              </div>
            `;

        } finally {

          button.disabled = false;

          button.textContent =
            "Login";

        }

      }
    );




  document
    .getElementById("logoutBtn")
    .addEventListener(
      "click",
      async function() {

        try {

          await signOut(auth);


          currentUser = null;

          currentUserData = null;


          showLoginScreen(
            `
              <div class="success">
                You have been logged out successfully.
              </div>
            `
          );


        } catch (error) {

          console.error(
            "Logout error:",
            error
          );

        }

      }
    );



  onAuthStateChanged(
    auth,
    async function(user) {

    

      if (!user) {

        currentUser = null;

        currentUserData = null;


        authScreen.classList.remove(
          "hidden"
        );

        appScreen.classList.add(
          "hidden"
        );


        return;

      }



      currentUser = user;


    

      if (!navigator.onLine) {

        authScreen.classList.remove(
          "hidden"
        );

        appScreen.classList.add(
          "hidden"
        );


        showLoginScreen(
          `
            <div class="error">
              You are offline.
              Please reconnect to the internet and log in again.
            </div>
          `
        );


        return;

      }


      try {

        /*
         * Get user profile from Firestore.
         */

        const userDoc =
          await getDoc(
            doc(
              db,
              "users",
              user.uid
            )
          );


        if (!userDoc.exists()) {

          console.error(
            "User profile not found."
          );


          await signOut(auth);


          showLoginScreen(
            `
              <div class="error">
                Your account profile could not be found.
                Please contact the administrator.
              </div>
            `
          );


          return;

        }


        currentUserData =
          userDoc.data();


        showDashboard();


      } catch (error) {

        console.error(
          "Loading user profile:",
          error
        );


      
        try {

          await signOut(auth);

        } catch (signOutError) {

          console.error(
            signOutError
          );

        }


        authScreen.classList.remove(
          "hidden"
        );

        appScreen.classList.add(
          "hidden"
        );


        showLoginScreen(
          `
            <div class="error">
              ${firebaseErrorMessage(error)}
            </div>
          `
        );

      }

    }
  );




  function showDashboard() {

    authScreen.classList.add(
      "hidden"
    );

    appScreen.classList.remove(
      "hidden"
    );


    document.getElementById(
      "userNameDisplay"
    ).textContent =
      currentUserData.name || "";


    document.getElementById(
      "roleDisplay"
    ).textContent =
      capitalize(
        currentUserData.role
      );


    document.getElementById(
      "welcomeText"
    ).textContent =
      "Welcome, " +
      (currentUserData.name || "User");


    if (
      currentUserData.role ===
      "instructor"
    ) {

      instructorDashboard.classList.remove(
        "hidden"
      );

      studentDashboard.classList.add(
        "hidden"
      );


      loadInstructorData();

    } else {

      instructorDashboard.classList.add(
        "hidden"
      );

      studentDashboard.classList.remove(
        "hidden"
      );


      loadStudentData();

    }

  }




  document
    .getElementById("courseForm")
    .addEventListener(
      "submit",
      async function(event) {

        event.preventDefault();


        const title =
          document
            .getElementById("courseTitle")
            .value
            .trim();


        const code =
          document
            .getElementById("courseCode")
            .value
            .trim()
            .toUpperCase();


        const description =
          document
            .getElementById("courseDescription")
            .value
            .trim();


        const message =
          document.getElementById(
            "courseMessage"
          );


        try {

          await addDoc(
            collection(
              db,
              "courses"
            ),
            {

              title: title,

              code: code,

              description: description,

              instructorId:
                currentUser.uid,

              instructorName:
                currentUserData.name,

              createdAt:
                serverTimestamp()

            }
          );


          document
            .getElementById(
              "courseForm"
            )
            .reset();


          message.innerHTML =
            `
              <div class="success">
                Course created successfully.
              </div>
            `;


          await loadInstructorData();


        } catch (error) {

          console.error(
            "Create course error:",
            error
          );


          message.innerHTML =
            `
              <div class="error">
                ${firebaseErrorMessage(error)}
              </div>
            `;

        }

      }
    );


  

  async function loadInstructorData() {

    await loadInstructorCourses();

    populateAssignmentCourses();

    await loadInstructorAssignments();

  }




  async function loadInstructorCourses() {

    const container =
      document.getElementById(
        "instructorCourses"
      );


    container.innerHTML =
      `
        <div class="loading">
          Loading courses...
        </div>
      `;


    try {

      const q =
        query(
          collection(
            db,
            "courses"
          ),

          where(
            "instructorId",
            "==",
            currentUser.uid
          )
        );


      const snapshot =
        await getDocs(q);


      allCourses = [];


      snapshot.forEach(
        function(docSnap) {

          allCourses.push({

            id:
              docSnap.id,

            ...docSnap.data()

          });

        }
      );


      if (allCourses.length === 0) {

        container.innerHTML =
          `
            <div class="empty">
              No courses created yet.
            </div>
          `;

        return;

      }


      container.innerHTML = "";


      allCourses.forEach(
        function(course) {

          container.innerHTML +=
            `
              <div class="card">

                <span class="course-code">
                  ${escapeHTML(course.code)}
                </span>

                <h3>
                  ${escapeHTML(course.title)}
                </h3>

                <p>
                  ${escapeHTML(course.description)}
                </p>

                <small>
                  Instructor:
                  ${escapeHTML(
                    course.instructorName || ""
                  )}
                </small>

              </div>
            `;

        }
      );


    } catch (error) {

      console.error(
        "Load instructor courses:",
        error
      );


      container.innerHTML =
        `
          <div class="error">
            ${firebaseErrorMessage(error)}
          </div>
        `;

    }

  }



  function populateAssignmentCourses() {

    const select =
      document.getElementById(
        "assignmentCourse"
      );


    select.innerHTML =
      `
        <option value="">
          Select Course
        </option>
      `;


    allCourses.forEach(
      function(course) {

        const option =
          document.createElement(
            "option"
          );


        option.value =
          course.id;


        option.textContent =
          course.code +
          " - " +
          course.title;


        select.appendChild(
          option
        );

      }
    );

  }




  document
    .getElementById("assignmentForm")
    .addEventListener(
      "submit",
      async function(event) {

        event.preventDefault();


        const title =
          document
            .getElementById("assignmentTitle")
            .value
            .trim();


        const description =
          document
            .getElementById("assignmentDescription")
            .value
            .trim();


        const courseId =
          document
            .getElementById("assignmentCourse")
            .value;


        const deadline =
          document
            .getElementById("assignmentDeadline")
            .value;


        const message =
          document.getElementById(
            "assignmentMessage"
          );


        const course =
          allCourses.find(
            function(item) {

              return item.id === courseId;

            }
          );


        if (!course) {

          message.innerHTML =
            `
              <div class="error">
                Please select a course.
              </div>
            `;

          return;

        }


        try {

          await addDoc(
            collection(
              db,
              "assignments"
            ),
            {

              title: title,

              description: description,

              courseId: courseId,

              courseTitle:
                course.title,

              courseCode:
                course.code,

              instructorId:
                currentUser.uid,

              deadline: deadline,

              createdAt:
                serverTimestamp()

            }
          );


          document
            .getElementById(
              "assignmentForm"
            )
            .reset();


          message.innerHTML =
            `
              <div class="success">
                Assignment created successfully.
              </div>
            `;


          await loadInstructorAssignments();


        } catch (error) {

          console.error(
            "Create assignment:",
            error
          );


          message.innerHTML =
            `
              <div class="error">
                ${firebaseErrorMessage(error)}
              </div>
            `;

        }

      }
    );


  async function loadInstructorAssignments() {

    const container =
      document.getElementById(
        "instructorAssignments"
      );


    container.innerHTML =
      `
        <div class="loading">
          Loading assignments...
        </div>
      `;


    try {

      const q =
        query(
          collection(
            db,
            "assignments"
          ),

          where(
            "instructorId",
            "==",
            currentUser.uid
          )
        );


      const snapshot =
        await getDocs(q);


      const assignments = [];


      snapshot.forEach(
        function(docSnap) {

          assignments.push({

            id:
              docSnap.id,

            ...docSnap.data()

          });

        }
      );


      if (assignments.length === 0) {

        container.innerHTML =
          `
            <div class="empty">
              No assignments created yet.
            </div>
          `;

        return;

      }


      container.innerHTML = "";


      assignments.forEach(
        function(assignment) {

          container.innerHTML +=
            `
              <div class="card assignment-card">

                <span class="course-code">
                  ${escapeHTML(
                    assignment.courseCode
                  )}
                </span>

                <h3>
                  ${escapeHTML(
                    assignment.title
                  )}
                </h3>

                <p>
                  ${escapeHTML(
                    assignment.description
                  )}
                </p>

                <div class="deadline">
                  Deadline:
                  ${formatDate(
                    assignment.deadline
                  )}
                </div>

              </div>
            `;

        }
      );


    } catch (error) {

      console.error(
        "Load instructor assignments:",
        error
      );


      container.innerHTML =
        `
          <div class="error">
            ${firebaseErrorMessage(error)}
          </div>
        `;

    }

  }



  async function loadStudentData() {

    await loadStudentEnrollments();

    await loadAvailableCourses();

    await loadEnrolledCourses();

    await loadStudentAssignments();

  }


  

  async function loadStudentEnrollments() {

    enrolledCourseIds = [];


    try {

      const q =
        query(
          collection(
            db,
            "enrollments"
          ),

          where(
            "studentId",
            "==",
            currentUser.uid
          )
        );


      const snapshot =
        await getDocs(q);


      snapshot.forEach(
        function(docSnap) {

          const data =
            docSnap.data();


          if (data.courseId) {

            enrolledCourseIds.push(
              data.courseId
            );

          }

        }
      );


    } catch (error) {

      console.error(
        "Load enrollments:",
        error
      );

    }

  }



  async function loadAvailableCourses() {

    const container =
      document.getElementById(
        "availableCourses"
      );


    container.innerHTML =
      `
        <div class="loading">
          Loading courses...
        </div>
      `;


    try {

      const snapshot =
        await getDocs(
          collection(
            db,
            "courses"
          )
        );


      allCourses = [];


      snapshot.forEach(
        function(docSnap) {

          allCourses.push({

            id:
              docSnap.id,

            ...docSnap.data()

          });

        }
      );


      if (allCourses.length === 0) {

        container.innerHTML =
          `
            <div class="empty">
              No courses available.
            </div>
          `;

        return;

      }


      container.innerHTML = "";


      allCourses.forEach(
        function(course) {

          const enrolled =
            enrolledCourseIds.includes(
              course.id
            );


          const card =
            document.createElement(
              "div"
            );


          card.className =
            "card";


          card.innerHTML =
            `
              <span class="course-code">
                ${escapeHTML(course.code)}
              </span>

              <h3>
                ${escapeHTML(course.title)}
              </h3>

              <p>
                ${escapeHTML(course.description)}
              </p>

              <small>
                Instructor:
                ${escapeHTML(
                  course.instructorName || ""
                )}
              </small>

              <br><br>
            `;


          const button =
            document.createElement(
              "button"
            );


          button.className =
            enrolled
              ? "btn btn-secondary"
              : "btn btn-primary";


          button.disabled =
            enrolled;


          button.textContent =
            enrolled
              ? "Already Enrolled"
              : "Enroll";


          if (!enrolled) {

            button.addEventListener(
              "click",
              function() {

                enrollCourse(
                  course.id
                );

              }
            );

          }


          card.appendChild(
            button
          );


          container.appendChild(
            card
          );

        }
      );


    } catch (error) {

      console.error(
        "Load available courses:",
        error
      );


      container.innerHTML =
        `
          <div class="error">
            ${firebaseErrorMessage(error)}
          </div>
        `;

    }

  }


 

  async function enrollCourse(courseId) {

    try {

      const q =
        query(

          collection(
            db,
            "enrollments"
          ),

          where(
            "studentId",
            "==",
            currentUser.uid
          ),

          where(
            "courseId",
            "==",
            courseId
          )

        );


      const existing =
        await getDocs(q);


      if (!existing.empty) {

        alert(
          "You are already enrolled."
        );

        return;

      }


      const course =
        allCourses.find(
          function(item) {

            return item.id === courseId;

          }
        );


      if (!course) {

        alert(
          "Course not found."
        );

        return;

      }


      await addDoc(
        collection(
          db,
          "enrollments"
        ),
        {

          studentId:
            currentUser.uid,

          studentName:
            currentUserData.name,

          courseId:
            courseId,

          courseTitle:
            course.title,

          courseCode:
            course.code,

          enrolledAt:
            serverTimestamp()

        }
      );


      alert(
        "Successfully enrolled!"
      );


      await loadStudentData();


    } catch (error) {

      console.error(
        "Enrollment error:",
        error
      );


      alert(
        firebaseErrorMessage(error)
      );

    }

  }



  async function loadEnrolledCourses() {

    const container =
      document.getElementById(
        "enrolledCourses"
      );


    container.innerHTML =
      `
        <div class="loading">
          Loading...
        </div>
      `;


    try {

      const q =
        query(
          collection(
            db,
            "enrollments"
          ),

          where(
            "studentId",
            "==",
            currentUser.uid
          )
        );


      const snapshot =
        await getDocs(q);


      if (snapshot.empty) {

        container.innerHTML =
          `
            <div class="empty">
              You are not enrolled in any courses.
            </div>
          `;

        return;

      }


      container.innerHTML = "";


      snapshot.forEach(
        function(docSnap) {

          const enrollment =
            docSnap.data();


          container.innerHTML +=
            `
              <div class="card">

                <span class="course-code">
                  ${escapeHTML(
                    enrollment.courseCode
                  )}
                </span>

                <h3>
                  ${escapeHTML(
                    enrollment.courseTitle
                  )}
                </h3>

                <p>
                  You are enrolled in this course.
                </p>

              </div>
            `;

        }
      );


    } catch (error) {

      console.error(
        "Load enrolled courses:",
        error
      );


      container.innerHTML =
        `
          <div class="error">
            ${firebaseErrorMessage(error)}
          </div>
        `;

    }

  }



  async function loadStudentAssignments() {

    const container =
      document.getElementById(
        "studentAssignments"
      );


    container.innerHTML =
      `
        <div class="loading">
          Loading assignments...
        </div>
      `;


    try {

      const enrollmentQuery =
        query(
          collection(
            db,
            "enrollments"
          ),

          where(
            "studentId",
            "==",
            currentUser.uid
          )
        );


      const enrollmentSnapshot =
        await getDocs(
          enrollmentQuery
        );


      const courseIds = [];


      enrollmentSnapshot.forEach(
        function(docSnap) {

          const data =
            docSnap.data();


          if (data.courseId) {

            courseIds.push(
              data.courseId
            );

          }

        }
      );


      if (courseIds.length === 0) {

        container.innerHTML =
          `
            <div class="empty">
              Enroll in a course to see assignments.
            </div>
          `;

        return;

      }


      const assignmentSnapshot =
        await getDocs(
          collection(
            db,
            "assignments"
          )
        );


      const assignments = [];


      assignmentSnapshot.forEach(
        function(docSnap) {

          const assignment =
            docSnap.data();


          if (
            courseIds.includes(
              assignment.courseId
            )
          ) {

            assignments.push({

              id:
                docSnap.id,

              ...assignment

            });

          }

        }
      );


      if (assignments.length === 0) {

        container.innerHTML =
          `
            <div class="empty">
              No assignments available.
            </div>
          `;

        return;

      }


      

      const submissionQuery =
        query(
          collection(
            db,
            "submissions"
          ),

          where(
            "studentId",
            "==",
            currentUser.uid
          )
        );


      const submissionSnapshot =
        await getDocs(
          submissionQuery
        );


      const submissions = {};


      submissionSnapshot.forEach(
        function(docSnap) {

          const data =
            docSnap.data();


          submissions[
            data.assignmentId
          ] = data;

        }
      );


      container.innerHTML = "";


      assignments.forEach(
        function(assignment) {

          const submission =
            submissions[
              assignment.id
            ];


          const status =
            getAssignmentStatus(
              assignment.deadline,
              submission
            );


          const statusClass =
            status.toLowerCase();


          let action = "";


          if (status === "Pending") {

            action =
              `
                <button
                  class="btn btn-primary submit-button"
                  data-assignment-id="${escapeHTML(
                    assignment.id
                  )}"
                >
                  Submit Assignment
                </button>
              `;

          } else if (
            status === "Overdue"
          ) {

            action =
              `
                <button
                  class="btn btn-secondary"
                  disabled
                >
                  Deadline Passed
                </button>
              `;

          } else {

            action =
              `
                <button
                  class="btn btn-success"
                  disabled
                >
                  Submitted
                </button>
              `;

          }


          container.innerHTML +=
            `
              <div
                class="
                  card
                  assignment-card
                  ${statusClass}
                "
              >

                <span class="course-code">
                  ${escapeHTML(
                    assignment.courseCode
                  )}
                </span>

                <br>

                <span
                  class="
                    status
                    ${statusClass}
                  "
                >
                  ${status}
                </span>

                <h3>
                  ${escapeHTML(
                    assignment.title
                  )}
                </h3>

                <p>
                  ${escapeHTML(
                    assignment.description
                  )}
                </p>

                <div class="deadline">
                  Deadline:
                  ${formatDate(
                    assignment.deadline
                  )}
                </div>

                ${action}

              </div>
            `;

        }
      );


      

      document
        .querySelectorAll(
          ".submit-button"
        )
        .forEach(
          function(button) {

            button.addEventListener(
              "click",
              function() {

                openSubmissionModal(
                  button.dataset.assignmentId
                );

              }
            );

          }
        );


    } catch (error) {

      console.error(
        "Load student assignments:",
        error
      );


      container.innerHTML =
        `
          <div class="error">
            ${firebaseErrorMessage(error)}
          </div>
        `;

    }

  }



  function getAssignmentStatus(
    deadline,
    submission
  ) {

    if (submission) {

      return "Submitted";

    }


    const now =
      new Date();


    const deadlineDate =
      new Date(deadline);


    if (
      now > deadlineDate
    ) {

      return "Overdue";

    }


    return "Pending";

  }


  

  function openSubmissionModal(
    assignmentId
  ) {

    document.getElementById(
      "submissionAssignmentId"
    ).value =
      assignmentId;


    document.getElementById(
      "submissionText"
    ).value = "";


    document.getElementById(
      "submissionMessage"
    ).innerHTML = "";


    document.getElementById(
      "submissionModal"
    ).classList.remove(
      "hidden"
    );

  }


  document
    .getElementById(
      "closeSubmissionModal"
    )
    .addEventListener(
      "click",
      function() {

        document.getElementById(
          "submissionModal"
        ).classList.add(
          "hidden"
        );

      }
    );


 

  document
    .getElementById(
      "submissionModal"
    )
    .addEventListener(
      "click",
      function(event) {

        if (
          event.target ===
          document.getElementById(
            "submissionModal"
          )
        ) {

          document.getElementById(
            "submissionModal"
          ).classList.add(
            "hidden"
          );

        }

      }
    );



  document
    .getElementById("submissionForm")
    .addEventListener(
      "submit",
      async function(event) {

        event.preventDefault();


        const assignmentId =
          document
            .getElementById(
              "submissionAssignmentId"
            )
            .value;


        const answer =
          document
            .getElementById(
              "submissionText"
            )
            .value
            .trim();


        const message =
          document.getElementById(
            "submissionMessage"
          );


        if (!answer) {

          message.innerHTML =
            `
              <div class="error">
                Please enter your answer.
              </div>
            `;

          return;

        }


        try {


          const q =
            query(

              collection(
                db,
                "submissions"
              ),

              where(
                "studentId",
                "==",
                currentUser.uid
              ),

              where(
                "assignmentId",
                "==",
                assignmentId
              )

            );


          const existing =
            await getDocs(q);


          if (!existing.empty) {

            message.innerHTML =
              `
                <div class="error">
                  You have already submitted this assignment.
                </div>
              `;

            return;

          }



          const assignmentDoc =
            await getDoc(
              doc(
                db,
                "assignments",
                assignmentId
              )
            );


          if (
            !assignmentDoc.exists()
          ) {

            message.innerHTML =
              `
                <div class="error">
                  Assignment no longer exists.
                </div>
              `;

            return;

          }


          const assignment =
            assignmentDoc.data();


          if (
            new Date() >
            new Date(
              assignment.deadline
            )
          ) {

            message.innerHTML =
              `
                <div class="error">
                  The deadline for this assignment has passed.
                </div>
              `;

            return;

          }


          await addDoc(
            collection(
              db,
              "submissions"
            ),
            {

              assignmentId:
                assignmentId,

              studentId:
                currentUser.uid,

              studentName:
                currentUserData.name,

              answer:
                answer,

              submittedAt:
                serverTimestamp()

            }
          );


          message.innerHTML =
            `
              <div class="success">
                Assignment submitted successfully!
              </div>
            `;


          setTimeout(
            async function() {

              document.getElementById(
                "submissionModal"
              ).classList.add(
                "hidden"
              );


              await loadStudentAssignments();

            },
            700
          );


        } catch (error) {

          console.error(
            "Submission error:",
            error
          );


          message.innerHTML =
            `
              <div class="error">
                ${firebaseErrorMessage(error)}
              </div>
            `;

        }

      }
    );


  function capitalize(value) {

    if (!value) {

      return "";

    }


    return (
      value.charAt(0).toUpperCase() +
      value.slice(1)
    );

  }


  function formatDate(value) {

    if (!value) {

      return "Not specified";

    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return "Invalid date";

    }


    return date.toLocaleString(
      undefined,
      {
        dateStyle: "medium",
        timeStyle: "short"
      }
    );

  }


  function escapeHTML(value) {

    if (
      value === undefined ||
      value === null
    ) {

      return "";

    }


    return String(value)

      .replaceAll(
        "&",
        "&amp;"
      )

      .replaceAll(
        "<",
        "&lt;"
      )

      .replaceAll(
        ">",
        "&gt;"
      )

      .replaceAll(
        '"',
        "&quot;"
      )

      .replaceAll(
        "'",
        "&#039;"
      );

  }



  function firebaseErrorMessage(error) {

    console.error(
      "Firebase error:",
      error
    );


    const code =
      error?.code || "";


    const message =
      error?.message || "";


    const messages = {

      "auth/email-already-in-use":
        "This email is already registered. Please log in instead.",

      "auth/invalid-email":
        "Please enter a valid email address.",

      "auth/weak-password":
        "Password must contain at least 6 characters.",

      "auth/invalid-credential":
        "Invalid email or password.",

      "auth/user-not-found":
        "No account was found with this email.",

      "auth/wrong-password":
        "Incorrect password.",

      "auth/too-many-requests":
        "Too many login attempts. Please try again later.",

      "auth/network-request-failed":
        "Network error. Please check your internet connection.",

      "auth/configuration-not-found":
        "Firebase Authentication is not configured correctly. Check Firebase Authentication → Sign-in method and make sure Email/Password is enabled.",

      "permission-denied":
        "Firebase permission denied. Check your Firestore security rules.",

      "failed-precondition":
        "Firestore is not configured correctly. Check that Cloud Firestore has been created.",

      "unavailable":
        "Firebase is temporarily unavailable or you are offline. Check your internet connection and try again.",

      "cancelled":
        "The Firebase request was cancelled.",

      "deadline-exceeded":
        "The Firebase request took too long. Check your internet connection.",

      "unauthenticated":
        "Your session has expired. Please log in again."

    };


    if (messages[code]) {

      return messages[code];

    }


    if (
      message.toLowerCase().includes(
        "client is offline"
      )
    ) {

      return (
        "The browser cannot connect to Firebase. " +
        "Check your internet connection, Firebase project settings, " +
        "and Firestore database."
      );

    }


    if (
      message.toLowerCase().includes(
        "failed to get document"
      )
    ) {

      return (
        "Unable to connect to Firestore. " +
        "Make sure your internet connection is working and " +
        "that Cloud Firestore is enabled in your Firebase project."
      );

    }


    return (
      message ||
      "Something went wrong. Please try again."
    );

  }



  showLoginScreen();


  console.log(
    "LearnHub application loaded."
  );
