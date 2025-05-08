import React, { useState } from 'react';
import SendRequest from '../../../utils/auth-service.utils';
import Loading from '../../../components/loading';
import FormInput from '../../../components/form-input';
import Button from '../../../components/button';

import styled from 'styled-components';
const SignupContainer = styled.div`
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

const defaultSingUp = {
	email: '',
	password: '',
	showPassword: false,
	confirmPassword: '',
	showConfirmPassword: false,
};

function SignUp({ loading, setLoading }) {
	const [singUpForm, setSingUpForm] = useState(defaultSingUp);
	const [message, setMessage] = useState('');

	const handleSignUp = async () => {
		if (!singUpForm.email && !singUpForm.password && !singUpForm.confirmPassword) {
			setMessage('請輸入信箱/密碼');
			return;
		}
		if (singUpForm.password !== singUpForm.confirmPassword) {
			setMessage('密碼請重新確認');
			return;
		}
		if (loading) return alert('Please be patient. wait a few minutes.');

		setLoading(true);
		setMessage('');

		const data = {
			do: 'signup',
			mail: singUpForm.email,
			password: singUpForm.password,
		};

		try {
			const result = await SendRequest(data);
			setMessage(result.message);
		} catch (error) {
			setMessage('發生錯誤，請稍後再試');
		} finally {
			setLoading(false);
		}
	};
	const handleChanage = (event) => {
		const { name, value } = event.target;
		setSingUpForm({ ...singUpForm, [name]: value });
	};
	const handleClickChange = (key) => {
		setSingUpForm({ ...singUpForm, [key]: !singUpForm[key] });
	};

	return (
		<SignupContainer>
			<h2>註冊</h2>
			<InputGroup>
				<FormInput
					label="Email"
					inputOption={{
						type: 'email',
						required: true,
						onChange: handleChanage,
						name: 'email',
						value: singUpForm.email,
					}}
				/>
				<FormInput
					label="Password"
					inputOption={{
						type: singUpForm.showPassword ? 'text' : 'password',
						required: true,
						onChange: handleChanage,
						name: 'password',
						value: singUpForm.password,
					}}
					showToggle={true}
					showPassword={singUpForm.showPassword}
					onToggleClick={() => handleClickChange('showPassword')}
				/>
				<FormInput
					label="Confirm Password"
					inputOption={{
						type: singUpForm.showConfirmPassword ? 'text' : 'password',
						required: true,
						onChange: handleChanage,
						name: 'confirmPassword',
						value: singUpForm.confirmPassword,
					}}
					showToggle={true}
					showPassword={singUpForm.showConfirmPassword}
					onToggleClick={() => handleClickChange('showConfirmPassword')}
				/>
				{message && <MessageStyled>{message}</MessageStyled>}
				<Button
					type="submit"
					onClick={handleSignUp}
					disabled={loading}
				>
					{loading ? <Loading /> : '註冊'}
				</Button>
			</InputGroup>
		</SignupContainer>
	);
}

export default SignUp;
