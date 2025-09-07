
import './App.css'
import FormPage from './components/FormPage'
import { formStepsSample1 } from './config/sampleStepConfig'

function App() {
  return <div className="multi-step-form-app-container">
    <div className="multi-step-form-app-content">
      <FormPage formSteps={formStepsSample1} onSubmit={() => { console.log('submitted') }} />
    </div>
  </div>
}

export default App
