import { FormInputLabel, Group, Input, ToggleButton } from './styled';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const FormInput = ({
	label,
	inputOption,
	showToggle = false,
	showPassword = false,
	onToggleClick = () => {},
}) => {
	return (
		<Group>
			<Input {...inputOption} />
			{label && <FormInputLabel shrink={inputOption.value.length}>{label}</FormInputLabel>}
			{showToggle && (
				<ToggleButton
					type="button"
					onClick={onToggleClick}
				>
					{showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
				</ToggleButton>
			)}
		</Group>
	);
};

export default FormInput;
