import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SendRequest from '../../../utils/send-request.utils';
import Loading from '../../../components/loading';
import FormInput from '../../../components/form-input';
import Button from '../../../components/button';

import { ContainerStyled, InputGroup, MessageStyled } from './styled';

const defaultForgetPassword = {
	email: '',
};

function ForgetPassword() {
	const [forgetPasswordForm, setForgetPassword] = useState(defaultForgetPassword);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const navigate = useNavigate();
	const handleChanage = (event) => {
		const { value, name } = event.target;
		setForgetPassword({ ...forgetPasswordForm, [name]: value });
	};

	const handleSubmit = async () => {
		if (!forgetPasswordForm.email) {
			setMessage('請輸入信箱');
			return;
		}
		if (loading) return alert('Please be patient. wait a few minutes.');
		setLoading(true);
		setMessage('');
		const data = {
			do: 'forget-password',
			mail: forgetPasswordForm.email,
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
			<h2>忘記密碼</h2>
			<InputGroup>
				<FormInput
					label="Email"
					inputOption={{
						type: 'email',
						required: true,
						onChange: handleChanage,
						name: 'email',
						value: forgetPasswordForm.email,
					}}
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

export default ForgetPassword;
