import { Routes, Route, useNavigate } from "react-router-dom";
import { EligibilityQuestionnaire } from "./pages/EligibilityQuestionnaire";
import {
  GoabOneColumnLayout,
  GoabAppHeader,
  GoabAppFooter,
  GoabMicrositeHeader,
  GoabPageBlock,
    GoabButton
} from "@abgov/react-components";
// import { api } from './lib/get-request-client'

// Placeholder for the Index page
function Index() {
  const navigate = useNavigate();
  return (
    <GoabPageBlock>
      <h1>Student Aid & Scholarships</h1>
      <p>Welcome to the Alberta Student Aid portal.</p>
      <div style={{ marginTop: '20px' }}>
        <GoabButton onClick={() => navigate('/eligibility')}>
          Check Eligibility
        </GoabButton>
      </div>
    </GoabPageBlock>
  );
}

// Placeholder for the Scholarship Application (will be replaced in PR-05)
import { ApplicationWizard } from "./components/wizard/ApplicationWizard";

function App() {
  return (
    <GoabOneColumnLayout>
      <section slot="header">
        <GoabMicrositeHeader type="alpha" version="UAT" />
        <GoabAppHeader url="/" heading="Student Aid" />
      </section>

      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/eligibility" element={<EligibilityQuestionnaire />} />
        <Route path="/scholarship-application" element={<ApplicationWizard />} />
      </Routes>

      <section slot="footer">
        <GoabAppFooter />
      </section>
    </GoabOneColumnLayout>
  );
}

export default App;
