import { createRoot } from 'react-dom/client';
import './App.scss'

function App({children}) {
  return (
    <div id="App" className='app-mod'>
      {children}
    </div>
  )
}

export function Render(children) {
    createRoot(document.getElementById('root')).render(
      <App>{children}</App>
    );
}



