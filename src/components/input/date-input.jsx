import styled from 'styled-components';
export const DateInput = ({ label, inputOption }) => {
	return (
		<Group>
			{label && <LabelStyle htmlFor={inputOption.id}>{label}：</LabelStyle>}
			<DateField
				type="date"
				{...inputOption}
			/>
		</Group>
	);
};
const subColor = 'grey';
const mainColor = 'black';
const Group = styled.div`
	display: flex;
	margin: 0;
	align-items: center;
	position: relative;
`;
const LabelStyle = styled.label`
	font-size: 16px;
	white-space: nowrap;
`;
const Input = styled.input`
	background: none;
	background-color: white;
	color: ${subColor};
	font-size: 18px;
	padding: 10px 10px 10px 5px;
	display: block;
	width: 100%;
	border: none;
	border-radius: 0;
	border-bottom: 1px solid ${subColor};
	margin: 0;
	&:focus {
		outline: none;
	}
`;
const DateField = styled(Input).attrs({ type: 'date' })``;
