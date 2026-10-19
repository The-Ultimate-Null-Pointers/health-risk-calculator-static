const API_URL = 'https://health-risk-calculator-unp-node-f5hygtdhemhxc6ef.centralus-01.azurewebsites.net'
const API_PATHS = {
    PING: '/api/ping',
    BLOOD_PRESSURE: '/api/calculate/blood-pressure',
    BMI: '/api/calculate/bmi',
    RISK_SCORE: '/api/calculate/risk-score'
}

// Wake up server when page loads
async function pingServer() {
    try {
        const response = await fetch(`${API_URL}${API_PATHS.PING}`)
        const text = await response.text()
        console.log('Server says:', text)
    } catch (error) {
        console.error('Ping failed: ', error)
    }
}

async function queryServer(path, body) {
    try {
        const response = await fetch(`${API_URL}${path}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        return result
    } catch (error) {
        console.error(`Query to "${path}" failed: `, error)
    }
    return null
}


async function attemptQueryBloodPressure() {
    const input = readBloodPressure()
    const validation = validateBloodPressure(input)
    if (!validation.valid) {
        alert(validation.message)
        return null
    }
    return queryServer(API_PATHS.BLOOD_PRESSURE, input)
}
function readBloodPressure() {
    const systolic = Number(document.getElementById("systolic").value)
    const diastolic = Number(document.getElementById("diastolic").value)
    return { systolic, diastolic }
}
function validateBloodPressure({ systolic, diastolic }) {
    if (isNaN(systolic) || isNaN(diastolic)) {
        return {valid: false, code: "NaN", message: "Please enter valid numbers for blood pressure."}
    }
    if (systolic <= 0 || diastolic <= 0) {
        return {valid: false, code: "OUT_OF_RANGE", message: "Please enter pysically possible values for blood pressure."}
    }
        if (systolic < 50 || systolic > 300 ||
        diastolic < 30 || diastolic > 200) {
        return {
            valid: false,
            code: "OUT_OF_RANGE",
            message: "Please enter realistic blood pressure values."
        }
    }

    if (systolic <= diastolic) {
        return {
            valid: false,
            code: "INVALID_BLOOD_PRESSURE",
            message: "Systolic pressure must be greater than diastolic pressure."
        }
    }
    return {valid: true}
}

async function attemptQueryBMI() {
    const input = readBMI()
    const validation = validateBMI(input)
    if (!validation.valid) {
        alert(validation.message)
        return null
    }
    return queryServer(API_PATHS.BMI, input)
}
function readBMI() {
    const heightFeet = Number(document.getElementById("height-feet").value)
    const heightInches = Number(document.getElementById("height-inches").value)
    const weightPounds = Number(document.getElementById("weight-pounds").value)
    return { heightFeet, heightInches, weightPounds }
}
function validateBMI({ heightFeet, heightInches, weightPounds }) {
    if (isNaN(heightFeet) || isNaN(heightInches) || isNaN(weightPounds)) {
        return {valid: false, code: "NaN", message: "Please enter valid numbers for height and weight."}
    }
    if (heightFeet < 0 || heightInches < 0 || weightPounds <= 0) {
        return {valid: false, code: "OUT_OF_RANGE", message: "Please enter physically possible values for height and weight."}
    }
        const totalHeightInches = (heightFeet * 12) + heightInches

    if (totalHeightInches < 24) {
        return {
            valid: false,
            code: "HEIGHT_TOO_LOW",
            message: "Height must be at least 2 feet."
        }
    }

    if (heightInches >= 12) {
        return {
            valid: false,
            code: "INVALID_HEIGHT",
            message: "Please enter 0–11 inches in the inches field."
        }
    }

    if (weightPounds > 1400) {
        return {
            valid: false,
            code: "OUT_OF_RANGE",
            message: "Please enter a realistic weight in pounds."
        }
    }
    return {valid: true}
}
async function attemptQueryRiskScore() {
    // 1: Read all inputs
    const bloodPressure = readBloodPressure()
    const bmi = readBMI()
    const age = readAge()
    const familyHistory = readFamilyHistory()

    // 2: Validate all inputs before making requests
    const bpValidation = validateBloodPressure(bloodPressure)
    if (!bpValidation.valid) {
        alert(bpValidation.message)
        return null
    }

    const bmiValidation = validateBMI(bmi)
    if (!bmiValidation.valid) {
        alert(bmiValidation.message)
        return null
    }

    const ageValidation = validateAge(age)
    if (!ageValidation.valid) {
        alert(ageValidation.message)
        return null
    }

    const familyHistoryValidation = validateFamilyHistory(familyHistory)
    if (!familyHistoryValidation.valid) {
        alert(familyHistoryValidation.message)
        return null
    }

    // 3: Do each query in sequence
    const bloodPressureResult = await queryServer(
        API_PATHS.BLOOD_PRESSURE,
        bloodPressure
    )
    if (bloodPressureResult === null) return null

    const bmiResult = await queryServer(
        API_PATHS.BMI,
        bmi
    )
    if (bmiResult === null) return null

    return queryServer(API_PATHS.RISK_SCORE, {
        age: age,
        bmiCategory: bmiResult.category,
        bloodPressureCategory: bloodPressureResult.category,
        familyDiseaseList: familyHistory
    });
}
function readAge() {
    return Number(document.getElementById("age").value)
}
function readFamilyHistory() {
    const diseases = []

    if (document.getElementById("family-diabetes").checked)   diseases.push("diabetes")
    if (document.getElementById("family-cancer").checked)     diseases.push("cancer")
    if (document.getElementById("family-alzheimers").checked) diseases.push("Alzheimer's")

    return diseases;
}
function validateAge(age) {
    if (isNaN(age)) {
        return {valid: false, code: "NaN", message: "Please enter a valid number for age."}
    }
    if (age < 0) {
        return {valid: false, code: "OUT_OF_RANGE", message: "Please enter a physically possible value for age."}
    }
        if (age < 18 || age > 120) {
        return {
            valid: false,
            code: "OUT_OF_RANGE",
            message: "Age must be between 18 and 120."
        }
    }
    return {valid: true}
}
function validateFamilyHistory(familyHistory) {
    if (!Array.isArray(familyHistory)) {
        return {valid: false, code: "INVALID_TYPE", message: "Family history must be an array."}
    }
    return {valid: true}
}


pingServer()