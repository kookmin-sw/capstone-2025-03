import { Provider } from "./theme/provider"
import { RecoilRoot } from "recoil"
import ReactDOM from "react-dom/client"
import App from "./App"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </Provider>
)