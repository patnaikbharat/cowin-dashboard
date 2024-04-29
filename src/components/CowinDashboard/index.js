import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationCoverage from '../VaccinationCoverage'
import './index.css'

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class CowinDashboard extends Component {
  state = {vaccinationData: {}, apiStatus: apiStatusConstant.initial}

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {
    this.setState({apiStatus: apiStatusConstant.inProgress})
    const response = await fetch('https://apis.ccbp.in/covid-vaccination-data')
    const fetchedData = await response.json()
    if (response.ok) {
      console.log('ok')
      const lastSevenDayData = fetchedData.last_7_days_vaccination.map(
        eachData => ({
          vaccineDate: eachData.vaccine_date,
          dose1: eachData.dose_1,
          dose2: eachData.dose_2,
        }),
      )
      const vaccinationByAgeData = fetchedData.vaccination_by_age.map(
        eachData => ({
          age: eachData.age,
          count: eachData.count,
        }),
      )
      const vaccinationByGenderData = fetchedData.vaccination_by_gender.map(
        eachData => ({
          count: eachData.count,
          gender: eachData.gender,
        }),
      )
      this.setState({
        vaccinationData: {
          lastSevenDayData,
          vaccinationByAgeData,
          vaccinationByGenderData,
        },
        apiStatus: apiStatusConstant.success,
      })
    } else {
      console.log('not ok')
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  renderSuccess = () => {
    const {vaccinationData} = this.state
    return (
      <>
        <VaccinationCoverage
          lastSevenDayData={vaccinationData.lastSevenDayData}
        />
        <VaccinationByGender
          vaccinationByGenderData={vaccinationData.vaccinationByGenderData}
        />
        <VaccinationByAge
          vaccinationByAgeData={vaccinationData.vaccinationByAgeData}
        />
      </>
    )
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        className="failure-image"
        alt="failure view"
      />
      <h1 className="failure-text">Something went wrong</h1>
    </div>
  )

  renderSwitchCondition = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstant.success:
        return this.renderSuccess()
      case apiStatusConstant.inProgress:
        return this.renderLoader()
      case apiStatusConstant.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    const {vaccinationData} = this.state
    console.log(vaccinationData)

    return (
      <div className="main-container">
        <div className="flex-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            className="website-logo"
            alt="website logo"
          />
          <h1 className="website-logo-heading">Co-WIN</h1>
        </div>
        <h1 className="main-heading">CoWIN Vaccination in India</h1>
        <div className="dashboard-container">
          {this.renderSwitchCondition()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
