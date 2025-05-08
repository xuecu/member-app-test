import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SendRequest from '../../../utils/send-request.utils';
import Loading from '../../../components/loading';
import FormInput from '../../../components/form-input';
import Button from '../../../components/button';

import { ContainerStyled, InputGroup, MessageStyled } from './styled';

const defaultResetPassword = {
	password: '',
	showPassword: false,
	confirmPassword: '',
	showConfirmPassword: false,
};

function ResetPassword() {
	const { id } = useParams(); // 接收會員 ID 或 token

	const [restePasswordForm, setRestePasswordForm] = useState(defaultResetPassword);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const navigate = useNavigate();
	const handleChanage = (event) => {
		const { value, name } = event.target;
		setRestePasswordForm({ ...restePasswordForm, [name]: value });
	};
	const handleClickChange = (key) => {
		setRestePasswordForm({ ...restePasswordForm, [key]: !restePasswordForm[key] });
	};

	const handleSubmit = async () => {
		if (restePasswordForm.password !== restePasswordForm.confirmPassword) {
			setMessage('密碼請重新確認');
			return;
		}
		if (loading) return alert('Please be patient. wait a few minutes.');
		setLoading(true);
		setMessage('');
		const data = {
			do: 'forget-password',
			password: restePasswordForm.password,
		};

		try {
			const result = await SendRequest(data);
			if (result.success) {
				alert('已成功寄出重設密碼信，請檢查信箱收取『驗證信』。');
				navigate('/login');
			} else {
				setMessage(`${result.message}`);
			}
		} catch (error) {
			setMessage('發生錯誤，請稍後再試');
		} finally {
			setLoading(false);
		}
	};
	return (
		<ContainerStyled>
			{/* 忘記密碼 */}
			<h2>重設密碼</h2>
			<InputGroup>
				<FormInput
					label="Password"
					inputOption={{
						type: restePasswordForm.showPassword ? 'text' : 'password',
						required: true,
						onChange: handleChanage,
						name: 'password',
						value: restePasswordForm.password,
					}}
					showToggle={true}
					showPassword={restePasswordForm.showPassword}
					onToggleClick={() => handleClickChange('showPassword')}
				/>
				<FormInput
					label="Confirm Password"
					inputOption={{
						type: restePasswordForm.showConfirmPassword ? 'text' : 'password',
						required: true,
						onChange: handleChanage,
						name: 'confirmPassword',
						value: restePasswordForm.confirmPassword,
					}}
					showToggle={true}
					showPassword={restePasswordForm.showConfirmPassword}
					onToggleClick={() => handleClickChange('showConfirmPassword')}
				/>
				{message && <MessageStyled>{message}</MessageStyled>}
				<Button
					type="submit"
					onClick={handleSubmit}
					disabled={loading}
				>
					{loading ? <Loading /> : '送出'}
				</Button>
			</InputGroup>
		</ContainerStyled>
	);
}

export default ResetPassword;
