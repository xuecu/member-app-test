import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

import ProtectedRoute from '@utils/protected-route.utils';
import ForgetPassword from '@pages/login/forget-password/forget-password.pages';
import ResetPassword from '@pages/login/reset-password/reset-password.pages';
import { Plugin, ProjectControl, Admin, Member, MemberChange, Login, DefaultLayout } from '@/pages'

import { MemberChangeMenuProvider } from '@contexts/member-change-menu.contexts';
import { ProjectControlProvider } from '@contexts/project-control.context';


function App() {
	const memberChangeProvider = [MemberChangeMenuProvider]
	const projectControlProvider = [ProjectControlProvider]

	const withProtectedRoute = ({element, providers=[]}) => {
		return <ProtectedRoute providers={providers} >
					{element}
				</ProtectedRoute>
	};

	return (
		<Routes>
			<Route path="/" element={<DefaultLayout />}>
				<Route index element={ <Navigate to="/login" replace /> } />
				<Route path="login">
					<Route index element={<Login />} />
					<Route path="forget-password" element={<ForgetPassword />} />
					<Route path="reset-password/:id" element={<ResetPassword />} />
				</Route>

				<Route path="dashboard" >
					<Route index element={<Navigate to="member" replace />} />
					<Route path="plugin" element={withProtectedRoute({ element: <Plugin /> })} />
					<Route path="member" element={withProtectedRoute({ element: <Member /> })} />
					<Route path="member-change" element={withProtectedRoute({ element: <MemberChange />, providers: memberChangeProvider })} />
					<Route path="admin" element={withProtectedRoute({ element: <Admin /> })} />
					<Route path="project-control" element={withProtectedRoute({ element: <ProjectControl />, providers: projectControlProvider })} />

				</Route>
			</Route>
		</Routes>
	);
}

export default App;
