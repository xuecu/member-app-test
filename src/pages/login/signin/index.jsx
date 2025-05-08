import React, { useState, useContext } from 'react';
import SendRequest from '../../../utils/auth-service.utils';
import Loading from '../../../components/loading';
import FormInput from '../../../components/form-input';
import Button from '../../../components/button';
import dayjs from 'dayjs';
import { AuthContext } from '../../../contexts/auth.context';
import styled from 'styled-components';
const SigninContainer = styled.div`
	display: flex;
	width: 40%;
	min-width: 250px;
	flex-direction: column;
`;
const InputGroup = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	padding-left: 30px;
	position: relative;
	padding-top: 20px;
`;
const MessageStyled = styled.span`
	position: absolute;
	top: 0;
	left: 100px;
	color: red;
`;
const SpanStyled = styled.span`
	display: flex;
	width: 100%;
	justify-content: end;
	color: gray;
	padding-bottom: 5px;
`;

const defaultSingIn = {
	email: '',
	password: '',
	showPassword: false,
};

function SignIn({ loading, setLoading, navigate }) {
	const { login } = useContext(AuthContext);
	const [singInForm, setSingInForm] = useState(defaultSingIn);
	const [message, setMessage] = useState('');

	const handleSignIn = async () => {
		if (!singInForm.email && !singInForm.password) {
			setMessage('請輸入信箱與密碼');
			return;
		}
		if (loading) return alert('Please be patient. wait a few minutes.');

		setLoading(true);
		setMessage('');

		const data = {
			do: 'signin',
			mail: singInForm.email,
			password: singInForm.password,
			timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
		};

		try {
			const result = await SendRequest(data);
			if (result.success) {
				login(JSON.parse(result.data));
				navigate('/dashboard');
			} else {
				setMessage(`${result.message}`);
			}
		} catch (error) {
			setMessage('發生錯誤，請稍後再試');
		} finally {
			setLoading(false);
		}
	};

	const handleChanage = (event) => {
		const { name, value } = event.target;
		setSingInForm({ ...singInForm, [name]: value });
	};
	const handleClickChange = (key) => {
		setSingInForm({ ...singInForm, [key]: !singInForm[key] });
	};
	const handleForgetPassword = () => navigate('/login/forget-password');

	return (
		<SigninContainer>
			<h2>登入</h2>
			<InputGroup>
				<FormInput
					label="Email"
					inputOption={{
						type: 'email',
						required: true,
						onChange: handleChanage,
						name: 'email',
						value: singInForm.email,
					}}
				/>
				<FormInput
					label="Password"
					inputOption={{
						type: singInForm.showPassword ? 'text' : 'password',
						required: true,
						onChange: handleChanage,
						name: 'password',
						value: singInForm.password,
					}}
					showToggle={true}
					showPassword={singInForm.showPassword}
					onToggleClick={() => handleClickChange('showPassword')}
				/>
				{message && <MessageStyled>{message}</MessageStyled>}
				<SpanStyled onClick={handleForgetPassword}>忘記密碼？</SpanStyled>
				<Button
					type="submit"
					onClick={handleSignIn}
					disabled={loading}
				>
					{loading ? <Loading /> : '登入'}
				</Button>
			</InputGroup>
		</SigninContainer>
	);
}

export default SignIn;
