import { useContext, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigatorStyled, LinkStyled, LogoutButton, GroupStyled, MemberStyled } from './styled';

import { AuthContext } from '../../../contexts/auth.context';

// import styled from 'styled-components';
const defaultRouter = {
	member: { route: '/dashboard/member', name: '會員頁' },
	'member-change': { route: '/dashboard/member-change', name: '會員異動' },
	plugin: { route: '/dashboard/plugin', name: '小工具' },
	admin: { route: '/dashboard/admin', name: '權限管理' },
};

function Navigator({ collapsed }) {
	const { user, logout } = useContext(AuthContext);
	const { name, mail, login_at, router } = user;
	const navigate = useNavigate();

	// 登出功能
	const handleLogout = () => {
		logout();
		navigate('/login'); // 導向登入頁面
	};

	return (
		<NavigatorStyled $collapsed={collapsed}>
			{user.mail !== '' ? (
				<Fragment>
					<GroupStyled>
						<MemberStyled>{name !== '' ? name : '尚未設定'}</MemberStyled>
						<LogoutButton onClick={handleLogout}>登出</LogoutButton>
					</GroupStyled>
					<GroupStyled>
						{router &&
							router.map((route) => {
								return (
									<LinkStyled to={defaultRouter[route].route}>
										{defaultRouter[route].name}
									</LinkStyled>
								);
							})}
					</GroupStyled>
				</Fragment>
			) : (
				<GroupStyled>
					<LinkStyled to="/login">登入/註冊</LinkStyled>
				</GroupStyled>
			)}
		</NavigatorStyled>
	);
}

export default Navigator;
