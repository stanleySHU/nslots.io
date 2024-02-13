import './register';
// #if VITE_FAKE
import './register/fake';
// #endif
import './main.scss';
import { Render } from 'common/App';
import { App } from './components/App';
Render(<App></App>);