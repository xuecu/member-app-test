import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { MemberChangeMenuProvider } from './contexts/member-change-menu.contexts';
import { AuthProvider } from './contexts/auth.context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<HashRouter>
			<AuthProvider>
				<MemberChangeMenuProvider>
					<App />
				</MemberChangeMenuProvider>
			</AuthProvider>
		</HashRouter>
	</React.StrictMode>
);
