1. Task: [link](https://github.com/rolling-scopes-school/tasks/tree/master/stage2/tasks/async-racehttps://github.com/rolling-scopes-school/tasks/tree/master/stage2/tasks/async-race)
2. Screenshot:
3. Deploy: [link](https://github.com/)
4. Done 07.04.2025 / deadline 08.04.2025
5. Score: 0 / 405
### Total Points: 190

##### 🏗️ Application Architecture (40 points)
- [ ] The application should be clearly divided into logical modules or layers, such as API interaction, UI rendering, and state management. Consultation with a mentor on the architecture before implementation is advised.

##### 📜 Dynamic Content Generation (30 points)
- [ ] All HTML content must be dynamically generated using JavaScript, with the `<body>` tag containing only a single `<script>` tag.

##### 🌐 Single Page Application (25 points)
- [ ] The application must be a Single Page Application (SPA), ensuring seamless user experience without page reloads during navigation.

##### 📦 Bundling and Tooling (20 points)
- [ ] Implement Webpack or another bundling tool to compile the project into a minimal set of files, ideally one HTML file, one JS file, and one CSS file.

##### ✅ Code Quality and Standards (15 points)
- [ ] Adhere to the Airbnb ESLint configuration to maintain code quality. Specific rules may be adjusted only with mentor approval, and there should be no ESLint errors or warnings.

##### 📏 Code Organization and Efficiency (15 points)
###### Function Modularization (10 points)
- [ ] Code should be organized into small, clearly named functions with specific purposes. Each function should not exceed 40 lines.
###### Code Duplication and Magic Numbers (5 points)
- [ ] Minimize code duplication and avoid the use of magic numbers or strings throughout the codebase.

##### 🎨 Prettier and ESLint Configuration (10 points)
###### Prettier Setup (5 points)
- [ ] Prettier is correctly set up with two scripts in `package.json`: `format` for auto-formatting and `ci:format` for checking issues.
###### ESLint Configuration (5 points)
- [ ] ESLint is configured with the Airbnb style guide. A `lint` script in `package.json` runs ESLint checks.

##### 🌟 Overall Code Quality (35 points)
###### Discretionary Points (35 points)
- [ ] Discretionary points awarded by the mentor based on overall code quality, readability, and maintainability.

---

### Total Points: 215

### 🏁 Basic Structure (85 points)

####  View Configuration (30 points)
##### Two Views (10 points)
- [ ] Implement two primary views: "Garage" and "Winners".
##### Garage View Content (5 points)
- [ ] The "Garage" view must display its name, the current page number, and the total number of cars in the database.
##### Winners View Content (5 points)
- [ ] The "Winners" view should similarly display its name, the current page number, and the total count of records in the database.
##### Persistent State (10 points)
- [ ] Ensure the view state remains consistent when navigating between views. This includes preserving page numbers and input states.

####  Garage View Functionality (55 points)
##### CRUD Operations (20 points)
- [ ] Enable users to create, update, and delete cars, and display the list of cars. A car has two attributes: "name" and "color".
##### Color Selection (10 points)
- [ ] Allow color selection from an RGB palette, displaying the selected color on the car's image along with its name.
##### Management Buttons (5 points)
- [ ] Provide buttons near each car's image for updating its attributes or deleting it.
##### Pagination (10 points)
- [ ] Implement pagination for the "Garage" view, displaying 7 cars per page.
##### Random Car Creation (10 points)
- [ ] There should be a button to create random cars (100 cars per click). Name should be assembled from two random parts, and color should be generated randomly.

---

### 🚗 Car Animation (50 points)
##### Engine Control Buttons (10 points)
- [ ] Place start/stop engine buttons near each car's image.
##### Start Engine Animation (20 points)
- [ ] User clicks the engine start button -> UI waits for car's velocity answer -> animate the car and make another request to drive. In case of a 500 error, car animation should be stopped.
##### Stop Engine Animation (10 points)
- [ ] User clicks the engine stop button -> UI waits for the answer for stopping the engine -> car returns to its initial place.
##### Button States (5 points)
- [ ] Start engine button should be disabled if the car is already in driving mode. Similarly, the stop engine button should be disabled when the car is in its initial place.
##### Responsive Animation (5 points)
- [ ] Ensure car animations are fluid and responsive on screens as small as 500px.

---

### 🏎️ Race Animation (35 points)
##### Start Race Button (15 points)
- [ ] Implement a button to start the race for all cars on the current page.
##### Reset Race Button (10 points)
- [ ] Create a button to reset the race, returning all cars to their starting positions.
##### Winner Announcement (10 points)
- [ ] After a car finishes first, display a message containing the car's name that shows which one has won.

---

### 🏆 Winners View (45 points)
##### Display Winners (15 points)
- [ ] After a car wins, it should be displayed in the "Winners view" table.
##### Pagination for Winners (10 points)
- [ ] Implement pagination for the "Winners" view, with 10 winners per page.
##### Winners Table (10 points)
- [ ] The table should include columns for the car's №, image, name, number of wins, and best time in seconds.
##### Sorting Functionality (10 points)
- [ ] Allow users to sort the table by the number of wins and best time, in ascending or descending order.