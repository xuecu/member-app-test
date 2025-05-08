import { Routes, Route, Navigate } from 'react-router-dom';
import DefaultLayout from './pages/default-layout';
import Login from './pages/login/login.pages';
import ProtectedRoute from './utils/protected-route.utils';
import MemberChange from './pages/member-change/member-change.pages';
import Member from './pages/member/member.pages';
import Admin from './pages/admin/admin.pages';
import ForgetPassword from './pages/login/forget-password/forget-password.pages';
import ResetPassword from './pages/login/reset-password/reset-password.pages';

function App() {
	return (
		<Routes>
			<Route path="/" element={<DefaultLayout />}>
				<Route index element={ <Navigate to="/login" replace /> } />
				<Route path="login" >
					<Route index element={<Login />} />
					<Route path="forget-password" element={<ForgetPassword />} />
					<Route path="reset-password/:id" element={<ResetPassword />} />
				</Route>

				<Route path="dashboard">
					<Route index element={ <Navigate to="member" replace />} />
					<Route path="member" element={<ProtectedRoute children={<Member />} />} />
					<Route path="member-change" element={<ProtectedRoute children={<MemberChange />} />} />
					<Route path="admin" element={<ProtectedRoute children={<Admin />} />} />
				</Route>
			</Route>
		</Routes>
	);
}

export default App;
