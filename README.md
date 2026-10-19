# Ultimate Health Risk Calculator

The **Ultimate Health Risk Calculator** is a web-based educational tool created by **The Ultimate Null Pointers**. Users enter basic health information to receive estimated BMI, blood pressure, and overall health-risk categories.

> \*\*Disclaimer:\*\* This calculator is for educational purposes only. Its results are not a medical diagnosis and are not a substitute for advice from a qualified healthcare professional. Do not use the results to make medical decisions.



`https://victorious-wave-01c3ffd10.4.azurestaticapps.net/`

## Features

* Collects age, height, and weight.
* Accepts systolic and diastolic blood pressure.
* Allows users to select relevant family history, including diabetes, cancer, and Alzheimer's disease.
* Validates input values before requesting calculations.
* Displays BMI, blood pressure, and overall risk categories.
* Uses a starfield background and a themed interface.

## How It Works

The site is a static HTML, CSS, and JavaScript frontend. It sends requests to a separately hosted backend API for the BMI, blood pressure, and overall risk-score calculations.

The frontend calls these API routes:

* `GET /api/ping` — checks the backend connection.
* `POST /api/calculate/bmi` — calculates the BMI category.
* `POST /api/calculate/blood-pressure` — determines the blood pressure category.
* `POST /api/calculate/risk-score` — calculates the overall risk category using age, the BMI and blood pressure categories, and family history.

The frontend is configured to use the following API base URL:

`https://health-risk-calculator-unp-node-f5hygtdhemhxc6ef.centralus-01.azurewebsites.net`

The calculator requires the backend service to be available for results to be calculated.

## Run Locally

No frontend build step is required.

1. Clone or download this repository.
2. Open the project directory.
3. Serve the directory with a local static web server, then open the local site in your browser.

For example, if Python is installed, run this command from the project directory:

```bash
python -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

You can also open `index.html` directly in a browser, although using a local web server is generally more representative of a deployed site. The backend API must still be reachable from your browser.

## Project Structure

```text
.
├── index.html       # Form and results markup
├── script.js        # Form handling, validation, and API requests
├── style.css        # Main page styling
├── background.js    # Generates the starfield background
├── background.css   # Starfield background styling and animation
├── images/
│   └── walle.jpg    # Image used in the submit button background
├── .github/
│   └── workflows/   # Azure Static Web Apps deployment workflow
├── LICENSE          # MIT License
└── README.md
```

## Deployment

The repository includes a GitHub Actions workflow for **Azure Static Web Apps**. The workflow deploys the static site when changes are pushed to the `main` branch and also handles pull-request deployment previews.

## Technologies

* HTML
* CSS
* JavaScript
* Fetch API for backend requests
* Azure Static Web Apps
* GitHub Actions for deployment

## Team

Created by **The Ultimate Null Pointers**.

## License

This project includes an MIT License. See the [`LICENSE`](LICENSE) file for the license terms.

