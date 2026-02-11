import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { EligibilityQuestionnaire } from "./pages/EligibilityQuestionnaire";
import {
  GoabOneColumnLayout,
  GoabAppHeader,
  GoabAppFooter,
  GoabMicrositeHeader,
  GoabPageBlock,
} from "@abgov/react-components";
import Client, { Local } from "./lib/client";

const client = new Client(Local);

// Placeholder for the Index page
function Index() {
  const navigate = useNavigate();
  return (
    <GoabPageBlock>
      <h1>Student Aid & Scholarships</h1>
      <p>Welcome to the Alberta Student Aid portal.</p>
      <div style={{ marginTop: '20px' }}>
        <goab-button onClick={() => navigate('/eligibility')}>
          Check Eligibility
        </goab-button>
      </div>
    </GoabPageBlock>
  );
}

// Placeholder for the Scholarship Application (will be replaced in PR-05)
import { ApplicationWizard } from "./components/wizard/ApplicationWizard";

function AppContent() {
  return (
    <GoabOneColumnLayout>
      <section slot="header">
        <GoabMicrositeHeader type="alpha" version="UAT" />
        <GoabAppHeader url="/" heading="Student Aid" />
      </section>

      <section slot="content">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/eligibility" element={<EligibilityQuestionnaire />} />
          <Route path="/scholarship-application" element={<ApplicationWizard />} />
        </Routes>
      </section>

      <section slot="footer">
        <GoabAppFooter />
      </section>
    </GoabOneColumnLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
